import { Colors } from '@/constants/Colors';
import { Path1, Path2 } from '@/constants/Paths';
import React from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import Animated from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

const { width } = Dimensions.get('window');

type Props = {
  underlineTxt: string;
  restTxt: string;
  size?: number;
};

const WaveUI = ({ underlineTxt, restTxt, size = 38 }: Props) => {
  return (
    <View style={styles.container}>
      <View style={{ backgroundColor: Colors.light.primary, height: restTxt === 'up' ? 200 : 200  }}>
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
