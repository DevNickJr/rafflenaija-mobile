import { GestureResponderEvent, Modal, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import ModalBtn from '@/components/ModalBtn'
import OtpBackend from '@/components/OtpBackend'

type Props={
    visible:boolean,
    onCancle?: ((event: GestureResponderEvent) => void) | undefined,
    onOk?: ((event: GestureResponderEvent) => void) | undefined   
}

const VerifyEmail = ({visible=true, onCancle, onOk}:Props) => {

    const [code, setCode] = useState('');
    const [pinReady, setPinReady] = useState(false);
    
    const max_code_length = 4;

    const VerificationLogic=(event: GestureResponderEvent)=>{
        onOk?.(event);
    }

  return (
    <Modal visible={visible} transparent animationType="fade">
        <View style={styles.modalWrapper}>
        <View style={styles.modalBox}>
            <OtpBackend
                setPinReady={setPinReady}
                code={code}
                setCode={setCode}
                maxLength={max_code_length}
            />

            <View style={styles.modalActions}>
            <ModalBtn title='Cancle' onPress={onCancle} inverted/>
            <ModalBtn title='Verify' onPress={(event) => VerificationLogic(event)}/>
            </View>
        </View>
        </View>
    </Modal>
  )
}

export default VerifyEmail

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
        flexDirection:"column",
        alignItems:"center"
      },
      modalTitle: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 10,
      },
      modalText: {
        marginBottom: 20,
        textAlign:"center"
      },
      modalActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 16,
      },
})