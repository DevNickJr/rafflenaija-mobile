import { ActivityIndicator, StatusBar, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import WaveUI from '@/components/WaveUi';
import InputField from '@/components/AuthInput';
import authStyle from '@/constants/authStyles';
import AuthButton from '@/components/AuthButton';
import { router } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import AuthLink from '@/components/AuthLink';
import Toast from 'react-native-toast-message';
import { IForgotPassword, IResponseData } from '@/interfaces';
import useMutate from '@/hooks/useMutation';
import { apiForgotPassword } from '@/services/AuthService';
import { Colors } from '@/constants/Colors';

const Phone = () => {
  const [phoneNumber, setPhoneNumber] = useState('');

  const isValid = phoneNumber.length === 11;

  const requestOtp = () => {
    router.push({
      pathname: '/(auth)/otp',
      params: { phone: phoneNumber },
    });
  };

  
  const forgotPasswordMutation = useMutate<IForgotPassword, any>(
    apiForgotPassword,
    {
      onSuccess: (data: IResponseData<"">) => {
          Toast.show({
            text1: data?.message ||  "Check your phone for OTP",
            type: "success"
          })
          requestOtp()
      },
      showErrorMessage: true,
    }
  )

    
  const handleMutation = async (): Promise<void> => {
    if (!phoneNumber) {
      Toast.show({
        type: 'info',
        text1: "Phone number cannot be empty",
      })
      return
    }
    if (phoneNumber.length !== 11) {
      Toast.show({
        type: 'info',
        text1: "Phone number must be 11 digits",
      })
      return
    }
    if (phoneNumber[0] != "0") {
      Toast.show({
        type: 'info',
        text1: "Phone number must start with 0",
    })
      return
    }
    
    return  forgotPasswordMutation.mutate({ phone_number: phoneNumber })
  }



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
        {forgotPasswordMutation?.isPending ?
            <View style={{
              flex: 1, 
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: 14,
              borderRadius: 10,
              marginTop: 12,
            }}>
              <ActivityIndicator size="large" color={Colors.light.primary} />
            </View>
            :
            <AuthButton title="Request OTP" onPress={handleMutation} disabled={!isValid} />
        }
        <TouchableOpacity onPress={() => router.navigate('/(auth)/register')} style={styles.signupContainer}>
            <Text style={styles.signupText}>Remember password?</Text>
            <AuthLink label=" Login" onPress={() => router.replace('/(auth)/login')} />
          </TouchableOpacity>
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
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',

    // marginTop: 5,
    marginTop: 20,
  },
  signupText: {
    fontSize: 13,
    color: '#333',
  },
});
