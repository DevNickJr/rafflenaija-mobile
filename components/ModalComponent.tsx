import { Modal, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import ModalBtn from './ModalBtn';

type Props = {
  visible: boolean;
};

const ModalComponent = ({ visible = true }: Props) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalWrapper}>
        <View style={styles.modalBox}>
          <Text style={styles.modalTitle}>Deactivate Account?</Text>
          <Text style={styles.modalText}>
            You have the option to deactivate your account from this page. Deactivation freezes all
            existing funds, logs out any active sessions (including this device), and restricts
            access to your account. To reactivate, you'll need to verify an OTP, reset your
            password, and, if needed, your Raffle Naija PIN.
          </Text>

          <View style={styles.modalActions}>
            <ModalBtn title="Cancle" onPress={() => {}} inverted />
            <ModalBtn title="OK" onPress={() => {}} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ModalComponent;

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
});
