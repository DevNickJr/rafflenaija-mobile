import { Redirect } from 'expo-router';
import { useSession } from '@/providers/SessionProvider';
import { ActivityIndicator, View } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useEffect, useState } from 'react';
import { hasSeenOnboarding } from '@/hooks/onboarding';

export default function Index() {
  const { access_token, isLoading } = useSession();
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);
  const [seenOnboarding, setSeenOnboarding] = useState(false);

  useEffect(() => {
    const checkOnboarding = async () => {
      const seen = await hasSeenOnboarding();
      setSeenOnboarding(seen);
      setCheckingOnboarding(false);
    };
    checkOnboarding();
  }, []);

  if (isLoading || checkingOnboarding) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </View>
    );
  }
  //Onboarding Screens
  if (!seenOnboarding) {
    return <Redirect href="/Onboardinnng" />;
  }

  return <Redirect href={access_token ? '/(tabs)/home' : '/(auth)/login'} />;
}
