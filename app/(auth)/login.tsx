import AuthButton from '@/components/AuthButton';
import InputField from '@/components/AuthInput';
import AuthLink from '@/components/AuthLink';
import Checkbox from '@/components/Checkbox';
import WaveUI from '@/components/WaveUi';
import useMutate from '@/hooks/useMutation';
import { ILoginReducerAction, ILoginResponse, IResponseData, IUserLogin } from '@/interfaces';
import { useSession } from '@/providers/SessionProvider';
import { apiLogin } from '@/services/AuthService';
import { router } from 'expo-router';
import React, { useReducer, useState } from 'react';
import { StatusBar, Text, View, StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';

const initialState: IUserLogin = {
  phone_number: '',
  password: '',
};

export default function Login() {
  const { signIn, access_token } = useSession();
  // const [phoneNumber, setPhoneNumber] = useState('');
  // const [password, setPassword] = useState('');
  const [isChecked, setChecked] = useState(false);
  const [step, setStep] = useState(1);

  const [user, dispatch] = useReducer((state: IUserLogin, action: ILoginReducerAction) => {
    if (action.type === 'reset') {
      return initialState;
    }
    return { ...state, [action.type]: action.payload };
  }, initialState);

  const loginMutation = useMutate<IUserLogin, any>(apiLogin, {
    onSuccess: (data: IResponseData<ILoginResponse>) => {
      signIn({
        ...data?.data?.user,
        access_token: data?.data?.access_token,
        refresh_token: data?.data?.refresh_token,
        wallet_balance: data?.data?.wallet_balance,
      });
      Toast.show({
        type: 'success',
        text1: 'Logged in',
      });

      dispatch({ type: 'reset' });
      return router.push('/');
    },
    onError(error) {
      if (typeof error?.response?.data?.message === 'string') {
        if (error?.response?.data?.message === 'Please verify your account') {
          Toast.show({
            type: 'success',
            text1: 'Please verify your account',
          });
          return setStep(2);
        }
        Toast.show({
          type: 'error',
          text1: error?.response?.data?.message || 'An Error Occurred!',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: error?.response?.data?.message[0] || 'An Error Occurred!',
        });
      }
    },
  });
  // showErrortext1: true,

  const login = async (user: IUserLogin) => {
    if (!user.phone_number) {
      Toast.show({
        type: 'info',
        text1: 'Phone number cannot be empty',
      });
      return;
    }
    if (!user.password) {
      Toast.show({
        type: 'info',
        text1: 'Password cannot be empty',
      });
      return;
    }
    loginMutation.mutate(user);
  };

  // useEffect(() => {
  //   if (loginMutation.isSuccess) {

  //   }
  // }, [loginMutation?.isSuccess, setAuthOpen])

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <WaveUI underlineTxt="Sign" restTxt="in" />

      <View style={styles.form}>
        <Text style={styles.label}>Phone Number</Text>
        <InputField
          icon="call-outline"
          placeholder="Enter your phone number"
          keyboardType="phone-pad"
          maxLength={11}
          numbersOnly
          value={user?.phone_number}
          onChangeText={(value) => dispatch({ type: 'phone_number', payload: value })}
          // value={phoneNumber}
          // onChangeText={setPhoneNumber}
        />

        <Text style={styles.label}>Password</Text>
        <InputField
          icon="lock-closed-outline"
          placeholder="Enter your password"
          secureTextEntry
          value={user?.password}
          onChangeText={(value) => dispatch({ type: 'password', payload: value })}
          // onChangeText={setPassword}
          // value={password}
        />

        <View style={styles.options}>
          <Checkbox label="Remember Me" isChecked={isChecked} setChecked={setChecked} />
          <AuthLink label="Forgot Password?" onPress={() => router.navigate('/(auth)/phone')} />
        </View>

        <AuthButton title="Login" onPress={() => login(user)} />

        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Don’t have an Account?</Text>
          <AuthLink label=" Sign up" onPress={() => router.navigate('/(auth)/register')} />
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
    marginTop: 20,
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
