import BackButton from '@/components/BackButton';
import { SafeView } from '@/components/SafeView';
import { useSession } from '@/providers/SessionProvider';
import { Redirect, Stack } from 'expo-router';
import { View } from 'react-native';

export default function MainLayout() {
  const value = useSession();
  //const colorScheme = useColorScheme();

  // You can keep the splash screen open, or render a loading screen like we do here.
  //   if (isLoading) {
  //     return <Text>Loading...</Text>;
  //   }

  // Only require authentication within the (app) group's layout as users
  // need to be able to access the (auth) group and sign in again.
  if (!value.is_logged_in) {
    return <Redirect href="/login" />;
  }

      // You can keep the splash screen open, or render a loading screen like we do here.
    //   if (isLoading) {
    //     return <Text>Loading...</Text>;
    //   }
    
      // Only require authentication within the (app) group's layout as users
      // need to be able to access the (auth) group and sign in again.
      // if (!session) {
      //   return <Redirect href="/login" />;
      // }
  
  return (
    <SafeView>
      <Stack
        screenOptions={{
          // headerBackVisible: false,
          headerLeft: () => <BackButton label=''/>,
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: 'transparent',
          },
          headerBackground:()=><View style={{elevation:0, backgroundColor:"#fff"}}/>
          // headerTransparent: true,
          // headerShown: false, // No header for auth screens (cleaner)
        }}
      />
    </SafeView>
  );
}
