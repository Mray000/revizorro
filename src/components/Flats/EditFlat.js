import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, Image, Modal} from 'react-native';
import {Shadow} from 'react-native-shadow-2';
import {colors} from 'utils/colors';
import {dimensions} from 'utils/dimisions';
import {Header} from 'utils/Header';
import {Input} from 'utils/Input';
import {moderateScale, scale, verticalScale} from 'utils/Normalize';
import ArrowRight from 'assets/arrow_right.svg';
import Picture from 'assets/picture.svg';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {launchImageLibrary} from 'react-native-image-picker';
import X from 'assets/x.svg';
import {bytesToSize} from 'utils/BytesToSize';
import {Button} from 'utils/Button';
import {api} from 'utils/api';
const types = {
  '1-комнатная квартира': '1_room_flat',
  '2-х комнатная квартира': '2_room_flat',
  '3-х комнатная квартира': '3_room_flat',
  '4-х комнатная квартира': '4_room_flat',
  '5-комнатная квартира': '5_room_flat',
  Дом: 'house',
  Участок: 'land',
  'Дом с участком': 'house_with_land',
  'Другое(гаражб склад, и др.)': 'other',
};
const URL = 'http://92.53.97.165/media/';

export const EditFlat = ({navigation, route}) => {
  let flat = route.params.flat;
  const [title, SetTitle] = useState(flat.title);
  const [address, SetAddress] = useState(flat.address);
  const [images, SetImages] = useState(flat.images);
  const [is_load, SetIsLoad] = useState(false);
  const [is_delete_modal_open, SetIsDeleteModalOpen] = useState(false);
  let type =
    route.params?.type || Object.keys(types).find(el => types[el] == flat.type);
  console.log(4565464);
  useEffect(() => {
    navigation.addListener('focus', () => {
      console.log(route.params?.type);
      type =
        route.params?.type ||
        Object.keys(types).find(el => types[el] == flat.type);
    });
  }, []);

  const handleAddImage = async () => {
    const result = await launchImageLibrary({mediaType: 'photo'});
    if (!result.didCancel) {
      SetImages(prev => [...prev, ...result.assets]);
      result.assets.map(el => {
        api.addFlatImage(flat.id, {
          uri: el.uri,
          type: el.type,
          name: el.fileName,
        });
      });
    }
  };

  const handleDeleteImage = async image => {
    if (image.id) {
      await api.deleteFlatImage(image.id);
    }
    SetImages(prev => prev.filter(el => el != image));
  };

  const handleDeleteFlat = async () => {
    await api.deleteFlat(flat.id);
    SetIsDeleteModalOpen(false);
    navigation.navigate('FlatsList');
  };

  const handleEditFlat = async () => {
    SetIsLoad(true);
    await api.editFlat(flat.id, {
      title,
      address,
      type: types[type],
    });
    navigation.navigate('FlatsList');
    SetIsLoad(false);
  };
  let is_button_disabled = !title || !address || !type || is_load;
  return (
    <KeyboardAwareScrollView
      style={{
        paddingTop: 10,
      }}>
      <Header
        title={'Редактирование'}
        navigation={navigation}
        to="FlatsList"
        children={
          <TouchableOpacity
            style={{position: 'absolute', right: 20}}
            disabled={is_button_disabled}
            onPress={handleEditFlat}>
            <Text
              style={{
                fontSize: moderateScale(15),
                fontFamily: 'Inter-Medium',
                color: colors.orange,
              }}>
              Готово
            </Text>
          </TouchableOpacity>
        }
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

        {type ? (
          <Text
            style={{
              color: '#A9A7A6',
              fontSize: moderateScale(14),
              marginTop: 10,
              marginLeft: 10,
            }}>
            тип недвижимости
          </Text>
        ) : null}

        <TouchableOpacity
          onPress={() =>
            navigation.navigate('FlatTypes', {type, flat, parent: 'EditFlat'})
          }
          //   onPress={() => console.log(435)}
          style={{
            height: dimensions.height / 10,
            marginTop: 10,
            width: '100%',
            justifyContent: 'center',
            backgroundColor: 'white',
            borderRadius: 18,
            borderColor: '#E5E3E2',
            alignItems: 'center',
            borderWidth: 1,
            flexDirection: 'row',
            paddingHorizontal: 1,
            backgroundColor: 'white',
            flexDirection: 'row',
            shadowColor: '#434343',
            shadowOffset: {
              width: 0,
              height: 10,
            },
            shadowOpacity: 0.51,
            shadowRadius: 13.16,
            elevation: 20,
            paddingHorizontal: 10,
            paddingVertical: 5,
          }}>
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
        </TouchableOpacity>

        <Text
          style={{
            color: '#A9A7A6',
            fontSize: moderateScale(14),
            marginTop: 10,
            marginLeft: 10,
          }}>
          Пример чистой квартиры
        </Text>
        {images.length ? (
          <View>
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
                    source={{uri: photo.uri || URL + photo.image}}
                    style={{
                      aspectRatio: 1,
                      borderRadius: 10,
                      width: '15%',
                    }}
                  />
                  <View style={{width: '70%'}} />

                  <TouchableOpacity
                    onPress={() => handleDeleteImage(photo)}
                    style={{width: '10%', alignItems: 'flex-end'}}>
                    <X fill="#D1CFCF" />
                  </TouchableOpacity>
                </View>
              </Shadow>
            ))}
          </View>
        ) : null}
        <TouchableOpacity
          onPress={handleAddImage}
          style={{
            padding: 10,
            backgroundColor: 'white',
            flexDirection: 'row',
            justifyContent: 'center',
            borderRadius: 15,
            marginTop: 20,
            alignItems: 'center',
          }}>
          <View
            style={{
              backgroundColor: '#FEF3EB',
              width: scale(30),
              borderRadius: 10,
              aspectRatio: 1,
              marginRight: 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontFamily: 'Inter-Medium',
                fontSize: moderateScale(15),
                color: colors.orange,
              }}>
              +
            </Text>
          </View>
          <Text
            style={{
              color: colors.orange,
              marginLeft: 5,
              fontFamily: 'Inter-Medium',
              fontSize: moderateScale(15),
            }}>
            Загрузить еще фото
          </Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={() => SetIsDeleteModalOpen(true)}
        style={{alignItems: 'center', width: '100%', marginTop: 20}}>
        <Text
          style={{
            color: '#AAA8A7',
            fontFamily: 'Inter-Medium',
            fontSize: moderateScale(16),
            marginBottom: 20,
          }}>
          Удалить квартиру
        </Text>
      </TouchableOpacity>
      {is_delete_modal_open ? (
        <DeleteModal
          DeleteFlat={handleDeleteFlat}
          CloseModal={() => SetIsDeleteModalOpen(false)}
        />
      ) : null}
    </KeyboardAwareScrollView>
  );
};

const DeleteModal = ({DeleteFlat, CloseModal}) => {
  return (
    <Modal animationType="fade" transparent>
      <View
        style={{
          backgroundColor: 'rgba(0,0,0,0.2)',
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
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
              fontSize: moderateScale(15),
              color: 'black',
              marginTop: verticalScale(15),
            }}>
            Удаление квартиры
          </Text>
          <Text
            style={{
              fontFamily: 'Inter-Regular',
              fontSize: moderateScale(13),
              paddingHorizontal: 5,
              color: '#8B8887',
              marginTop: 3,
              textAlign: 'center',
            }}>
            Вы уверены, что хотите удалить квартиру? Все данные квартиры
            удалятся без возможности восстановления.
          </Text>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 10,
              borderTopColor: '#E5E3E2',
              borderTopWidth: 1,
            }}>
            <TouchableOpacity
              onPress={DeleteFlat}
              style={{width: '50%', padding: 8}}>
              <Text
                style={{
                  fontFamily: 'Inter-Regular',
                  fontSize: moderateScale(15),
                  color: '#E6443A',
                  textAlign: 'center',
                }}>
                Удалить
              </Text>
            </TouchableOpacity>
            <View
              style={{backgroundColor: '#E5E3E2', width: 1, height: '100%'}}
            />
            <TouchableOpacity
              onPress={CloseModal}
              style={{
                width: '50%',
                padding: 8,
              }}>
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
