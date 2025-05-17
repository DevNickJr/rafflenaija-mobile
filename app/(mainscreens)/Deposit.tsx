import React, { useState, useEffect } from 'react';
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

const Deposit = () => {
  const [activeTab, setActiveTab] = useState<'BANK' | 'TRANSFER'>('BANK');
  const [amount, setAmount] = useState<number>(0);
  const [inProgress, setInProgress] = useState<boolean>(false);
  const [copiedText, setCopiedText] = useState<string>('');

  const handleCopy = async (text: string) => {
    await Clipboard.setStringAsync(text);
    if (Platform.OS === 'android') {
      ToastAndroid.show('Copied to clipboard!', ToastAndroid.SHORT);
    } else {
      Alert.alert('Copied to clipboard!');
    }
  };

  const handlePayment = () => {
    if (!amount || amount < 100) {
      Alert.alert('Error', 'Minimum deposit amount is NGN 100.00');
      return;
    }
    setInProgress(true);
  };

  const handlePaid = () => {
    Alert.alert('Info', 'Payment confirmation is ongoing. Your account will be credited shortly');
    setInProgress(false);
    setAmount(0);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Deposit</Text>

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
  );
};

export default Deposit;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
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
