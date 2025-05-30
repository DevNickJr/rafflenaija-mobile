import { Colors } from '@/constants/Colors';
import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import NumberInput from './NumberInput';
import OtpBackend from './OtpBackend';
import DropDownScroll from './DropDownScroll';
import { IBank, IBankAccount, IReferralWithdraw, IResponseData } from '@/interfaces';
import { dummyBanks } from '@/constants/dummyBanks';
import { apiGetUserBankAccounts } from '@/services/WalletService';
import useFetch from '@/hooks/useFetch';
import { apiReferral, apiWithdrawReferralFunds } from '@/services/ReferralService';
import useMutate from '@/hooks/useMutation';
import Toast from 'react-native-toast-message';

type Props = {
  visible: boolean;
  onClose: () => void;
};

type TabTypes = 'Withdraw Referral Funds' | 'Enter Amount' | 'OTP Verification' | 'Enter Amount Raffle';

const RefferalModalV2 = ({ visible, onClose }: Props) => {
  const [currentTab, setCurrentTab] = useState<TabTypes>('Withdraw Referral Funds');
  const [bankList, setBankList] = useState([
    { id: '1', name: 'UBA', account: '12*****433' },
    { id: '2', name: 'Access Bank', account: '52*****143' }
  ]);

       
  const { data: referral } = useFetch({
    api: apiReferral,
    select: ((d: any) => d?.data?.data),
    key: ["referral"],
    requireAuth: true
})

  const [banks, setBanks] = useState<IBank[]>([...dummyBanks]);
  const [selectedBankId, setSelectedBankId] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [optionType, setOptionType] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState(0);
  const [otp, setOtp] = useState('');
  const [pinReady, setPinReady] = useState(false);
  const [loading, setLoading] = useState(false);

  const { data: accounts, refetch, isLoading } = useFetch<IResponseData<IBankAccount[]>>({
    api: apiGetUserBankAccounts,
    key: ["bank-accounts"],
    requireAuth: true
  })

  // const { data: banks } = useFetch<IResponseData<IBank[]>>({
  //     api: apiGetSupportedBanks,
  //     key: ["banks"],
  //     requireAuth: true
  // })

  const resetState = () => {
    setCurrentTab('Withdraw Referral Funds');
    setSelectedBankId('');
    setSelectedOption('');
    setSelectedBank('');
    setAccountNumber('');
    setAmount(0);
    setOtp('');
    setPinReady(false);
  };

  const withdrawMutation = useMutate<IReferralWithdraw, IResponseData<"">>(
    apiWithdrawReferralFunds,
    {
      onSuccess: (data: IResponseData<"">) => {
          console.log("data", data)
          setAmount(0);
          Toast.show({
              type: "success",
              text1: data.message || "Operation Successful"
          })
          onClose()
          return
      },
      showErrorMessage: true,
    }
)


const handleWithdraw = () => {
    return withdrawMutation.mutate({
        amount,
    })
}   


  const handleProceed = () => {
    switch (currentTab) {
      case 'Withdraw Referral Funds':
        if (selectedOption === 'wtrfna') {
          setCurrentTab('Enter Amount Raffle');
        } else if (selectedBankId || selectedOption === 'newbank') {
          setCurrentTab('Enter Amount');
        } else {
          Alert.alert('Select an account or option');
        }
        break;
      case 'Enter Amount':
        handleWithdraw();
        break;
      case 'OTP Verification':
        if (pinReady && otp.length === 4) {
          setLoading(true);
          setTimeout(() => {
            setLoading(false);
            Alert.alert('Success', 'Withdrawal Successful', [
              { text: 'OK', onPress: onClose }
            ]);
            resetState();
          }, 3000);
        } else {
          Alert.alert('Invalid OTP');
        }
        break;
      case 'Enter Amount Raffle':
        if (amount && parseFloat(amount?.toString()) <= referral?.wallet?.balance) {
          setLoading(true);
          setTimeout(() => {
            setLoading(false);
            Alert.alert('Success', 'Raffle Withdrawal Successful', [
              { text: 'OK', onPress: onClose }
            ]);
            resetState();
          }, 3000);
        } else {
          Alert.alert('Enter valid amount');
        }
        break;
    }
  };

  const handleAddBank = () => {
    if (selectedBank && accountNumber.length === 10) {
      const newBank = {
        id: (bankList.length + 1).toString(),
        name: selectedBank,
        account: `${accountNumber.slice(0, 2)}*****${accountNumber.slice(-3)}`
      };
      setBankList([...bankList, newBank]);
      setSelectedOption('');
      setSelectedBankId('');
      setSelectedBank('');
      setAccountNumber('');
    } else {
      Alert.alert('Please select bank and enter valid account number');
    }
  };

  const optionPick = (type: 'main' | 'bank', payload: string) => {
    setOptionType(type);
    if (type === 'main') {
      setSelectedOption(payload);
      setSelectedBankId('');
    } else {
      setSelectedBankId(payload);
      setSelectedOption('');
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <ScrollView contentContainerStyle={styles.innerContent}>
            {currentTab === 'Withdraw Referral Funds' && (
              <View style={styles.mainViewWrapper}>
                <Text style={styles.title}>Withdraw Referral Funds</Text>
                <Text style={styles.description}>Withdraw your referral funds from Raffle Naija</Text>
                <Text style={styles.amount}>Total Amount Earned: NGN {referral?.wallet?.balance}</Text>

                <Text style={styles.banksec}>Select Account to send to</Text>
                {
                 !accounts?.data?.length ?
                   <Text style={styles.banksec}>No accounts have been added. Add accounts from withdraw page to proceed</Text>
                 : 
                  accounts?.data.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      style={styles.bankCard}
                      onPress={() => optionPick('bank', item.recipient_code)}
                    >
                      <View style={styles.radioCircle}>
                        {selectedBankId === item.recipient_code && <View style={styles.selectedDot} />}
                      </View>
                      <View style={styles.bankDet}>
                        <Text>{item.bank_name?.slice(0,25)} {item.bank_name?.length > 24 && '...'}</Text>
                        <Text>{item.account_number}</Text>
                      </View>
                    </TouchableOpacity>
                  ))
                }

                {/* <TouchableOpacity onPress={() => optionPick('main', 'newbank')} style={styles.otherOptions}>
                  <View style={styles.radioCircle}>
                    {selectedOption === 'newbank' && <View style={styles.selectedDot} />}
                  </View>
                  <Text>Add a new bank account</Text>
                </TouchableOpacity> */}

                {selectedOption === 'newbank' && (
                  <View style={{ paddingLeft: 20 }}>
                    <DropDownScroll
                      label="Select Bank"
                      options={banks.map((b) => b.name)}
                      value={selectedBank}
                      onSelect={setSelectedBank}
                    />
                    <NumberInput
                      label=''
                      placeholder="Account Number"
                      value={accountNumber}
                      onChange={(val) => setAccountNumber(val)}
                    />
                    <TouchableOpacity onPress={handleAddBank} style={styles.btn}>
                      <Text style={styles.btnText}>Add Bank</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {/* <TouchableOpacity onPress={() => optionPick('main', 'wtrfna')} style={styles.otherOptions}>
                  <View style={styles.radioCircle}>
                    {selectedOption === 'wtrfna' && <View style={styles.selectedDot} />}
                  </View>
                  <Text>Withdraw to Raffle Naija account</Text>
                </TouchableOpacity> */}
              </View>
            )}

            {currentTab === 'Enter Amount' && (
              <View style={styles.enterAmtWrapper}>
                <Text style={styles.title}>Enter Amount</Text>
                <Text style={styles.description}>Enter the amount to withdraw</Text>
                <NumberInput
                  label="Enter Amount"
                  value={amount ? String(amount) : ''}
                  onChange={(value) => setAmount(Number(value))}
                  placeholder={''}
                />
              </View>
            )}

            {currentTab === 'OTP Verification' && (
              <View style={styles.enterAmtWrapper}>
                <Text style={styles.title}>OTP Verification</Text>
                <Text style={styles.description}>Enter the OTP sent to your number</Text>
                <OtpBackend
                  setPinReady={setPinReady}
                  code={otp}
                  setCode={setOtp}
                  maxLength={4}
                />
              </View>
            )}

            {/* {currentTab === 'Enter Amount Raffle' && (
              <View style={styles.enterAmtWrapper}>
                <Text style={styles.title}>Withdraw to Raffle Naija</Text>
                <NumberInput
                  label="Raffle Naija Number"
                  value={amount}
                  onChange={setAmount}
                />
                <NumberInput
                  label="Amount"
                  value={amount}
                  onChange={setAmount}
                />
              </View>
            )} */}

            {loading ? (
              <ActivityIndicator size="large" color={Colors.light.primary} style={{ marginTop: 20 }} />
            ) : (
              <View style={styles.controlbtns}>
                <TouchableOpacity style={styles.invBtn} onPress={onClose}>
                  <Text style={styles.invTxt}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.proceedBtn} onPress={handleProceed}>
                  <Text style={styles.proceedTxt}>
                    {currentTab === 'OTP Verification' ? 'Verify' : 'Proceed'}
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

export default RefferalModalV2;

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
        fontWeight:"600",
        color:Colors.light.blackTxt,
        fontSize:14,
        textAlign:"center"
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