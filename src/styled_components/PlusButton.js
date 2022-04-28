import React, {useState, useEffect} from 'react';
import {View, Text} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Shadow} from 'react-native-shadow-2';
import {colors} from 'utils/colors';
import {moderateScale, scale, verticalScale} from 'utils/normalize';

export const PlusButton = ({onPress}) => {
  return (
    <Shadow
      startColor={'#F4843316'}
      finalColor={'#F4843301'}
      offset={[0, 6]}
      distance={10}
      containerViewStyle={{
        position: 'absolute',
        width: scale(40),
        aspectRatio: 1,
        backgroundColor: colors.orange,
        right: 10,
        bottom: verticalScale(50),
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
      }}
      viewStyle={{
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        padding: 0,
      }}>
      <TouchableOpacity onPress={onPress}>
        <Text
          style={{
            color: 'white',
            fontFamily: 'Inter-Medium',
            fontSize: moderateScale(30),
            bottom: 3,
          }}>
          +
        </Text>
      </TouchableOpacity>
    </Shadow>
  );
};
