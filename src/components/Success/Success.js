import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import SuccessSvg from 'assets/success.svg';
import X from 'assets/x.svg';
import {Shadow} from 'react-native-shadow-2';
import {Button} from 'utils/Button';
import {moderateScale} from 'utils/Normalize';

export const Success = ({navigation, route: {params: params}}) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: 'white',
        alignItems: 'flex-end',
        padding: 20,
      }}>
      <Shadow
        startColor={'#00000008'}
        finalColor={'#00000001'}
        offset={[0, 8]}
        distance={20}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate(params.to, params.params ? param.params : null)
          }
          style={{
            backgroundColor: 'white',
            width: 45,
            height: 45,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 17,
          }}>
          <X width={13} height={13} fill="#45413E" />
        </TouchableOpacity>
      </Shadow>
      <View
        style={{justifyContent: 'center', alignItems: 'center', width: '100%'}}>
        <SuccessSvg />
        <Text
          style={{
            color: 'black',
            fontFamily: 'Inter-SemiBold',
            textAlign: 'center',
            fontSize: moderateScale(18),
            marginTop: 10,
          }}>
          {params.title}
        </Text>
        {params.description ? (
          <Text
            style={{
              fontSize: moderateScale(14),
              color: '#686463',
              fontFamily: 'Inter-Regular',
              textAlign: 'center',
              marginTop: 10,
            }}>
            {params.description}
          </Text>
        ) : null}
      </View>

      <Button
        text={params.button_title || 'Ок'}
        onPress={() => navigation.navigate(params.to)}
      />
    </View>
  );
};
