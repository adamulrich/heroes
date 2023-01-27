
const { MongoClient } = require('mongodb');
require('dotenv').config();
const connectionString = process.env.MONGO_CONNECT_STRING;
console.log(process.env.MONGO_CONNECT_STRING);

let mongoDB = null;

async function initDB(){

    const client = new MongoClient(connectionString);    
    
    try {
        // Connect to the MongoDB cluster
        await client.connect();
        console.log("connection to DB confirmed.")
        // Make the appropriate DB calls
        mongoDB = client;
 
    } catch (e) {
        console.error(e);
    } finally {
        // await client.close();
    }
}

function getDB() {
    if (mongoDB != null) {
        return mongoDB
    } else {
        initDB()
        //console.log("db not initialized yet.")
        return mongoDB
    }
}

module.exports = { initDB, getDB }



 
