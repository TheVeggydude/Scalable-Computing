FROM bitnami/spark:latest

COPY regression.py /opt/bitnami/spark

USER root
RUN mkdir .ivy2
RUN chown 1001:1001 .ivy2
RUN pip3 install kafka-python
USER 1001

CMD spark-submit --packages com.datastax.spark:spark-cassandra-connector_2.11:2.4.2 --py-files regression.py regression.py
