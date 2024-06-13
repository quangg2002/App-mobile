import React, { Dispatch, SetStateAction } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { colors } from '@/theme';

interface InputProps {
  placeholder: string;
  value: string;
  onChangeText: Dispatch<SetStateAction<string>>;
  secureTextEntry?: boolean;
}

const Input = (props: InputProps) => {
  const { placeholder, value, onChangeText, secureTextEntry } = props;

  return (
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
      />
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    height: 48,
    borderColor: colors.black,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 22,
  },
  input: {
    width: '100%',
  },
});

export default Input;
