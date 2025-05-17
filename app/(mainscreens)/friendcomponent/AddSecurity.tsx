import DropDownScroll from '@/components/DropDownScroll';
import React, { useReducer, useState } from 'react';
import { Alert } from 'react-native';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  GestureResponderEvent,
} from 'react-native';

interface ISecurityQuestion {
  security_question: string;
  security_answer: string;
}

interface ISecurityQuestions {
  security_questions: string[];
  security_answers: string[];
}

interface ISecurityQuestionAction {
  type: keyof ISecurityQuestion | 'reset';
  payload: string;
}

const initialState: ISecurityQuestion = {
  security_question: '',
  security_answer: '',
};

type Props = {
  onAnswer: ((value?: string) => void) | undefined;
};
const AddSecurityQuestion = ({ onAnswer }: Props) => {
  const [security, setSecurity] = useState<ISecurityQuestions>({
    security_questions: [],
    security_answers: [],
  });

  const [loading, setLoading] = useState(false);
  const [questions] = useState<string[]>([
    'What is your pet’s name?',
    'What is your mother’s maiden name?',
    'What city were you born in?',
  ]);

  const [user, dispatch] = useReducer(
    (state: ISecurityQuestion, action: ISecurityQuestionAction) => {
      if (action.type === 'reset') return initialState;
      return { ...state, [action.type]: action.payload };
    },
    initialState,
  );

  const [currentQsn, setCurrentQsn] = useState('');

  const handleAdd = () => {
    if (security.security_questions.length >= 3) return;

    setCurrentQsn('');
    setSecurity((prev) => ({
      security_questions: [...prev.security_questions, user.security_question],
      security_answers: [...prev.security_answers, user.security_answer],
    }));

    dispatch({ type: 'reset', payload: '' });
  };

  const handleSubmit = () => {
    // Hanndle Submit Logic
    if (security.security_questions.length < 3) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Security Questions Submitted Successfully', '', [
        { text: 'OK', onPress: onAnswer },
      ]);
    }, 2000);
  };

  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator size="large" color="#000" />}
      <Text style={styles.header}>Set Withdrawal Question & Answer</Text>
      <Text style={styles.subText}>
        Enter a question and Answer that you can always remember and is also unique to you. A total
        of 3 questions and answers is required
      </Text>

      <DropDownScroll
        label="Withdrawal Question"
        options={questions}
        value={currentQsn}
        onSelect={(value) => {
          setCurrentQsn(value);
          dispatch({ type: 'security_question', payload: value });
        }}
      />

      {/* <Text style={{fontSize:18, fontWeight:"600", marginVertical:6}}>{currentQsn}</Text> */}

      <Text style={styles.label}>Withdrawal Answer</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter a unique response"
        value={user.security_answer}
        onChangeText={(text) => dispatch({ type: 'security_answer', payload: text })}
      />

      <View style={styles.progressContainer}>
        {[0, 1, 2].map((i) => (
          <View
            key={i}
            style={[
              styles.progressCircle,
              security.security_questions.length > i && styles.progressActive,
            ]}>
            <Text
              style={
                security.security_questions.length > i ? styles.activeText : styles.inactiveText
              }>
              {i + 1}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleAdd} style={styles.button}>
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleSubmit}
          style={[styles.button, security.security_questions.length < 3 && styles.buttonDisabled]}
          disabled={security.security_questions.length < 3}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AddSecurityQuestion;

const styles = StyleSheet.create({
  container: {
    // padding: 20,
    // maxWidth: 400,
    // alignSelf: 'center'
  },
  header: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
  },
  subText: {
    fontSize: 12,
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    marginVertical: 4,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  pickerWrapper: {
    // borderWidth: 1,
    // borderRadius: 8,
    // marginBottom: 16,
    // overflow: 'hidden'
  },
  picker: {
    height: 50,
    width: '100%',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginVertical: 16,
  },
  progressCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressActive: {
    backgroundColor: '#007bff',
  },
  activeText: {
    color: '#fff',
  },
  inactiveText: {
    color: '#000',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: '#007bff',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
  },
});
