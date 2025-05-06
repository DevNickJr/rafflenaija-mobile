// components/BackButton.tsx
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';

export default function BackButton() {
  const router = useRouter();

  return (
    <TouchableOpacity onPress={() => router.back()} style={{ paddingHorizontal: 10 }}>
      <Ionicons name="chevron-back" size={24} color="black" />
    </TouchableOpacity>
  );
}
