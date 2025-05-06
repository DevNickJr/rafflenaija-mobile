import React, { useReducer } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
// import { toastMessage } from '../utils/toastMessage'; // you’ll need to implement this
// import usePost from '../hooks/useMutation';
import { ITransfer, ITransferAction, IResponseData } from '@/interfaces';
import { apiTransfer } from '@/services/WalletService'; 
import ModalBtn from '@/components/ModalBtn';

const initialState: ITransfer = {
  amount: 0,
  recipient_phone: ''
};

const FTransfer = () => {
  const [user, dispatch] = useReducer((state: ITransfer, action: ITransferAction) => {
    if (action.type === 'reset') return initialState;
    return { ...state, [action.type]: action.payload };
  }, initialState);

//   const TransferToFriendMutation = usePost<ITransfer, any>(
//     apiTransfer,
//     {
//       onSuccess: (data: IResponseData<''>) => {
//         console.log('new data', data);
//         dispatch({ type: 'reset', payload: '' });
//       },
//       showErrorMessage: true,
//       requireAuth: true
//     }
//   );

  const handleTransfer = () => {
    if (!user.amount) {
      return alert('Enter Amount');
    }

    if (!user.recipient_phone) {
      return alert("Enter Friend's Phone Number");
    }

    if (user.amount < 100) {
      return alert('Amount must be 100 and above');
    }

    // TransferToFriendMutation.mutate(user);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* {TransferToFriendMutation.isPending && (
        <ActivityIndicator size="large" color="#000" style={styles.loader} />
      )} */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Recipient Phone</Text>
        <TextInput
          style={styles.input}
          keyboardType="phone-pad"
          value={user.recipient_phone}
          onChangeText={(text) =>
            dispatch({ type: 'recipient_phone', payload: text })
          }
          placeholder="Enter Phone Number"
        />

        <Text style={styles.label}>Amount (NGN)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={user.amount <= 0 ? '' : String(user.amount)}
          onChangeText={(text) =>
            dispatch({ type: 'amount', payload: Number(text) })
          }
          placeholder="Enter min 100"
        />

        <ModalBtn title='Transfer' onPress={handleTransfer}/>
      </View>

      <View style={styles.noteContainer}>
        <Text style={styles.noteTitle}>NOTE</Text>
        <View style={styles.noteList}>
          <Text style={styles.noteItem}>
            1. Phone Number must be a registered Raffle Naija Account
          </Text>
          <Text style={styles.noteItem}>
            2. If you have any issues, please contact customer service
          </Text>
          <Text style={styles.noteItem}>
            3. Minimum Transfer amount is NGN 100.00 - you can Transfer at least NGN 100.00 in one transaction.
          </Text>
          <Text style={styles.noteItem}>
            4. Maximum per transaction is NGN 9,999,999.00 - you can Transfer up to NGN 9,999,999.00 in one transaction.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default FTransfer;

const styles = StyleSheet.create({
    container: {
      paddingTop: 16,
    //   paddingHorizontal: 16,
    },
    loader: {
      marginBottom: 20,
    },
    inputContainer: {
      maxWidth: 400,
      gap: 12,
      marginBottom: 32,
    },
    label: {
      fontSize: 14,
      marginBottom: 4,
    },
    input: {
      padding: 12,
      fontSize: 14,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 8,
      backgroundColor: 'transparent',
    },
    buttonText: {
      color: '#fff',
      fontSize: 14,
    },
    noteContainer: {
      width: '100%',
    },
    noteTitle: {
      marginBottom: 12,
      fontSize: 12,
      fontWeight: '600',
    },
    noteList: {
      paddingLeft: 16,
      gap: 10,
    },
    noteItem: {
      fontSize: 12,
      color: '#888',
    },
  });
  
