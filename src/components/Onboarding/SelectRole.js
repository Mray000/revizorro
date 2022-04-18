import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import {colors} from 'utils/colors';
import {dimensions} from 'utils/dimisions';
import {moderateScale, scale, verticalScale} from 'utils/normalize';
import Check from 'assets/check.svg';
import {Button} from 'styled_components/Button';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
export const SelectRole = ({
  SetRole,
  role,
  SetIsSelectRoleScreen,
  navigation,
}) => {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        // height: dimensions.height,
        flex: 1,
        backgroundColor: 'white',
      }}>
      <View
        style={{
          alignItems: 'center',
          width: '100%',
          justifyContent: 'center',
          marginBottom: dimensions.height * 0.2 + 10,
        }}>
        <Text
          style={{
            color: 'black',
            fontFamily: 'Inter-SemiBold',
            fontSize: moderateScale(18),
          }}>
          Приветствуем
        </Text>
        <Text
          style={{
            color: '#696463',
            fontFamily: 'Inter-Regular',
            fontSize: moderateScale(15),
            marginTop: 5,
          }}>
          Пожалуйста, выберите свою роль:
        </Text>
        <View style={{width: '100%'}}>
          <RoleButton
            is_active={role == 'owner'}
            SetRole={() => SetRole('owner')}
            text="Я владалец компании"
          />
          <RoleButton
            is_active={role == 'housemaid'}
            SetRole={() => SetRole('housemaid')}
            text="Я горничная"
          />
          <RoleButton
            is_active={role == 'manager'}
            SetRole={() => SetRole('manager')}
            text="Я менеджер компании"
          />
        </View>
      </View>
      {console.log(30 + StatusBar.currentHeight)}
      <View
        style={{
          width: '100%',
          position: 'absolute',
          bottom: insets.bottom,
          bottom:
            // Dimensions.get('screen').height -
            // Dimensions.get('window').height +
            20,
        }}>
        <Button
          text={'Пропустить'}
          onPress={() => navigation.navigate('Login', {role})}
          icon={true}
        />
        <Button
          text={'Далее'}
          onPress={() => SetIsSelectRoleScreen(false)}
          icon={true}
          marginTop={10}
        />
      </View>
    </View>
  );
};

const RoleButton = ({is_active, SetRole, text}) => (
  <TouchableOpacity
    style={{
      height: dimensions.height / 10,
      flexDirection: 'row',
      borderRadius: 15,
      width: '100%',
      backgroundColor: is_active ? colors.orange : '#FEF3EB',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 10,
    }}
    onPress={SetRole}>
    {is_active ? (
      <View
        style={{
          backgroundColor: 'white',
          width: scale(20),
          aspectRatio: 1,
          borderRadius: 40,
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          left: 10,
        }}>
        <Check width={12} height={8} fill={colors.orange} />
      </View>
    ) : null}
    <Text
      style={{
        fontSize: moderateScale(16),
        color: is_active ? 'white' : colors.orange,
      }}>
      {text}
    </Text>
  </TouchableOpacity>
);
