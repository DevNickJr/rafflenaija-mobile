import Constants from 'expo-constants';

Constants.expoConfig?.extra?.apiPrefix;

const appConfig = {
  // apiPrefix: process.env.EXPO_PUBLIC_API_ENDPOINT,
  apiPrefix: Constants.expoConfig?.extra?.apiPrefix || 'https://api.rafflenaija.com/api',
};

export default appConfig;
