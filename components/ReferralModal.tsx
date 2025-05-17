import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet
} from 'react-native';

type Props={
    visible:boolean;
    onClose:()=>void;
}

const ReferralWithdrawModal = ({ visible=true, onClose }:Props) => {
  const [modalStep, setModalStep] = useState('banks');
  const [selectedBankId, setSelectedBankId] = useState('');
  const [bankList, setBankList] = useState([
    { id: '1', name: 'UBA', account: '12*****433' },
    { id: '2', name: 'Access Bank', account: '52*****143' }
  ]);
  const [newBank, setNewBank] = useState('');
  const [newAccountNumber, setNewAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [raffleNumber, setRaffleNumber] = useState('');
  const [otp, setOtp] = useState('');

  const handleProceedFromBanks = () => {
    if (selectedBankId === 'new_account') {
      setModalStep('add_new_bank');
    } else if (selectedBankId === 'raffle_ninja') {
      setModalStep('raffle_details');
    } else {
      setModalStep('amount');
    }
  };

  const handleAddNewBank = () => {
    const newId = Date.now().toString();
    const newBankObj = {
      id: newId,
      name: `${newBank} - ${newAccountNumber}`,
      account: '1032111',
    };
    setBankList([...bankList, newBankObj]);
    setSelectedBankId(newId);
    setModalStep('amount');
  };

  const handleAmountProceed = () => {
    setModalStep('otp');
  };

  const handleOtpSubmit = () => {
    setModalStep('success');
    setTimeout(() => {
      onClose();
      setModalStep('banks');
      setSelectedBankId('');
      setAmount('');
      setOtp('');
      setNewAccountNumber('');
      setNewBank('');
      setRaffleNumber('');
    }, 2000);
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <ScrollView horizontal>
            <View style={styles.innerContent}>
              {modalStep === 'banks' && (
                <>
                  <Text style={styles.modalTitle}>Withdraw Referral Funds</Text>
                  {bankList.map(bank => (
                    <TouchableOpacity
                      key={bank.id}
                      style={styles.radioRow}
                      onPress={() => setSelectedBankId(bank.id)}
                    >
                      <View style={styles.radioCircle}>
                        {selectedBankId === bank.id && <View style={styles.selectedDot} />}
                      </View>

                      <View>
                        
                      </View>
                      <Text style={styles.bankText}>{bank.name}</Text>
                    </TouchableOpacity>
                  ))}

                  <View style={{ height: 1, backgroundColor: '#ddd', marginVertical: 10 }} />

                  <TouchableOpacity
                    style={styles.radioRow}
                    onPress={() => setSelectedBankId('raffle_ninja')}
                  >
                    <View style={styles.radioCircle}>
                      {selectedBankId === 'raffle_ninja' && <View style={styles.selectedDot} />}
                    </View>
                    <Text style={styles.bankText}>Withdraw to Raffle Ninja</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.radioRow}
                    onPress={() => setSelectedBankId('new_account')}
                  >
                    <View style={styles.radioCircle}>
                      {selectedBankId === 'new_account' && <View style={styles.selectedDot} />}
                    </View>
                    <Text style={styles.bankText}>Withdraw to a New Account</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.modalButton}
                    disabled={!selectedBankId}
                    onPress={handleProceedFromBanks}
                  >
                    <Text style={styles.modalButtonText}>Proceed</Text>
                  </TouchableOpacity>
                </>
              )}

              {modalStep === 'add_new_bank' && (
                <>
                  <Text style={styles.modalTitle}>Enter Bank Details</Text>
                  <TextInput
                    placeholder="Enter Bank Name"
                    style={styles.input}
                    value={newBank}
                    onChangeText={setNewBank}
                  />
                  <TextInput
                    placeholder="Enter Account Number"
                    style={styles.input}
                    keyboardType="number-pad"
                    value={newAccountNumber}
                    onChangeText={setNewAccountNumber}
                  />
                  <TouchableOpacity
                    style={styles.modalButton}
                    disabled={!newBank || !newAccountNumber}
                    onPress={handleAddNewBank}
                  >
                    <Text style={styles.modalButtonText}>Proceed</Text>
                  </TouchableOpacity>
                </>
              )}

              {modalStep === 'raffle_details' && (
                <>
                  <Text style={styles.modalTitle}>Enter Raffle Ninja Details</Text>
                  <TextInput
                    placeholder="Raffle Ninja Number"
                    style={styles.input}
                    value={raffleNumber}
                    onChangeText={setRaffleNumber}
                  />
                  <TextInput
                    placeholder="Amount"
                    style={styles.input}
                    keyboardType="numeric"
                    value={amount}
                    onChangeText={setAmount}
                  />
                  <TouchableOpacity
                    style={styles.modalButton}
                    disabled={!raffleNumber || !amount}
                    onPress={handleAmountProceed}
                  >
                    <Text style={styles.modalButtonText}>Proceed</Text>
                  </TouchableOpacity>
                </>
              )}

              {modalStep === 'amount' && (
                <>
                  <Text style={styles.modalTitle}>Enter Amount</Text>
                  <TextInput
                    placeholder="Amount"
                    style={styles.input}
                    keyboardType="numeric"
                    value={amount}
                    onChangeText={setAmount}
                  />
                  <TouchableOpacity
                    style={styles.modalButton}
                    disabled={!amount}
                    onPress={handleAmountProceed}
                  >
                    <Text style={styles.modalButtonText}>Proceed</Text>
                  </TouchableOpacity>
                </>
              )}

              {modalStep === 'otp' && (
                <>
                  <Text style={styles.modalTitle}>Enter OTP</Text>
                  <TextInput
                    placeholder="OTP"
                    style={styles.input}
                    keyboardType="numeric"
                    value={otp}
                    onChangeText={setOtp}
                  />
                  <TouchableOpacity
                    style={styles.modalButton}
                    disabled={!otp}
                    onPress={handleOtpSubmit}
                  >
                    <Text style={styles.modalButtonText}>Submit</Text>
                  </TouchableOpacity>
                </>
              )}

              {modalStep === 'success' && (
                <Text style={styles.successText}>Withdrawal Successful!</Text>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

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
    width: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#555',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  selectedDot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#555',
  },
  bankText: {
    fontSize: 16,
  },
  modalButton: {
    backgroundColor: '#007BFF',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 16,
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
  },
  successText: {
    fontSize: 18,
    color: 'green',
    textAlign: 'center',
  },
});

export default ReferralWithdrawModal;