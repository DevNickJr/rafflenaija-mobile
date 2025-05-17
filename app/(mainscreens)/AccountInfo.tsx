import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import TextInputField from '@/components/TextInputField';
import { router } from 'expo-router';

const genderOptions = ['Male', 'Female'];

const AccountInfoScreen = () => {
  const [userInfo, setUserInfo] = useState({
    firstName: 'Adah',
    lastName: 'Jonathan',
    phoneNumber: '08082332823',
    email: 'jonathanadah11@gmail.com',
    dateOfBirth: '',
    gender: '',
  });

  const [genderDropdownVisible, setGenderDropdownVisible] = useState(false);

  const handleChange = (field: string, value: string) => {
    if (field === 'phoneNumber') {
      // Prevent input beyond 11 digits
      if (value.length > 11) return;
    }

    setUserInfo({ ...userInfo, [field]: value });
  };

  const handleSave = () => {
    console.log('Form Data:', userInfo);
    Alert.alert('Saved', 'Form data logged to console.');
    router.back();
  };

  const toggleGenderDropdown = () => {
    setGenderDropdownVisible(!genderDropdownVisible);
  };

  const selectGender = (option: string) => {
    setUserInfo({ ...userInfo, gender: option });
    setGenderDropdownVisible(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Account Info</Text>

      <TextInputField label="First Name" value={userInfo.firstName} editable={false} />
      <TextInputField label="Last Name" value={userInfo.lastName} editable={false} />
      <TextInputField
        label="Phone Number"
        value={userInfo.phoneNumber}
        onChangeText={(text) => handleChange('phoneNumber', text)}
        editable={false}
      />

      <View style={styles.emailContainer}>
        <View style={{ flex: 1 }}>
          <TextInputField
            label="Email Address"
            value={userInfo.email}
            editable={true}
            onChangeText={(text) => handleChange('email', text)}
          />
        </View>
        <Pressable style={styles.verifyButton}>
          <Text style={styles.verifyText}>Verify</Text>
        </Pressable>
      </View>

      <TextInputField
        label="Date of Birth"
        placeholder="Select Date"
        value={userInfo.dateOfBirth}
        onChangeText={(text) => handleChange('dateOfBirth', text)}
      />

      {/* Custom Dropdown */}
      <View style={styles.dropdownContainer}>
        <Text style={styles.label}>Gender</Text>
        <TouchableOpacity onPress={toggleGenderDropdown} style={styles.dropdownButton}>
          <Text style={{ color: userInfo.gender ? '#000' : '#999' }}>
            {userInfo.gender || 'Select Gender'}
          </Text>
        </TouchableOpacity>

        {genderDropdownVisible && (
          <View style={styles.dropdownOptions}>
            {genderOptions.map((option) => (
              <TouchableOpacity
                key={option}
                onPress={() => selectGender(option)}
                style={styles.dropdownItem}>
                <Text style={styles.dropdownItemText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveText}>Save Changes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AccountInfoScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 24,
    color: '#000',
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  verifyButton: {
    marginLeft: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#e6f4ea',
    borderRadius: 8,
  },
  verifyText: {
    color: 'green',
    fontWeight: '500',
  },
  dropdownContainer: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 6,
    fontSize: 14,
    color: '#000',
  },
  dropdownButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    justifyContent: 'center',
  },
  dropdownOptions: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginTop: 6,
    backgroundColor: '#fff',
    elevation: 3,
    zIndex: 999,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  dropdownItemText: {
    color: '#000',
    fontSize: 16,
  },
  saveButton: {
    marginTop: 24,
    backgroundColor: 'green',
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
