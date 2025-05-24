import { View, Text, StyleSheet, StatusBar, ActivityIndicator } from 'react-native';
import React, { useReducer, useState } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import WaveUI from '@/components/WaveUi';
import InputField from '@/components/AuthInput';
import AuthButton from '@/components/AuthButton';
import { IPasswordReset, IPasswordResetAction, IResponseData } from '@/interfaces';
import useMutate from '@/hooks/useMutation';
import { apiPasswordReset } from '@/services/AuthService';
import Toast from 'react-native-toast-message';
import { Colors } from '@/constants/Colors';

const initialState: IPasswordReset = {
  phone_number: '',
  new_password: "",
  confirm_password: ""
}

const ResetPassword = () => {
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  
  const [user, dispatch] = useReducer((state: IPasswordReset, action: IPasswordResetAction) => {
    if (action.type === "reset") {
      return initialState
    }
    return { ...state, [action.type]: action.payload }
  }, initialState)
      
  const resetPasswordMutation = useMutate<IPasswordReset, any>(
      apiPasswordReset,
      {
        onSuccess: (data: IResponseData<"">) => {
            console.log("data", data)
              dispatch({ type: "reset", payload: "" })   
              Toast.show({
                type: 'success',
                text1: "Password Reset Successfull",
              })
              router.replace('/(auth)/login');
        },
        showErrorMessage: true,
      }
    )

  const handleSubmit = () => {
    if (!user.phone_number && !phone) {
      return Toast.show({
        type: 'info',
        text1: "Phone Number isn't provided"
      })
    }
    if (!user.new_password || !user?.confirm_password) {
      return Toast.show({
        type: 'info',
        text1: "Fill all fields"
      })
    }
    if (user.new_password !== user?.confirm_password) {
      return Toast.show({
        type: 'info',
        text1: "Passwords do not match"
      })
    }
    resetPasswordMutation.mutate({
      phone_number: phone || user?.phone_number,
      new_password: user?.new_password,
      confirm_password: user?.confirm_password
    })
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <WaveUI underlineTxt="" restTxt="" />
      <Text style={{ fontSize: 24, fontWeight: '600', marginLeft: 30 }}>Reset Password</Text>

      <View style={styles.form}>
        <Text style={styles.label}>New Password</Text>
        <InputField
          icon="lock-closed-outline"
          placeholder="Enter new password"
          secureTextEntry
          value={user?.new_password}
          onChangeText={(value) => dispatch({ type: "new_password", payload: value})}
        />

        <Text style={styles.label}>Confirm Password</Text>
        <InputField
          icon="lock-closed-outline"
          placeholder="Confirm new password"
          secureTextEntry
          value={user?.confirm_password}
          onChangeText={(value) => dispatch({ type: "confirm_password", payload: value})}
        />
           {resetPasswordMutation?.isPending ?
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
              <AuthButton title="Reset Password" onPress={handleSubmit} />
          }
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
