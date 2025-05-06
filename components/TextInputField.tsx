import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';

type Props = TextInputProps & {
  label: string;
  editable?: boolean;
};

const TextInputField: React.FC<Props> = ({ label, editable = true, ...rest }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, !editable && styles.disabled]}
        editable={editable}
        placeholderTextColor="#999"
        {...rest}
      />
    </View>
  );
};

export default TextInputField;

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    color: '#333',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  disabled: {
    backgroundColor: '#f0f0f0',
    color: '#999',
  },
});
