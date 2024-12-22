const { generatePersonalizedEmail } = require('./aiService');
const { sendEmail } = require('./emailService');

const DISCOUNT_TIERS = {
  FIRST_ATTEMPT: 5,
  SECOND_ATTEMPT: 10,
  FINAL_ATTEMPT: 15
};

async function handleAbandonedCart(cartData) {
  const { customer, cart_token, line_items, abandoned_checkout_url } = cartData;
  
  if (!isCartAbandoned(cartData)) {
    return;
  }

  const customerHistory = await getCustomerHistory(customer.id);
  const discountTier = determineDiscountTier(customerHistory);
  
  const emailContent = await generatePersonalizedEmail({
    customerName: customer.first_name,
    items: line_items,
    discountPercentage: discountTier,
    checkoutUrl: abandoned_checkout_url
  });

  await sendEmail({
    to: customer.email,
    subject: 'Complete your purchase with a special offer!',
    html: emailContent
  });

  await updateCustomerHistory(customer.id, cart_token);
}

function isCartAbandoned(cartData) {
  const abandonmentThreshold = 1000 * 60 * 30; // 30 minutes
  return Date.now() - new Date(cartData.updated_at) > abandonmentThreshold;
}

function determineDiscountTier(customerHistory) {
  const attempts = customerHistory.abandonedCarts.length;
  
  if (attempts === 0) return DISCOUNT_TIERS.FIRST_ATTEMPT;
  if (attempts === 1) return DISCOUNT_TIERS.SECOND_ATTEMPT;
  return DISCOUNT_TIERS.FINAL_ATTEMPT;
}

module.exports = {
  handleAbandonedCart
};