import { Redirect } from 'expo-router';
import { useSession } from '@/providers/SessionProvider';

export default function Index() {
  const { access_token, isLoading } = useSession();

  if (isLoading) return null;

  return <Redirect href={access_token ? '/(tabs)/home' : '/(auth)/login'} />;
}
