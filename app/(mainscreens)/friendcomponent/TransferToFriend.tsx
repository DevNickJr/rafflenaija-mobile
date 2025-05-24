import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import TextInputField from '@/components/TextInputField';
import ModalBtn from '@/components/ModalBtn';
import { useReducer, useState } from 'react';
import AddSecurityQuestion from './AddSecurity';
import FTransfer from './FTransfer';
import VerifyEmail from './VerifyEmail';
import { useSession } from '@/providers/SessionProvider';
import { apiGetRandomQuestion } from '@/services/WalletService';
import useFetch from '@/hooks/useFetch';
import { IEmail, IEmailAction, IResponseData } from '@/interfaces';
import { apiVerifyEmail } from '@/services/AuthService';
import useMutate from '@/hooks/useMutation';
import Toast from 'react-native-toast-message';
import VerifyAccountEmail from '@/components/VerifyAccountEmail';

const initialState: IEmail = {
  email: ""
}
const TransferToFriend = () => {
  const context = useSession()

  const [email, setEmail] = useState('');
  const [transferTab, setTransferTab] = useState(0);

  const [user, dispatch] = useReducer((state: IEmail, action: IEmailAction) => {
    if (action.type == "reset") {
        return initialState
    }
    return { ...state, [action.type]: action.payload }
}, initialState)

  
  const { data: question, isLoading } = useFetch<IResponseData<string[]>>({
    api: apiGetRandomQuestion,
    key: ["random-question"],
    requireAuth: true
  })


  const answersDone = () => {
    setTransferTab(0);
  };
  const [verifyModalisOpen, setVerifyModalOpen] = useState(false)

  
  const verifyEmail = useMutate<IEmail, any>(
    apiVerifyEmail,
    {
      onSuccess: (data: IResponseData<"">) => {
        setVerifyModalOpen(true)
      },
      showErrorMessage: true,
      requireAuth: true
    }
  )


  const handleVerifyEmail = () => {
    if (!user.email) {
        return Toast.show({
            type: "error",
            text1: "Input Email"
        })
    }
    verifyEmail.mutate({
        email: user?.email
    })
  }

  return (
    <View style={styles.container}>
      <VerifyAccountEmail
        visible={verifyModalisOpen}
        onClose={() => setVerifyModalOpen(false)}
        onOk={() => setVerifyModalOpen(false)}
      />
      {
        // transferTab === 0 &&(
        //     <FTransfer/>
        // )
        transferTab === 0 && (
          <View style={{ flex: 1 }}>
            {(context?.is_verified) && question ? (
              <FTransfer />
            ) : (
              <View>
                <Text style={styles.description}>
                  To safeguard your funds, it's essential to complete the verification of your BVN,
                  confirm your email, set up a withdrawal question and answer, and enter a
                  verification code dispatched to your registered phone number.
                </Text>
                {
                  !context?.is_verified &&
                  <>
                    <TouchableOpacity style={styles.optionRow} onPress={() => setTransferTab(1)}>
                      <MaterialIcons name="email" size={20} color="#666" />
                      <Text style={styles.optionText}>Verify Email</Text>
                      <Feather name="chevron-right" size={20} color="#999" style={styles.arrow} />
                    </TouchableOpacity>

                    <View style={styles.separator} />
                  </>
                }
                {
                  !question &&
                  <>
                    <TouchableOpacity style={styles.optionRow} onPress={() => setTransferTab(2)}>
                      <Feather name="help-circle" size={20} color="#666" />
                      <Text style={styles.optionText}>Withdrawal Questions & Answers</Text>
                      <Feather name="chevron-right" size={20} color="#999" style={styles.arrow} />
                    </TouchableOpacity>
                    <View style={styles.separator} />
                  </>
                }

              </View>
            )}
          </View>
        )
      }

      {transferTab === 1 && (
        <View>
          <Text style={styles.title}>Verify Mail</Text>
          <Text style={styles.subtitle}>
            Enter your Email Address to verify your Account and have easy access to transfer to
            friends
          </Text>

          <TextInputField
            label="Ennter Address"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your Email Address"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {/* <TouchableOpacity style={styles.button} onPress={handleVerifyEmail}>
                        <Text style={styles.buttonText}>Verify Email</Text>
                    </TouchableOpacity> */}
          <ModalBtn title="Verify Email" onPress={handleVerifyEmail} />
        </View>
      )}
      {transferTab === 2 && <AddSecurityQuestion onAnswer={() => answersDone()} />}
    </View>
  );
};

export default TransferToFriend;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    // padding: 20,
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
