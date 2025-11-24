/* eslint-disable prettier/prettier */
export default () => ({
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    currency: process.env.DEFAULT_CURRENCY || 'usd',
  },
});
