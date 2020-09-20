# Household appliances lifetime prediction

## Running the code
For now we have a data production and consumption demo. This can be ran using:

```shell script
docker-compose up --build
```

`sensor_heater` will produce updates for the simulated appliance. These are passed to Kafka and then consumed by the 
`db_interface` and the `streaming_worker`.

## Spark job submission
After the infrastructure is setup you can access a container called `spark` from which we submit our Spark jobs. Copy the
relevant files over to the container using `docker cp path/to/script spark:/opt/bitnami/spark`.

### Prediction streaming
- Copy the file `spark/streaming_worker/streaming_worker.py` to the `spark` container.
- `docker exec -it spark bash` to get into the container.
- `spark-submit --master spark://spark-master:7077 --packages org.apache.spark:spark-sql-kafka-0-10_2.11:2.4.5 
--py-files streaming_worker.py streaming_worker.py` to submit.

### Machine learning
- Copy the file `spark/ml/regression.py` to the `spark` container.
- `docker exec -it spark bash` to get into the container.
- `spark-submit --packages com.datastax.spark:spark-cassandra-connector_2.11:2.4.2 --py-files regression.py regression.py` 
to submit to Spark.


## System Architecture
Please find the google slides describing our system architecture [here](https://docs.google.com/presentation/d/1NYL6EoNU3GWoOIYkiPU1ZjK3Hhs6i2bgwzrqqKD7PlU/edit?usp=sharing).

#### TODO:

- [ ] Interactive [map](https://leafletjs.com) with pins that simulate households. Click on a pin and be presented with options: view data (historical query) / request lifetime of appliances of household ([leaflet for Vue](https://www.npmjs.com/package/vue2-leaflet)).
- [ ] View data as [interactive/dynamic](https://www.chartjs.org) graphs.
- [ ] If no time for leaflet, a list of all households would suffice.