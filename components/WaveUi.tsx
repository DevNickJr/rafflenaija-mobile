import { Colors } from '@/constants/Colors';
import { Path2 } from '@/constants/Paths';
import React from 'react';
import { View, StyleSheet, Dimensions, Text, Image } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Logo from "@/assets/images/logo3.svg"
import LogoText from "@/assets/images/logo-text.svg"

const { width } = Dimensions.get('window');

type Props = {
  underlineTxt: string;
  restTxt: string;
  size?: number;
};

const WaveUI = ({ underlineTxt, restTxt, size = 38 }: Props) => {
  return (
    <View style={styles.container}>
      <View style={{ backgroundColor: Colors.light.primary, height: restTxt === 'up' ? 200 : 200, alignItems:"center", justifyContent:"center"  }}>
        {/* <Image source={require('@/assets/images/logo2.png')}
          style={{ 
            position:"absolute",
            zIndex:50,
            width: width*0.42, height: width*0.4,
            // backgroundColor:"white", 
            }} /> */}
            <View style={{ gap: 1, justifyContent: 'center', alignItems: 'center', position: "absolute",  zIndex:50, }}>
              <Image source={require('@/assets/images/logo-icon.png')}
                style={{ 
                  // position:"absolute",
                  zIndex:50,
                  width: 60, height: 52,
                  // backgroundColor:"white", 
                }} 
              />
              <LogoText 
                width={150} 
                height={80} 
                style={{
                  // position:"absolute",
                  // zIndex:50,
                }}
              />
            </View>

        <Svg
          height={restTxt === 'up' ? "40%" : "60%" }
          width="100%"
          viewBox="0 0 1440 320"
          style={{ position: 'absolute', top: 180 }}>
          <Path fill={Colors.light.primary} d={Path2} />
        </Svg>
      </View>

      <View style={{ 
         marginTop: restTxt === 'up' ? 30 : 60,
         marginLeft: 30,
         width: 150,
       }}>
        <Text style={{ fontSize: size, fontWeight: '600' }}>
          <Text style={{ textDecorationLine: 'underline', paddingBottom: 30 }}>{underlineTxt}</Text>{' '}
          {restTxt}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // justifyContent: 'flex-end',
  },
  wave: {
    position: 'absolute',
    bottom: 0,
  },
  textcontainer: {
    marginTop: 60,
    marginLeft: 30,
    width: 150,
  },
  text: {
    fontSize: 38,
    fontWeight: '600',
  },
});

export default WaveUI;
