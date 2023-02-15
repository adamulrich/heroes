const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    version: '',
    title: 'HEROES REST API',
    description: '',
  },
  host: '',
  basePath: '',
  servers: [
    { url: "http://localhost:3000" },
    { url: "https://hero-service.onrender.com" }
  ],
    
  schemes: [],
  consumes: [],
  produces: [],
  tags: [
    {
      name: '',
      description: '',
    },
  ],
  components: {
    "securitySchemes": {
      "oAuth2Implicit": {
        "type": "oauth2",
        "description": "For more information, see https://developers.getbase.com/docs/rest/articles/oauth2/requests",
        "flows": {
          "implicit": {
            "authorizationUrl": "https://dev-vukawrenb1tvjct0.us.auth0.com/authorize",
            "scopes": {
              "read": "Grant read-only access to all your data except for the account and user info",
              "write": "Grant write-only access to all your data except for the account and user info",
              "profile": "Grant read-only access to the account and user info only"
            }
          }
        }
      }
    }
  },
  security: [
    {
      "oAuth2Implicit":
        ["write",
          "read"
        ] 
    }], 
  definitions: {
    heroNameAndId: {
      id: 0,
      name: "Grogu"
    }
  }
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./server.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
