import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, Modal, ScrollView} from 'react-native';
import {dimensions} from '../utils/dimisions';
import {moderateScale} from '../utils/normalize';

export const ModalPicker = ({data, onPick, visible, closeModal}) => {
  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View
        style={{
          backgroundColor: 'rgba(0,0,0,0.2)',
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View
          style={{
            height: dimensions.height * 0.7,
            alignItems: 'center',
            justifyContent: 'center',
            width: '70%',
          }}>
          <View
            style={{
              width: '100%',
              maxHeight: dimensions.height * 0.7 * 0.9,
              borderRadius: 10,
              backgroundColor: 'white',
              overflow: 'hidden',
              paddingHorizontal: 5,
              paddingTop: 5,
            }}>
            <ScrollView>
              {data.map(el => (
                <TouchableOpacity
                  key={el}
                  onPress={() => {
                    onPick(el);
                    closeModal();
                  }}
                  style={{
                    backgroundColor: 'white',
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingVertical: 10,
                    borderColor: '#EAE9E9',
                    borderBottomWidth: 1,
                  }}>
                  <Text
                    style={{
                      color: '#69A3EB',
                      fontSize: moderateScale(15),
                      fontFamily: 'Inter-SemiBold',
                    }}>
                    {el}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          <TouchableOpacity
            onPress={closeModal}
            style={{
              width: '100%',
              marginTop: 10,
              backgroundColor: 'white',
              borderRadius: 10,
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: 10,
            }}>
            <Text
              style={{
                color: 'black',
                fontFamily: 'Inter-Medium',
                fontSize: moderateScale(15),
              }}>
              Закрыть
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
