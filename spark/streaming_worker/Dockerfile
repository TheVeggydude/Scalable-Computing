FROM bitnami/spark:2.4.5

COPY streaming_worker.py /opt/bitnami/spark

USER root
RUN mkdir .ivy2
RUN chown 1001:1001 .ivy2
USER 1001

# RUN pip install --no-cache-dir -r requirements.txt
# spark-submit --master spark://spark-master:7077 --packages org.apache.spark:spark-sql-kafka-0-10_2.11:2.4.5 --py-files streaming_worker.py streaming_worker.py