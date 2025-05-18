import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
import { Ionicons as Icon } from '@expo/vector-icons'; // Make sure to install this
import { useSession } from '@/providers/SessionProvider';

const UserIdCard = () => {
  const context = useSession()

  const [showBalance, setShowBalance] = useState(false);

  const toggleBalance = () => {
    
  };

  return (
    <View style={styles.container}>
      <Image  style={styles.userImg} src={context?.profile_picture || ''} />
      <View>
        <Text style={styles.txtStyle}>{context?.phone_number}</Text>

        <View style={styles.balanceContainer}>
          <Text style={[styles.txtStyle, { flex: 1 }]} numberOfLines={1} ellipsizeMode="tail">
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
