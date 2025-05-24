import { SafeView } from '@/components/SafeView';
import { useSession } from '@/providers/SessionProvider';
import { Redirect, Stack } from 'expo-router';

export default function AuthLayout() {
  

  return (
    <SafeView>
      <Stack
      screenOptions={{
        headerShown: false, // No header for auth screens (cleaner)
      }}
    />
  </SafeView>
  
  );
}
