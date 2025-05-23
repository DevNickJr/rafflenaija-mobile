// components/BackButton.tsx
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';

export default function BackButton({
  label
}: {
  label: string
}) {
  const router = useRouter();

  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      // marginHorizontal: 24,
    }}>
      <TouchableOpacity onPress={() => router.back()} style={{  }}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <Text style={{
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 24,
        color: '#000',
      }}>{label}</Text>
    </View>
  );
}
