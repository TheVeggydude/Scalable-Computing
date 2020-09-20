from pyspark import SparkContext, SparkConf
from pyspark.sql import SQLContext
from pyspark.sql import functions as F
from pyspark.sql.functions import col
from kafka import KafkaProducer
from kafka.errors import NoBrokersAvailable
from time import sleep

import pyspark
import json
import os


def load_and_get_table_df(keys_space_name, table_name):
    """
    Reads a table from a Cassandra keyspace as a PySpark DataFrame.
    :param keys_space_name: Cassandra keyspace as string.
    :param table_name: Table in keyspace as string.
    :return: PySpark DataFrame containing table data.
    """
    table_df = sql_context.read\
        .format("org.apache.spark.sql.cassandra")\
        .options(table=table_name, keyspace=keys_space_name)\
        .load()
    return table_df


def compute_coefficients(df, column):
    """
    Computes min and max values for the given DataFrame column
    :param df: DataFrame to be used.
    :param column: String of the column name.
    :return: (min value, max value)
    """

    # Filter out all values in column higher than -1
    df = df.select(col("t"), col(column)).where(column + " > -1")
    n = df.select("t").count()

    # Compute required statistics
    df_stats = df.select(
        F.mean(col(column)).alias('mean_' + column),
        F.mean(col("t")).alias('mean_t'),
        F.max(col(column)).alias('max_' + column),
        F.min(col(column)).alias('min_' + column),
        F.sum(col(column) * col("t")).alias("sum(" + column + "*t)"),
        F.sum(col("t") * col("t")).alias("sum(t^2)")
    ).collect()[0]

    # Regression
    mean_t = df_stats['mean_t']
    mean_var = df_stats['mean_' + column]

    # Handle empty database tables
    if not mean_t:
        return None, None, None, None

    SS_tvar = df_stats["sum(" + column + "*t)"] - n*mean_var*mean_t
    SS_tt = df_stats["sum(t^2)"] - n*mean_t*mean_t

    a = SS_tvar / SS_tt
    b = mean_var - a * mean_t

    print()
    print("Summary of " + str(column))
    print((a, b, df_stats['min_' + column], df_stats['max_' + column]))
    print(flush=True)

    return df_stats['min_' + column], df_stats['max_' + column], a, b


def update_coefficients_for(df):
    """
    Gets the a, b and limit coefficients per parameter column and pushes them to Kafka.
    :param df: DataFrame containing the training data.
    :return: List containing tuples (a, b, max, min) with linear regression coefficients and limits.
    """

    results = {}
    excluded = ['id', 'model', 't', 'ts']
    for column in [name for name in df.schema.names if name not in excluded]:

        min, max, a, b = compute_coefficients(df, column)
        if not a:
            return None

        print()
        print(f"Coefficients for {model}:{column} = {min, max, a, b}")
        print(flush=True)

        results[column] = {
            "a": a,
            "b": b,
            "limit": min if a < 0 else max
        }

    return results


if __name__ == '__main__':

    model = str(os.environ.get("MODEL")).replace("'", "")

    spark_config = SparkConf()
    spark_config.set('spark.cassandra.connection.host', 'cassandra-cluster')

    spark_context = SparkContext(master='spark://spark-master:7077', appName='regression', conf=spark_config)
    sql_context = SQLContext(spark_context)  # needed to be able to query data.

    # Get the kafka brokers from the env variables
    kafka_servers = os.environ.get('KAFKA').replace("'", "").split(":")
    kafka_servers = [server.replace("-", ":") for server in kafka_servers]

    producer = None
    while not producer:
        try:
            producer = KafkaProducer(
                bootstrap_servers=kafka_servers,
                key_serializer=lambda m: str(m).encode(),  # transforms id string to bytes
                value_serializer=lambda m: json.dumps(m).encode('ascii')  # transforms messages to json bytes
            )
        except NoBrokersAvailable:
            print('No brokers available, sleeping', flush=True)
            sleep(5)

    sleep(20)  # sleep to wait for cassandra
    while True:
        frame = load_and_get_table_df('household', model + "s")
        coefficients = update_coefficients_for(frame)

        # Only send message if database is populated
        if coefficients:
            msg = {
                "model": model,
                "variables": coefficients
            }

            # push to kafka
            producer.send('coefficients', key=model, value=msg)

        sleep(30)
