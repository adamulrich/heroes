// env
require('dotenv').config();
const connectionString = process.env.MONGO_CONNECT_STRING;
const port = process.env.HTTP_PORT;
const swaggerUI = require("swagger-ui-express");
const cors = require('cors')
const logger = require('morgan');

// mongoDB
const mongoDB = require('./dbconnect');
mongoDB.initDB();


//express
const express = require('express');
const http = require('http');
const https = require('https');
const app = express();

// attach login/logout/ /callback
const { auth } = require('express-openid-connect');

const config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.SECRET,
    baseURL: process.env.BASE_URL,
    clientID: process.env.CLIENT_ID,
    issuerBaseURL: process.env.ISSUER_BASE_URL
  };
  
  
 app.use(auth(config));

// logger
app.use(logger('dev'));

//routes
app.use(cors());
app.use(express.json());

const swaggerSpec = require('./swagger-output.json');
const { env } = require('process');
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.use('/', require('./routes/heroes'));

app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Z-Key');
    res.setHeader('Access-Control-Allow-Credentials', true);
})



//start
app.listen(port, (res, req) => {
    
    console.log(`App listening on port ${port}`)
})
            