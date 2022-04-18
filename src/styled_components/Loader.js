import React from 'react';
import {Image, Text, View, Animated, Easing} from 'react-native';

import loader from 'assets/loader.png';
export const Loader = () => {
  let spinValue = new Animated.Value(0);

  // First set up animation
  Animated.loop(
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 1000,
      easing: Easing.linear,
      useNativeDriver: true,
    }),
  ).start();
  // Next, interpolate beginning and end values (in this case 0 and 1)
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Animated.Image
        style={{transform: [{rotate: spin}], width: 40, height: 40}}
        source={loader}
      />
    </View>
  );
};
