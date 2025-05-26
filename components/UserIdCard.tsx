import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
import { Ionicons as Icon } from '@expo/vector-icons'; // Make sure to install this
import { useSession } from '@/providers/SessionProvider';
import { apiUpdatePic } from '@/services/AuthService';
import useMutate from '@/hooks/useMutation';
import { IPic, IResponseData, IUser } from '@/interfaces';
import Toast from 'react-native-toast-message';
import * as ImagePicker from 'expo-image-picker';

const UserIdCard = () => {
  const context = useSession()
  const updatePicMutation = useMutate<IPic, any>(
      apiUpdatePic,
      {
        onSuccess: (data: IResponseData<IUser>) => {
            context.dispatch({ type: "LOGIN", payload: {
              access_token: context.access_token,
              refresh_token: context?.refresh_token,
              phone_number: context.phone_number,
              first_name: context.first_name,
              last_name: context.last_name,
              email: context.email,
              is_verified: context.is_verified,
              dob: context.dob,
              gender: context.gender,
              wallet_balance: context?.wallet_balance,
              profile_picture: data?.data?.profile_picture,
            }})
            
            Toast.show({
                type: "success",
                text1: "Profile Pic updated successfully."
              })
        },
        showErrorMessage: true,
        requireAuth: true
      }
    )

    const handlePicUpdate = (image: string) => {
      if (!image) {
          return Toast.show({
              type: "info",
              text1: "Select an Image to Upload"
          })
      }
      // create file from image
      const file = {
          uri: image,
          type: 'image/jpeg',
          name: 'profile_picture.jpg'
      } as unknown as File

      updatePicMutation.mutate({
          profile_picture: file
      })
    }
  //   const imageRef = useRef<HTMLInputElement | null>(null)
  
  const pickImage = async () => {
      // No permissions request is necessary for launching the image library
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      console.log(result);
  
      if (!result.canceled) {
          handlePicUpdate(result.assets[0].uri);
      }
    };
  

  const [showBalance, setShowBalance] = useState(false);


  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={pickImage}>
        <Image  style={styles.userImg} src={context?.profile_picture || ''} />
      </TouchableOpacity>
      <View>
        <Text style={styles.txtStyle}>{context?.phone_number}</Text>

        <View style={styles.balanceContainer}>
          <Text style={[styles.txtStyle, showBalance?undefined: { flex: 1 }]} numberOfLines={1} ellipsizeMode="tail">
            {showBalance ? 
            <>
            NGN {context?.wallet_balance}
            </>
            : 
            '****'}
          </Text>

          <TouchableOpacity onPress={() => setShowBalance(prev => !prev)}>
            <Icon name={showBalance ? 'eye' : 'eye-off'} size={16} color="#000" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default UserIdCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    // backgroundColor: 'gray',
    padding: 8,
  },
  userImg: {
    width: 40,
    height: 40,
    backgroundColor: '#c0c0c0',
    borderRadius: 30,
  },
  txtStyle: {
    fontSize: 12,
    // width: 100,
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
    minWidth: 62,
  },
});
