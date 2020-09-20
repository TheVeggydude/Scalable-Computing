from pyspark.sql import SparkSession

if __name__ == '__main__':
    # Subscribe to 1 topic defaults to the earliest and latest offsets
    df = spark \
        .read \
        .format("kafka") \
        .option("kafka.bootstrap.servers", "kafka:29091, kafka2:29092") \
        .option("subscribe", "sensor_data") \
        .load()
    df.selectExpr("CAST(key AS STRING)", "CAST(value AS STRING)")
