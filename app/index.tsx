import { Redirect, SplashScreen } from 'expo-router';
import { useSession } from '@/providers/SessionProvider';
import { ActivityIndicator, View } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useEffect, useState } from 'react';
import { hasSeenAge, hasSeenOnboarding } from '@/hooks/onboarding';
import { useFonts } from 'expo-font';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

export default function Index() {
  const { access_token, isLoading } = useSession();
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);
  const [checkingAge, setCheckingAge] = useState(true);
  const [seenOnboarding, setSeenOnboarding] = useState(false);
  const [seenAge, setSeenAge] = useState(false);
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...MaterialIcons.font,
    ...MaterialCommunityIcons.font
  });

  useEffect(() => {
    if (loaded && !isLoading && !checkingOnboarding && !checkingAge) {
      SplashScreen.hideAsync();
    }
  }, [loaded, isLoading, checkingOnboarding, checkingAge]);

  useEffect(() => {
    const checkOnboarding = async () => {
      const seen = await hasSeenOnboarding();
      setSeenOnboarding(seen);
      setCheckingOnboarding(false);
    };
    checkOnboarding();
  }, []);

  useEffect(() => {
    const checkAge = async () => {
      const seen = await hasSeenAge();
      setSeenAge(seen);
      setCheckingAge(false);
    };
    checkAge();
  }, []);

  if (!loaded || isLoading || checkingOnboarding || checkingAge) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </View>
    );
  }
  // Age Screen
  if (!seenAge) {
    return <Redirect href="/AgeGate" />;
  }
  //Onboarding Screens
  if (!seenOnboarding) {
    return <Redirect href="/Onboardinnng" />;
  }

  return <Redirect href={access_token ? '/(tabs)/home' : '/(auth)/login'} />;
}
