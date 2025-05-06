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
import { IAddBank, IAddBankAction, IBank, IBankAccount } from '@/interfaces'; // Adjust your path
//import { IAddBank } from '@/interfaces';
import Dropdown from '@/components/Dropdown'; // Assuming you have this
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { dummyBanks, dummyAccounts } from '@/constants/dummyBanks';
import DropDownScroll from '@/components/DropDownScroll';
import TransferToFriend from './friendcomponent/TransferToFriend';
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
  const [accounts, setAccounts] = useState<IBankAccount[]>([]);
  const [banks, setBanks] = useState<IBank[]>([]);
  const [loading, setLoading] = useState(false);
  const [currAccount, setCurrAccount] = useState('');
  const [amount, setAmount] = useState<number>();

  const [selectedBank, setSelectedBank] = useState<string>('');

  const [addBank, dispatch] = useReducer(
    (state: IAddBank, action: IAddBankAction) => {
      if (action.type === 'reset') return initialState;
      return { ...state, [action.type]: action.payload };
    },
    initialState
  );

  useEffect(() => {
    // Simulate API fetch
    setLoading(true);
    setTimeout(() => {
      setBanks(dummyBanks);
      setAccounts(dummyAccounts);
      setLoading(false);
    }, 500);
  }, []);

  const noAccount = useMemo(() => accounts.length === 0, [accounts]);

  const handleAccountNumber = (val: string) => {
    if (val.length > 10) return alert('Account number must be 10 digits');
    if (val.length === 10) {
      // Simulate verify
      console.log('Verifying bank account...');
    }
    dispatch({ type: 'account_number', payload: val });
  };

//   const handleSelectBank = (val: string) => {
//     dispatch({ type: 'bank_code', payload: val });
//     const bank = banks.find((b) => b.code === val);
//     dispatch({ type: 'bank_name', payload: bank?.name || '' });
//   };


  const handleSelectBank = (val: string) => {
    setSelectedBank(val);
    // Additional logic here if needed
  };

  const addUserBank=()=>{
    if (!selectedBank || addBank.account_number.length !== 10) {
        return alert('Please select a bank and enter a valid 10-digit account number');
      }
  
      setLoading(true);
  
      setTimeout(() => {
        const bank = banks.find((b) => b.name === selectedBank);
        if (!bank) return alert('Bank not found');
  
        const newAccount: IBankAccount = {
          id: (accounts.length + 1).toString(),
          account_name: 'Simulated Name', // Replace with actual verified name if needed
          account_number: addBank.account_number,
          bank_code: bank.code,
          bank_name: bank.name,
          is_default: false,
          recipient_code: `${bank.slug}_${addBank.account_number}`, // Simulated recipient code
        };
  
        setAccounts((prev) => [...prev, newAccount]);
        setBanks((prev) => prev.filter((b) => b.code !== bank.code));
        setSelectedBank('');
        // dispatch({ type: 'reset' });
        setCurrAccount('');
        setLoading(false);
      }, 1000);
  }

  const handleWithdraw = () => {
    const target = currAccount || accounts.find((a) => a.is_default)?.recipient_code;
    if (!target) return alert('No account selected');
    setLoading(true);
    setTimeout(() => {
      alert('Withdrawal simulated!');
      setAmount(0);
      setLoading(false);
    }, 1000);
  };

  const handleCurrentAccount = (val: string) => {
    setCurrAccount(currAccount === val ? '' : val);
  };

  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator size="large" color="#007bff" />}
      <Text style={styles.title}>Withdraw</Text>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          onPress={() => {
            setTransferTab(0);
            setActiveTab('BANK');
          }}
          style={[styles.tab, activeTab === 'BANK' && styles.activeTab]}
        >
          <Text style={activeTab === 'BANK' ? styles.activeText : styles.inactiveText}>Bank</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab('TRANSFER')}
          style={[styles.tab, activeTab === 'TRANSFER' && styles.activeTab]}
        >
          <Text style={activeTab === 'TRANSFER' ? styles.activeText : styles.inactiveText}>
            Transfer to Friends
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{paddingBottom:30}} showsVerticalScrollIndicator={false}>
        {activeTab === 'BANK' ? (
            <View>
            {!noAccount && (
                <View>
                    {
                        accounts.map((item,idx)=>{
                            return(
                                <View key={idx} style={styles.accountRow}>
                                    <TouchableOpacity onPress={() => handleCurrentAccount(item.recipient_code)}>
                                        <View style={styles.radioOuter}>
                                        {currAccount === item.recipient_code && <View style={styles.radioInner} />}
                                        </View>
                                    </TouchableOpacity>
                                    {/* <Image source={Logo} style={styles.logo} /> */}
                                    <Text style={styles.bankName}>{item.bank_name}</Text>
                                    <Text style={styles.accountNumber}>****{item.account_number.slice(6)}</Text>
                                    <TouchableOpacity onPress={() => alert('Simulated delete')}>
                                        <Ionicons name="trash" size={20} color="red" />
                                    </TouchableOpacity>
                                </View>
                            )
                        })
                    }
                </View>
                
            )}
            
            <View style={{flexDirection:"row", alignItems:"center", marginTop:20}}>
                <TouchableOpacity onPress={() => handleCurrentAccount('5000')}>
                    <View style={styles.radioOuter}>
                        {currAccount === '5000' && <View style={styles.radioInner} />}
                    </View>
                </TouchableOpacity>
                <Text style={styles.subTitle}>Add New Bank Account</Text>
            </View>
            {
                (currAccount ==='5000')&&
                <View>
                <DropDownScroll
                    label="Select Bank"
                    options={banks.map((bank) => bank.name)}
                    value={selectedBank}
                    onSelect={handleSelectBank}
                />
                <TextInput
                    placeholder="Account Number"
                    keyboardType="numeric"
                    value={addBank.account_number}
                    onChangeText={handleAccountNumber}
                    style={styles.input}
                />
                <TouchableOpacity onPress={() => addUserBank()} style={styles.btn}>
                    <Text style={styles.btnText}>Add Bank</Text>
                </TouchableOpacity>
                </View>
            }
            <Text style={{marginTop:10, color:"#000"}}>Enter Amount (NGN)</Text>
            <TextInput
                placeholder="min 50.00"
                keyboardType="numeric"
                value={amount?.toString()}
                onChangeText={(val) => setAmount(Number(val))}
                style={styles.input}
            />
            <TouchableOpacity onPress={handleWithdraw} style={styles.btn}>
                <Text style={styles.btnText}>Withdraw</Text>
            </TouchableOpacity>
            </View>
        ) : (
            <TransferToFriend/>
        )}

      </ScrollView>
    </View>
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
      alignItems:"center",
      justifyContent:"center"
    },
  });
  