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

const insertHeaterQuery = 'INSERT INTO heaters(id, model, t, ts, wattage, temperature) VALUES(?, ?, ?, ?, ?, ?)';
const insertLampQuery = 'INSERT INTO lamps(id, model, t, ts, wattage, lumen) VALUES(?, ?, ?, ?, ?, ?)';
const insertVacuumQuery = 'INSERT INTO vacuums(id, model, t, ts, wattage, suction) VALUES(?, ?, ?, ?, ?, ?)';

module.exports = class PackageService {
    // Commit sensory data to Cassandra Cluster
    static async insertData(query, data) {
        // Commit data to Cassandra DB
        cassandraClient = new cassandra.Client(clientOptions);
        
        switch(query) {
            case 'heater':
                query = insertHeaterQuery;
                break;
            case 'lamp':
                query = insertLampQuery;
                break;
            case 'vacuum':
                query = insertVacuumQuery;
                break;
            default:
                console.log(`Invalid query = ${query}.`);        
        }
        console.log(`attempting to insert ${data} using ${query}`);
        cassandraClient.execute(query, data, {prepare: true}, (err) => {
            if(err) {
                console.log(err);
            }
        });
    }
}