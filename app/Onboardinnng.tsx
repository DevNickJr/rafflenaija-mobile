import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { OnboardFlow, DotPagination } from 'react-native-onboard'
import { Stack, useRouter } from 'expo-router'
import { FooterProps } from 'react-native-onboard/lib/OnboardFlow/Footer'
import Onboard1 from "@/assets/onboarding/cards.svg"
// import Onboard2 from "@/assets/onboarding/undraw_stand-out_alq4.svg"
import Onboard2 from "@/assets/onboarding/secure.svg"
// import Onboard3 from "@/assets/onboarding/win.svg"
import Onboard3 from "@/assets/onboarding/withdraw.svg"
import { setOnboardingComplete } from '@/hooks/onboarding'
import { SafeView } from '@/components/SafeView'

//   imageUri: 'https://frigade.com/img/example1.png',
  // imageComponent:  <Image 
  //   source={require('@/assets/images/splash-icon2.png')}
  //   style={{ 
  //     width: '100%', 
  //     height: '70%', 
  //     }} />
const Onboardinnng = () => {

  const router = useRouter();

  const handleDone = async () => {
    await setOnboardingComplete();
    router.replace('/(auth)/login'); // or '/(tabs)/home' if already logged in
  };

  return (
    <SafeView style={{ flex: 1 }}>
       <Stack.Screen
            options={{
                title: 'Age',
                headerShown: false
            }}
        />
      <OnboardFlow
        titleStyle={{
          fontSize: 24,
          fontWeight: 'bold',
          marginBottom: 10,
          color: 'black'
        }}
        subtitleStyle={{
          fontSize: 16,
          // color: 'green',
          color: 'gray',
          marginBottom: 20, 
        }}
        pages={[
          // {
          //   title: 'Welcome to Raffle Naija',
          //   subtitle: 'Win amazing prizes with just a few taps. Join raffles, collect tickets, and stand a chance to win every day!',
          //   imageComponent: <Onboard1 width={"90%"} height={"70%"} style={{ marginTop: 40 }} />
          // },
          // {
          //   title: 'Simple and Transparent',
          //   subtitle: 'Browse live raffles, purchase tickets securely, and see real-time draws. It’s all fair, fun, and fully digital.',
          //   imageComponent:<Onboard2 width={"90%"} height={"70%"} style={{ marginTop: 40 }} />
          // },
          // {
          //   title: 'Ready to Win?',
          //   subtitle: 'Create your account in seconds and join your first raffle today.',
          //   imageComponent: <Onboard3 width={"90%"} height={"70%"} style={{ marginTop: 40 }} />
          // },
          {
            title: 'Win Real Prizes with Cards',
            subtitle: 'Join raffles, collect tickets, and stand a chance to win real rewards every day.',
            imageComponent: <Onboard1 width={"90%"} height={"70%"} style={{ marginTop: 40 }} />
          },
          {
            title: 'Secure, Fair, and Transparent',
            subtitle: 'Browse live raffles, purchase tickets securely, and enjoy fully digital, fair draws.',
            imageComponent: <Onboard2 width={"90%"} height={"70%"} style={{ marginTop: 40 }} />
          },
          {
            title: 'Withdraw Instantly',
            subtitle: 'Winners can cash out directly to their bank account. Fast, secure, and reliable.',
            imageComponent: <Onboard3 width={"90%"} height={"70%"} style={{ marginTop: 40 }} />
          }
        ]}
          onDone={() => handleDone()
        }
        FooterComponent={({ goToNextPage, goToPreviousPage, currentPage, pages }: FooterProps) => {
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
    </SafeView>
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