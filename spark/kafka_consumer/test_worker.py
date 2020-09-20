from kafka import KafkaConsumer
from kafka.errors import NoBrokersAvailable
from json import loads
from time import sleep

if __name__ == '__main__':

    consumer = None
    while not consumer:  # Continuously try to connect to broker
        try:
            # To consume latest messages and auto-commit offsets
            consumer = KafkaConsumer('sensor_data',
                                     group_id='spark_test_worker',
                                     bootstrap_servers=['kafka:29091'],
                                     key_deserializer=lambda m: m.decode(),
                                     value_deserializer=lambda m: loads(m.decode('ascii')))
        except NoBrokersAvailable:
            print('Broker not yet available, sleeping', flush=True)
            sleep(5)

    while True:
        topics = consumer.poll()
        print(topics.keys(), flush=True)

        try:
            assert len(topics.keys()) != 0

            for topic in topics.keys():
                for record in topics[topic]:
                    print(record.value, flush=True)

        except AssertionError:
            print('No messages available, sleeping', flush=True)

        sleep(5)
