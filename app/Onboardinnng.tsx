import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { OnboardFlow, DotPagination } from 'react-native-onboard'
import { SecondaryButtonProps } from 'react-native-onboard/lib/OnboardFlow/components/SecondaryButton'
import { router, useRouter } from 'expo-router'
import { FooterProps } from 'react-native-onboard/lib/OnboardFlow/Footer'
import Onboard1 from "@/assets/onboarding/undraw_unboxing_p8sg.svg"
import Onboard2 from "@/assets/onboarding/undraw_stand-out_alq4.svg"
import { setOnboardingComplete } from '@/hooks/onboarding'

const Onboardinnng = () => {

  const router = useRouter();

  const handleDone = async () => {
    await setOnboardingComplete();
    router.replace('/(auth)/login'); // or '/(tabs)/home' if already logged in
  };

  return (
    <OnboardFlow
      pages={[
        {
          title: 'Welcome to Raffle Naija',
          subtitle: 'Win amazing prizes with just a few taps. Join raffles, collect tickets, and stand a chance to win every day!',
        //   imageUri: 'https://frigade.com/img/example1.png',
          imageComponent:<Onboard1 width={"90%"} height={"70%"}/>
        },
        {
          title: 'Simple and Transparent',
          subtitle: 'Browse live raffles, purchase tickets securely, and see real-time draws. It’s all fair, fun, and fully digital.',
          imageComponent:<Onboard2 width={"90%"} height={"70%"}/>
        },
        {
          title: 'Seamless & Secure Transactions',
          subtitle: 'We support trusted payment providers like PayPal and Flutterwave. Your data and funds are protected.',
          imageComponent:<Onboard1 width={"90%"} height={"70%"}/>
        },
        {
          title: 'Refer & Win',
          subtitle: 'nvite friends and get rewarded! You both earn bonuses when they join and participate in raffles.',
          imageComponent:<Onboard1 width={"90%"} height={"70%"}/>
        },
        {
          title: 'Ready to Win?',
          subtitle: 'Create your account in seconds and join your first raffle today.',
          imageComponent:<Onboard1 width={"90%"} height={"70%"}/>
        },
      ]}
      onDone={() => handleDone()}




      FooterComponent={({ showFooter, goToNextPage, goToPreviousPage, currentPage, pages }: FooterProps) => {
        return (
          <View style={{ paddingHorizontal: 10, paddingBottom: 20 }}>
            {/* Dot Pagination */}
            <DotPagination currentPage={currentPage} totalPages={(Number(pages?.length))}/>
      
            {/* Navigation Buttons */}
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 16 }}>
              {currentPage > 0 && (
                <TouchableOpacity
                  onPress={goToPreviousPage}
                  style={[styles.button, { alignSelf: "center" }]}
                >
                  <Text style={[styles.buttonText, { color: 'green' }]}>Back</Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity
                onPress={goToNextPage}
                style={[styles.button, { alignSelf: "flex-end" }]}
              >
                <Text style={styles.buttonText}>
                  {currentPage === Number(pages?.length) - 1 ? 'Done' : 'Next'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      }}
      
      

      
    
      type={'fullscreen'}
    />
  )
}

export default Onboardinnng

const styles = StyleSheet.create({
    button: {
        padding: 12,
        backgroundColor: "rgba(0,0,0,0)",
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 8,
        width:120,
      },
      buttonText: {
        color: 'green',
        fontSize: 16,
        fontWeight: '600',
      },
})