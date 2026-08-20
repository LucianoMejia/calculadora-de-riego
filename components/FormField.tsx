import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';

interface FormFieldProps extends Omit<TextInputProps, 'value' | 'onChangeText'> {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  unit?: string;
}

export function FormField({ label, value, onChangeText, unit, ...rest }: FormFieldProps) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>
        {label}
        {unit ? <Text style={styles.unit}>  {unit}</Text> : null}
      </Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        keyboardType="decimal-pad"
        placeholderTextColor="#B0B8C9"
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 16 },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: '#5A6178',
    marginBottom: 8,
  },
  unit: {
    fontWeight: '400',
    color: '#9BA3B5',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E4E7ED',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 16,
    color: '#1A1D26',
    backgroundColor: '#F7F8FA',
  },
});
