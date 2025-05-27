const myValue = 'My App';

module.exports = {
  name: myValue,
  // All values in extra will be passed to your app.
  extra: {
    publicPaymentKey: process.env.EXPO_PUBLIC_PAYMENT_KEY,
    apiPrefix: process.env.EXPO_PUBLIC_API_ENDPOINT,
  },
};