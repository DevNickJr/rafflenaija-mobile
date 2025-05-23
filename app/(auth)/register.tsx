import { useSession } from '@/providers/SessionProvider';
import AuthButton from '@/components/AuthButton';
import InputField from '@/components/AuthInput';
import AuthLink from '@/components/AuthLink';
import Checkbox from '@/components/Checkbox';
import WaveUI from '@/components/WaveUi';
import { router } from 'expo-router';
import React, { useReducer, useState } from 'react';
import { SafeAreaView, StatusBar, Text, View, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/Colors';
import { IRegisterReducerAction, IResponseData, IUserRegister } from '@/interfaces';
import useMutate from '@/hooks/useMutation';
import { apiRegister } from '@/services/AuthService';
import Toast from 'react-native-toast-message';

const initialState: IUserRegister = {
  phone_number: '',
  password: '',
  referral_code: '',
  agreeToTerms: false
}


export default function SignIn() {
  const [user, dispatch] = useReducer((state: IUserRegister, action: IRegisterReducerAction) => {
    if (action.type === "reset") {
      return initialState
    }
      return { ...state, [action.type]: action.payload }
    }, initialState)
  const [showPassword, setShowPassword] = useState(false)
  const [step, setStep] = useState(1)

  
  const registerMutation = useMutate<IUserRegister, any>(
    apiRegister,
    {
      onSuccess: (data: IResponseData<"">) => {
          console.log("data", data)
          // dispatch({ type: "reset" })
          Toast.show({
            type: "success",
            text1: "Account Created Successfully",
          })

          router.replace('/(auth)/login')
      },
      showErrorMessage: true,
    }
  )
  
  
    const handleRegisterMutation = async (): Promise<void> => {
      if (!user.phone_number) {
        Toast.show({
          type: 'info',
          text1: "Phone number cannot be empty",
        })
        return
      }
      if (user.phone_number.length !== 11) {
        Toast.show({
          type: 'info',
          text1: "Phone number must be 11 digits",
        })
        return
      }
      if (user.phone_number[0] != "0") {
        Toast.show({
          type: 'info',
          text1: "Phone number must start with 0",
      })
        return
      }
      if (!user.password) {
        Toast.show({
          type: 'info',
          text1: "Password cannot be empty", 
      })
        return
      }
      if (user.password.length < 8) {
        Toast.show({
          type: 'info',
          text1: "Password must be at least 8 characters",
        })
        return
      }
      if (!user.agreeToTerms) {
        Toast.show({
          type: 'info',
          text1: "You must agree to the terms and conditions", 
        })
        return
      }

      if (!user.referral_code) {
          return registerMutation.mutate({
            phone_number: user.phone_number,
            password: user.password
          })
      }
      return  registerMutation.mutate(user)
    }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.light.primary} />
      {/* <View style={styles.header}>
        <Text style={styles.headerText}>Sign in</Text>
        <View style={styles.underline} />
      </View> */}
      <WaveUI underlineTxt="Sign" restTxt="up" />

      <ScrollView>
        <View style={styles.form}>
          <Text style={styles.label}>Phone Number</Text>
          <InputField
            icon="call-outline"
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
            maxLength={11}
            numbersOnly
            value={user?.phone_number}
            onChangeText={(value) => dispatch({ type: "phone_number", payload: value})} 
          />
          <Text style={styles.label}>Password</Text>
          <InputField
            icon="lock-closed-outline"
            placeholder="Enter your password"
            secureTextEntry
            value={user?.password}
            onChangeText={(value) => dispatch({ type: "password", payload: value})} 
          />
          <Text style={styles.label}>Referral (Optional)</Text>
          <InputField
            icon="code"
            placeholder="Enter referral code"
            keyboardType="default"
            maxLength={11}
            numbersOnly
            value={user?.referral_code}
            onChangeText={(value) => dispatch({ type: "referral_code", payload: value})} 
          />
          <View style={styles.options}>
            <Checkbox
              label="By creating an account, you agree to our Terms & Conditions and confirm that you are at least 18 years old or over and all information given is true."
              isChecked={user?.agreeToTerms || false} setChecked={(value) => dispatch({ type: "agreeToTerms", payload: value })} />
          </View>

          
          {registerMutation?.isPending ?
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
          <AuthButton title="Create Account" onPress={handleRegisterMutation} />
          }


          <TouchableOpacity onPress={() => router.navigate('/(auth)/register')} style={styles.signupContainer}>
            <Text style={styles.signupText}>Already have an Account?</Text>
            <AuthLink label=" Login" onPress={() => router.replace('/(auth)/login')} />
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    paddingVertical: 15,
    paddingBottom: 25
    // marginTop: 20,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 1,
    marginTop: 20,
  },
  options: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 1,
    marginTop: 20,
    marginVertical: 20,
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
