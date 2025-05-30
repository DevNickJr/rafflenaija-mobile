import AuthButton from '@/components/AuthButton';
import InputField from '@/components/AuthInput';
import AuthLink from '@/components/AuthLink';
import Checkbox from '@/components/Checkbox';
import WaveUI from '@/components/WaveUi';
import { Colors } from '@/constants/Colors';
import useMutate from '@/hooks/useMutation';
import { ILoginReducerAction, ILoginResponse, IResponseData, IUserLogin } from '@/interfaces';
import { useSession } from '@/providers/SessionProvider';
import { apiLogin } from '@/services/AuthService';
import { router } from 'expo-router';
import React, { useReducer, useState } from 'react';
import { StatusBar, Text, View, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
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
      return router.push("/(tabs)/home");
    },
    onError(error) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.data?.message ||
        error?.response?.data?.detail || error?.message;
      console.log(error)
      Toast.show({
        type: 'error',
        text1: message || 'An Error Occurred!',
      });
      if (typeof message === 'string') {
        if (message === 'Please verify your account') {
          Toast.show({
            type: 'success',
            text1: 'Please verify your account',
          });
          return setStep(2);
        }
        Toast.show({
          type: 'error',
          text1: message || 'An Error Occurred!',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: error?.response?.data?.message?.[0] || error?.message || 'An Error Occurred!',
        });
      }
    },
  });
  // showErrortext1: true,

  const login = async () => {
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
        text1: 'Password cannot be empty',
      });
      return;
    }
    if (user.password.length < 8) {
      Toast.show({
        type: 'info',
        text1: "Password incorrect",
      })
      return
    }

    loginMutation.mutate(user);
  };

  
  const dummyLogin=()=>{

    let myUser ={
      phone_number: "09012345678",
      first_name: "John",
      last_name: "Doe",
      email: "john.doe@example.com",
      is_verified: true,
      dob: "1990-01-01",
      gender: "Male",
      profile_picture: "https://farm4.staticflickr.com/3075/3168662394_7d7103de7d_z_d.jpg",
      created_at: "2023-01-01T00:00:00Z",
    }



    signIn({
      ...myUser,
      access_token: "dummy-access-token-123",
      refresh_token: "dummy-refresh-token-456",
      wallet_balance: "5000.00",
    });
    Toast.show({
      type: 'success',
      text1: 'Logged in',
    });

    dispatch({ type: 'reset' });
    return router.push("/(tabs)/home");
  }

  // useEffect(() => {
  //   if (loginMutation.isSuccess) {

  //   }
  // }, [loginMutation?.isSuccess, setAuthOpen])

  return (
    <View style={styles.container}>
      <StatusBar barStyle="default" backgroundColor={Colors.light.primary} />

      <WaveUI underlineTxt="Sign" restTxt="in" />
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

          {loginMutation?.isPending ?
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
          <AuthButton title="Login" onPress={login} />
          }
          {/* <AuthButton title="Login" onPress={() => login(user)} /> */}

          <TouchableOpacity onPress={() => router.navigate('/(auth)/register')} style={styles.signupContainer}>
            <Text style={styles.signupText}>Don’t have an Account?</Text>
            <AuthLink label=" Sign up" onPress={() => router.navigate('/(auth)/register')} />
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
    marginTop: 20,
    paddingBottom: 25
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
    marginTop: 18,
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
    marginTop: 20,
  },
  signupText: {
    fontSize: 13,
    color: '#333',
  },
});
