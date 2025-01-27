# Household appliances lifetime predictions
The following application monitors the status of appliances within a household and predicts the remaining lifetime of each appliance.

<!-- Each comment should be explained 'briefly'. -->

## Data
<!-- Simulated data -->
The data, which concerns physical variables as sensed by sensors in home appliances, is generated by dummy sensor applications.
The data is generated through the application of a linear equation with the time since start `t` as it's variable.

For each sensor we generate two variables of type float every 4 seconds. Moreover, along with these values we send 
the ID, timestamp, seconds since start and the appliance model type.


## Sensors
<!-- Different types of sensors -->
Currently we have three models of sensors/appliances: heaters, lamps and vacuums. Each of these has a different combination of 
variables and functions that generate these values.

<!-- Python Docker containers that can be deployed to increase load -->
The sensors are containerized in order to easily increase the load for demonstrative purposes. Each container will look for
a kafka broker to connect to and, after connecting, publish data to the ingestion service.

<!-- Mathematical functions that the sensors implement -->
All the simulations are done through linear equations. This means that all variables are of the form `var = at+b`. This is
also used in the design of the sensors to simplify the codebase for them.

<!-- Breaking behaviour of sensor and how this is represented (-1) -->
In order to predict appliance failure the appliances must actually fail. This is simulated through setting limits on the variables.
Once such a limit is reached the corresponding variable will return a `-1` value and turn itself (and thus also its container) off. 

## Database 
<!-- Type of database used (NoSQL CassandraDB) -->
CassandraDB was the NoSQL database of choice in order to fascilitate horizontal scalability and storing fast time-series data.

<!-- Advantages of using said database -->
Due to the fact that CassandraDB uses SSTables with consistent hashing, reading on one particular row is very fast.

<!-- Replicability strategy -->
Each instance of Cassandra uses a replication factor of 3 per created table.

<!-- Compaction -->
A compaction strategy is implemented per each table.

<!-- Interface of Database -->
As sensors send historical data through Kafka, a service layer written in Node.js (`db-interface`) that ingests the data and abstracts accessibility to the database was created. With this, sensors do not have direct access to the database and the rate at which data is inserted into the database can be controlled. 

<!-- What do you store in it (what tables, historical data) -->
The database contains a keyspace `household` that has three tables, one for each type of sensor that store historical data, and one `predictions` table that stores the results of our model.  

<!-- Initialization of database -->
The tables are created automatically during its initialization through the use of the `cassandra-init.sh` script.

## Message broker
<!-- Reasons for using Kafka w/ Zookeeper -->
Apache Kafka was chosen to be the message broker for the system. The Kafka brokers are supervised by a Zookeeper server. 
<!-- Replicated brokers (there are three) -->
A cluster of three Kafka brokers is used to handle messages and it has a replication factor of 3 in order to minimize the chances of data loss.
<!-- Topics created and why (who are producers / consumers) -->
There are three topics used for transmitting messages between the subservices:
- sensor_data: the sensors produce messages into this topic and the streaming layer and db-interface consume the messages from it;
- coefficients: the historical computational layer produces coefficients for the linear regression into this topic and the streaming computational layer consumes the messages from it;
- predictions: the streaming computational layer produces messages into this topic and the status_retriever consumes from it;

## Computational layer
<!-- Spark cluster specification (historical train / streaming predict) -->
In terms of the spark node architecture, two nodes are being used in this system. One of them is used to submit an application, while the other one performs the actual computations by running the application.

There are two applications built for spark that are used in this system:

### Historical data
<!-- Implementation of historical -->
As we know that we are dealing with linear equations with only one variable we can use a simplified linear regression
method. This approximates the `a` and `b` values in the simulation equation `at+b` for a given model's variable. Moreover,
we approximate the limit that causes the variable to break the sensor model.

The data for this is collected from Cassandra and computed using spark. Then the coefficients are pushed back to Kafka 
for use by the prediction job.


### Streaming data
<!-- Implementation of streaming -->
The streaming part of the computational layer is where the appliance life time predictions are computed in real time. By using the latest coefficients computed by the linear regression we can determine the estimated time step at which the given appliance will break. Then, by subtracting from that the current number of time steps of the above mentioned appliance, we can compute its estimated remaining lifetime.

### Containerization
<!-- Docker containers -->
Every service has been containerized and managed using Docker and `docker-compose`.

<!-- Volumes used for Cassandra, Kafka, and Zookeeper -->
Separate volumes were created for containers that are stateful in nature (i.e. Cassandra, Kafka, and Zookeeper). Every service communicated with one another through a bridge network named `household-network`.

## Kubernetes
<!-- Orchestration platform -->
Each service was deployed within the Kubernetes infrastructure locally on Minikube through the files specified in the `Kubernetes` folder. Worth mentioning is the fact that services which are stateful are implemented via `StatefulSets`.

<!-- Deployment on GCP -->
As of writing this, the application is not yet deployed on Google Cloud Platform, however we intend to make this transition before the demo.

## Frontend
<!-- What data is visualized -->
A simple webpage was built that shows the predicted lifetime expectancies for the current household. The webpage was created in Vue.js and loads the latest results from Cassandra through a service named `status_retriever`.

### System pipeline
Sensors produce data continuously and stream it into a Kafka topic named `sensor_data`. The `db-interface` consumer ingests each message and inserts them as soon as they arrive into `cassandra-cluster`. Whenever a training job is submitted, data from Cassandra is ingested into Spark through Kafka and the regression parameters are trained. Whenever a request to predict the lifetime of the appliances is made, the trained parameters are used to predict lifetime based on incoming data from the sensors. The result is sent to a Kafka topic named `predictions` that is then received by a database interface to be stored into Cassandra. Finally, whenever the user wants to see the lifetime of their appliances, a request is made to retrieve the latest predictions.
