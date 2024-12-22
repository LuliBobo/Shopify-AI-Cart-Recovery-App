const { OpenAI } = require('openai');

// Initialize OpenAI client with error handling
let openai;
try {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
} catch (error) {
  console.error('Failed to initialize OpenAI client:', error.message);
  throw error;
}

async function generatePersonalizedEmail({ customerName, items, discountPercentage, checkoutUrl }) {
  try {
    const itemsList = items.map(item => item.title).join(', ');

    const prompt = `
      Write a friendly, personalized email to ${customerName} about their abandoned shopping cart.
      Items in cart: ${itemsList}
      Offer a ${discountPercentage}% discount.
      Make it engaging and persuasive, but not pushy.
      Include the checkout URL: ${checkoutUrl}
      Keep it concise and focused on value.
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful shopping assistant writing cart recovery emails."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 300
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Error generating email content:', error);
    throw new Error('Failed to generate personalized email content');
  }
}

module.exports = {
  generatePersonalizedEmail
};