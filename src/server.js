require('dotenv').config();
const express = require('express');
const { validateEnvVariables } = require('./config/envValidation');
const recoveryService = require('./services/recovery');

// Validate environment variables before starting the server
try {
  validateEnvVariables();
} catch (error) {
  console.error('\x1b[31m%s\x1b[0m', error.message);
  process.exit(1);
}

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Webhook endpoint for cart abandonment
app.post('/webhooks/cart/update', async (req, res) => {
  try {
    await recoveryService.handleAbandonedCart(req.body);
    res.status(200).send('OK');
  } catch (error) {
    console.error('Error handling cart update:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: error.message 
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});