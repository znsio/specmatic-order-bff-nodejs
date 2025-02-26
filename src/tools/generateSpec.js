const swaggerJsdoc = require('swagger-jsdoc');
const yaml = require('yaml');
const fs = require('fs');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Specmatic Order Backend API',
      version: '1.0.0',
      description: 'API for managing products and orders',
    },
    servers: [
      {
        url: 'http://localhost:8080',
        description: 'Local development server',
      },
    ],
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js'],
};

const specs = swaggerJsdoc(options);

// Write the generated spec to a YAML file
fs.writeFileSync(
  path.join(__dirname, '../../generated-openapi.yaml'),
  yaml.stringify(specs, null, 2)
);

console.log('OpenAPI specification generated in YAML format!');