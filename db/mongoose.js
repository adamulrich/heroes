// mongoose
const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
require('dotenv').config();

let db = null;

const connectionString = process.env.MONGO_CONNECT_STRING;

async function getDb() {
    if (db == null) {
        try {
            db = await mongoose.connect(connectionString);  
            let dbConnection = mongoose.connection;
            dbConnection.once('open', () => console.log('connected to the database'));

            // checks if connection with the database is successful
            dbConnection.on('error', console.error.bind(console, 'MongoDB connection error:'));  
        } catch (error) {
            console.log(error)
        }
    }
    return db
}

module.exports = { getDb}