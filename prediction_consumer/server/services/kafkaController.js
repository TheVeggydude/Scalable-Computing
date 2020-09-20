const {Kafka} = require('kafkajs');
const ResultService = require('./ResultService');

const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['kafka:29091', 'kafka2:29092', 'kafka3:29093']
});

const consumer = kafka.consumer({groupId: 'status-retriever'});

module.exports = class KafkaController {

    static async getMessage() {
    
    }
}
