import { Colors } from '@/constants/Colors';
import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';

interface LinkProps {
  label: string;
  onPress: () => void;
}

const AuthLink: React.FC<LinkProps> = ({ label, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text style={styles.linkText}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  linkText: {
    fontSize: 12,
    color: Colors.light.primary,
    fontWeight: 'bold',
  },
});

export default AuthLink;
