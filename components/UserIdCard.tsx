import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { Ionicons as Icon } from '@expo/vector-icons'; // Make sure to install this

const UserIdCard = () => {
  const [showBalance, setShowBalance] = useState(true);

  const toggleBalance = () => {
    setShowBalance(!showBalance);
  };

  return (
    <View style={styles.container}>
      <View style={styles.userImg} />

      <View>
        <Text style={styles.txtStyle}>08082332823</Text>

        <View style={styles.balanceContainer}>
          <Text style={[styles.txtStyle, { flex: 1 }]} numberOfLines={1} ellipsizeMode="tail">
            {showBalance ? 'NGN 2,800,400.00' : '****'}
          </Text>

          <TouchableOpacity onPress={toggleBalance}>
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
    gap: 4,
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
    width: 100,
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
});
