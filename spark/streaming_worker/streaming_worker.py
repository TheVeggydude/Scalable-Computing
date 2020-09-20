from pyspark.sql import SparkSession
from pyspark.sql.types import *
from pyspark.sql.functions import *
import time

def read_from_kafka_topic(topic_name, broker_ports_string):
    spark = SparkSession.builder.appName("SimpleApp").config("spark.sql.crossJoin.enabled", True).getOrCreate()
    df = spark \
        .readStream \
        .format("kafka") \
        .option("kafka.bootstrap.servers", broker_ports_string) \
        .option("startingOffsets", "latest") \
        .option("subscribe", topic_name) \
        .load()
    return df

def push_json_to_kafka_topic(json_df, topic_name, broker_ports_string):
    return json_df \
    .writeStream \
    .outputMode("append") \
    .format("kafka") \
    .option("checkpointLocation", "/tmp/checkpoint") \
    .option("kafka.bootstrap.servers", broker_ports_string) \
    .option("topic", topic_name) \
    .option("includeTimestamp", value=True) \
    .option("truncate", False) \
    .start()

def push_json_to_console(json_df, topic_name, broker_ports_string):
    return json_df \
    .writeStream \
    .outputMode("append") \
    .format("console") \
    .option("truncate", False) \
    .start()

if __name__ == '__main__':
    print('Started script')
    originalSensorDF = read_from_kafka_topic("sensor_data", "kafka:29091,kafka2:29092")
    originalCoefficientsDF = read_from_kafka_topic("coefficients", "kafka:29091,kafka2:29092")

    stringSensorDF = originalSensorDF.select(col("value").cast("string"), col("timestamp").alias("timestamp1")).select("value", "timestamp1")
    stringCoefficientsDF = originalCoefficientsDF.select(col("value").cast("string"), col("timestamp").alias("timestamp2")).select("value", "timestamp2")

    sensorSchema = StructType([
        StructField("id", DoubleType(), False),
        StructField("t", DoubleType(), False)
    ])

    coefficientsSchema = StructType([
        StructField("a", DoubleType(), False),
        StructField("b", DoubleType(), False),
        StructField("lim", DoubleType(), False)
    ])

    sensorDF = stringSensorDF.select(from_json("value", sensorSchema).alias("value1"), "timestamp1")
    coefficientsDF = stringCoefficientsDF.select(from_json("value", coefficientsSchema).alias("value2"), "timestamp2")

    sensorWatermark = sensorDF.withWatermark("timestamp1", "2 hours")
    coefficientsWatermark = coefficientsDF.withWatermark("timestamp2", "3 hours")

    #joinedDF = sensorDF.withColumn("coeffs", struct(lit(a), lit(b)))

    joinedDF = sensorDF.join(coefficientsDF, expr(""""""))

    manipulatedDF = joinedDF.select("value1.*", "timestamp1", "value2.*","timestamp2").select(to_json(struct("*")).alias("value"))

    query = push_json_to_console(manipulatedDF, "predictions", "kafka:29091,kafka2:29092")
    time.sleep(60)
    query.stop()
    print("END")