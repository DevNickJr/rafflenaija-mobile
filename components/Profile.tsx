import {
    StyleSheet,
    View,
    Image,
  } from 'react-native';
  import React from 'react';
  import UserIdCard from '@/components/UserIdCard';


const Profile = () => {
   
    return (    
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 20 }}>
            <Image source={require('@/assets/images/homelogo.png')} style={{ width: 40, height: 40 }} />
            <UserIdCard />
        </View>
    )
};

export default Profile;
