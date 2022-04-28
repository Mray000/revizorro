import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import X from 'assets/x.svg';
import {Shadow} from 'react-native-shadow-2';
import {getBoxShadow} from 'utils/get_box_shadow';
export const CloseButton = ({onPress}) => {
  return (
    <Shadow
      {...getBoxShadow()}
      containerViewStyle={{
        marginRight: 10,
        alignSelf: 'flex-end',
      }}>
      <TouchableOpacity
        onPress={onPress}
        style={{
          width: 45,
          height: 45,
          backgroundColor: 'white',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 17,
        }}>
        <X width={13} height={13} fill="#45413E" />
      </TouchableOpacity>
    </Shadow>
  );
};
