import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
} from 'react-native';
import ModalBtn from '../ModalBtn';

interface Props {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const DeactivateAccount: React.FC<Props> = ({ visible, onCancel, onConfirm }) => {
  const [showDeactivateForm, setShowDeactivateForm] = useState(false);
  const [reason, setReason] = useState('');

  const handleSubmit = () => {
    console.log('Deactivation reason:', reason);
    // You can trigger an API call here
  };

  return (
    <View style={{ flex: 1 }}>
      {!showDeactivateForm && (
        <Modal visible={visible} transparent animationType="fade">
          <View style={styles.modalWrapper}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>Deactivate Account?</Text>
              <Text style={styles.modalText}>
                You have the option to deactivate your account from this page. Deactivation freezes
                all existing funds, logs out any active sessions (including this device), and
                restricts access to your account. To reactivate, you'll need to verify an OTP, reset
                your password, and, if needed, your Raffle Naija PIN.
              </Text>

              <View style={styles.modalActions}>
                <ModalBtn title="Cancle" onPress={onCancel} inverted />
                <ModalBtn
                  title="OK"
                  onPress={() => {
                    onConfirm();
                    setShowDeactivateForm(true);
                  }}
                />
              </View>
            </View>
          </View>
        </Modal>
      )}

      {showDeactivateForm && (
        <ScrollView>
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>You are about to deactivate your account.</Text>
            <Text style={styles.formNote}>
              If you ever feel the need to reactivate your account, you will have to send us a mail
              stating your Phone number, reason why you deactivated and also respond to following
              questions that will be asked during the reactivation phase.
            </Text>

            <Text style={styles.inputLabel}>Deactivation Reason</Text>
            <TextInput
              placeholder="Enter your Reason for deactivation"
              cursorColor={'#c0c0c0'}
              style={styles.textArea}
              multiline
              numberOfLines={5}
              value={reason}
              onChangeText={setReason}
            />

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default DeactivateAccount;

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
    marginBottom: 10,
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
  formContainer: {
    padding: 10,
    flex: 1,
    gap: 16,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
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
});
