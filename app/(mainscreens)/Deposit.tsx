import React, { useState, useEffect, useReducer } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
  ToastAndroid,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import * as Clipboard from 'expo-clipboard';
import { Stack } from 'expo-router';
import { usePaystack } from 'react-native-paystack-webview';
import { useSession } from '@/providers/SessionProvider';
import { IDeposit, IDepositAction, IResponseData, IReturnDeposit, IUser } from '@/interfaces';
import { apiGetUser } from '@/services/AuthService';
import useFetch from '@/hooks/useFetch';
import Toast from 'react-native-toast-message';
import useMutate from '@/hooks/useMutation';
import { apiDeposit } from '@/services/WalletService';

const initialState = {
  email: "",
  amount: 0,
  reference: (new Date()).getTime().toString(),
}
const Deposit = () => {
  const [copiedText, setCopiedText] = useState<string>('');

  const handleCopy = async (text: string) => {
    await Clipboard.setStringAsync(text);
    if (Platform.OS === 'android') {
      ToastAndroid.show('Copied to clipboard!', ToastAndroid.SHORT);
    } else {
      Alert.alert('Copied to clipboard!');
    }
  };


  const { popup } = usePaystack();


  const [inProgress, setInprogress] = useState(false)
  const { access_token, dispatch: authStateDispatch, wallet_balance, ...context } = useSession()
  
  const [activeTab, setActiveTab] = useState<"BANK" | "TRANSFER">("BANK")

  const [user, dispatch] = useReducer((state: IDeposit, action: IDepositAction) => {
      if (action.type === "reset") {
        return initialState
      }
          return { ...state, [action.type]: action.payload }
  }, initialState)

  const { data: userData, refetch: refetchUser } = useFetch<IResponseData<IUser>>({
      api: apiGetUser,
      key: ["user"],
      requireAuth: true,
      enabled: !!access_token,
      showMessage: false
  })

  const [amount, setAmount] = useState(0)

  const onSuccess = (reference: any) => {
      // Implementation for whatever you want to do with reference and after success call.
      console.log({reference});
      setAmount(0)
      refetchUser()
      Toast.show({
        type: 'success',
        text1: "Payment is being processed"
    })
  };
  
  const onClose = () => {
      // implementation for  whatever you want to do when the Paystack dialog closed.
      console.log('closed')
      dispatch({ type: "reset", payload: "" })
  }
  
  const handlePayment = () => {
      if (!amount) {
          return Toast.show({
            type: 'info',
            text1: "Enter Deposit Amount"
          })
      }

      if (amount < 100) {
          return Toast.show({
            type: 'info',
            text1: "Amount must be 100 and above"
          })
      }

      const reference = (Date.now().toString() + Math.random().toString().replace(".", "")).slice(-24)
      const email = context?.phone_number + "@raffle-naija.com" // temporal 
      // const email = context.email ? context.email : context?.phone_number + "@raffle-naija.com"

      dispatch({ type: "email", payload: email })
      dispatch({ type: "reference", payload: reference })
      dispatch({ type: "amount", payload: amount })

      depositMutation.mutate({
          email,
          reference,
          amount
      })
  }
  
  const depositMutation = useMutate<IDeposit, IResponseData<IReturnDeposit>>(
      apiDeposit,
      {
        onSuccess: () => {
            Toast.show({
                type: 'success',
                text1: "Loading payment page"
            })

            console.log({ popup })
            console.log('success', user.email, user.reference,  Number(user.amount || 0)*100,)
            

            popup.checkout({
              email: user.email,
              reference: user.reference,
              amount: Number(user.amount || 0)*100,
              // plan: 'PLN_example123',
              // invoice_limit: 3,
              // subaccount: 'SUB_abc123',
              // split_code: 'SPL_def456',
              // split: {
              //   type: 'percentage',
              //   bearer_type: 'account',
              //   subaccounts: [
              //     { subaccount: 'ACCT_abc', share: 60 },
              //     { subaccount: 'ACCT_xyz', share: 40 }
              //   ]
              // },
              // metadata: {
              //   custom_fields: [
              //     {
              //       display_name: 'Order ID',
              //       variable_name: 'order_id',
              //       value: 'OID1234'
              //     }
              //   ]
              // },
              onSuccess,
              // onClose,
              // config: {   } 

              // onSuccess: (res) => console.log('Success:', res),
              onCancel: () => {
                Toast.show({
                  type: 'info',
                  text1: 'Payment Cancelled',
                })
                console.log('User cancelled')
              },
              onLoad: (res) => console.log('WebView Loaded:', res),
              onError: (err) => {
                Toast.show({
                  type: 'error',
                  text1: 'An error occurred',
                })
                console.log({ err })
              }
            });
            // payNow({ })
        },
        showErrorMessage: true,
        requireAuth: true
      }
    )

  useEffect(() => {
      if (userData?.data?.wallet_balance && (wallet_balance != userData?.data?.wallet_balance)) {
          authStateDispatch({ type: "UPDATE", payload: {
              wallet_balance: userData?.data?.wallet_balance || 0,
          }})
      }
  },[userData?.data?.wallet_balance, wallet_balance, authStateDispatch])

  const handlePaid = () => {
      Toast.show({
        type: 'success',
        text1: 'Payment confirmation is ongoing. Your account will be credited shortly',
      })
      setInprogress(false)
      setAmount(0)
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Deposit',
        }}
      />
      <ScrollView contentContainerStyle={styles.container}>
        {/* <Text style={styles.title}>Deposit</Text> */}

        <View style={styles.tabContainer}>
          <TouchableOpacity onPress={() => setActiveTab('BANK')}>
            <Text style={[styles.tab, activeTab === 'BANK' && styles.activeTab]}>Bank Transfers</Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'BANK' && (
          <View>
            {!inProgress ? (
              <View>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Amount (NGN)</Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    placeholder="Enter min 100"
                    value={amount > 0 ? amount.toString() : ''}
                    onChangeText={(text) => setAmount(Number(text))}
                  />
                </View>
                <TouchableOpacity style={styles.button} onPress={handlePayment}>
                  <Text style={styles.buttonText}>Fund Wallet</Text>
                </TouchableOpacity>

                <View style={styles.noteContainer}>
                  <Text style={styles.noteTitle}>NOTE</Text>
                  <Text style={styles.note}>
                    • We do not share your payment information. It is used for transaction
                    verification only.
                  </Text>
                  <Text style={styles.note}>
                    • If you have any issues, please contact customer service.
                  </Text>
                  <Text style={styles.note}>• Minimum deposit amount is NGN 100.00.</Text>
                  <Text style={styles.note}>• Maximum per transaction is NGN 9,999,999.00.</Text>
                </View>
              </View>
            ) : (
              <View style={styles.paymentInfo}>
                <Text style={styles.sectionTitle}>
                  Send ₦{amount} from your bank to the account details below
                </Text>
                <View style={styles.infoItem}>
                  <Text>Bank Name</Text>
                  <Text style={styles.bold}>Example Bank</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text>Account Number</Text>
                  <TouchableOpacity
                    onPress={() => handleCopy('1234567890')}
                    style={styles.copyContainer}>
                    <Text style={styles.bold}>1234567890</Text>
                    <MaterialCommunityIcons name="content-copy" size={18} color="#000" />
                  </TouchableOpacity>
                </View>
                <View style={styles.infoItem}>
                  <Text>Account Name</Text>
                  <Text style={styles.bold}>Raffle Naija</Text>
                </View>
                <Text style={styles.warning}>
                  Note: Please do not transfer money into this account more than once. Transaction
                  expires in 30mins.
                </Text>
                <TouchableOpacity style={styles.button} onPress={handlePaid}>
                  <Text style={styles.buttonText}>I have made payment</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </>
  );
};

export default Deposit;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  tab: {
    marginRight: 16,
    fontSize: 16,
    color: '#ccc',
  },
  activeTab: {
    color: Colors.light.primary,
    borderBottomWidth: 2,
    borderColor: Colors.light.primary,
    fontWeight: 'bold',
    paddingBottom: 4,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 12,
    fontSize: 14,
  },
  button: {
    backgroundColor: Colors.light.primary,
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignSelf: 'flex-start',
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
  },
  noteContainer: {
    marginTop: 24,
  },
  noteTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  note: {
    fontSize: 12,
    color: '#777',
    marginBottom: 4,
  },
  paymentInfo: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  infoItem: {
    marginTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  bold: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  copyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  warning: {
    color: '#dc2626',
    marginTop: 16,
    fontSize: 12,
  },
});
