const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const {Kafka} = require('kafkajs');

const StreamHandler = require('./../services/StreamHandler.js');

const app = express();
setTimeout(() => {

    const kafka = new Kafka({
        clientId: 'my-app',
        brokers: ['kafka:29091', 'kafka2:29092', 'kafka3:29093']
    });

    const sensorConsumer = kafka.consumer({groupId: 'sensor-consumer'});

    const runSensorConsumer = async() => {
        await sensorConsumer.connect()
        await sensorConsumer.subscribe({topic: 'sensor_data', fromBeginning: false});
        
        await sensorConsumer.run({
            eachMessage: async ({topic, partition, message}) => {
                console.log({
                    partition,
                    offset: message.offset,
                    value: message.value.toString(),
                });
                const id = JSON.parse(message.value.toString())["id"];
                const t = JSON.parse(message.value.toString())["t"];
                const model = JSON.parse(message.value.toString())["model"];
                let sensorData = {id, t, model}
                StreamHandler.insertSensorData(sensorData);
            }
        });

    }

    const kafka2 = new Kafka({
        clientId: 'my-second-app',
        brokers: ['kafka:29091', 'kafka2:29092', 'kafka3:29093']
    });

    const coeffConsumer = kafka2.consumer({groupId: 'coeff-consumer'});

    const runCoeffConsumer = async() => {
        await coeffConsumer.connect()
        await coeffConsumer.subscribe({topic: 'coefficients', fromBeginning: false});
        
        await coeffConsumer.run({
            eachMessage: async ({topic, partition, message}) => {
                console.log(`COEFFICIENTS@&#$!@*&($HWSIEUFGN#O@&* RHESLF#LR)`)
                console.log({
                    partition,
                    offset: message.offset,
                    value: message.value.toString(),
                });
                const sensor = JSON.parse(message.value.toString())["model"];
                var coefficients = {};
                for(var varName in message.value.variables){
                    var a = JSON.parse(message.value.variables[varName].toString())["a"];
                    var b = JSON.parse(message.value.variables[varName].toString())["b"];
                    var lim = JSON.parse(message.value.variables[varName].toString())["limit"];
                    coefficients[varName] = {a, b, lim}
                }
                var result = {sensor, coefficients}
                StreamHandler.insertCoefficients(result);
            }
        });

    }

    runSensorConsumer();
    runCoeffConsumer();

    app.use(bodyParser.json());
    app.use(cors());
    app.use(express.json());

    const port = process.env.PORT || 4005;

    app.listen(port, () => console.log(`Node streaming started on port ${port}`));
}, 50000);
