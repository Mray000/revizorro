import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import { colors } from './colors';
import {dimensions} from './dimisions';
import { moderateScale, scale } from './Normalize';

export const AddButton = ({text, onPress, marginTop}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        height: dimensions.height / 10,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        borderRadius: 20,
        marginTop,
      }}>
      <View
        style={{
          backgroundColor: 'rgba(243, 132, 52, 0.1)',
          width: scale(30),
          aspectRatio: 1,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 12,
        }}>
        <Text
          style={{
            color: colors.orange,
            fontFamily: 'Inter-Regular',
            fontSize: moderateScale(16),
            textAlignVertical: 'center',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          +
        </Text>
      </View>
      <Text
        style={{
          color: colors.orange,
          fontFamily: 'Inter-Medium',
          marginLeft: 10,
          fontSize: moderateScale(16),
        }}>
        {text}
      </Text>
    </TouchableOpacity>
  );
};
