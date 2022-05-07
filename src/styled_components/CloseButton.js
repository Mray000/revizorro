import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import X from 'assets/x.svg';
import {Shadow} from 'react-native-shadow-2';
import {getBoxShadow} from 'utils/get_box_shadow';
export const CloseButton = ({onPress, is_absolute, style}) => {
  return (
    <Shadow
      {...getBoxShadow()}
      containerViewStyle={[
        is_absolute ? styles.right_absolute : styles.right,
        {...style},
      ]}>
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

const styles = StyleSheet.create({
  right_absolute: {
    right: 10,
    position: 'absolute',
  },
  right: {
    marginRight: 10,
    alignSelf: 'flex-end',
  },
});
