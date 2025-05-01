import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface CheckboxProps {
  label: string;
}

const Checkbox: React.FC<CheckboxProps> = ({ label }) => {
  return (
    <View style={styles.rememberMe}>
      <View style={styles.checkbox} />
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
    width: 16,
    height: 16,
    borderWidth: 1,
    borderColor: '#fa6c6c',
    marginRight: 6,
  },
  rememberText: {
    fontSize: 12,
    color: '#333',
  },
});

export default Checkbox;
