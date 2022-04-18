import React from 'react';
import { Text, View } from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import ToggleSwitch from 'toggle-switch-react-native';
import {verticalScale, moderateScale} from "utils/normalize.js"

export const SwitchComponent = ({is_active, SetIsActive, title, disabled}) => {
    let boxShadow = !is_active
      ? {
          startColor: '#00000010',
          finalColor: '#00000002',
          offset: [0, 15],
          distance: 5,
        }
      : {
          startColor: '#0000',
          finalColor: '#0000',
          offset: [0, 0],
          distance: 0,
          corners: [],
          sides: [],
          size: 0,
        };
    return (
      <Shadow
        {...boxShadow}
        viewStyle={{
          flexDirection: 'row',
          width: '100%',
          marginTop: 10,
          height: verticalScale(60),
        }}>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            backgroundColor: 'white',
            borderWidth: 1,
            borderColor: is_active ? '#E5E3E2' : 'white',
            borderRadius: 15,
            paddingHorizontal: 20,
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text
            style={{
              color: is_active ? '#8B8887' : 'black',
              fontSize: moderateScale(16),
              width: '80%',
            }}>
            {title}
          </Text>
          <ToggleSwitch
            onColor="#F7AF7B"
            offColor="#C5BEBE"
            size="large"
            isOn={is_active}
            disabled={disabled}
            onToggle={() => SetIsActive(!is_active)}
          />
        </View>
      </Shadow>
    );
  };
  