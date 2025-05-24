import useMutate from '@/hooks/useMutation';
import { IUpdatePassword, IUpdatePasswordReducerAction } from '@/interfaces';
import { apiUpdatePassword } from '@/services/AuthService';
import React, { useReducer, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Alert,
} from 'react-native';
import Toast from 'react-native-toast-message';


const initialState: IUpdatePassword = {
  old_password: "",
  new_password: "",
}

const ChangePasswordSection = () => {
  const [user, dispatch] = useReducer((state: IUpdatePassword, action: IUpdatePasswordReducerAction) => {
    if (action.type === "reset") {
      return initialState
    }
    return { ...state, [action.type]: action.payload }
}, initialState)

const updatePasswordMutation = useMutate<IUpdatePassword, any>(
    apiUpdatePassword,
    {
      onSuccess: () => {
        //   console.log("new data", data)
        dispatch({ type: "old_password", payload: "" })
        dispatch({ type: "new_password", payload: "" })
        Toast.show({
          type: 'success',
          text1: "Password updated successfully"
        })
      },
      showErrorMessage: true,
      requireAuth: true
    }
  )

  const handlePasswordUpdate = () => {
    if (!user.old_password) {
        return Toast.show({
          type: 'success',
          text1: "Old password is required"
        })
    }
    if (!user.new_password) {
        return Toast.show({
          type: 'success',
          text1: "New password is required"
        })
    }
    updatePasswordMutation.mutate(user)
  }

  // const [oldPassword, setOldPassword] = useState('');
  // const [newPassword, setNewPassword] = useState('');

  // const handleSave = () => {
  //   console.log('Old Password:', oldPassword);
  //   console.log('New Password:', newPassword);
  //   Alert.alert('Saved', 'Password change data logged to console.');
  // };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Old Password</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        placeholder="Enter old password"
        value={user.old_password}
        onChangeText={(value) => dispatch({ type: "old_password", payload: value })} 
      />

      <Text style={styles.label}>New Password</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        placeholder="Enter new password"
        value={user.new_password}
        onChangeText={(value) => dispatch({ type: "new_password", payload: value })} 
      />
      {/* <Pressable
        onPress={() => Alert.alert('Forgot Password')}
        style={{ width: 120, alignSelf: 'flex-end' }}>
        <Text style={styles.forgotText}>Forgot Password?</Text>
      </Pressable> */}
      <TouchableOpacity style={styles.saveButton} onPress={handlePasswordUpdate}>
        <Text style={styles.saveText}>{updatePasswordMutation?.isPending ? "Saving.." : "Save"}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ChangePasswordSection;

const styles = StyleSheet.create({
  container: {
    gap: 16,
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  forgotText: {
    color: 'green',
    textAlign: 'right',
    marginTop: 6,
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: 'green',
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
