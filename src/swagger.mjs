import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    version: '',
    title: 'HEROES REST API',
    description: '',
  },
  host: '',
  basePath: '',
  schemes: {},
  consumes: {},
  produces: {},
  tags: [
    {
      name: '',
      description: '',
    },
  ],
  securityDefinitions: {},
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
    heroNameAndId: {
      id: 0,
      name: "Grogu"
    },
    hero: { 
      example: {}
    },
    user: {}
  }
};

const outputFile = './src/swagger-output.json';
const endpointsFiles = ['./src/server.ts'];

swaggerAutogen(outputFile, endpointsFiles, doc);
