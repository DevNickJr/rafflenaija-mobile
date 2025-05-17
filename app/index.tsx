import { Redirect } from 'expo-router';
import { useSession } from '@/providers/SessionProvider';
import { ActivityIndicator, View } from 'react-native';
import { Colors } from '@/constants/Colors';

export default function Index() {
  const { access_token, isLoading } = useSession();

  if (isLoading) {
    // Show a splash or loading indicator while checking session
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Colors.light.primary}/>
      </View>
    );
  }

  return <Redirect href={access_token ? '/(tabs)/home' : '/(auth)/login'} />;
}
