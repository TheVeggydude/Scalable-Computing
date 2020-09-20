const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const PackageService = require("../services/PackageService");
const {Kafka} = require('kafkajs')


const app = express();

setTimeout(() => {

    const kafka = new Kafka({
        clientId: 'my-app',
        brokers: ['kafka:29091', 'kafka2:29092', 'kafka3:29093']
    });

    const consumer = kafka.consumer({groupId: 'db-interface'});

    const run = async() => {
        await consumer.connect()
        await consumer.subscribe({topic: 'sensor_data', fromBeginning: true});
        
        await consumer.run({
            eachMessage: async ({topic, partition, message}) => {
                console.log({
                    partition,
                    offset: message.offset,
                    value: message.value.toString(),
                });
                let params;
                let sensor;
                const data = JSON.parse(message.value.toString());
                
                const id = data["id"];
                const timestamp = data["timestamp"];
                const t = data["t"];
                const model = data["model"];
                const variables = data["variables"];

                if (model == "heater") {
                    const temp = variables["temperature"];
                    const wattage = variables["wattage"];
                    params = [id, model, t, timestamp, wattage, temp];
                    sensor = "heater";
                    console.log(`Heater message to be inserted = ${params}`);
                }
                else if (model == "lamp") {
                    const lumen = variables["lumen"];
                    const wattage = variables["wattage"];
                    params = [id, model, t, timestamp, wattage, lumen];
                    sensor = "lamp";
                    console.log(`Lamp message to be inserted = ${params}`);
                }
                else if (model == "vacuum") {
                    const suction = variables["suction"];
                    const wattage = variables["wattage"];
                    params = [id, model, t, timestamp, wattage, suction];
                    sensor = "vacuum";
                    console.log(`Vacuum message to be inserted = ${params}`);
                }
                PackageService.insertData(sensor, params);
            }
        });
    }

    run();

    app.use(bodyParser.json());
    app.use(cors());
    app.use(express.json());

    const prediction = require('../routes/api/prediction');

    app.use('/api/prediction', prediction);
    const port = process.env.PORT || 4004;

    app.listen(port, () => console.log(`Database interface started on port ${port}`));
}, 50000);
