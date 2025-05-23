import '../global.css';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PaystackProvider } from 'react-native-paystack-webview';
import { useColorScheme } from '@/hooks/useColorScheme';
import { SessionProvider, useSession } from '@/providers/SessionProvider';
import Toast from 'react-native-toast-message';
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
// Prevent the splash screen from auto-hiding before asset loading is complete.
const channels: ("bank" | "card" | "ussd" | "qr" | "mobile_money" | "bank_transfer" | "eft" | "apple_pay")[] = ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer']


SplashScreen.preventAutoHideAsync();
// Create a client
const queryClient = new QueryClient();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { access_token, isLoading } = useSession();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...MaterialIcons.font,
    ...MaterialCommunityIcons.font
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  
  
    if (access_token){

    }
  

  return (
    <PaystackProvider defaultChannels={channels} publicKey={process.env.EXPO_PUBLIC_PAYMENT_KEY || ''}>
      <QueryClientProvider client={queryClient}>
        {/* your navigators or screens */}
        <ThemeProvider value={DefaultTheme}>
        {/* <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}> */}
          <SessionProvider>
            <Stack>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="(mainscreens)" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" />
            </Stack>
          </SessionProvider>
          {/* <StatusBar style="auto" /> */}
          <Toast
            topOffset={30}
            visibilityTime={2000}
            autoHide
          />
        </ThemeProvider>
        {/* <StatusBar style="auto" /> */}
      </QueryClientProvider>
    </PaystackProvider>
  );
}
