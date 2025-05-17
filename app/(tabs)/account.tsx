// screens/AccountScreen.tsx
import React, { ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesome5, MaterialIcons, Ionicons, Entypo } from '@expo/vector-icons';
import { useSession } from '@/providers/SessionProvider';
import { Href, router } from 'expo-router';

type MenuItem = {
  title: string;
  icon: ReactNode; // because you're passing JSX elements like <FontAwesome5 ... />
  href?: Href;
};

const menuItems: MenuItem[] = [
  {
    title: 'Account Info',
    icon: <FontAwesome5 name="user" size={20} color="#333" />,
    href: '/(mainscreens)/AccountInfo',
  },
  {
    title: 'Deposit',
    icon: <FontAwesome5 name="wallet" size={20} color="#333" />,
    href: '/(mainscreens)/Deposit',
  },
  {
    title: 'Withdraw',
    icon: <FontAwesome5 name="money-bill-wave" size={20} color="#333" />,
    href: '/(mainscreens)/Withdraw',
  },
  { title: 'Games History', icon: <MaterialIcons name="history" size={20} color="#333" /> },
  { title: 'Transactions', icon: <FontAwesome5 name="receipt" size={20} color="#333" /> },
  {
    title: 'Safety & Security',
    icon: <Ionicons name="shield-checkmark" size={20} color="#333" />,
    href: '/(mainscreens)/SafetySecurity',
  },
  {
    title: 'Log Out',
    icon: <Entypo name="log-out" size={20} color="#E53935" />,
    href: '/(auth)/login',
  },
];

const Account = () => {
  const { signOut } = useSession();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileHeader}>
        <Text style={styles.headerText}>Account</Text>
      </View>
      <View style={styles.menuContainer}>
        {menuItems.map((item, idx) => (
          <TouchableOpacity
            key={idx}
            style={[styles.menuItem, idx !== menuItems.length - 1 && styles.menuItemSeparator]}
            onPress={async () => {
              if (item.title === 'Log Out' && item.href) {
                signOut();
                await SecureStore.deleteItemAsync('NAVIGATION_STATE');
                router.replace(item.href);
              } else if (item.href) {
                router.push(item.href);
              }
            }}>
            <View style={styles.iconWrapper}>{item.icon}</View>
            <Text style={[styles.menuText, item.title === 'Log Out' && { color: '#E53935' }]}>
              {item.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

export default Account;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f7f9',
  },
  profileHeader: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  iconWrapper: {
    width: 30,
    alignItems: 'center',
  },
  menuText: {
    fontSize: 16,
    marginLeft: 20,
    color: '#333',
    fontWeight: '500',
  },

  menuContainer: {
    marginTop: 20,
    backgroundColor: '#fff',
    marginHorizontal: 15,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },

  menuItemSeparator: {
    borderBottomColor: '#ccc',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
