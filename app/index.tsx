import { Redirect } from 'expo-router';
import { useSession } from '@/providers/SessionProvider';

export default function Index() {
  const { session, isLoading } = useSession();

  if (isLoading) return null;
  

  return (
    <Redirect href={session ? '/(tabs)' : '/(auth)/login'} />
  );
}
