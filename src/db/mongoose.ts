// mongoose
import mongoose from 'mongoose';
mongoose.set('strictQuery', true);

// dotenv
import dotenv from 'dotenv';
dotenv.config();

let db: unknown = null;

/* tslint:disable:no-string-literal */
const connectionString: string = (process.env['MONGO_CONNECT_STRING']) ?? "";

async function getDb() {
    if (db == null) {
        try {
            db = await mongoose.connect(connectionString);
            const dbConnection = mongoose.connection;
            dbConnection.once('open', () => console.log('connected to the database'));

            // checks if connection with the database is successful
            dbConnection.on('error', console.error.bind(console, 'MongoDB connection error:'));
        } catch (error) {
            console.log(error)
        }
    }
    return db
}

export {getDb};