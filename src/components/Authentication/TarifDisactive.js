import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {colors} from 'utils/colors';
import {moderateScale} from 'utils/normalize';
import X from 'assets/x.svg';

export const TarifDisactive = ({navigation}) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.orange,
      }}>
      <View style={{right: 10, top: 10, position: 'absolute'}}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Onboarding')}
          style={{
            backgroundColor: 'white',
            width: 50,
            aspectRatio: 1,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 17,
          }}>
          <X width={13} height={13} fill="#45413E" />
        </TouchableOpacity>
      </View>
      <Text
        style={{
          color: 'white',
          fontFamily: 'Inter-SemiBold',
          fontSize: moderateScale(22),
          textAlign: 'center',
          padding: 5,
        }}>
        Срок подписки истек, обратитесь к владельцу компании
      </Text>
    </View>
  );
};
