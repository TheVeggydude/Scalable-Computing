const {Kafka} = require('kafkajs');

const kafka = new Kafka({
    clientId: 'my-third-app',
    brokers: ['kafka:29091', 'kafka2:29092', 'kafka3:29093']
});

var sensorDictionary = {}
var coefficientsDictionary = {}

function insertSensorData(sensorData){
    sensorDictionary[sensorData.id] = sensorData;
    if(coefficientsDictionary[sensorDictionary[sensorData.id].model]){
        produceMessage(sensorData.id);

    }
    else{
        console.log("Nothing in the coefficients dictionary for this model :(")
    }
}

function insertCoefficients(msg){
    coefficientsDictionary[msg.sensor] = msg.coefficients;
    produceMessage();
}

async function produceMessage(specificSensor){
    messages = [];
    sensorIds = [];
    if(specificSensor){
        sensorIds.push(specificSensor);
    }
    else {
       for(var key in sensorDictionary{
        sensorIds.push(key);
       } 
    }
    for(var sensorId in sensorIds){
        var messageValue = {};
        var coeffs = coefficientsDictionary[sensorDictionary[sensorId].model]
        var sum = 0;
        var howMany = 0;
        for(var coeff of coeffs){
            let deltaT = (coeff.lim - coeff.b)/coeff.a - sensorDictionary[sensorId].t;
            sum = sum + deltaT;
            howMany = howMany + 1;
        }
        var realDeltaT = sum/howMany 
        messageValue = {
            id: sensorId,
            deltat: realDeltaT
        };
        messages.push({value: messageValue});
    }
    var producer = kafka.producer();
    console.log(messages);
    await producer.connect();
    await producer.send({
        topic: "predictions",
        messages: messages
    })
    await producer.disconnect();
}

module.exports = {
    insertSensorData: insertSensorData,
    insertCoefficients: insertCoefficients
}