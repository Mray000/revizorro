import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import Workers from 'assets/workers.svg';
import {moderateScale, verticalScale} from './Normalize';
import {colors} from './colors';
export const BottomNavigator = ({state, descriptors, navigation}) => {
  const focusedOptions = descriptors[state.routes[state.index].key].options;
  if (focusedOptions.hidden) {
    return null;
  }
  console.log(state.index);
  return (
    <View
      style={{
        flexDirection: 'row',
        height: verticalScale(50),
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#F2F1F0',
        justifyContent: 'space-between',
        bottom: -0.0000000000001,
        width: '100%',
        alignItems: 'center',
      }}>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        const isFocused = state.index === index;
        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate({name: route.name, merge: true});
          }
        };
        if (options.hidden) return null;
        return (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityState={isFocused ? {selected: true} : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              width: '20%',
              height: '100%',
            }}>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                // backgroundColor: 'red',
              }}>
              {isFocused ? <options.icon_active /> : <options.icon />}
            </View>
            <Text
              style={{
                color: isFocused ? colors.orange : '#969392',
                fontSize: moderateScale(11),
              }}>
              {options.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
