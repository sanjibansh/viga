
//"express": "^4.18.3"  ojriginal express version
// Import module
const connectionString = require('./models/models');
const PriceService = require('./src/priceService');
const priceService = new PriceService(connectionString);
const express = require('express');
const swaggerUi = require('swagger-ui-express');
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

const swaggerSpecs = swaggerJsdoc(options);
const bodyParser = require('body-parser');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON bodies
//app.use(bodyParser.json());

/**
 * @swagger
 * /calculate-price:
 *   put:
 *     summary: Calculate delivery price
 *     description: Calculates the total price for delivering food items based on various factors.
 *     parameters:
 *       - in: query
 *         name: zone
 *         required: true
 *         description: The zone for the delivery (Zone A, Zone B).
 *         schema:
 *           type: string
 *       - in: query
 *         name: organization_id
 *         required: true
 *         description: The ID of the organization.
 *         schema:
 *           type: integer
 *       - in: query
 *         name: total_distance
 *         required: true
 *         description: The total distance of the delivery in kilometers.
 *         schema:
 *           type: integer
 *       - in: query
 *         name: type
 *         required: true
 *         description: The type of food item (perishable or non-perishable).
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total_price:
 *                   type: number
 *                   format: float
 *                   description: The total price for the delivery.
 */
app.put('/calculate-price', async (req, res) => {
  // Implementation of the API endpoint
  try {
    const { zone, organization_id, total_distance, type } = req.query;
    const totalPrice= await priceService.calculatePrice(zone,organization_id,total_distance,type);
    console.log("returned price", totalPrice)
    return res.json({'Total Price' : totalPrice}); // Convert back to euros
  } catch (error) {
    console.error('Error calculating price:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
