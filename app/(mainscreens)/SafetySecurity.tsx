import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import ChangePasswordSection from '@/components/safetytabs/ChangePasswordSection';
import RestrictAccount from '@/components/safetytabs/RestrictAccountSection';
import DeactivateAccount from '@/components/safetytabs/DeactivateAccount';
import { Stack } from 'expo-router';

const tabs = ['Change Password', 'Restrict Account', 'Deactivate Account'];

const SafetySecurityScreen = () => {
  const [activeTab, setActiveTab] = useState('Change Password');
  const [showModal, setShowModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);

  const handleTabPress = (tab: string) => {
    if (tab === 'Restrict Account') {
      setShowModal(true);
    } else if (tab === 'Deactivate Account') {
      setShowDeactivateModal(true);
    }
    setActiveTab(tab);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Change Password':
        return <ChangePasswordSection />;
      case 'Restrict Account':
        return (
          <RestrictAccount
            visible={showModal}
            onCancel={() => {
              setShowModal(false);
              setActiveTab('Change Password');
            }}
            onConfirm={() => {
              setShowModal(false);
              setActiveTab('Restrict Account');
            }}
          />
        );
      case 'Deactivate Account':
        return (
          <DeactivateAccount
            visible={showDeactivateModal}
            onCancel={() => {
              setShowDeactivateModal(false);
              setActiveTab('Change Password');
            }}
            onConfirm={() => {
              setShowDeactivateModal(false);
              setActiveTab('Deactivate Account');
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Safety and Security',
        }}
      />
      <View style={styles.screen}>
        <View style={{ height: 60 }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabContainer}>
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => handleTabPress(tab)}
                style={[
                  styles.tab,
                  { borderBottomColor: activeTab === tab ? 'green' : 'transparent' },
                ]}>
                <Text style={[styles.tabText, { color: activeTab === tab ? 'green' : '#333' }]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.bodyContainer}>{renderTabContent()}</ScrollView>
        </View>
      </View>
    </>
  );
};

export default SafetySecurityScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 20,
    height: 50,
  },
  tab: {
    marginRight: 20,
    paddingBottom: 8,
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
  },
  bodyContainer: {
    padding: 20,
  },
  placeholder: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 40,
  },
});
