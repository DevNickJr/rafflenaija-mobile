import { GestureResponderEvent, StyleSheet, Text, TouchableOpacity } from 'react-native';
import React from 'react';

type Props = {
  title: string;
  inverted?: boolean;
  onPress?: ((event: GestureResponderEvent) => void) | undefined;
};

const ModalBtn = ({ onPress, title, inverted = false }: Props) => {
  return (
    <TouchableOpacity
      style={[
        styles.optButton,
        inverted && { backgroundColor: 'transparent', borderWidth: 1, borderColor: 'green' },
      ]}
      onPress={onPress}>
      <Text style={{ color: inverted ? 'green' : 'white' }}>{title}</Text>
    </TouchableOpacity>
  );
};

export default ModalBtn;

const styles = StyleSheet.create({
  optButton: {
    backgroundColor: 'green',
    width: '30%',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 20,
  },
});
