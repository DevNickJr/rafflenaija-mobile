import { GestureResponderEvent, Modal, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import ModalBtn from '@/components/ModalBtn';
import OtpBackend from '@/components/OtpBackend';
import Toast from 'react-native-toast-message';
import { apiVerifyEmailComplete } from '@/services/AuthService';
import useMutate from '@/hooks/useMutation';
import { IOTP, IResponseData } from '@/interfaces';
import { useSession } from '@/providers/SessionProvider';

type Props = {
  visible: boolean;
  onClose: () => void;
  onOk?: ((event: GestureResponderEvent) => void) | undefined;
};

const VerifyAccountEmail = ({ visible = true, onClose, onOk }: Props) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [code, setCode] = useState('');
  const context = useSession()

  const handleClose = () => {
    setStep(1);
    onClose();
  };
  
  const [pinReady, setPinReady] = useState(false);

  const max_code_length = 6;

  const VerificationLogic = (event: GestureResponderEvent) => {
    onOk?.(event);
  };

  const verifyEmailMutation = useMutate<IOTP, any>(
    apiVerifyEmailComplete,
    {
      onSuccess: (data: IResponseData<"">) => {
          console.log("data", data)
          setCode('')
          // toast.success(data?.message || "OTP Verified Successfully")   
          Toast.show({
            text1: data?.message ||  "Email Verified Successfully",
            type: "success"
          })
          context.dispatch({ type: "LOGIN", payload: {
            access_token: context.access_token,
            refresh_token: context.refresh_token,
            wallet_balance: context.wallet_balance,
            phone_number: context.phone_number,
            first_name: context.first_name,
            last_name: context.last_name,
            email: context.email,
            dob: context.dob,
            gender: context.gender,
            profile_picture: context.profile_picture,
            is_verified: true,
          }})
          handleClose()

      },
      showErrorMessage: true,
    }
  )

  const handleSubmit = () => {
    if (!code) {
      return Toast.show({
        type: 'info',
        text1: 'Input OTP',
      })
    }
    if (code.length < 6) {
      return Toast.show({
        type: 'info',
        text1: "OTP incomplete",
      })
    }
    verifyEmailMutation.mutate({
        otp: code,
    })
  }

  const handleConfrim = () => {
    if (step == 1) {
        setStep(2)
        return
    }
    handleSubmit()
}


  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalWrapper}>
        <View style={styles.modalBox}>
            {
            step === 1 && (
                <>
                    <Text style={styles.modalTitle}>Email Verification</Text>
                    <Text style={styles.modalText}>
                        A confirmation Email has been sent to the provided address! Please check and click the link within 48 hours to complete the verification process.
                    </Text>
                </>
            )
            }
            {
            step === 2 && (
                <>
                    <Text style={styles.modalTitle}>Enter OTP</Text>
                    <OtpBackend
                        setPinReady={setPinReady}
                        code={code}
                        setCode={setCode}
                        maxLength={max_code_length}
                    />
                </>
                
            )
            }
            <View style={styles.modalActions}>
                <ModalBtn title="Cancle" onPress={handleClose} inverted />
                <ModalBtn title={verifyEmailMutation?.isPending ? 'Processing..' : "OK"} onPress={handleConfrim} />
            </View>
        </View>

      </View>
    </Modal>
  );
};

export default VerifyAccountEmail;

const styles = StyleSheet.create({
  modalWrapper: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 20,
  },
  modalText: {
    marginBottom: 20,
    textAlign: 'center',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16,
  },
});
