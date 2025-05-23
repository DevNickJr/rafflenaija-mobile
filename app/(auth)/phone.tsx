import { StatusBar, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import WaveUI from '@/components/WaveUi';
import InputField from '@/components/AuthInput';
import authStyle from '@/constants/authStyles';
import AuthButton from '@/components/AuthButton';
import { router } from 'expo-router';

const Phone = () => {
  const [phoneNumber, setPhoneNumber] = useState('');

  const isValid = phoneNumber.length === 11;

  const requestOtp = () => {
    router.push({
      pathname: '/(auth)/otp',
      params: { phone: phoneNumber },
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <WaveUI underlineTxt="" restTxt="" />

      <View style={styles.form}>
        <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 10 }}>
          Enter Your Phone Number
        </Text>

        <InputField
          icon="call-outline"
          placeholder="Enter your phone number"
          keyboardType="phone-pad"
          maxLength={11}
          numbersOnly
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />

        <AuthButton title="Request OTP" onPress={requestOtp} disabled={!isValid} />
      </View>
    </View>
  );
};

export default Phone;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  form: {
    padding: 20,
    gap: 10,
  },
});
