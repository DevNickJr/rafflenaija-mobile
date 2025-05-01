import React, { useState } from 'react';
import { TextInput, TouchableOpacity, Pressable, Text } from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useSession } from '@/providers/SessionProvider';

export default function LoginScreen() {
  const {signIn} = useSession();
  const [showPassword, setShowPassword] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');



  return (
    <ThemedView className="flex flex-1 justify-center px-6 py-10 bg-white">
      {/* Header */}
      <ThemedView className="flex-row justify-between items-center mb-6">
        <ThemedText type="title" className="text-4xl font-bold">
          Login
        </ThemedText>
        <Pressable>
          <AntDesign name="close" size={24} color="black" />
        </Pressable>
      </ThemedView>

      {/* Subtext */}
      <ThemedText className="text-xs max-w-[280px] mb-8">
        Please enter your credentials to access your account and stand a chance to win items.
      </ThemedText>

      {/* Form */}
      <ThemedView className="flex gap-6">
        {/* Phone Number */}
        <ThemedView className="flex flex-col gap-2">
          <ThemedText className="text-sm">Phone Number</ThemedText>
          <TextInput
            className="p-4 w-full text-sm rounded-full border border-gray-300"
            placeholder="09012345678"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholderTextColor="#999"
          />
        </ThemedView>

        {/* Password */}
        <ThemedView className="flex flex-col gap-2">
          <ThemedText className="text-sm">Password</ThemedText>
          <ThemedView className="relative w-full">
            <TextInput
              className="p-4 pr-12 w-full text-sm rounded-full border border-gray-300"
              placeholder="Enter your password"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              placeholderTextColor="#999"
            />
            <Pressable
              onPress={() => setShowPassword(!showPassword)}
              className="absolute top-4 right-4">
              {showPassword ? (
                <Ionicons name="eye-off" size={24} color="black" />
              ) : (
                <Ionicons name="eye" size={24} color="black" />
              )}
            </Pressable>
          </ThemedView>
        </ThemedView>

        {/* Remember me and Forgot Password */}
        <ThemedView className="flex-row justify-between items-center mt-2">
          <ThemedView className="flex-row items-center space-x-2">
            <ThemedView className="w-4 h-4 rounded border border-gray-400" />
            <ThemedText className="text-sm">Remember me</ThemedText>
          </ThemedView>
          <TouchableOpacity>
            <ThemedText className="text-sm font-bold text-primary">Forgot Password?</ThemedText>
          </TouchableOpacity>
        </ThemedView>

        <TouchableOpacity>
          <Text>Login</Text>
        </TouchableOpacity>

        {/* Login Button */}
        <TouchableOpacity 
        onPress={()=>signIn()}
        className="p-4 mt-6 rounded-full bg-primary">
          <ThemedText className="font-bold text-center text-white">Login</ThemedText>
        </TouchableOpacity>

        {/* Signup Link */}
        <TouchableOpacity className="mt-6" >
          <ThemedText className="text-sm text-center">
            Not Registered yet?.
            <ThemedText className="font-bold text-primary">Create an Account</ThemedText>
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
}
