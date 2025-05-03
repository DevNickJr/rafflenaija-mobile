import {Checkbox as Checkbox1} from 'expo-checkbox';
import { Colors } from '@/constants/Colors';
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
interface CheckboxProps {
  label: string;
  isChecked:boolean;
  setChecked?: ((value: boolean) => void) | undefined
}

const Checkbox: React.FC<CheckboxProps> = ({ label,  isChecked=false, setChecked }) => {
  
  return (
    <View style={styles.rememberMe}>
      <Checkbox1
          style={styles.checkbox}
          value={isChecked}
          onValueChange={setChecked}
          color={isChecked ? Colors.light.primary : undefined}
        />
      <Text style={styles.rememberText}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  rememberMe: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    // width: 16,
    // height: 16,
    // borderWidth: 1,
    borderColor: Colors.light.primary,
    marginRight: 6,
  },
  rememberText: {
    fontSize: 12,
    color: '#333',
  },
});

export default Checkbox;
