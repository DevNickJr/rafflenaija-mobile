import * as SecureStore from 'expo-secure-store';

const ONBOARDING_KEY = 'hasSeenOnboarding';
const AGE_KEY = 'over18';

export const setOnboardingComplete = async () => {
  await SecureStore.setItemAsync(ONBOARDING_KEY, 'true');
};

export const hasSeenOnboarding = async (): Promise<boolean> => {
  const value = await SecureStore.getItemAsync(ONBOARDING_KEY);
  return value === 'true';
};

export const setAgeComplete = async () => {
  await SecureStore.setItemAsync(AGE_KEY, 'true');
};

export const hasSeenAge = async (): Promise<boolean> => {
  const value = await SecureStore.getItemAsync(AGE_KEY);
  return value === 'true';
};
