import React, {useState, useEffect} from 'react';
import {View, Text, Modal, TouchableOpacity} from 'react-native';

import {authentication} from 'store/authentication';
import {moderateScale, verticalScale} from 'utils/normalize';

export const LogoutModal = ({visible, closeModal, navigation}) => {
  const logout = () => {
    closeModal();
    authentication.logout();
    navigation.navigate('Onboarding');
  };
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={closeModal}>
      <View
        style={{
          backgroundColor: 'rgba(0,0,0,0.2)',
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
        }}>
        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 15,
            width: '70%',
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontFamily: 'Inter-SemiBold',
              fontSize: moderateScale(16),
              color: 'black',
              marginTop: verticalScale(15),
            }}>
            Выйти из аккаунта?
          </Text>
          <Text
            style={{
              fontFamily: 'Inter-Regular',
              fontSize: moderateScale(14),
              paddingHorizontal: 5,
              color: '#8B8887',
              marginTop: 3,
              textAlign: 'center',
            }}>
            Вы уверены, что хотите выйти?
          </Text>

          <View
            style={{
              flexDirection: 'row',
              marginTop: 10,
              borderTopColor: '#E5E3E2',
              borderTopWidth: 1,
              width: '100%',
            }}>
            <TouchableOpacity
              style={{width: '50%', padding: 8}}
              onPress={logout}>
              <Text
                style={{
                  fontFamily: 'Inter-Regular',
                  fontSize: moderateScale(15),
                  color: '#E6443A',
                  textAlign: 'center',
                }}>
                Выйти
              </Text>
            </TouchableOpacity>
            <View style={{backgroundColor: '#E5E3E2', width: 1}} />
            <TouchableOpacity
              onPress={closeModal}
              style={{width: '50%', padding: 8}}>
              <Text
                style={{
                  fontFamily: 'Inter-SemiBold',
                  fontSize: moderateScale(15),
                  color: 'black',
                  textAlign: 'center',
                }}>
                Отмена
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
