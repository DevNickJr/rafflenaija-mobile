import React from 'react';
import { Text, TextInput, View, StyleSheet, KeyboardTypeOptions } from 'react-native';

type NumberInputProps = {
  label: string;
  value: string;
  onChange: (text: string) => void;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
};

const NumberInput: React.FC<NumberInputProps> = ({
  label,
  value,
  onChange,
  placeholder = 'Enter Number',
  keyboardType = 'numeric',
}) => {
  const handleChange = (text: string) => {
    const numericText = text.replace(/[^0-9]/g, ''); // remove all non-digits
    onChange(numericText);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        keyboardType={keyboardType}
        value={value}
        onChangeText={handleChange}
        placeholder={placeholder}
        placeholderTextColor="#999"
      />
    </View>
  );
};

export default NumberInput;

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 6,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
});
