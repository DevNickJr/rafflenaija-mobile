import '../global.css';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PaystackProvider } from 'react-native-paystack-webview';
// import { useColorScheme } from '@/hooks/useColorScheme';
import { SessionProvider, useSession } from '@/providers/SessionProvider';
import Toast from 'react-native-toast-message';
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import axios from 'axios';

// Prevent the splash screen from auto-hiding before asset loading is complete.
const channels: ("bank" | "card" | "ussd" | "qr" | "mobile_money" | "bank_transfer" | "eft" | "apple_pay")[] = ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer']

SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

SplashScreen.preventAutoHideAsync();
// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (axios.isAxiosError(error)) {
          // Disable retry on 401 Unauthorized errors
          const status = error?.response?.status;
          if (status === 401 && failureCount > 1) return false;
        }
        return failureCount < 3; // retry max 3 times otherwise
      },
    },
  },
});

export default function RootLayout() {
  // const colorScheme = useColorScheme();

  return (
    <PaystackProvider defaultChannels={channels} publicKey={Constants.expoConfig?.extra?.publicPaymentKey || 'pk_live_3a1ef3cb30186d97964bf0e333e7cb7e01714e55'}>
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
      {/* <StatusBar style="dark" /> */}
    </PaystackProvider>
  );
}

