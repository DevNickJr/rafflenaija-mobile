import { View, Text, StyleSheet, StatusBar } from 'react-native';
import React, { useState } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import WaveUI from '@/components/WaveUi';
import InputField from '@/components/AuthInput';
import AuthButton from '@/components/AuthButton';

const ResetPassword = () => {
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const onReset = () => {
    if (password !== confirm) {
      alert("Passwords don't match");
      return;
    }

    // Submit reset with phone and password

    // Navigate back to login
    router.replace('/(auth)/login');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <WaveUI underlineTxt="" restTxt="" />
      <Text style={{ fontSize: 24, fontWeight: "600", marginLeft:30 }}>Reset Password</Text>

      <View style={styles.form}>
        <Text style={styles.label}>New Password</Text>
        <InputField
          icon="lock-closed-outline"
          placeholder="Enter new password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Text style={styles.label}>Confirm Password</Text>
        <InputField
          icon="lock-closed-outline"
          placeholder="Confirm new password"
          secureTextEntry
          value={confirm}
          onChangeText={setConfirm}
        />

        <AuthButton title="Reset Password" onPress={onReset} />
      </View>
    </View>
  );
};

export default ResetPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  form: {
    padding: 30,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
    marginTop: 20,
  },
});
