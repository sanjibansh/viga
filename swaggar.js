const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Food Delivery API',
      version: '1.0.0',
      description: 'API for calculating delivery costs for different types of food items across various zones.',
    },
  },
  apis: ['./index.js'], // Path to the API file (main.js)
};

const specs = swaggerJsdoc(options);

module.exports = specs;
