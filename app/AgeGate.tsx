import React from 'react';
import { View, Text, Button, StyleSheet, Alert, BackHandler } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { setAgeComplete } from '@/hooks/onboarding';
import AuthButton from '@/components/AuthButton';
// import WaveUI from '@/components/WaveUi';

const AgeGate = () => {
  const router = useRouter();

  const handleConfirmAge = async () => {
    await setAgeComplete();
    router.replace('/Onboardinnng'); // or your main screen
  };

  const handleDecline = () => {
    BackHandler.exitApp()
    // Alert.alert(
    //   "Access Denied",
    //   "You must be 18 years or older to use this app.",
    //   [{ text: "Exit App", onPress: () => BackHandler.exitApp() }]
    // );
  };


  return (
    <>
        <Stack.Screen
            options={{
                title: 'Age',
                headerShown: false
            }}
        />
        {/* <WaveUI underlineTxt="" restTxt="" /> */}
        <View style={styles.container}>
        <Text style={styles.title}>Age Confirmation</Text>
        <Text style={styles.message}>
            This app is intended for users 18 years or older.
        </Text>
        <View style={styles.buttonContainer}>
            <AuthButton title="I am 18 or older" onPress={handleConfirmAge} />
            <AuthButton title="I am less than 18" variant='outline' onPress={handleDecline} />
        </View>
        </View>
    </>
  );
};

export default AgeGate;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
  },
  buttonContainer: {
    gap: 16,
  },
});
