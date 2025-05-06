import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Alert,
} from 'react-native';

const ChangePasswordSection = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleSave = () => {
    console.log('Old Password:', oldPassword);
    console.log('New Password:', newPassword);
    Alert.alert('Saved', 'Password change data logged to console.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Old Password</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        placeholder="Enter old password"
        value={oldPassword}
        onChangeText={setOldPassword}
      />

      <Text style={styles.label}>New Password</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        placeholder="Enter new password"
        value={newPassword}
        onChangeText={setNewPassword}
      />

      <Pressable onPress={() => Alert.alert('Forgot Password')} style={{width:120, alignSelf:"flex-end"}}>
        <Text style={styles.forgotText}>Forgot Password?</Text>
      </Pressable>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveText}>Save</Text>
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
