const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    version: '',      // by default: '1.0.0'
    title: 'HEROES REST API',        // by default: 'REST API'
    description: '',  // by default: ''
  },
  host: '',      // by default: 'localhost:3000'
  basePath: '',  // by default: '/'
  schemes: [],   // by default: ['http']
  consumes: [],  // by default: ['application/json']
  produces: [],  // by default: ['application/json']
  tags: [        // by default: empty Array
    {
      name: '',         // Tag name
      description: '',  // Tag description
    },
    // { ... }
  ],
  securityDefinitions: {},  // by default: empty object
  definitions: {},          // by default: empty object (Swagger 2.0)
  components: {
    securitySchemes: {
      oAuth2Implicit: {
        type: 'oauth2',
        flow: 'implicit',
        scopes: {
          read: 'Grant read-only access to all your data except for the account and user info',
          write: 'Grant write-only access to all your data except for the account and user info',
          profile: 'Grant read-only access to the account and user info only'
        }
      }
    }
  },
  security: {
    oAuth2Implicit: {
      write: 'write',
      read: 'read'
    }
  },
  definitions: {
    hero: {
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
      group_affiliation: "-",
      relatives: "-"
    },
    image: {
      url: "https://static.wikia.nocookie.net/starwars/images/4/43/TheChild-Fathead.png/revision/latest?cb=20201031231040"
    }
  },
  addHero: {
    heroName: "Baby Yoda",
    powerstats: {
      intelligence: 40,
      strength: 30,
      speed: 33,
      durability: 25,
      power: 50,
      combat: 50
    },
    biography: {
      full_name: "Baby Yoda",
      alter_egos: "No alter egos found.",
      aliases: ["The Child"],
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
    work: { occupation: "-", "base": "-" },
    connections: {
      group_affiliation: "-",
      relatives: "-"
    },
    image: {
      url: "https://static.wikia.nocookie.net/starwars/images/4/43/TheChild-Fathead.png/revision/latest?cb=20201031231040"
    }
  },
  heroNameAndId: {
    id: 0,
    name: "Grogu"
  }
  }
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./server.js'];

/* NOTE: if you use the express Router, you must pass in the 
   'endpointsFiles' only the root file where the route starts,
   such as: index.js, app.js, routes.js, ... */

swaggerAutogen(outputFile, endpointsFiles, doc);


// oAuthSample: { 
//   type: 'oauth2',
//   description: 'This API uses OAuth 2 with the implicit grant flow.',
//   flows: {
//     implicit:  { //flow(authorizationCode, implicit, password or clientCredentials),
//       authorizationUrl: 'https://domain.auth0.com/authorize',
//       scopes: {
//         writer: 'write new data to heroes',
//         reader: 'can read data from heroes' 
//       }
//     }
//  }
// }
