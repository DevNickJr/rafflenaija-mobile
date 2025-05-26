// screens/AccountScreen.tsx
import React, { ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesome5, MaterialIcons, Ionicons, Entypo } from '@expo/vector-icons';
import { useSession } from '@/providers/SessionProvider';
import { Href, router } from 'expo-router';
import { SafeView } from '@/components/SafeView';
import AccountUser from '@/components/AccountUser';
import { StatusBar } from 'expo-status-bar';

type MenuItem = {
  title: string;
  icon: ReactNode;
  href?: Href;
};

const topMenuItems: MenuItem[] = [
  { title: 'Account Info', icon: <FontAwesome5 name="user" size={20} color="#333" />, href:"/(mainscreens)/AccountInfo" },
  { title: 'Deposit', icon: <FontAwesome5 name="wallet" size={20} color="#333" />, href:"/(mainscreens)/Deposit" },
  { title: 'Withdraw', icon: <FontAwesome5 name="money-bill-wave" size={20} color="#333" />, href:"/(mainscreens)/Withdraw" },
  { title: 'Games Results', icon: <MaterialIcons name="history" size={20} color="#333" /> , href:"/(mainscreens)/GameResult"},
  { title: 'Transactions', icon: <FontAwesome5 name="receipt" size={20} color="#333" />, href:"/(mainscreens)/Transaction" },
  { title: 'Referrals', icon: <Ionicons name="people" size={20} color="#333" />, href:"/(mainscreens)/Referral" },
];

const bottomMenuItems: MenuItem[] = [
  { title: 'Safety & Security', icon: <Ionicons name="shield-checkmark" size={20} color="#333" />, href:"/(mainscreens)/SafetySecurity" },
  { title: 'Log Out', icon: <Entypo name="log-out" size={20} color="#E53935" />, href:"/(auth)/login"},
];

const Account = () => {
  const { signOut } = useSession();

  const handlePress = async (item: MenuItem) => {
    if (item.title === 'Log Out') {
      signOut();
      await SecureStore.deleteItemAsync('NAVIGATION_STATE');
      router.replace("/(auth)/login");
    } else if (item.href) {
      router.push(item.href);
    }
  };

  // <SafeAreaView style={[styles.container,{paddingTop:Platform.OS==="android"?40:0}]}>
  return (
    <SafeView>
      <ScrollView style={{
        flexGrow: 1,
      }}>
        <AccountUser />

        <View style={styles.contentContainer}>
          <View style={styles.topMenuContainer}>
            {topMenuItems.map((item, idx) => (
              <TouchableOpacity
                key={idx}
                style={[styles.menuItem, idx != topMenuItems?.length-1 && styles.menuItemSeparator]}
                onPress={() => handlePress(item)}
              >
                <View style={styles.iconWrapper}>{item.icon}</View>
                <Text style={styles.menuText}>{item.title}</Text>

                <View style={{flex:1, alignItems:"flex-end"}}>
                  <MaterialIcons name="arrow-forward-ios" size={24} color="gray" />
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <View style={{
            ...styles.topMenuContainer,
              marginTop: 30,
          }}>
            {bottomMenuItems.map((item, idx) => (
              <TouchableOpacity
                key={idx}
                style={[styles.menuItem, idx != bottomMenuItems?.length-1 && styles.menuItemSeparator]}
                onPress={() => handlePress(item)}
              >
                <View style={styles.iconWrapper}>{item.icon}</View>
                <Text style={[styles.menuText, item.title === 'Log Out' && { color: '#E53935' }]}>
                  {item.title}
                </Text>

                <View style={{flex:1, alignItems:"flex-end"}}>
                  <MaterialIcons name="arrow-forward-ios" size={24} color={item.title === 'Log Out'?'#E53935':'gray'} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeView>
  );
};

export default Account;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
    backgroundColor: '#f4f7f9',
    // paddingBottom:70
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', gap: 20,
    padding: 20,
    paddingTop: 20,
    // backgroundColor: '#fff',
    // marginBottom: 10,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
    // justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingBottom: 30,

  },
  topMenuContainer: {
    // height: '80%',
    // justifyContent: 'space-evenly',
    gap: 10,
    backgroundColor: '#fff',
    borderRadius: 15,
    paddingTop: 10,
    paddingHorizontal: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  // bottomMenuContainer: {
  //   backgroundColor: '#fff',
  //   marginTop: 30,
  //   borderRadius: 15,
  //   paddingVertical: 10,
  //   paddingHorizontal: 10,
  //   elevation: 2,
  //   shadowColor: '#000',
  //   shadowOpacity: 0.05,
  //   shadowOffset: { width: 0, height: 2 },
  //   shadowRadius: 8,
  // },
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
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingBottom: 20,
    paddingHorizontal: 10,
  },
  menuItemSeparator: {
    borderBottomColor: '#ccc',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
