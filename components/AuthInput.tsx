import React, { useState } from 'react';
import { TextInput, View, StyleSheet, TouchableOpacity, TextInputProps } from 'react-native';
import { Ionicons as Icon } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

interface InputFieldProps extends TextInputProps {
  icon: keyof typeof Icon.glyphMap;
  placeholder: string;
  secureTextEntry?: boolean;
  numbersOnly?: boolean; // ✅ New prop to enforce numeric-only input
}

const InputField: React.FC<InputFieldProps> = ({
  icon,
  placeholder,
  secureTextEntry = false,
  numbersOnly = false,
  onChangeText,
  ...props
}) => {
  const [isPasswordVisible, setPasswordVisible] = useState(!secureTextEntry);

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  const handleChangeText = (text: string) => {
    const value = numbersOnly ? text.replace(/[^0-9]/g, '') : text;
    onChangeText?.(value);
  };

  return (
    <View style={styles.inputContainer}>
      <Icon name={icon} size={20} color="#999" />
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#999"
        secureTextEntry={!isPasswordVisible && secureTextEntry}
        style={styles.input}
        keyboardType={numbersOnly ? 'numeric' : props.keyboardType}
        onChangeText={handleChangeText}
        {...props}
      />
      {secureTextEntry && (
        <TouchableOpacity onPress={togglePasswordVisibility}>
          <Icon
            name={isPasswordVisible ? 'eye-outline' : 'eye-off-outline'}
            size={20}
            color="#999"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: Colors.light.primary,
    borderBottomWidth: 1,
    paddingVertical: 5,
  },
  input: {
    flex: 1,
    marginHorizontal: 10,
    fontSize: 16,
    color: '#333',
  },
});

export default InputField;
