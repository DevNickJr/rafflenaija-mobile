import { Modal, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import ModalBtn from './ModalBtn';

type Props = {
  visible: boolean;
  title: string;
  content: string;
  boldTxt?: string;
  titleSize?: number;
  contentSize?: number;
  boldTxtSize?: number;
  onCancel?: () => void;
  onConfirm?: () => void;
};

const ModalComponent = ({ 
  visible = true,
  title,
  content,
  boldTxt,
  titleSize = 18,
  contentSize = 16,
  boldTxtSize = 26,
  onCancel = () => {},
  onConfirm = () => {}
}: Props) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalWrapper}>
        <View style={styles.modalBox}>
          <Text style={[styles.modalTitle, { fontSize: titleSize }]}>{title}</Text>
          <Text style={[styles.modalText, { fontSize: contentSize }]}>{content}</Text>
          {!!boldTxt && (
            <Text style={[styles.modalNote, { fontSize: boldTxtSize }]}>{boldTxt}</Text>
          )}
          <View style={styles.modalActions}>
            <ModalBtn title="Cancel" onPress={onCancel} inverted />
            <ModalBtn title="OK" onPress={onConfirm} />
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
    textAlign:"center"
  },
  modalText: {
    marginBottom: 20,
    textAlign: 'center',
  },
  modalNote: {
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16,
  },
});
