import { StyleSheet, Pressable, Keyboard, Text, View, ScrollView, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import WaveUI from '@/components/WaveUi';
import OtpBackend from '@/components/OtpBackend';
import AuthButton from '@/components/AuthButton';
import useMutate from '@/hooks/useMutation';
import { IActivateAccount, IForgotPassword, ILoginResponse, IResetCode, IResponseData } from '@/interfaces';
import { apiActivateAccount, apiResendCode, apiVerifyCode } from '@/services/AuthService';
import Toast from 'react-native-toast-message';
import { useSession } from '@/providers/SessionProvider';
import { Colors } from '@/constants/Colors';

const VerifyRegOtp: React.FC = () => {
  const [code, setCode] = useState('');
  const [pinReady, setPinReady] = useState(false);
  const [timer, setTimer] = useState(60); // 1 minute
  const [resendEnabled, setResendEnabled] = useState(false);
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const { signIn, access_token } = useSession();


  const max_code_length = 6;

  useEffect(() => {
    if (timer === 0) {
      setResendEnabled(true);
      return;
    }

    const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const resendOtp = () => {
    setTimer(60);
    setResendEnabled(false);
    // Call backend to resend OTP using `phone`
  };

  const activateAccountMutation = useMutate<IActivateAccount, any>(
    apiActivateAccount,
  {
    onSuccess: (data: IResponseData<ILoginResponse>) => {
        signIn({
            ...data?.data?.user,
            access_token: data?.data?.access_token,
            refresh_token: data?.data?.refresh_token,
            wallet_balance: data?.data?.wallet_balance,
          });
          Toast.show({
            type: 'success',
            text1: 'Account Activated Successfully',
          });
    
          return router.push("/(tabs)/home");
    },
    showErrorMessage: true,
  }
  )

  const resendCodeMutation = useMutate<IForgotPassword, any>(
    apiResendCode,
    {
      onSuccess: (data: IResponseData<"">) => {
          console.log("data", data)
          // dispatch({ type: "reset", payload: "" })
          // toast.success(data?.message || "OTP Verified Successfully")   
          Toast.show({
            text1: data?.message ||  "OTP Resent",
            type: "success"
          })
          resendOtp()
          // setAuthOpen("COMPLETE-RESET")
          // setStep(3)
      },
      showErrorMessage: true,
    }
  )

  const handleSubmit = () => {
    if (!code) {
      return Toast.show({
        type: "info",
        text1: 'Input OTP'
      })
    }
    if (code.length < 4) {
      return Toast.show({
        type: "info",
        text1: 'OTP incomplete"'
      })
    }
    activateAccountMutation.mutate({
        otp: code,
        phone_number: phone,
    })
  }

  return (
    <Pressable onPress={Keyboard.dismiss} style={styles.container}>
      <WaveUI underlineTxt="Activate" restTxt="account" size={33} />
        <Text style={{ paddingHorizontal: 30, marginTop: 5 }}>We sent a verification code to your Phone Number. Enter the 6-digit code sent to you to activate your account.</Text>
      <ScrollView>
        <View style={styles.form}>
          <OtpBackend
            setPinReady={setPinReady}
            code={code}
            setCode={setCode}
            maxLength={max_code_length}
          />


          {activateAccountMutation?.isPending ?
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
        
            <AuthButton
              title="Verify OTP"
              onPress={handleSubmit}
              disabled={!pinReady || code.length < max_code_length}
            />
          }
          {/* <AuthButton title="Login" onPress={() => login(user)} /> */}
          <Text style={styles.timerText}>
            {resendEnabled ? "Didn't get the OTP?" : `Resend available in ${formatTime(timer)}`}
          </Text>
          
          {resendEnabled && <>
            {resendCodeMutation?.isPending ?
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
            <AuthButton title="Resend OTP" onPress={() => {resendCodeMutation?.mutate({ phone_number: phone })}} variant="outline" />
            }
          </>
          }
        </View>
      </ScrollView>
    </Pressable>
  );
};

export default VerifyRegOtp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    flex: 1,
    flexDirection: 'column',
    marginTop: 30,
    paddingHorizontal: 30,
  },
  timerText: {
    textAlign: 'center',
    marginVertical: 10,
    fontSize: 14,
    color: '#666',
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
