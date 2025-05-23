import React, { useEffect, useReducer, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Pressable,
  Alert,
  Platform,
} from 'react-native';
import TextInputField from '@/components/TextInputField';
import { router, Stack } from 'expo-router';
import { IEmail, IResponseData, IUser, IUserReducerAction } from '@/interfaces';
import { useSession } from '@/providers/SessionProvider';
import DateTimePicker from '@react-native-community/datetimepicker';
import { apiUpdateUser, apiVerifyEmail } from '@/services/AuthService';
import Toast from 'react-native-toast-message';
import useMutate from '@/hooks/useMutation';
import BackButton from '@/components/BackButton';

const genderOptions = ['Male', 'Female'];

const initialState: IUser = {
  phone_number: "",
  first_name: "",
  last_name: "",
  email: "",
  is_verified: false,
  dob: "",
  gender: "",
  profile_picture: "",
  wallet_balance: ""
}


const AccountInfoScreen = () => {
  const context = useSession()

  const [user, dispatch] = useReducer((state: IUser, action: IUserReducerAction) => {
      return { ...state, [action.type]: action.payload }
  }, initialState)

  useEffect(() => {
    dispatch({ type: "phone_number", payload: context.phone_number || "" })
    dispatch({ type: "first_name", payload: context.first_name || "" })
    dispatch({ type: "last_name", payload: context.last_name || "" })
    dispatch({ type: "email", payload: context.email || "" })
    dispatch({ type: "gender", payload: context.gender || "" })
    dispatch({ type: "profile_picture", payload: context.profile_picture || "" })
    dispatch({ type: "phone_number", payload: context.phone_number || "" })
    dispatch({ type: "dob", payload: context.dob || "" })
    dispatch({ type: "wallet_balance", payload: context.wallet_balance || "" })
},[context])


  // const [userInfo, setUserInfo] = useState({
  //   firstName: 'Adah',
  //   lastName: 'Jonathan',
  //   phoneNumber: '08082332823',
  //   email: 'jonathanadah11@gmail.com',
  //   dateOfBirth: '',
  //   gender: '',
  // });

  const [genderDropdownVisible, setGenderDropdownVisible] = useState(false);

  // const handleChange = (field: string, value: string) => {
  //   if (field === 'phoneNumber') {
  //     // Prevent input beyond 11 digits
  //     if (value.length > 11) return;
  //   }

  //   setUserInfo({ ...userInfo, [field]: value });
  // };

  const handleSave = () => {
    // console.log('Form Data:', userInfo);
    Alert.alert('Saved', 'Form data logged to console.');
    router.back();
  };

  const toggleGenderDropdown = () => {
    setGenderDropdownVisible(!genderDropdownVisible);
  };

  const selectGender = (option: string) => {
    // setUserInfo({ ...userInfo, gender: option });
    dispatch({ type: "gender", payload: option })
    setGenderDropdownVisible(false);
  };
  const [showDatePicker, setShowDatePicker] = useState(false);
  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      dispatch({ type: "dob", payload:  selectedDate.getFullYear() +  "-" + (selectedDate.getMonth() + 1).toString().padStart(2, '0') + "-" +  selectedDate.getDate().toString().padStart(2, '0')  })
    }
  };

  
  const updateUserMutation = useMutate<Partial<IUser>, any>(
    apiUpdateUser,
    {
      onSuccess: (data: IResponseData<IUser>) => {
          context.dispatch({ type: "LOGIN", payload: {
            access_token: context.access_token,
            refresh_token: context?.refresh_token,
            phone_number: data?.data?.phone_number,
            first_name: data?.data?.first_name,
            last_name: data?.data?.last_name,
            email: data?.data?.email,
            is_verified: data?.data?.is_verified,
            dob: data?.data?.dob,
            gender: data?.data?.gender,
            profile_picture: data?.data?.profile_picture,
            wallet_balance: data?.data?.wallet_balance,
          }})
          
          Toast.show({
            type: 'success',
            text1: 'User updated successfully.',
          });
          router.replace('/account')
      },
      onError: (error: any) => {
        console.log(error?.response?.data?.message || "Error updating user")
        Toast.show({
          type:'error',
          text1: 'Error updating user',
        });
      },
      // showErrorMessage: true,
      requireAuth: true
    }
  )

  const verifyEmail = useMutate<IEmail, any>(
    apiVerifyEmail,
    {
      onSuccess: (data: IResponseData<IUser>) => {
        // setVerifyModalOpen(true)
      },
      showErrorMessage: true,
      requireAuth: true
    }
  )

  const handleUserUpdate = () => {
    const { profile_picture, phone_number, ...data } = user
    if (!data?.dob) {
      return Toast.show({
        type:'info',
        text1: 'Date of Birth is required',
      });
    }
    if (!data?.gender) {
      return Toast.show({
        type:'info',
        text1: 'Gender is required',
      });
    }
    if (!data?.first_name) {
      return Toast.show({
        type:'info',
        text1: 'First Name is required',
      });
    }
    if (!data?.last_name) {
      return Toast.show({
        type:'info',
        text1: 'Last Name is required',
      })
    }
    if (!data?.email) {
      return Toast.show({
        type:'info',
        text1: 'Email is required',
      });
    }
    updateUserMutation.mutate(data)
  }

  const handleVerifyEmail = () => {
    if (user?.email != context?.email) {
        return Toast.show({
            type:'info',
            text1: 'Save Changes before verifying your email"',
        });
    }
    verifyEmail.mutate({
        email: user?.email
    })
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Account Info',
        }}
      />
      <ScrollView contentContainerStyle={styles.container}>
        {/* <BackButton label="Account Info" /> */}
        {/* <Text style={styles.title}></Text> */}
        <TextInputField
          label="First Name"
          // value={userInfo.firstName}
          // editable={false}
          value={user.first_name}
          onChangeText={(text) => dispatch({ type: "first_name", payload: text })}
        />
        <TextInputField
          label="Last Name"
          // value={userInfo.lastName}
          // editable={false}
          value={user.last_name}
          onChangeText={(text) => dispatch({ type: "last_name", payload: text })}
        />
        <TextInputField
          label="Phone Number"
          keyboardType='numeric'
          // value={userInfo.phoneNumber}
          // onChangeText={(text) => handleChange('phoneNumber', text)}
          // editable={false}
          value={user.phone_number}
          onChangeText={(text) => dispatch({ type: "phone_number", payload: text })}
        />

        <View style={styles.emailContainer}>
          <View style={{ flex: 1 }}>
            <TextInputField
              containerStyle={{
                marginBottom: 0,
              }}
              label="Email Address"
              editable={true}
              keyboardType={'email-address'}
              // value={userInfo.email}
              // onChangeText={(text) => handleChange('email', text)}
              value={user.email}
              onChangeText={(text) => dispatch({ type: "email", payload: text })}
            />
          </View>
          <Pressable style={styles.verifyButton} onPress={handleVerifyEmail}>
            <Text style={styles.verifyText}>Verify</Text>
          </Pressable>
        </View>
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 14,marginBottom: 6, color: '#333' }}>Date of Birth</Text>
          <TouchableOpacity 
            style={{
                height: 48,
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 8,
                paddingHorizontal: 12,
                backgroundColor: '#fff',
                // alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={{ }}>{user?.dob}</Text>
          </TouchableOpacity>
        </View>
        {showDatePicker && (
            <DateTimePicker
              value={new Date(user.dob)}
              mode="date"
              display={Platform.OS === 'ios' ? 'inline' : 'default'}
              onChange={handleDateChange}
            />
          )}
        {/* <TextInputField
          label="Date of Birth"
          placeholder="Select Date"
          // value={userInfo.dateOfBirth}
          // onChangeText={(text) => handleChange('dateOfBirth', text)}
          value={user.dob}
          onChangeText={(text) => dispatch({ type: "dob", payload: text })}
        /> */}

        {/* Custom Dropdown */}
        <View style={styles.dropdownContainer}>
          <Text style={styles.label}>Gender</Text>
          <TouchableOpacity onPress={toggleGenderDropdown} style={styles.dropdownButton}>
            <Text style={{ color: user.gender ? '#000' : '#999' }}>
              {user.gender || 'Select Gender'}
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

        <TouchableOpacity style={styles.saveButton} onPress={handleUserUpdate}>
          <Text style={styles.saveText}>Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>
    </>
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
    marginTop: 20,
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
    paddingVertical: 16,
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
