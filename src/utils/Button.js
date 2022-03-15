import React, {useState} from 'react';
import {Dimensions, Text, TouchableOpacity, View} from 'react-native';
import {colors} from 'utils/colors';
import Next from 'assets/next.svg';
import {moderateScale} from './Normalize';
export const Button = ({
  disabled,
  text,
  flex,
  icon,
  absolute,
  height,
  marginTop,
  second_text,
  ...props
}) => {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: disabled ? '#ECEAEA' : colors.orange,
        width: '100%',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        height: height || Dimensions.get('window').height / 10,
        borderColor: colors.orange,
        marginTop,
      }}
      {...props}
      disabled={disabled}>
      <View style={{alignItems: 'center', justifyContent: 'center'}}>
        <Text
          style={{
            color: disabled ? '#A29E9D' : 'white',
            fontSize: moderateScale(16),
          }}>
          {text}
        </Text>
        {second_text ? (
          <Text
            style={{
              color: disabled ? '#A29E9D' : '#FDEEE2',
              fontSize: moderateScale(13),
              textAlign: "center"
            }}>
            {second_text}
          </Text>
        ) : null}
      </View>
      {icon ? (
        <Next
          width={23}
          height={23}
          style={{position: 'absolute', right: 20}}
        />
      ) : null}
    </TouchableOpacity>
  );
};
