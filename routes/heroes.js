
const router = require('express').Router();
const dataController = require('../controllers/heroes');

// req.isAuthenticated is provided from the auth router
router.get('/profile', (req, res) => {
  if (req.oidc.isAuthenticated()) {
    res.send(JSON.stringify(req.oidc.user));
  } else {
    res.status(401).send("not logged in");
  }
});

router.get('/',
    // #swagger.summary = 'returns ok if the service is running'
    // #swagger.description = 'returns ok if the service is running'
    /* #swagger.responses[200] = {
            description: 'OK',
        }
    */
    dataController.returnHeartbeat);

router.get('/hero-names-and-ids', 
    // #swagger.summary = 'returns all the hero names and their ids'
    // #swagger.description = 'returns all the hero names and their ids'
    /* #swagger.responses[200] = {
            description: 'json list',
            schema: [{ $ref: '#/definitions/heroNameAndId' }]
             }
    }
    */
    dataController.getNamesAndIds);

router.get('/hero/:id', 
    // #swagger.summary = 'returns hero based on id'
    // #swagger.description = 'returns hero based on id'
    /* #swagger.responses[200] = {
            description: 'hero json',
            schema: { $ref: '#/definitions/hero' }
             }
    }
    */
    dataController.getHero);


router.post('/hero', (req, res) => {
    if (req.oidc.isAuthenticated()) {
        /* #swagger.security = [{
            "oAuth2Implicit": [
            "write"
            ]
        }]
        */
        // #swagger.summary = 'add a hero to the db'
        // #swagger.description = 'add a hero to the db'
        /* #swagger.responses[201] = {
                description: 'OK',
                schema: { $ref: '#definitions/insertionSuccess' }
                }
        }
        */
        /*  #swagger.parameters['obj'] = {
                in: 'body',
                description: 'Add a user',
                schema: { $ref: '#/definitions/addHero' }
            } */
            
        dataController.createNewHero(req, res); 
    } else {
        res.status(401).send("not logged in");
    }
});


router.put("/hero/:id", (req, res) => {
    if (req.oidc.isAuthenticated()) {
    // #swagger.summary = 'replaces a hero in the db based on ID'
    // #swagger.description = 'replaces a hero in the db based on ID'
    /* #swagger.responses[204] = {
            description: 'OK',
             }
    }
    */ 
    /*  #swagger.parameters['obj'] = {
                in: 'body',
                description: 'Replace hero info',
                schema: { $ref: '#/definitions/addHero' }
        } */

        dataController.updateHero(req, res);
    } else {
        res.status(401).send("not logged in");
    }
});

router.delete("/hero/:id", (req, res) => {
    if (req.oidc.isAuthenticated()) {
    // #swagger.summary = 'deletes a hero from the db based on ID.'
    // #swagger.description = 'deletes a hero from the db based on ID.'
    // #swagger.parameters['id'] = { description: 'hero Id' }
    /* #swagger.responses[200] = {
            description: 'OK',
             }
    }
    */
    dataController.deleteHero(req, res);
} else {
    res.status(401).send("not logged in");
}
});

module.exports = router;
