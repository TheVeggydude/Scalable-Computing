const express = require('express');
const router = express.Router();

const localDatacenter = 'datacenter1';
const cassandra = require('cassandra-driver');
const contactPoints = ['cassandra-cluster', 'cassandra-cluster', 'cassandra-cluster'];
const loadBalancingPolicy = new cassandra.policies.loadBalancing.DCAwareRoundRobinPolicy(localDatacenter); 

const clientOptionsHousehold = {
   policies : {
      loadBalancing : loadBalancingPolicy
   },
   contactPoints: contactPoints,
   authProvider: new cassandra.auth.PlainTextAuthProvider('cassandra', 'cassandra'),
   keyspace:'household'
};

const getPredictions = 'SELECT * FROM predictions';

// Get predictions based on ID
router.get('/', async (req, res) => {
    const householdPredictions = await getHouseholdPredictions();
    res.status(200).send(householdPredictions);
});

// Retrieves a list of appliance ids with their corresponding predictions
async function getHouseholdPredictions() {
    cassandraClient = new cassandra.Client(clientOptionsHousehold)
    request = getPredictions;

    let compiledList = [];
    await new Promise((resolve, reject) => {
        cassandraClient.execute(request, (result, err) => {
            console.log(`SUCCESSFULLY EXECUTED QUERY`);
            for (i = 0; i < err.rows.length; i ++) {
                let appliance = {
                    id: '',
                    deltaT: 9999
                }
                appliance.id = err.rows[i].id;
                appliance.deltat = err.rows[i].deltat;
                compiledList.push(appliance);
            }
            resolve()
        })
    }).then(
        response => {},
        reason => {}
    );
    console.log(`compiled list:${compiledList}`);
    return compiledList;
}

module.exports = router;