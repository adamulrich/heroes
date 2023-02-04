const { exit } = require('process');
const mongoDB = require('../dbconnect');
const ObjectId = require('mongodb').ObjectId;

//heartbeat
function navigationUi(req, res) {

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
                if (result == null) {
                    setHeaders(res);
                    res.status(404).send(result);
                } else {
                    //return data
                    setHeaders(res);
                    res.status(200).send(result);
                }
        });
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
}

// creates a new hero with the data provided
async function createNewHero(req, res) {

    try {
        if (await getPrivData(req.oidc.user.sub,'create')) {
            //get new hero data from request object
            const newHero = req.body;
            // check object correctness
            if (allKeysExist(heroTemplate, newHero) === false) {
                res.status(400).send("Bad data.");
                return;
            }

            //get db
            const db = mongoDB.getDB().db("heroes");

            //get new id number
            const newId = await db.collection("heroes").find(
                {},
                { projection: { id: 1, _id: 0 } })
                .sort({ id: -1 })
                .limit(1).toArray();

            newHero['id'] = newId[0]['id'] + 1;
            

            // create user in database
            await db.collection("heroes").insertOne(newHero, (err, result) => {
                if (err) {
                    console.log(err);
                    return err;
                }
                else {
                    setHeaders(res);
                    delete result['insertedId'];
                    //return new id number
                    result['id'] = newHero['id'];
                    res.status(201).send(result);
                }
            });
        } else {
            res.status(403).send("Not Authorized");    
        }
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
}

// replaces a hero based on the id provided
async function updateHero(req, res) {

    try {
        if (await getPrivData(req.oidc.user.sub, 'update')) {
            //get id from request object
            const heroId = parseInt(req.params.id);
            
            //get new hero data from request object
            const updatedHero = req.body;

            // check object correctness
            if (allKeysExist(heroTemplate, updatedHero) === false) {
                res.status(400).send("Bad data.");
                return;
            }
        

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
                else {
                    // return result
                    setHeaders(res);
                    res.status(204).send('');
                }
            })
        } else {
            res.status(403).send("Not Authorized");    
        }
     } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
}

// delete one here from database depending on id provided
async function deleteHero(req, res) {

    try {
        if (await getPrivData(req.oidc.user.sub, 'delete')) {
            //get id from request object
            const heroId = parseInt(req.params.id);
            
            //get data
            const dbo = mongoDB.getDB().db("heroes");
            await dbo.collection("heroes").deleteOne({ id: heroId }, (err, result) => {
                if (err)
                    return err;
                else
                    if (result.deletedCount == 0) {
                        setHeaders(res);
                        res.status(404).send(result);
                    } else {
                        //return data
                        setHeaders(res);
                        res.status(200).send(result);
                    }
            });
        } else {
            res.status(403).send("Not Authorized");    
        }
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

async function canCreate(sid) {
    const user = await getPrivData(sid);
    if (user != null) {
        return user.privileges.create;
    } else {
        console.log("user not found");
        return false;
    }
}


async function getPrivData(sub,priv) {

    const dbo = await mongoDB.getDB().db("heroes");
    const user = await dbo.collection("privileges").findOne({ user_id: sub });
    if (user != null) {
        return user.privileges[priv];
    } else {
        console.log("User not found.");
        return false;
    }

    return returnValue;
}

function allKeysExist(template, newHero) {

    //check root keys
    let returnFlag = keysExist(template, newHero)
        
    //check other keys
    const keyList = ['powerstats', 'biography', 'appearance', 'work', 'connections', 'image']
    keyList.forEach  ( key => {
        if (keysExist(template[key], newHero[key]) === false) {
            returnFlag = false;
        }
    })
    return returnFlag;
}

function keysExist(template, newHero) {
    let returnFlag = true;
    Object.keys(template).forEach(key => {
        if (key in newHero == false) {
            returnFlag = false;
            }
    })
    if (Object.keys(template).length != Object.keys(newHero).length) {
        returnFlag = false;
    }
    return returnFlag;
}

const heroTemplate = {
    name: "Grogu",
    powerstats: {
      intelligence: 40,
      strength: 30,
      speed: 33,
      durability: 25,
      power: 50,
      combat: 50
    },
    biography: {
      "full-name": "Grogu",
      "alter-egos": "No alter egos found.",
      aliases: ["The Child", "Baby Yoda"],
      "place-of-birth": "-",
      "first-appearance": "The Mandalorian (2019)",
      publisher: "George Lucas",
      alignment: "good"
    },
    appearance: {
      gender: "Male",
      race: "Yoda's species",
      height: ["1'1", "34 cm"],
      weight: ["19 lb", "17 kg"],
      "eye-color": "Brown",
      "hair-color": "White"
    },
    work: { occupation: "-", base: "-" },
    connections: {
      "group-affiliation": "",
      relatives: ""
    },
    image: {
      url: "https://static.wikia.nocookie.net/starwars/images/4/43/TheChild-Fathead.png/revision/latest?cb=20201031231040"
    }
  }

  module.exports = { navigationUi, getNamesAndIds, getHero, createNewHero, updateHero, deleteHero } ;
