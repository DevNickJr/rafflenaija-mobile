import { StyleSheet, Pressable, Keyboard, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import WaveUI from '@/components/WaveUi';
import OtpBackend from '@/components/OtpBackend';
import AuthButton from '@/components/AuthButton';
import useMutate from '@/hooks/useMutation';
import { IForgotPassword, IResetCode, IResponseData } from '@/interfaces';
import { apiResendCode, apiVerifyCode } from '@/services/AuthService';
import Toast from 'react-native-toast-message';

const OtoInput: React.FC = () => {
  const [code, setCode] = useState('');
  const [pinReady, setPinReady] = useState(false);
  const [timer, setTimer] = useState(60); // 1 minute
  const [resendEnabled, setResendEnabled] = useState(false);
  const { phone } = useLocalSearchParams<{ phone: string }>();

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

  const verifyOtp = () => {
    router.push({
      pathname: '/(auth)/resetpass',
      params: { phone },
    });
  };

  const resendOtp = () => {
    setTimer(60);
    setResendEnabled(false);
    // Call backend to resend OTP using `phone`
  };


      
  const verifyCodeMutation = useMutate<IResetCode, any>(
    apiVerifyCode,
    {
      onSuccess: (data: IResponseData<"">) => {
          console.log("data", data)
          // toast.success(data?.message || "OTP Verified Successfully")   
          Toast.show({
            text1: data?.message ||  "OTP Verified Successfully",
            type: "success"
          })

          verifyOtp()
          // setAuthOpen("COMPLETE-RESET")
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
    verifyCodeMutation.mutate({
      reset_code: code
    })
  }

  return (
    <Pressable onPress={Keyboard.dismiss} style={styles.container}>
      <WaveUI underlineTxt="" restTxt="OTP" />
      <View style={styles.wrapper}>
        <OtpBackend
          setPinReady={setPinReady}
          code={code}
          setCode={setCode}
          maxLength={max_code_length}
        />

        <AuthButton
          title="Verify OTP"
          onPress={handleSubmit}
          disabled={!pinReady || code.length < max_code_length}
        />

        <Text style={styles.timerText}>
          {resendEnabled ? "Didn't get the OTP?" : `Resend available in ${formatTime(timer)}`}
        </Text>

        {resendEnabled && <AuthButton title="Resend OTP" onPress={() => {resendCodeMutation?.mutate({ phone_number: phone })}} variant="outline" />}
      </View>
    </Pressable>
  );
};

export default OtoInput;

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
});
