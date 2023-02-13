
// router
import Router from 'express';
const router = Router();

// controller
import {getNamesAndIds, getHero, createNewHero, updateHero, deleteHero } from '../controllers/heroes';


// req.isAuthenticated is provided from the auth router
router.get('/', (_req: any, res: any) => {
    // #swagger.ignore = true
    if (_req.oidc.isAuthenticated()) {
        res.render('profile', {
            title: 'Profile',
            image: _req.oidc.user.picture,
            name: _req.oidc.user.name,
            user_id: _req.oidc.user.sub
        });
  } else {
        res.render('profile', {
            title: 'Profile',
            image: '',
            name: 'Not logged in.',
            user_id: ''
        })
  }
})

router.get('/hero-names-and-ids',
    // #swagger.summary = 'returns all the hero names and their ids'
    // #swagger.description = 'returns all the hero names and their ids'
    /* #swagger.responses[200] = {
            description: 'json list',
            schema: [{ $ref: '#/definitions/heroNameAndId' }]
             }
    }
    */
    getNamesAndIds);

router.get('/hero/:id',
    // #swagger.summary = 'returns hero based on id'
    // #swagger.description = 'returns hero based on id'
    /* #swagger.responses[200] = {
            description: 'hero json',
            schema: { $ref: '#/definitions/hero' }
             }
    }
    */
    getHero);


router.post('/hero', (_req: any, res: any) => {
    if (_req.oidc.isAuthenticated()) {
        /* #swagger.security = [{
            "oAuth2Implicit": [
            "write"
            ]
        }]
        */
        // #swagger.summary = 'add a hero to the db'
        // #swagger.description = 'add a hero to the db'
        /* #swagger.responses[201] = {
                description: 'OK'}
                }
        }
        */
        /*  #swagger.parameters['obj'] = {
                in: 'body',
                description: 'Add a user',
                schema: { $ref: '#/definitions/hero' }
            } */

        createNewHero(_req, res);
    } else {
        res.status(401).send("not logged in");
    }
});


router.put("/hero/:id", (_req: any, res: any) => {
    if (_req.oidc.isAuthenticated())
    {
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
                schema: { $ref: '#/definitions/hero' }
        } */

        updateHero(_req, res);
    } else {
        res.status(401).send("not logged in");
    }
});

router.delete("/hero/:id", (_req: any, res: any) => {
    if (_req.oidc.isAuthenticated()) {
    // #swagger.summary = 'deletes a hero from the db based on ID.'
    // #swagger.description = 'deletes a hero from the db based on ID.'
    // #swagger.parameters['id'] = { description: 'hero Id' }
    /* #swagger.responses[200] = {
            description: 'OK',
             }
    }
    */
        deleteHero(_req, res);
    } else {
        res.status(401).send("not logged in");
    }
});


export default router;
