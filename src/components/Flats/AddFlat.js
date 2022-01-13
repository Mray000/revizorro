import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import {Shadow} from 'react-native-shadow-2';
import {colors} from 'utils/colors';
import {dimensions} from 'utils/dimisions';
import {Header} from 'utils/Header';
import {Input} from 'utils/Input';
import {moderateScale} from 'utils/Normalize';
import ArrowRight from 'assets/arrow_right.svg';
import Picture from 'assets/picture.svg';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {launchImageLibrary} from 'react-native-image-picker';
import X from 'assets/x.svg';
import {bytesToSize} from 'utils/BytesToSize';
import {Button} from 'utils/Button';
import {api} from 'utils/api';
import { types } from 'utils/flat_types';


export const AddFlat = ({navigation, route}) => {
  const [title, SetTitle] = useState('');
  const [address, SetAddress] = useState('');
  const [images, SetImages] = useState([]);
  const [is_load, SetIsLoad] = useState(false);
  let type = route.params?.type;

  const LoadPhoto = async () => {
    const result = await launchImageLibrary({mediaType: 'photo'});
    if (!result.didCancel) {
      console.log(result.assets);
      SetImages(prev => [...prev, ...result.assets]);
    }
  };

  const handleAddFlat = async () => {
    SetIsLoad(true);
    await api.addFlat({
      title,
      address,
      type: types[type],
      images: images.map(el => ({
        uri: el.uri,
        type: el.type,
        name: el.fileName,
      })),
    });
    navigation.navigate('FlatsList');
    SetIsLoad(false);
  };
  let is_button_disabled =
    !title || !address || !type || !images.length || is_load;
  // let is_button_disabled = !title || !address || is_load;
  return (
    <KeyboardAwareScrollView
      style={{
        backgroundColor: 'white',
        paddingTop: 10,
      }}>
      <Header
        title={'Добавление квартиры'}
        navigation={navigation}
        to="FlatsList"
      />
      <View style={{paddingHorizontal: 10}}>
        <Input
          key={1}
          value={title}
          onChangeText={SetTitle}
          placeholder="Придумайте название"
          title={'название'}
        />
        <Input
          key={2}
          value={address}
          onChangeText={SetAddress}
          placeholder="Введите адрес"
          title={'адрес'}
        />

        <TouchableOpacity
          onPress={() =>
            navigation.navigate('FlatTypes', {type, parent: 'AddFlat'})
          }
          style={{
            height: dimensions.height / 10,
            marginTop: 10,
            width: '100%',
            justifyContent: 'center',
            backgroundColor: 'white',
          }}>
          <Shadow
            viewStyle={{
              width: '100%',
              height: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              borderColor: '#E5E3E2',
              borderWidth: 1,
              borderRadius: 18,
              flexDirection: 'row',
              paddingHorizontal: 1,
              backgroundColor: 'white',
            }}
            startColor={type ? '#00000010' : '#0000'}
            finalColor={type ? '#00000002' : '#0000'}
            offset={type ? [0, 5] : [0, 0]}
            distance={!type ? 0 : undefined}
            corners={!type ? [] : undefined}
            sides={!type ? [] : undefined}
            size={!type ? 0 : undefined}>
            <View
              style={{
                justifyContent: 'center',
                width: '90%',
                height: '100%',
              }}>
              <Text
                style={{
                  alignSelf: 'stretch',
                  color: type ? 'black' : '#979493',
                  paddingLeft: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 17,
                }}>
                {type || 'Выберите тип недвижимости'}
              </Text>
            </View>
            <View
              style={{
                width: '10%',
                alignItems: 'center',
              }}>
              <ArrowRight fill={type ? '#CAC8C8' : colors.orange} />
            </View>
          </Shadow>
        </TouchableOpacity>

        <View
          style={{
            borderColor: '#E5E3E2',
            borderWidth: 1,
            borderRadius: 20,
            padding: 15,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 10,
          }}>
          <Text
            style={{
              fontFamily: 'Inter-Regular',
              fontSize: moderateScale(14),
              color: '#979493',
              textAlign: 'center',
            }}>
            Загрузите фото-примеры, как должна выглядеть чистая квартира
          </Text>
          <TouchableOpacity
            onPress={LoadPhoto}
            style={{
              padding: 10,
              backgroundColor: '#FEF3EB',
              flexDirection: 'row',
              justifyContent: 'center',
              alignSelf: 'center',
              borderRadius: 10,
              marginTop: 10,
              // width: '60%',
              alignItems: 'center',
            }}>
            <Picture />
            <Text
              style={{
                color: colors.orange,
                marginLeft: 5,
                fontSize: moderateScale(15),
              }}>
              загрузить фото
            </Text>
          </TouchableOpacity>

          {images.length ? (
            <View style={{marginTop: 10}}>
              {images.map(photo => (
                <Shadow
                  viewStyle={{
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 20,
                    marginTop: 10,
                    flexDirection: 'row',
                    paddingHorizontal: 2,
                    backgroundColor: 'white',
                  }}
                  startColor={'#00000010'}
                  finalColor={'#00000002'}
                  offset={[0, 10]}
                  // distance={ 0 : undefined}
                  // corners={ ? [] : undefined}
                  // sides={ ? [] : undefined}
                  // size={ ? 0 : undefined}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      width: '100%',
                      alignItems: 'center',
                      padding: 10,
                      borderRadius: 20,
                    }}>
                    <Image
                      source={{uri: photo.uri}}
                      style={{
                        aspectRatio: 1,
                        borderRadius: 10,
                        width: '15%',
                      }}
                    />

                    <View
                      style={{
                        width: '75%',
                        paddingLeft: 10,
                        justifyContent: 'space-between',
                      }}>
                      <Text
                        lineBreakMode="clip"
                        numberOfLines={1}
                        style={{
                          color: 'black',
                          fontSize: moderateScale(15),
                          fontFamily: 'Inter-Medium',
                        }}>
                        {photo.fileName}
                      </Text>
                      <Text
                        style={{
                          color: '#C5BEBE',
                          fontSize: moderateScale(15),
                          fontFamily: 'Inter-Regular',
                          // marginTop: 5,
                        }}>
                        {bytesToSize(photo.fileSize)}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() =>
                        SetImages(prev => prev.filter(el => el != photo))
                      }
                      style={{width: '10%', alignItems: 'center'}}>
                      <X fill="#D1CFCF" />
                    </TouchableOpacity>
                  </View>
                </Shadow>
              ))}
            </View>
          ) : null}
        </View>
        <View style={{marginVertical: 30}}>
          <Button
            disabled={is_button_disabled}
            onPress={handleAddFlat}
            text={'Добавить квартиру'}
          />
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};
