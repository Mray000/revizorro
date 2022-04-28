import React, {useState, useEffect} from 'react';
import {View, Text} from 'react-native';
import {colors} from 'utils/colors';
import {moderateScale} from 'utils/normalize';

export const ErrorText = ({error}) => {
  return (
    <View>
      <Text
        style={{
          color: colors.red,
          fontSize: moderateScale(14),
          marginTop: 5
        }}>
        {error}
      </Text>
    </View>
  );
};
