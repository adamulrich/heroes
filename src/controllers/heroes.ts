
import heroModel from '../models/heroes';
import userModel from '../models/users';

const Hero = heroModel;
const User = userModel;

const contentText = 'text/plain';
const contentJson = 'application/json';

// gets names and ids for all heroes
export async function getNamesAndIds(_req: any, res: any) {
    try {
        const Heroes = await Hero.find({}).select(['heroId','heroName','-_id']);
        setHeaders(res, contentJson);
        res.status(200).send(Heroes);

    } catch (error) {
        setHeaders(res, contentText);
        res.status(500).send(`${error}`);
        }
}

// gets one contact from database depending on id provided
export async function getHero(_req: any, res: any) {
    try {
        // get id from request object
        const heroId = Number(_req.params.id);

        const result = await Hero.find({ 'heroId': heroId });

        // no result - not a valid id
        if (result === null || result.length === 0) {
            setHeaders(res, contentText);
            res.status(404).send(result);
        } else {
            // return data
            setHeaders(res, contentJson);
            res.status(200).send(result[0]);
        }
    } catch (error) {
        setHeaders(res, contentText);
        res.status(500).send(`${error}`);
    }
}

// creates a new hero with the data provided
export async function createNewHero(_req: any, res: any) {
    try {
        if (await getPrivData(_req.oidc.user.sub,'create')) {

            // get new hero data from request object
            try {
                const newHero = new Hero(_req.body);

                // get new id number
                const newId = await Hero.find({}).sort({ heroId: -1 }).limit(1);
                newHero.heroId = newId[0].heroId + 1;

                // create user in database
                try {
                    await newHero.save();

                // failed to save
                } catch (error) {
                    setHeaders(res, contentText);
                    res.status(422).send(`Bad data. ${error}`);
                    return;
                }

                // success
                setHeaders(res, contentText);
                res.status(201).send(`New Hero: ${newHero.heroName}, Id: ${newHero.heroId}`);

            // catch unknown errors
            } catch (error) {
                setHeaders(res, contentText);
                res.status(400).send(`${error}`);
                return;
            }
        // failed authoriation for user
        } else {
            setHeaders(res, contentText);
            res.status(403).send("Incorrect permissions.");
        }
    } catch (error) {
        res.status(500).send(`${error}`);
    }
}

// replaces a hero based on the id provided
export async function updateHero(_req: any, res: any) {
    try {
        if (await getPrivData(_req.oidc.user.sub, 'update')) {
            // get id from request object
            const heroId = Number(_req.params.id);

            // get new hero data from request object
            const updatedHero = _req.body;
            let result = null;

            // update User
            try {
                updatedHero.heroId = heroId;

                // validate hero against model
                result = await Hero.updateOne({ heroId: { $eq: heroId } }, updatedHero, { runValidators: true });

            } catch (error) {
                setHeaders(res, contentText);
                res.status(422).send(`Bad data. ${error}`);
                return;
            }

            let statusCode = 0;
            let modifiedCount = 0;
            if (result) {
                modifiedCount = result.modifiedCount
            }
            // if we don't have a result or the modifiedCount is 0 set the status code to 404
            if (result === null || modifiedCount === 0 ) {
                statusCode = 404
            } else {
                statusCode = 200
            }
            setHeaders(res, contentJson);
            res.status(statusCode).send(result);

        } else {
            setHeaders(res, contentText);
            res.status(403).send("Incorrect permissions.");
        }
     } catch (error) {
        res.status(500).send(`${error}`);
    }
}

// delete one here from database depending on id provided
export async function deleteHero(_req: any, res: any) {
    try {
        const deletePriv = await getPrivData(_req.oidc.user.sub, 'delete');
        console.log(`Delete Priv: ${deletePriv}`);
        if (deletePriv) {

            // get id from request object
            const heroId = Number(_req.params.id);
            let result: any = null;

            // delete
            try {
                result = await Hero.deleteOne({heroId: {$eq: heroId}});
            } catch (error) {
                setHeaders(res, contentText);
                res.status(422).send(`Bad data. ${error}`);
                return;
            }
            // if deletedCount is 0 set the status code to 404
            let statusCode = 0;
            if (result.deletedCount === 0) {
                statusCode = 404
            } else {
                statusCode = 200
            }
            setHeaders(res, contentText);
            res.status(statusCode).send(result);

        // failed permissions
        } else {
            res.status(403).send("Incorrect permissions.");
        }
        } catch (error) {
        res.status(500).send(`${error}`);
    }
}

// sets the headers for the response
function setHeaders(res: any, contentType: string) {
    res.setHeader('Content-Type', contentType);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Z-Key');
    res.setHeader('Access-Control-Allow-Credentials', true);

}

// const privileges: privilegeType = { 1: 'create', 2: 'read', 3: 'update', 4: 'delete' }

async function getPrivData(sub: string, priv: string) {
    try {
        const userPrivs = await User.findOne({ user_id: sub });
        if (userPrivs != null) {
            // @ts-ignore
            return userPrivs.privileges[priv];
        } else {
            console.log("User not found.");
            return false;
        }

    } catch (error) {
        console.log(`${error}`)
        return false;
    }
}
