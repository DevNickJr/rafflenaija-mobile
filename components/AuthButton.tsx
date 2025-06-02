import { Colors } from '@/constants/Colors';
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'outline' | 'solid';
  buttonStyle?: StyleProp<ViewStyle>;
  buttonTextStyle?: StyleProp<TextStyle>;
}

const AuthButton: React.FC<ButtonProps> = ({
  title,
  onPress,
  disabled = false,
  variant = 'solid',
  buttonStyle={},
  buttonTextStyle,
}) => {
  const isOutline = variant === 'outline';

  return (
    <TouchableOpacity
      style={[
        styles.button,
        isOutline ? styles.outline : styles.solid,
        disabled && styles.disabled,
        buttonStyle,
      ]}
      onPress={onPress}
      disabled={disabled}>
      <Text
        style={[
          styles.buttonText,
          isOutline ? styles.outlineText : {},
          disabled && styles.disabledText,
          buttonTextStyle,
        ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 12,
  },
  solid: {
    backgroundColor: Colors.light.primary,
  },
  outline: {
    borderWidth: 1,
    borderColor: Colors.light.primary,
    backgroundColor: 'transparent',
  },
  disabled: {
    backgroundColor: '#ccc',
    borderColor: '#ccc',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  outlineText: {
    color: Colors.light.primary,
  },
  disabledText: {
    color: '#888',
  },
});

export default AuthButton;
