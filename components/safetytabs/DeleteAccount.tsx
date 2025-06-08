import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
} from 'react-native';
import Toast from 'react-native-toast-message';
import useMutate from '@/hooks/useMutation';
import { apiRequestAccountDeletion, apiDeleteAccountConfirm } from '@/services/AuthService';
import { useSession } from '@/providers/SessionProvider';

const DeleteAccount = () => {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState('');
  const { phone_number, signOut } = useSession();

  const onDeleted = () => {
    setVisible(false);
    setStep(1);
    setOtp('');
    signOut()
  };

  // Step 1: Request deletion (sends OTP)
  const requestDeletionMutation = useMutate<any, any>(
    apiRequestAccountDeletion,
    {
      onSuccess: () => {
        Toast.show({ type: 'success', text1: 'OTP sent to your phone.' });
        setStep(2);
      },
      onError: (error: any) => {
        Toast.show({ type: 'error', text1: error?.message || 'Failed to request deletion' });
      },
      requireAuth: true,
    }
  );

  // Step 2: Verify OTP & delete
  const verifyOtpMutation = useMutate<any, any>(
    apiDeleteAccountConfirm,
    {
      onSuccess: () => {
        Toast.show({ type: 'success', text1: 'Account deleted successfully.' });
        onDeleted();
      },
      onError: (error: any) => {
        Toast.show({ type: 'error', text1: error?.message || 'OTP verification failed' });
      },
      requireAuth: true,
    }
  );

  const handleRequestDeletion = () => {
    requestDeletionMutation.mutate({ phone_number });
  };

  const handleVerifyOtpAndDelete = () => {
    verifyOtpMutation.mutate({ otp });
  };

  return (
    <View style={{ flex: 1 }}>
        {step === 1 && (
          <>
            <Text style={styles.formTitle}>You are about to delete your account.</Text>
            <Text style={styles.formNote}>
              Deleting your account is irreversible. All your data will be permanently removed.
            You will be logged out immediately. To confirm deletion, you will need to enter an OTP sent to {phone_number}.
            </Text>

            <TouchableOpacity
              onPress={handleRequestDeletion}
              style={[styles.button, styles.confirmBtn, { marginTop: 28 }]}
              disabled={requestDeletionMutation.isPending}
            >
              <Text style={styles.buttonText}>
                {requestDeletionMutation.isPending ? 'Processing...' : 'Delete Account'}
              </Text>
            </TouchableOpacity>
          </>
        )}

        {step === 2 && (
          <>
            <Text style={styles.title}>Enter OTP</Text>
            <Text style={styles.text}>Please enter the OTP sent to {phone_number}</Text>
            <TextInput
              style={styles.input}
              keyboardType="number-pad"
              placeholder="OTP"
              value={otp}
              onChangeText={setOtp}
              maxLength={6}
            />
            <TouchableOpacity
              onPress={handleVerifyOtpAndDelete}
              style={[styles.button, styles.confirmBtn]}
              disabled={verifyOtpMutation.isPending || otp.length < 6}
            >
              <Text style={styles.buttonText}>
                {verifyOtpMutation.isPending ? 'Verifying...' : 'Verify & Delete'}
              </Text>
            </TouchableOpacity>
          </>
        )}
    </View>
  );
};

export default DeleteAccount;

const styles = StyleSheet.create({
  modalWrapper: {
    flex: 1,
    // backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    padding: 24,
  },
  modalBox: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
  },
  formContainer: {
    // padding: 10,
    flex: 1,
    gap: 16,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 16
  },
  formNote: {
    fontSize: 14,
    color: '#555',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 14,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: 'green',
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 12,
  },
  submitText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 12,
    textAlign: 'center',
  },
  text: {
    fontSize: 14,
    color: '#444',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 25,
    marginHorizontal: 8,
    alignItems: 'center',
  },
  cancelBtn: {
    backgroundColor: '#ccc',
  },
  confirmBtn: {
    backgroundColor: '#D32F2F',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    letterSpacing: 10,
  },
});
