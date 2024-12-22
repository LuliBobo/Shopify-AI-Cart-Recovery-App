function validateEnvVariables() {
  const requiredVars = [
    'SHOPIFY_SHOP_NAME',
    'SHOPIFY_ACCESS_TOKEN',
    'OPENAI_API_KEY',
    'SMTP_HOST',
    'SMTP_PORT',
    'SMTP_USER',
    'SMTP_PASS',
    'SMTP_FROM'
  ];

  const missingVars = requiredVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}\n` +
      'Please create a .env file based on .env.example and fill in all required values.'
    );
  }
}

module.exports = { validateEnvVariables };