const openAIService = require('./openai');
const emailService = require('./email');
const cartService = require('./cart');
const { DISCOUNT_TIERS } = require('../config/constants');

class RecoveryService {
  determineDiscountTier(customerHistory) {
    const attempts = customerHistory.abandonedCarts.length;
    
    if (attempts === 0) return DISCOUNT_TIERS.FIRST_ATTEMPT;
    if (attempts === 1) return DISCOUNT_TIERS.SECOND_ATTEMPT;
    return DISCOUNT_TIERS.FINAL_ATTEMPT;
  }

  async generateEmailContent({ customerName, items, discountPercentage, checkoutUrl }) {
    const itemsList = items.map(item => item.title).join(', ');
    const prompt = `
      Write a friendly, personalized email to ${customerName} about their abandoned shopping cart.
      Items in cart: ${itemsList}
      Offer a ${discountPercentage}% discount.
      Make it engaging and persuasive, but not pushy.
      Include the checkout URL: ${checkoutUrl}
      Keep it concise and focused on value.
    `;

    return await openAIService.generateCompletion(
      prompt,
      "You are a helpful shopping assistant writing cart recovery emails."
    );
  }

  async handleAbandonedCart(cartData) {
    try {
      const { customer, cart_token, line_items, abandoned_checkout_url } = cartData;
      
      if (!cartService.isCartAbandoned(cartData)) {
        return;
      }

      const customerHistory = await cartService.getCustomerHistory(customer.id);
      const discountTier = this.determineDiscountTier(customerHistory);
      
      const emailContent = await this.generateEmailContent({
        customerName: customer.first_name,
        items: line_items,
        discountPercentage: discountTier,
        checkoutUrl: abandoned_checkout_url
      });

      await emailService.sendEmail({
        to: customer.email,
        subject: 'Complete your purchase with a special offer!',
        html: emailContent
      });

      await cartService.updateCustomerHistory(customer.id, cart_token);
    } catch (error) {
      throw new Error(`Cart recovery failed: ${error.message}`);
    }
  }
}

module.exports = new RecoveryService();