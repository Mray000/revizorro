import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, Image, Modal} from 'react-native';
import {Shadow} from 'react-native-shadow-2';
import {colors} from 'utils/colors';
import {dimensions} from 'utils/dimisions';
import {Header} from 'styled_components/Header';
import {Input} from 'styled_components/Input';
import {moderateScale, scale, verticalScale} from 'utils/normalize';
import ArrowRight from 'assets/arrow_right.svg';
import Picture from 'assets/picture.svg';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {launchImageLibrary} from 'react-native-image-picker';
import X from 'assets/x.svg';
import {api, ImageURL} from 'utils/api';
import {Loader} from 'styled_components/Loader';
import {convertType, types} from 'utils/flat_types';


export const EditFlat = ({navigation, route}) => {
  let flat = route.params.flat;
  const [title, SetTitle] = useState(flat.title);
  const [address, SetAddress] = useState(flat.address);
  const [images, SetImages] = useState(flat.images);
  const [is_load, SetIsLoad] = useState(false);
  const [delited_images, SetDelitedImages] = useState([]);
  const [added_images, SetAddedImages] = useState([]);
  const [is_delete_modal_open, SetIsDeleteModalOpen] = useState(false);
  let type = route.params?.type || convertType(flat.type);
  useEffect(() => {
    navigation.addListener('focus', () => {
      type = route.params?.type || convertType(flat.type);
    });
  }, []);

  const handleAddImage = async () => {
    const result = await launchImageLibrary({mediaType: 'photo'});
    if (!result.didCancel) {
      SetAddedImages(prev => [...prev, ...result.assets]);
    }
  };

  const handleDeleteImage = async image => {
    SetDelitedImages(prev => [...prev, image]);
  };

  const handleEditFlat = async () => {
    SetIsLoad(true);
    await api.editFlat(flat.id, {
      title,
      address,
      type: types[type],
    });
    await Promise.all(
      delited_images.map(
        async image => image.id && (await api.deleteFlatImage(image.id)),
      ),
    );
    await Promise.all(
      added_images.map(
        async image =>
          await api.addFlatImage(flat.id, {
            uri: image.uri,
            type: image.type,
            name: image.fileName,
          }),
      ),
    );
    navigation.navigate('FlatsList');
    SetIsLoad(false);
  };

  const handleDeleteFlat = async () => {
    await api.deleteFlat(flat.id);
    SetIsDeleteModalOpen(false);
    navigation.navigate('FlatsList');
  };

  let is_button_disabled = !title || !address || !type || is_load;
  if (is_load) return <Loader />;
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
            shadowColor: '#C8C7C7',
            shadowOffset: {
              width: 0,
              height: 10,
            },
            shadowOpacity: 0.50,
            shadowRadius: 10,
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
        <View>
          {[...added_images, ...images]
            .filter(image => !delited_images.includes(image))
            .map(photo => (
              <Shadow
                key={photo.image}
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
                offset={[0, 10]}>
                <View
                  style={{
                    flexDirection: 'row',
                    width: '100%',
                    alignItems: 'center',
                    padding: 10,
                    borderRadius: 20,
                  }}>
                  <Image
                    source={{uri: photo.uri ||  photo.image}}
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
