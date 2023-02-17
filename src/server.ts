
// dotenv
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();


/* tslint:disable:no-string-literal */
const port = process.env['HTTP_PORT'] ?? 3000;
import swaggerUI from 'swagger-ui-express';
import cors from 'cors';
import logger from 'morgan';

// db models
import { getDb } from './db/mongoose';
import heroModel from './models/heroes';
import { example} from './models/heroes';
import userModel from './models/users';

import m2s from 'mongoose-to-swagger';

// swagger
const heroSchema = m2s(heroModel);
const addHeroExample = example;
const userSchema = m2s(userModel);

import swaggerSpec from '../src/swagger-output.json';


// @ts-ignore
swaggerSpec.definitions.hero = heroSchema;
// @ts-ignore
swaggerSpec.definitions.hero.example = addHeroExample;
// @ts-ignore
swaggerSpec.definitions.user = userSchema;

// express
import express from 'express';

const app = express();

// static paths and encoding
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// attach login/logout/ /callback
import { auth } from 'express-openid-connect';



const config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env['SECRET'],
    baseURL: process.env['BASE_URL'] ,
    clientID: process.env['CLIENT_ID'],
    issuerBaseURL: process.env['ISSUER_BASE_URL']
  };

app.use(auth(config));

// logger
app.use(logger('dev'));

// routes
app.use(cors());
app.use(express.json());

// swagger
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

import routes from './routes/heroes.js';
app.use('/', routes);

app.use((_req: any, res: any ) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Z-Key');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
})

// start
app.listen(port, async () => {
    /* tslint:disable:no-string-literal */
    console.log(`App listening at ${process.env['BASE_URL']}`)
    try {
        await getDb();
        console.log("connected via mongoose to mongo db");
    } catch (error) {
        console.log(error);
    }
})

module.exports = app;
