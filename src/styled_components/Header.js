import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {Shadow} from 'react-native-shadow-2';
import {moderateScale, scale, verticalScale} from '../utils/normalize';
import ArrowLeft from 'assets/arrow_left.svg';
import {colors} from 'utils/colors';
export const Header = ({
  title,
  navigation,
  to,
  children,
  params,
  onBack,
  complete_button,
  is_complete_button_disabled,
  onCompleteButtonPress,
}) => {
  return (
    <View
      style={{
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        height: verticalScale(50),
      }}>
      <Shadow
        startColor={'#00000008'}
        finalColor={'#00000001'}
        offset={[0, 8]}
        distance={15}
        containerViewStyle={{
          position: 'absolute',
          left: 10,
          width: '10%',
        }}>
        <TouchableOpacity
          onPress={() =>
            onBack
              ? onBack()
              : navigation.navigate(to, params ? params : undefined)
          }
          style={{
            width: scale(40),
            height: scale(40),
            aspectRatio: 1,
            backgroundColor: 'white',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 15,
          }}>
          <ArrowLeft fill="black" width={15} height={15} />
        </TouchableOpacity>
      </Shadow>
      <Text
        style={{
          color: 'black',
          fontFamily: 'Inter-SemiBold',
          fontSize: moderateScale(15),
        }}>
        {title}
      </Text>
      {complete_button ? (
        <TouchableOpacity
          style={{position: 'absolute', right: 20}}
          disabled={is_complete_button_disabled}
          onPress={onCompleteButtonPress}>
          <Text
            style={{
              fontSize: moderateScale(15),
              fontFamily: 'Inter-Medium',
              color: is_complete_button_disabled ? '#AAA8A7' : colors.orange,
            }}>
            Готово
          </Text>
        </TouchableOpacity>
      ) : null}
      {children}
    </View>
  );
};
