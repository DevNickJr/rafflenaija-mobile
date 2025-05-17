import { useSession } from '@/providers/SessionProvider';
import { Redirect, Stack } from 'expo-router';

export default function AuthLayout() {
  

  return (
    <Stack
      screenOptions={{
        headerShown: false, // No header for auth screens (cleaner)
      }}
    />
  );
}
