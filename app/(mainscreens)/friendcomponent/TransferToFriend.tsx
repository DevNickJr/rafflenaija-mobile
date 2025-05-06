import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import TextInputField from '@/components/TextInputField';
import ModalBtn from '@/components/ModalBtn';
import { useState } from 'react';
import AddSecurityQuestion from './AddSecurity';
import FTransfer from './FTransfer';
import VerifyEmail from './VerifyEmail';

const TransferToFriend = () => {

    const [email, setEmail] = useState('');
    const [transferTab, setTransferTab] = useState(0);

    const [isVerified, setIsVerified]=useState(false) // For email
    const [allQns, setAllQns]=useState(false) // For questions
    const [openOtp, setOpenOtp]=useState(false)

  const handleVerifyEmail = () => {
    if (!email) {
      Alert.alert('Validation', 'Please enter a valid email address');
      return;
    }
    // Replace with your dispatch or email verification logic
    console.log('Verifying email:', email);
    setOpenOtp(true)
  };

  const emailOtpDone=()=>{
    setIsVerified(true)
    setOpenOtp(false)
    setTransferTab(0)
  }

  const answersDone=()=>{
    setAllQns(true)
    setTransferTab(0)
  }

  return (
    <View style={styles.container}>
        <VerifyEmail 
            visible={openOtp}
            onCancle={()=>setOpenOtp(false)}
            onOk={()=>emailOtpDone()}
        />
        {
            // transferTab === 0 &&(
            //     <FTransfer/>
            // )
            transferTab === 0 &&(
                <View style={{flex:1}}>
                    {
                        (isVerified && allQns)?
                        <FTransfer/>:
                        <View>
                            <Text style={styles.description}>
                                To safeguard your funds, it's essential to complete the verification of your BVN, confirm your email,
                                set up a withdrawal question and answer, and enter a verification code dispatched to your registered phone number.
                            </Text>

                            <TouchableOpacity style={styles.optionRow} onPress={()=>setTransferTab(1)}>
                                <MaterialIcons name="email" size={20} color="#666" />
                                <Text style={styles.optionText}>Verify Email</Text>
                                <Feather name="chevron-right" size={20} color="#999" style={styles.arrow} />
                            </TouchableOpacity>

                            <View style={styles.separator} />

                            <TouchableOpacity style={styles.optionRow} onPress={()=>setTransferTab(2)}>
                                <Feather name="help-circle" size={20} color="#666" />
                                <Text style={styles.optionText}>Withdrawal Questions & Answers</Text>
                                <Feather name="chevron-right" size={20} color="#999" style={styles.arrow} />
                            </TouchableOpacity>

                            <View style={styles.separator} />
                        </View>
                    }
                </View>
            )
                
            
        }

        {
            transferTab ===1 &&(
                <View>
                    <Text style={styles.title}>Verify Mail</Text>
                    <Text style={styles.subtitle}>
                        Enter your Email Address to verify your Account and have easy access to transfer to friends
                    </Text>

                    <TextInputField 
                        label='Ennter Address'
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Enter your Email Address"
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    {/* <TouchableOpacity style={styles.button} onPress={handleVerifyEmail}>
                        <Text style={styles.buttonText}>Verify Email</Text>
                    </TouchableOpacity> */}
                    <ModalBtn title='Verify Email' onPress={handleVerifyEmail}/>
                </View>
                
            )
        }
        {
            transferTab ===2 &&(
                <AddSecurityQuestion onAnswer={()=>answersDone()}/>
                
            )
        }
    </View>
  )
}

export default TransferToFriend

const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      padding: 20,
      backgroundColor: '#fff',
    },
    tabRow: {
      flexDirection: 'row',
      marginBottom: 20,
    },
    inactiveTab: {
      color: '#999',
      fontSize: 16,
      marginRight: 20,
    },
    activeTab: {
      color: '#2e7d32',
      fontSize: 16,
      fontWeight: 'bold',
      borderBottomWidth: 2,
      borderBottomColor: '#2e7d32',
      paddingBottom: 5,
    },
    description: {
      fontSize: 14,
      color: '#333',
      marginBottom: 30,
      lineHeight: 20,
    },
    optionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 15,
    },
    optionText: {
      flex: 1,
      fontSize: 16,
      marginLeft: 10,
      color: '#333',
    },
    arrow: {
      marginLeft: 'auto',
    },
    separator: {
      height: 1,
      backgroundColor: '#eee',
      marginLeft: 30,
    },

    title: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
      },
      subtitle: {
        fontSize: 12,
        color: '#555',
        marginBottom: 16,
      },
  });
  