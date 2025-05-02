import AuthButton from '@/components/AuthButton';
import InputField from '@/components/AuthInput';
import AuthLink from '@/components/AuthLink';
import Checkbox from '@/components/Checkbox';
import WaveUI from '@/components/WaveUi';
import { useSession } from '@/providers/SessionProvider';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, StatusBar, Text, View, StyleSheet } from 'react-native';


export default function Login() {
    const { signIn } = useSession();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Handle login logic
    signIn()
    console.log('Logging in with:', phoneNumber, password);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content"/>
     
      <WaveUI underlineTxt='Sign' restTxt='in'/>

      <View style={styles.form}>
        <Text style={styles.label}>Phone Number</Text>
        <InputField
          icon="call-outline"
          placeholder="Enter your phone number"
          keyboardType="phone-pad"
          maxLength={11}
          numbersOnly
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />

        <Text style={styles.label}>Password</Text>
        <InputField
          icon="lock-closed-outline"
          placeholder="Enter your password"
          secureTextEntry
          onChangeText={setPassword}
        />

        <View style={styles.options}>
          <Checkbox label="Remember Me" />
          <AuthLink label="Forgot Password?" onPress={() => router.navigate("/(auth)/phone")} />
        </View>

        <AuthButton title="Login" onPress={handleLogin} />

        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Don’t have an Account?</Text>
          <AuthLink label=" Sign up" onPress={() => router.navigate("/(auth)/register")} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#fa6c6c',
    height: '35%',
    borderBottomRightRadius: 60,
    borderBottomLeftRadius: 60,
    justifyContent: 'flex-end',
    padding: 30,
  },
  headerText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  underline: {
    height: 4,
    width: 60,
    backgroundColor: '#fff',
    marginTop: 8,
    borderRadius: 2,
  },
  form: {
    padding: 30,
    marginTop: 40,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
    marginTop: 20,
  },
  options: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 20,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
  },
  signupText: {
    fontSize: 13,
    color: '#333',
  },
});
