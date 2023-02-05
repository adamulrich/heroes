const ObjectId = require('mongodb').ObjectId;
const { default: mongoose } = require('mongoose');
const Hero = require('../models/heroes');
const User = require('../models/users')

//heartbeat
function navigationUi(req, res) {

    var login_name = "Not Logged in.";
    if (req.oidc.isAuthenticated()) {
        login_name = `Logged in as ${req.oidc.user.name}`
    }
}

// gets names and ids for all heroes
async function getNamesAndIds(req, res) {
    try {
        const Heroes = await Hero.find({}).select(['heroId','heroName','-_id']);
            setHeaders(res);
            res.status(200).send(Heroes);
    } catch (error) {
        res.status(500).send(error);
        }  
}


// gets one contact from database depending on id provided
async function getHero(req, res) {

    try {

        //get id from request object
        const heroId = parseInt(req.params.id);
        
        //get data
        try {
            const result = await Hero.find({ 'heroId': heroId });    
            if (result == null || result.length == 0) {
                setHeaders(res);
                res.status(404).send(result);
            } else {
                //return data
                setHeaders(res);
                res.status(200).send(result[0]);
            }
        } catch (error) {
            return err;
        }
    } catch (error) {
        res.status(500).send(error);
    }
}

// creates a new hero with the data provided
async function createNewHero(req, res) {

    try {
        if (await getPrivData(req.oidc.user.sub,'create')) {
            //get new hero data from request object
            try {
                const newHero = new Hero(req.body);

                // get new id number
                const newId = await Hero.find({}).sort({ heroId: -1 }).limit(1);
                newHero['heroId'] = newId[0]['heroId'] + 1;
                let heroName = '', id = 0;
                // create user in database
                try {
                    await newHero.save();
                    heroName = newHero['heroName'];
                    id = newHero['heroId'];
                } catch (error) {
                    res.setHeader('Content-Type', 'text/plain');
                    res.status(400).send(`Bad data. ${error}`);
                    return;
                }
            
                setHeaders(res);
                res.setHeader('Content-Type', 'text/plain');

                res.status(201).send(`New Hero: ${heroName}, Id: ${id}`);
            } catch (error) {
                res.setHeader('Content-Type', 'text/plain');
                res.status(400).send(`Bad data. ${error}`);
                return;
            }

        } else {
            res.setHeader('Content-Type', 'text/plain');
            res.status(403).send("Not Authorized");    
        }
    } catch (error) {
        res.status(500).send(error);
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
            let result =  null;
            // update User
            try {
                updatedHero['heroId'] = heroId;
                result = await Hero.updateOne({heroId: {$eq: heroId}}, updatedHero);
            } catch (error) {
                res.setHeader('Content-Type', 'text/plain');
                res.status(400).send(`Bad data. ${error}`);
                return;
            }
            let statusCode = 0;
            let modifiedCount = 0;
            if (result) {modifiedCount = result.modifiedCount}
            if (result === null || modifiedCount == 0 ) {
                statusCode = 404
            } else {
                statusCode = 200
            }
            setHeaders(res);
            res.setHeader('Content-Type', 'application/json');
            res.status(statusCode).send(result);

        } else {
            res.setHeader('Content-Type', 'text/plain');
            res.status(403).send("Not Authorized");    
        }

     } catch (error) {
        res.status(500).send(error);
    }
}

// delete one here from database depending on id provided
async function deleteHero(req, res) {

    try {
        if (await getPrivData(req.oidc.user.sub, 'delete')) {

            //get id from request object
            const heroId = parseInt(req.params.id);
            let result = '';
            //delete
            try {
                
                result = await Hero.deleteOne({heroId: {$eq: heroId}});
            } catch (error) {
                res.setHeader('Content-Type', 'text/plain');
                res.status(400).send(`Bad data. ${error}`);
                return;
            }
            let statusCode = 0;
            if (result.deletedCount == 0) {
                statusCode = 404
            } else {
                statusCode = 200
            }
            setHeaders(res);
            res.setHeader('Content-Type', 'text/plain');
            res.status(statusCode).send(result);

        } else {
            res.status(403).send("Not Authorized");    
        }
        } catch (error) {
        res.status(500).send(error);
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

async function getPrivData(sub,priv) {

    try {
        const userPrivs = await User.findOne({ user_id: sub });
        if (userPrivs != null) {
            return userPrivs.privileges[priv];
        } else {
            console.log("User not found.");
            return false;
        }
    
    } catch (error) {
        console.log(error)        
        return false;
    }
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
    heroName: "Grogu",
    powerstats: {
      intelligence: 40,
      strength: 30,
      speed: 33,
      durability: 25,
      power: 50,
      combat: 50
    },
    biography: {
      full_name: "Grogu",
      alter_egos: "No alter egos found.",
      aliases: ["The Child", "Baby Yoda"],
      place_of_birth: "-",
      first_appearance: "The Mandalorian (2019)",
      publisher: "George Lucas",
      alignment: "good"
    },
    appearance: {
      gender: "Male",
      race: "Yoda's species",
      height: ["1'1", "34 cm"],
      weight: ["19 lb", "17 kg"],
      eye_color: "Brown",
      hair_color: "White"
    },
    work: { occupation: "-", 
            base: "-" },
    connections: {
      group_affiliation: "",
      relatives: ""
    },
    image: {
      url: "https://static.wikia.nocookie.net/starwars/images/4/43/TheChild-Fathead.png/revision/latest?cb=20201031231040"
    }
  }

  module.exports = { navigationUi, getNamesAndIds, getHero, createNewHero, updateHero, deleteHero } ;
