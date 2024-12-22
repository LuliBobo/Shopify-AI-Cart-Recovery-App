// Email discount tiers
const DISCOUNT_TIERS = {
  FIRST_ATTEMPT: 5,
  SECOND_ATTEMPT: 10,
  FINAL_ATTEMPT: 15
};

// Cart abandonment threshold in milliseconds (30 minutes)
const CART_ABANDONMENT_THRESHOLD = 1000 * 60 * 30;

module.exports = {
  DISCOUNT_TIERS,
  CART_ABANDONMENT_THRESHOLD
};