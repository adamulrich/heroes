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
    explorer: false,
    swaggerOptions: {
        oauth: {
            authRequired: true,
            auth0Logout: true,
            clientId: 'Sd3qo6O9oO416v1CqERcSTuYKDnysHli',
            clientSecret: 'asdfasdfkljasdfjklasjkl;dfj;klasjkd;lf132j42kl34kjl23wEC2323423423424123ASDFASDFAVAFVALKJAKL;DFJA',
            appName: "v1.0",
            baseURL: 'http://localhost:3000',
            issuerBaseURL: 'https://dev-vukawrenb1tvjct0.us.auth0.com',
            scopeSeparator: ',',
			additionalQueryStringParams: {}			

        }
    }
}
  

  
//  app.use(auth(config));

// logger
app.use(logger('dev'));

//routes
app.use(cors());
app.use(express.json());

const swaggerSpec = require('./swagger-output.json');
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec, config));

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
            