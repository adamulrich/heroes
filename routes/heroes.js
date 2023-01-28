
const router = require('express').Router();
const dataController = require('../controllers/heroes');

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


router.post('/hero', 
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
                schema: { $ref: '#/definitions/newContact' }
        } */
    dataController.createNewHero);

router.put("/hero/:id", 
    // #swagger.summary = 'replaces a contact in the db based on ID'
    // #swagger.description = 'replaces a contact in the db based on ID'
    /* #swagger.responses[204] = {
            description: 'OK',
             }
    }
    */
    /*  #swagger.parameters['obj'] = {
                in: 'body',
                description: 'Replace contact info',
                schema: { $ref: '#/definitions/newContact' }
        } */

    dataController.updateHero);

router.delete("/hero/:id", 
    // #swagger.summary = 'deletes a contact from the db based on ID.'
    // #swagger.description = 'deletes a contact from the db based on ID.'
    // #swagger.parameters['id'] = { description: 'Contact Id' }
    /* #swagger.responses[200] = {
            description: 'OK',
             }
    }
    */
    dataController.deleteHero);

module.exports = router;
