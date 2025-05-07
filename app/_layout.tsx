import '../global.css';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { useColorScheme } from '@/hooks/useColorScheme';
import { SessionProvider } from '@/providers/SessionProvider';
import Toast from 'react-native-toast-message';
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Create a client
const queryClient = new QueryClient();

export default function RootLayout() {
  const colorScheme = useColorScheme();
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

  return (
    <QueryClientProvider client={queryClient}>
      {/* your navigators or screens */}
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <SessionProvider>
          <Stack>
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(mainscreens)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
        </SessionProvider>
        <StatusBar style="auto" />
        <Toast />
      </ThemeProvider>
      {/* <StatusBar style="auto" /> */}
    </QueryClientProvider>
  );
}
