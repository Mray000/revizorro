import React, {useState} from 'react';
import {Dimensions, Text, TouchableOpacity} from 'react-native';
import {colors} from 'utils/colors';
import { moderateScale } from 'utils/Normalize';
export const QuestionButton = ({
  selected,
  text,
  flex,
  icon,
  absolute,
  height,
  marginTop,
  ...props
}) => {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: selected ? colors.orange : '#FEF3EB',
        width: '100%',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        height: height || Dimensions.get('window').height / 10,
        borderColor: colors.orange,
        marginTop,
      }}
      {...props}>
      <Text
        style={{
          color: selected ? 'white' : colors.orange,
          fontSize: moderateScale(16),
        }}>
        {text}
      </Text>
      
    </TouchableOpacity>
  );
};
