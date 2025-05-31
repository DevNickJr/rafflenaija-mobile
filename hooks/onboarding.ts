import * as SecureStore from 'expo-secure-store';

const ONBOARDING_KEY = 'hasSeenOnboarding';

export const setOnboardingComplete = async () => {
  await SecureStore.setItemAsync(ONBOARDING_KEY, 'true');
};

export const hasSeenOnboarding = async (): Promise<boolean> => {
  const value = await SecureStore.getItemAsync(ONBOARDING_KEY);
  return value === 'true';
};
