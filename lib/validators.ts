import { Alert } from 'react-native';

type ValidationRule = {
  field: string;
  value: number | null | undefined;
  test: (v: number) => boolean;
  msg: string;
};

export function validate(fields: ValidationRule[]): boolean {
  for (const f of fields) {
    if (f.value == null || isNaN(f.value)) {
      Alert.alert('Campo requerido', `Ingresa un valor válido para "${f.field}".`);
      return false;
    }
    if (!f.test(f.value)) {
      Alert.alert('Valor inválido', f.msg);
      return false;
    }
  }
  return true;
}
