import React, { useEffect, useMemo, useReducer, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  TextInput,
  FlatList,
  ScrollView,
} from 'react-native';
import { IAddBank, IAddBankAction, IBank, IBankAccount, IDelete, IResponseData, IUser, IVerifyBank, IVerifyBankResponse, IWithdraw } from '@/interfaces'; // Adjust your path
//import { IAddBank } from '@/interfaces';
import Dropdown from '@/components/Dropdown'; // Assuming you have this
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { dummyBanks, dummyAccounts } from '@/constants/dummyBanks';
import DropDownScroll from '@/components/DropDownScroll';
import TransferToFriend from './friendcomponent/TransferToFriend';
import { Stack } from 'expo-router';
import useFetch from '@/hooks/useFetch';
import { apiAddBankAccount, apiDeleteBankAccount, apiGetSupportedBanks, apiGetUserBankAccounts, apiVerifyBankAccount, apiWithdraw } from '@/services/WalletService';
import useMutate from '@/hooks/useMutation';
import Toast from 'react-native-toast-message';
import { apiGetUser } from '@/services/AuthService';
import { useSession } from '@/providers/SessionProvider';
// Dummy image in place of Logo
const Logo = require('../../assets/images/homelogo.png');

const initialState: IAddBank = {
  account_number: '',
  bank_code: '',
  bank_name: '',
  is_default: false,
};

// const dummyBanks: IBank[] = [
//     {
//       name: 'Zenith Bank',
//       code: '057',
//       country: 'Nigeria',
//       currency: 'NGN',
//       id: 1,
//       longcode: '057150013',
//       slug: 'zenith-bank',
//     },
//     {
//       name: 'GTBank',
//       code: '058',
//       country: 'Nigeria',
//       currency: 'NGN',
//       id: 2,
//       longcode: '058152036',
//       slug: 'gtbank',
//     },
//   ];

// const dummyAccounts: IBankAccount[] = [
//     {
//       id: '1',
//       account_name: 'John Doe',
//       account_number: '1234567890',
//       bank_code: '057',
//       bank_name: 'Zenith Bank',
//       is_default: true,
//       recipient_code: 'zenith123',
//     },
//   ];

const Withdraw = () => {
  const [activeTab, setActiveTab] = useState<'BANK' | 'TRANSFER'>('BANK');
  const [transferTab, setTransferTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currAccount, setCurrAccount] = useState('new');
  const [amount, setAmount] = useState(0)

  const { access_token, wallet_balance , dispatch: authStateDispatch } = useSession();

  // const [selectedBank, setSelectedBank] = useState<string>('');

  const [addBank, dispatch] = useReducer((state: IAddBank, action: IAddBankAction) => {
    if (action.type === 'reset') return initialState;
    return { ...state, [action.type]: action.payload };
  }, initialState);



  const [deleteAccountId, setDeleteAccountId] = useState('')
  
  const { data: accounts, refetch, isLoading } = useFetch<IResponseData<IBankAccount[]>>({
      api: apiGetUserBankAccounts,
      key: ["bank-accounts"],
      requireAuth: true
  })

  const { data: banks } = useFetch<IResponseData<IBank[]>>({
      api: apiGetSupportedBanks,
      key: ["banks"],
      requireAuth: true
  })


  const addBankMutation = useMutate<IAddBank, any>(
      apiAddBankAccount,
      {
        onSuccess: (data: IResponseData<"">) => {
            console.log("data", data)
            dispatch({ type: "reset", payload: '' })
            setCurrAccount("")
            Toast.show({
                type: "success",
                text1: data.message || "Account Added Successfully"
            })
            refetch()
            return
        },
        showErrorMessage: true,
      }
  )

  const verifyBankMutation = useMutate<IVerifyBank, IResponseData<IVerifyBankResponse>>(
      apiVerifyBankAccount,
      {
        onSuccess: (data: IResponseData<"">) => {
            console.log("data", data)
            Toast.show({
                type: "success",
                text1: data.message || "Account Verified Successfully"
            })
            return
        },
        showErrorMessage: true,
      }
  )

  const deleteBankMutation = useMutate<IDelete, IResponseData<"">>(
      apiDeleteBankAccount,
      {
        onSuccess: (data: IResponseData<"">) => {
            console.log("data", data)
            Toast.show({
                type: "success",
                text1: data.message || "Account Deleted Successfully"
            })
            refetch()
            setDeleteAccountId("")
            return
        },
        showErrorMessage: true,
      }
  )

  const withdrawMutation = useMutate<IWithdraw, IResponseData<"">>(
      apiWithdraw,
      {
        onSuccess: (data: IResponseData<"">) => {
            console.log("data", data)
            setAmount(0)
            Toast.show({
                type: "success",
                text1: data.message || "Withdrawal is being processed"
            })
            refetchUser()
          //   toast.success(data.message || "Operation Successful")
            return
        },
        showErrorMessage: true,
      }
  )

  const { data: userData, refetch: refetchUser } = useFetch<IResponseData<IUser>>({
      api: apiGetUser,
      key: ["user"],
      requireAuth: true,
      enabled: !!access_token,
      showMessage: false
  })

  useEffect(() => {
      if (userData?.data?.wallet_balance && (wallet_balance != userData?.data?.wallet_balance)) {
          authStateDispatch({ type: "UPDATE", payload: {
              wallet_balance: Number(userData?.data?.wallet_balance) || wallet_balance || 0,
          }})
      }
  },[userData?.data?.wallet_balance, wallet_balance, authStateDispatch])

  const noAccount = useMemo(() => (accounts?.data && accounts?.data?.length > 0) ? false : true, [accounts])

  const handleAccountNumber = (val: string) => {
      if (val.length > 10) {
        Toast.show({
            type: "info",
            text1: "Account Number must be 10 digits"
        })
        return
      }
      if (val.length === 10) {
          verifyBankMutation.mutate({
              account_number: val,
              bank_code: addBank.bank_code,
          })
      }
      dispatch({ type: "account_number", payload: val })
  }

  const handleSelectBank = (val: string) => {
    const bank = banks?.data?.find(bank => bank.name === val)
    dispatch({ type: "bank_code", payload: bank?.code || '' })
    dispatch({ type: "bank_name", payload: bank?.name || "" })
  }

  const handleWithdraw = () => {
      if (currAccount && currAccount !== "new") {
        // const recipient_code = accounts?.data?.find(account => account?.account_number === currAccount)
        return withdrawMutation.mutate({
            amount,
            // bank_account_id: currAccount
            recipient_code: currAccount
        })
      }
      const recipient_code = accounts?.data?.find(account => account?.is_default === true)?.id
      if (!recipient_code) {
          return Toast.show({
              type: "info",
              text1: "No default Account Set. Select an Account"
          })
      }
      return withdrawMutation.mutate({
          amount,
          // bank_account_id: recipient_code
          recipient_code
      })
  }
  const handleCurrentAccount = (val: string) => {
      if (currAccount === val) {
          return setCurrAccount("")
      }
      return setCurrAccount(val)
  }


  return (
    <>
      <Stack.Screen
        options={{
          title: 'Withdrawal',
        }}
      />
      <View style={styles.container}>
        {loading && <ActivityIndicator size="large" color="#007bff" />}
        {/* <Text style={styles.title}>Withdraw</Text> */}

        <View style={styles.tabContainer}>
          <TouchableOpacity
            onPress={() => {
              setTransferTab(0);
              setActiveTab('BANK');
            }}
            style={[styles.tab, activeTab === 'BANK' && styles.activeTab]}>
            <Text style={activeTab === 'BANK' ? styles.activeText : styles.inactiveText}>Bank</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab('TRANSFER')}
            style={[styles.tab, activeTab === 'TRANSFER' && styles.activeTab]}>
            <Text style={activeTab === 'TRANSFER' ? styles.activeText : styles.inactiveText}>
              Transfer to Friends
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={{ paddingBottom: 30 }}
          showsVerticalScrollIndicator={false}>
          {activeTab === 'BANK' ? (
            <View>
              {!noAccount && (
                <View>
                  {accounts?.data?.map((item, idx) => {
                    return (
                      <View key={idx} style={styles.accountRow}>
                        <TouchableOpacity onPress={() => handleCurrentAccount(item.recipient_code)}>
                          <View style={styles.radioOuter}>
                            {currAccount === item.recipient_code && (
                              <View style={styles.radioInner} />
                            )}
                          </View>
                        </TouchableOpacity>
                        {/* <Image source={Logo} style={styles.logo} /> */}
                        <Text style={styles.bankName}>{item.bank_name}</Text>
                        <Text style={styles.accountNumber}>****{item.account_number.slice(6)}</Text>
                        <TouchableOpacity onPress={() => alert('Simulated delete')}>
                          <Ionicons name="trash" size={20} color="red" />
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </View>
              )}

              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20 }}>
                <TouchableOpacity onPress={() => handleCurrentAccount('new')}>
                  <View style={styles.radioOuter}>
                    {currAccount === 'new' && <View style={styles.radioInner} />}
                  </View>
                </TouchableOpacity>
                <Text style={styles.subTitle}>Add New Bank Account</Text>
              </View>
              {currAccount === 'new' ? (
                <View style={{ marginTop: 10 }}>
                  <DropDownScroll
                    label="Select Bank"
                    options={banks?.data?.map((bank) => bank.name) || []}
                    value={addBank?.bank_name || ''}
                    onSelect={handleSelectBank}
                  />
                  <TextInput
                    placeholder="Account Number"
                    keyboardType="numeric"
                    value={addBank.account_number}
                    onChangeText={handleAccountNumber}
                    style={styles.input}
                  />
                  {
                      (verifyBankMutation.isSuccess && addBank?.account_number.length===10) && <Text style={{ marginTop: 4, color: Colors.light.primary }}>{verifyBankMutation.data.data.account_name}</Text>
                  }
                  <TouchableOpacity onPress={() =>  addBankMutation.mutate(addBank)} style={styles.btn}>
                    <Text style={styles.btnText}>Add Bank</Text>
                  </TouchableOpacity>
                </View>
              ) :
              <>
                <Text style={{ marginTop: 20, color: '#000' }}>Enter Amount (NGN)</Text>
                <TextInput
                  placeholder="min 50.00"
                  keyboardType="numeric"
                  value={amount ? amount?.toString() : ''}
                  onChangeText={(val) => setAmount(Number(val))}
                  style={styles.input}
                />
                <TouchableOpacity onPress={handleWithdraw} style={styles.btn}>
                  <Text style={styles.btnText}>Withdraw</Text>
                </TouchableOpacity>
              </>}
            </View>
          ) : (
            <TransferToFriend />
          )}
        </ScrollView>
      </View>
    </>
  );
};

export default Withdraw;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 10,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderColor: Colors.light.primary,
  },
  activeText: {
    color: Colors.light.primary,
    fontWeight: 'bold',
  },
  inactiveText: {
    color: '#aaa',
  },
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.light.primary,
  },
  logo: {
    width: 30,
    height: 30,
    marginRight: 8,
  },
  bankName: {
    flex: 1,
  },
  accountNumber: {
    marginRight: 10,
  },
  subTitle: {
    //marginTop: 20,
    fontWeight: '600',
    fontSize: 16,
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
  transferBox: {
    height: 200,
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
