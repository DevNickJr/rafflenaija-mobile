import { Colors } from '@/constants/Colors';
import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import NumberInput from './NumberInput';
import { useSession } from '@/providers/SessionProvider';
import useMutate from '@/hooks/useMutation';
import { apiPurchaseTicket } from '@/services/GameService';
import { IGame, IRaffleTicket, IResponseData, IUser } from '@/interfaces';
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';

interface IProps {
    onClose: () => void;
    visible: boolean;
    raffle: IRaffleTicket | null
    refetchGames:  (options?: RefetchOptions | undefined) => Promise<QueryObserverResult<IResponseData<IGame[]>, Error>>
    refetchUser:  (options?: RefetchOptions | undefined) => Promise<QueryObserverResult<IResponseData<IUser>, Error>>
}

const RaffleModal = ({ visible, onClose, refetchUser, refetchGames, raffle }: IProps) => {
  const [amount, setAmount] = useState('');
//   const [loading, setLoading] = useState(false);

  const context = useSession()

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (e.target === e.currentTarget) {
        closeModal()
      }
  }

    const closeModal = () => {
        onClose()
    }
    
    const purchaseMutation = useMutate<string, any>(
        apiPurchaseTicket,
        {
          onSuccess: (data: IResponseData<''>) => {
              console.log("ticket purchase ", data)
              refetchUser()
              refetchGames()
              Toast.show({
                type: "success",
                text1: data?.message || "Ticket purchased successfully"
              })
              closeModal()
          },
          showErrorMessage: true,
          requireAuth: true
        }
      )

      const handlePurchase = () => {
        if (!raffle?.code) {
            return Toast.show({
                type: "error",
                text1: "Something went wrong"
              })
        }
        if (!context.is_logged_in) {
            return Toast.show({
                type: "error",
                text1: "Your session has expired"
            })
        }
        purchaseMutation.mutate(raffle.code)
      }


  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <ScrollView contentContainerStyle={styles.innerContent}>
            <View style={styles.enterAmtWrapper}>
            <Text style={styles.title}>Are you sure you want to raffle the card?</Text>
            <Text style={styles.description}>You are about to pay to raffle the card</Text>
            <Text style={styles.amount}>₦{raffle?.price}</Text>
            {/* <NumberInput
                label="Amount in NGN"
                value={amount}
                onChange={setAmount}
            /> */}
            </View>
            {purchaseMutation?.isPending ? (
              <ActivityIndicator size="large" color={Colors.light.primary} style={{ marginTop: 20 }} />
            ) : (
              <View style={styles.controlbtns}>
                <TouchableOpacity style={styles.invBtn} onPress={onClose}>
                  <Text style={styles.invTxt}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.proceedBtn} onPress={handlePurchase}>
                  <Text style={styles.proceedTxt}>
                    {'Confirm'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default RaffleModal;

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '90%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
    },
    innerContent: {
        width: '100%',
        gap:6
    },
    mainViewWrapper:{
        gap:8
    },
    title:{
        fontSize:24,
        fontWeight:"bold",
        textAlign:"center",
        color:Colors.light.blackTxt
    },
    description:{
        color:Colors.light.grayTxt,
        fontSize:12,
        textAlign:"center"
    },
    amount:{
        fontSize:24,
        fontWeight:"bold",
        textAlign:"center",
        color:Colors.light.blackTxt
    },
    bankactwrapper:{
        gap:4,
        marginTop:16,
    },
    banksec:{
        fontSize:12,
        fontWeight:"600",
        color:Colors.light.blackTxt,
        textAlign:"center"
    },
    bankCard:{
        gap:4,
        // borderWidth:1,
        paddingVertical:10,
        flexDirection:"row",
    },
    bankDet:{
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center",
        flex:1,
    },
    bankTxt:{
        color:Colors.light.blackTxt
    },
    otherOptions:{
        flexDirection:"row",
        gap:6,
        paddingVertical:10
    },
    optionTxt:{
        color:Colors.light.blackTxt
    },
    radioCircle: {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: Colors.light.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    selectedDot: {
        height: 10,
        width: 10,
        borderRadius: 5,
        backgroundColor: Colors.light.primary,
    },
    controlbtns:{
        flexDirection:"row",
        gap:6,
        marginVertical:10
    },
    invBtn:{
        flex:1,
        borderWidth:1,
        borderRadius:20,
        alignItems:"center",
        padding:10,
        borderColor:Colors.light.primary
    },
    invTxt:{
        color:Colors.light.primary,
        fontSize:16
    },
    proceedBtn:{
        flex:1,
        backgroundColor:Colors.light.primary,
        borderWidth:1,
        borderRadius:20,
        alignItems:"center",
        padding:10,
        borderColor:Colors.light.primary
    },
    proceedTxt:{
        color:Colors.light.whiteTxt,
        fontSize:16
    },
    enterAmtWrapper:{
        gap:10
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        padding: 10,
        marginTop: 10,
    },
    btn: {
        backgroundColor: Colors.light.primary,
        padding: 12,
        borderRadius: 6,
        marginTop: 15,
      },
      btnText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: '600',
      },
})