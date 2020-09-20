const localDatacenter = 'datacenter1';
const cassandra = require('cassandra-driver');
const contactPoints = ['cassandra-cluster', 'cassandra-cluster', 'cassandra-cluster'];
const loadBalancingPolicy = new cassandra.policies.loadBalancing.DCAwareRoundRobinPolicy(localDatacenter); 
const clientOptions = {
   policies : {
      loadBalancing : loadBalancingPolicy
   },
   contactPoints: contactPoints,
   authProvider: new cassandra.auth.PlainTextAuthProvider('cassandra', 'cassandra'),
   keyspace:'household'
};
let cassandraClient = new cassandra.Client(clientOptions);

const insertResultQuery = 'INSERT INTO predictions(id, deltat) VALUES(?, ?)';

module.exports = class PackageService {
    // Commit sensory data to Cassandra Cluster
    static async insertPrediction(data) {
        console.log(`data: ${data}`);
        // Commit data to Cassandra DB
        cassandraClient = new cassandra.Client(clientOptions);

        console.log(`attempting to insert ${data} using ${insertResultQuery}`);
        cassandraClient.execute(insertResultQuery, data, {prepare: true}, (err) => {
            if(err) {
                console.log(err);
            }
        });
    }
}