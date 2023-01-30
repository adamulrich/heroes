const mongoDB = require('../dbconnect');
const ObjectId = require('mongodb').ObjectId;


//heartbeat
function naviagationUi(req, res) {

    var login_name = "Not Logged in.";
    if (req.oidc.isAuthenticated()) {
        login_name = `Logged in as ${req.oidc.user.name}`
    }
    const return_value = `
    <!DOCTYPE html><html>
    <head><link rel="stylesheet" href="base.css">
        <title>HeroDB</title>
    </head>
    <body>
    <header>
    <h1>Hero DB is up and running.</h1>
    <nav>
    <ul>
        <li><a href='/login'>Login</a></li>
        <li><a href='/logout'>Logout</a></li>
        <li><a href='/profile'>Current Profile</a></li>
        <li><a href='/api-docs'>Test the Hero API</a></li>
    </ul>
    </nav>
    </header>
    <section class="profile">
        <h3>${login_name}</h3>
    </section>
    </body>
    </html>`
        
    //return data
    setHeaders(res);
    res.setHeader('Content-Type', 'text/html');    
    res.status(200).send(return_value);
}

// gets names and ids for all heroes
async function getNamesAndIds(req, res) {

    try {
        //get db
        const dbo = mongoDB.getDB().db("heroes");

        //get data
        const result = await dbo.collection("heroes").find({}, 
        { projection: {id: 1,name: 1, _id: 0}}).toArray();
            setHeaders(res);
            res.status(200).send(result);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
        }  
}


// gets one contact from database depending on id provided
async function getHero(req, res) {

    try {

        //get id from request object
        const heroId = parseInt(req.params.id);
        
        //get data
        const dbo = await mongoDB.getDB().db("heroes");
        dbo.collection("heroes").findOne({ id: heroId }, (err, result) => {
            if (err) 
            return err;
            else 
                //return data
                setHeaders(res);
                res.status(200).send(result);
        });
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
}

// creates a new hero with the data provided
async function createNewHero(req, res) {

    try {

         //get new hero data from request object
        const newUser =req.body;

        //get db
        const db = mongoDB.getDB().db("heroes");

        //get new id number
        const newId = await db.collection("heroes").find(
            {}, 
            { projection: { id: 1, _id: 0} })
            .sort({ id: -1})
            .limit(1).toArray();

        newUser['id'] = newId[0]['id'] + 1;
        

        // create user in database
        await db.collection("heroes").insertOne(newUser, (err, result) => {
            if (err) {
                console.log(err);
                return err;
            }
            else  {
                setHeaders(res);
                delete result['insertedId'];
                //return new id number
                result['id'] = newUser['id'];
                res.status(201).send(result);
            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
}

// replaces a hero based on the id provided
async function updateHero(req, res) {

    try {
        //get id from request object
        const heroId = parseInt(req.params.id);
        
        //get new hero data from request object
        const updatedHero = req.body;

        // if the hero id is missing from the data, add it.
        if (updatedHero['id'] == null) {
            updatedHero['id'] = heroId;
        }

        //update contact
        const db = mongoDB.getDB().db("heroes");
        await db.collection("heroes").replaceOne({ id: heroId }, updatedHero, (err, result) => {

            if (err) {
                console.log(err);
                return err;
            }
            else  {
                // return result
                setHeaders(res);
                res.status(204).send('');
            }
        })
     } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
}

// delete one here from database depending on id provided
async function deleteHero(req, res) {

    try {

        //get id from request object
        const heroId = parseInt(req.params.id);
        
        //get data
        const dbo = mongoDB.getDB().db("heroes");
        await dbo.collection("heroes").deleteOne({ id: heroId }, (err, result) => {
            if (err) 
            return err;
            else 
                //return data
                setHeaders(res);
                res.status(200).send(result);
        });
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
}

// sets the headers for the response
function setHeaders(res) {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Z-Key');
    res.setHeader('Access-Control-Allow-Credentials', true);
    
}

module.exports = { naviagationUi, getNamesAndIds, getHero, createNewHero, updateHero, deleteHero } ;
