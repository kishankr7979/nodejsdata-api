const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABSE_URL, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }

});

const SensorData = sequelize.define('sensor-data', {
    serial: {
        type: DataTypes.STRING,
        allowNull: false


    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    temperature: {
        type: DataTypes.FLOAT,
        allowNull: false

    }
})

const app = express();
app.use(express.json());




app.get('/data', async(req, res) => {
    const allData = await SensorData.findAll();
    res.status(200).send(allData);
    return;
});
app.post('/data', async(req, res) => {
    let data = req.body;
    const sensorData = await SensorData.create(data);
    res.status(200).send(sensorData);
    return;
});

let port = 8080
app.listen(port, () => {
    try {
        sequelize.authenticate();
        console.log('Connected to Database :) ');
        sequelize.sync({ alter: true });
        console.log('Synced to Database :) ');
    } catch (error) {
        console.log('not able to connect to database :(', error);
    }
    console.log('Server is listeing on : ', port);

});