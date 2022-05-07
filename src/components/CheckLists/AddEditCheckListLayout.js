import React, {useState, useEffect, useRef, useMemo} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import DraggableFlatList, {
  NestableScrollContainer,
  NestableDraggableFlatList,
  ShadowDecorator,
} from 'react-native-draggable-flatlist';

import {Shadow} from 'react-native-shadow-2';
import {dimensions} from 'utils/dimisions';
import {Input} from 'styled_components/Input';
import ArrowRight from 'assets/arrow_right.svg';
import {colors} from 'utils/colors';
import {Header} from 'styled_components/Header';
import {moderateScale, scale, verticalScale} from 'utils/normalize';
import BottomSheet from 'styled_components/BottomSheet';
import Check from 'assets/check.svg';
import X from 'assets/x.svg';
import {Button} from 'styled_components/Button';
import {ModalPicker} from 'styled_components/ModalPicker';
import {useToggle} from 'hooks/useToggle';
import {getBoxShadow} from 'utils/get_box_shadow';
export const AddEditCheckListLayout = ({
  type,
  SetTitle,
  SetPrice,
  SetHours,
  SetMinutes,
  is_load,
  questionbBottomSheet,
  photoBottomSheet,
  ChangeIsOpenQuestionModal,
  AddAnswer,
  EditQuestion,
  AddPhotosTask,
  AddQuestion,
  questions_and_photos,
  title,
  price,
  answers,
  answer,
  photos_text,
  hours,
  minutes,
  is_question_modal_visible,
  is_photo_modal_visible,
  is_add_modal_visible,
  SetIsAddModalVisible,
  navigation,
  handleAddCheckList,
  ChangeIsOpenPhotoModal,
  question,
  SetQuestion,
  SetAnswer,
  SetAnswers,
  SetPhotosText,
  SetQuestionsAndPhotos,
  EditPhotoTask,
  handleEditCheckList,
  is_edit,
  handleDeleteCheckList,
  is_delete_modal_open,
  SetIsDeleteModalOpen,
  DeleteQuestion,
  DeletePhoto,
  edit_id,
  check_list,
}) => {
  const [is_hours_modal_visible, SetIsHoursModalVisible] = useState(false);
  const [is_minutes_modal_visible, SetIsMinutesModalVisible] = useState(false);
  const [is_info_visible, SetIsInfoVisible] = useState(false);
  const [is_cancel_modal_open, SetIsCancelModalOpen] = useToggle(false);
  const [is_warging_modal_open, SetIsWargingModalOpen] = useState(false);

  let is_button_disabled =
    !(questions_and_photos.length && type && title) || is_load;

  let hours_values = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  let minutes_values = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
  const renderItem = ({item: {text, answers, id}, drag, isActive, index}) => {
    return (
      <View style={{paddingHorizontal: 10}}>
        <ShadowDecorator radius={20}>
          <TouchableOpacity
            onLongPress={drag}
            disabled={isActive}
            onPress={() => {
              if (answers) EditQuestion({text, answers, id});
              else EditPhotoTask({text, id});
            }}
            style={[
              {
                backgroundColor: 'white',
                borderRadius: 20,
                padding: 15,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 10,
                elevation: isActive ? 20 : 0,
              },
            ]}>
            <View>
              <Text
                style={{
                  color: 'black',
                  fontSize: moderateScale(15),
                  fontFamily: 'Inter-Medium',
                }}>
                {index + 1}. {text}
              </Text>
              {answers ? (
                <Text
                  style={{
                    color: '#8C8383',
                    marginTop: 2,
                    fontSize: moderateScale(14),
                    fontFamily: 'Inter-Regular',
                  }}>
                  {answers.join(' / ')}
                </Text>
              ) : null}
            </View>
            <ArrowRight fill="#CAC8C8" />
          </TouchableOpacity>
        </ShadowDecorator>
      </View>
    );
  };

  return (
    <NestableScrollContainer>
      <Header
        to={'ListOfCheckLists'}
        navigation={navigation}
        title={is_edit ? 'Чек-лист' : 'Добавление чек-листа'}
        onBack={() => SetIsCancelModalOpen(true)}
        complete_button={true}
        is_complete_button_disabled={is_button_disabled}
        onCompleteButtonPress={handleEditCheckList}
      />
      <View style={{flex: 1, paddingHorizontal: 10, overflow: 'visible'}}>
        <Input
          key={1}
          value={title}
          onChangeText={SetTitle}
          placeholder="Придумайте название"
          title={'название'}
        />
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('FlatTypes', {
              type,
              check_list,
              parent: is_edit ? 'EditCheckList' : 'AddCheckList',
            })
          }
          style={{
            height: dimensions.height / 10,
            marginTop: 10,
            width: '100%',
            justifyContent: 'center',
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
          {type ? (
            <View
              style={{
                position: 'absolute',
                paddingVertical: 3,
                top: '-10%',
                paddingHorizontal: 8,
                backgroundColor: 'white',
                left: '5%',
                borderRadius: 8,
              }}>
              <Text
                style={{
                  color: '#C5BEBE',
                  fontFamily: 'Inter-Regular',
                  fontSize: moderateScale(14),
                }}>
                подходящий тип недвижимости
              </Text>
            </View>
          ) : null}
        </TouchableOpacity>
        <View style={{marginTop: 10}}>
          <Text
            style={{
              fontFamily: 'Inter-Regular',
              fontSize: moderateScale(14),
              color: '#AEACAB',
              marginLeft: 10,
            }}>
            ДЛИТЕЛЬНОСТЬ
          </Text>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 10,
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity
              onPress={() => SetIsHoursModalVisible(true)}
              style={{
                height: dimensions.height / 11,
                borderColor: '#C5BFBE',
                borderRadius: 20,
                borderWidth: 1,
                width: '48%',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: '#C5BFBE',
                  fontSize: moderateScale(14),
                  fontFamily: 'Inter-Regular',
                }}>
                {hours} ч
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => SetIsMinutesModalVisible(true)}
              style={{
                height: dimensions.height / 11,
                borderColor: '#C5BFBE',
                borderRadius: 20,
                borderWidth: 1,
                width: '48%',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: '#C5BFBE',
                  fontSize: moderateScale(14),
                  fontFamily: 'Inter-Regular',
                }}>
                {minutes} мин
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            height: dimensions.height / 10,
            marginTop: 15,
            width: '100%',
            justifyContent: 'center',
          }}>
          <TouchableOpacity
            onPress={() => SetIsInfoVisible(!is_info_visible)}
            style={{
              position: 'absolute',
              left: 10,
              zIndex: 1,
              elevation: 1,
              width: scale(20),
            }}>
            <Shadow
              startColor={'#00000008'}
              finalColor={'#00000001'}
              offset={[0, 5]}
              distance={8}
              viewStyle={{
                borderRadius: 30,
                aspectRatio: 1,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'white',
              }}>
              <View>
                <Text
                  style={{
                    color: colors.orange,
                    fontSize: moderateScale(14),
                    fontFamily: 'Inter-SemiBold',
                  }}>
                  i
                </Text>
              </View>
            </Shadow>
          </TouchableOpacity>
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
            startColor={price ? '#00000010' : '#0000'}
            finalColor={price ? '#00000002' : '#0000'}
            offset={price ? [0, 5] : [0, 0]}
            distance={!price ? 0 : undefined}
            corners={!price ? [] : undefined}
            sides={!price ? [] : undefined}
            size={!price ? 0 : undefined}>
            <TextInput
              style={{
                justifyContent: 'center',
                width: '90%',
                height: '100%',
                color: 'black',
                paddingLeft: 40,
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: moderateScale(17),
              }}
              value={price}
              placeholderTextColor={`#979493`}
              placeholder={price || 'не обязательно'}
              keyboardType="numeric"
              onChangeText={SetPrice}
            />

            <View
              style={{
                width: '10%',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontFamily: 'Inter-Medium',
                  fontSize: moderateScale(15),
                  color: 'rgb(127,122,122)',
                }}>
                ₽
              </Text>
            </View>
          </Shadow>
          <View
            style={{
              position: 'absolute',
              paddingVertical: 3,
              top: '-10%',
              paddingHorizontal: 8,
              backgroundColor: 'white',
              left: '5%',
              borderRadius: 8,
            }}>
            <Text
              style={{
                color: '#C5BEBE',
                fontFamily: 'Inter-Regular',
                fontSize: moderateScale(14),
              }}>
              стоимость
            </Text>
          </View>
        </View>
        {is_info_visible ? (
          <Text
            style={{
              marginTop: 5,
              fontSize: moderateScale(15),
              fontFamily: 'Inter-Regular',
              color: '#A9A6A6',
            }}>
            Если у вас сдельная оплата, то напишите стоимость уборки, если
            оклад, тогда оставьте поле не заполненным
          </Text>
        ) : null}
        <View>
          <Text
            style={{
              marginTop: 10,
              color: 'rgb(159,156,155)',
              fontFamily: 'Inter-Medium',
              fontSize: moderateScale(15),
            }}>
            вопросы
          </Text>
          <TouchableOpacity
            onPress={SetIsAddModalVisible}
            style={{
              height: dimensions.height / 10,
              backgroundColor: 'white',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
              borderRadius: 20,
              marginTop: 10,
            }}>
            <View
              style={{
                backgroundColor: 'rgba(243, 132, 52, 0.1)',
                width: scale(30),
                aspectRatio: 1,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 12,
              }}>
              <Text
                style={{
                  color: colors.orange,
                  fontFamily: 'Inter-Regular',
                  fontSize: moderateScale(16),
                  textAlignVertical: 'center',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                +
              </Text>
            </View>
            <Text
              style={{
                color: colors.orange,
                fontFamily: 'Inter-Medium',
                marginLeft: 10,
                fontSize: moderateScale(16),
              }}>
              Добавить
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {questions_and_photos.length ? (
        <Text
          style={{
            fontFamily: 'Inter-Medium',
            fontSize: moderateScale(14),
            color: 'rgb(159,156,155)',
            textAlign: 'center',
            marginTop: 5,
          }}>
          зажмите, чтобы переставить местами
        </Text>
      ) : null}
      <NestableDraggableFlatList
        data={questions_and_photos}
        onDragEnd={({data}) => SetQuestionsAndPhotos(data)}
        // style={{paddingHorizontal: 10}}
        keyExtractor={item => item.id}
        renderItem={renderItem}
      />
      {is_edit ? (
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
            Удалить чек-лист
          </Text>
        </TouchableOpacity>
      ) : (
        <View style={{marginVertical: 20, paddingHorizontal: 10}}>
          <Button
            text={'Сохранить чек-лист'}
            onPress={handleAddCheckList}
            disabled={is_button_disabled}
          />
        </View>
      )}

      {is_add_modal_visible ? (
        <BottomSheet
          height={verticalScale(200)}
          radius={20}
          hasDraggableIcon
          closeFunction={SetIsAddModalVisible}>
          <View
            style={{
              height: verticalScale(200),
              backgroundColor: 'white',
              padding: 10,
              width: '100%',
            }}>
            <TouchableOpacity onPress={ChangeIsOpenQuestionModal}>
              <Shadow
                {...getBoxShadow()}
                viewStyle={{
                  height: dimensions.height / 10,
                  backgroundColor: 'white',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  borderRadius: 20,
                }}>
                <Text
                  style={{
                    color: colors.orange,
                    fontFamily: 'Inter-Medium',
                    marginLeft: 10,
                    fontSize: moderateScale(16),
                  }}>
                  Вопрос-ответ
                </Text>
              </Shadow>
            </TouchableOpacity>
            <TouchableOpacity onPress={ChangeIsOpenPhotoModal}>
              <Shadow
                {...getBoxShadow()}
                viewStyle={{
                  height: dimensions.height / 10,
                  backgroundColor: 'white',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  borderRadius: 20,
                }}
                containerViewStyle={{marginTop: 20}}>
                <Text
                  style={{
                    color: colors.orange,
                    fontFamily: 'Inter-Medium',
                    marginLeft: 10,
                    fontSize: moderateScale(16),
                  }}>
                  Фотоотчет
                </Text>
              </Shadow>
            </TouchableOpacity>
          </View>
        </BottomSheet>
      ) : null}

      {is_question_modal_visible ? (
        <BottomSheet
          height={verticalScale(edit_id ? 420 : 390)}
          radius={20}
          plus_height={answers.length ? 70 : 0}
          hasDraggableIcon
          ref={questionbBottomSheet}
          closeFunction={ChangeIsOpenQuestionModal}>
          <KeyboardAvoidingView
            behavior={Platform.OS == 'ios' ? 'padding' : ''}
            style={{backgroundColor: 'white'}}>
            <View
              style={{padding: 10, backgroundColor: 'white', paddingTop: 0}}>
              <Input
                is_multiline={true}
                value={question}
                placeholderTextColor={`#979493`}
                placeholder="Например: вы нормально убрали?"
                onChangeText={SetQuestion}
                title={'ваш вопрос'}
                is_title_visible={true}
                no_shadow={true}
              />
              <View
                style={{
                  height: verticalScale(50),
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: 20,
                  alignItems: 'center',
                }}>
                <View style={{height: '100%', width: '85%'}}>
                  <Input
                    placeholder="Например: безусловно"
                    placeholderTextColor={`#979493`}
                    value={answer}
                    onChangeText={SetAnswer}
                    title="вариант ответа"
                    is_title_visible={true}
                    height={'100%'}
                    no_shadow={true}
                  />
                </View>

                <TouchableOpacity
                  disabled={!answer}
                  onPress={AddAnswer}
                  style={{
                    backgroundColor: answer ? colors.orange : '#fef3eb',
                    width: '12%',
                    aspectRatio: 1,
                    borderRadius: 15,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 10,
                  }}>
                  <Check
                    width={14}
                    height={10}
                    fill={answer ? 'white' : '#FACCAB'}
                  />
                </TouchableOpacity>
              </View>
              {answers.length ? (
                <ScrollView
                  style={{height: verticalScale(60), marginBottom: 10}}>
                  <View
                    style={{
                      flexWrap: 'wrap',
                      width: '100%',
                      flexDirection: 'row',
                    }}>
                    {answers.map(el => (
                      <View
                        key={el}
                        style={{
                          flexDirection: 'row',
                          padding: 5,
                          backgroundColor: '#fef3eb',
                          borderRadius: 8,
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: 3,
                        }}>
                        <Text
                          style={{
                            color: colors.orange,
                            fontSize: moderateScale(14),
                            fontFamily: 'Inter-Regular',
                            marginRight: 5,
                          }}>
                          {el}
                        </Text>
                        <TouchableOpacity
                          onPress={() =>
                            SetAnswers(prev => prev.filter(q => el != q))
                          }>
                          <X fill={'#FACCAB'} />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                </ScrollView>
              ) : null}
              <View style={{marginBottom: verticalScale(20)}}>
                <Button
                  height={verticalScale(50)}
                  text={'Сохранить вопрос'}
                  onPress={AddQuestion}
                  disabled={!(question && answers.length)}
                />
              </View>
              {edit_id ? (
                <TouchableOpacity
                  onPress={DeleteQuestion}
                  style={{
                    marginBottom: verticalScale(20),
                  }}>
                  <Text
                    style={{
                      fontFamily: 'Inter-Medium',
                      fontSize: moderateScale(15),
                      color: 'gray',
                      textAlign: 'center',
                    }}>
                    Удалить вопрос
                  </Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </KeyboardAvoidingView>
        </BottomSheet>
      ) : null}
      {is_photo_modal_visible ? (
        <BottomSheet
          height={verticalScale(edit_id ? 360 : 330)}
          radius={20}
          plus_height={answers.length ? 0 : 70}
          hasDraggableIcon
          ref={photoBottomSheet}
          closeFunction={ChangeIsOpenPhotoModal}>
          <KeyboardAvoidingView
            behavior={Platform.OS == 'ios' ? 'padding' : ''}
            style={{backgroundColor: 'white'}}>
            <View
              style={{padding: 10, paddingTop: 0, backgroundColor: 'white'}}>
              <Input
                is_multiline={true}
                value={photos_text}
                placeholderTextColor={`#979493`}
                placeholder="Например: сделайте фото заправленной кровати"
                onChangeText={SetPhotosText}
                title={'какое фото нужно сделать'}
                is_title_visible={true}
                no_shadow={true}
              />
              <View style={{marginVertical: verticalScale(20)}}>
                <Button
                  height={verticalScale(50)}
                  text={'Сохранить задачу сделать фото'}
                  onPress={AddPhotosTask}
                  disabled={!photos_text}
                />
              </View>
              {edit_id ? (
                <TouchableOpacity
                  onPress={DeletePhoto}
                  style={{marginBottom: verticalScale(20)}}>
                  <Text
                    style={{
                      fontFamily: 'Inter-Medium',
                      fontSize: moderateScale(15),
                      color: 'gray',
                      textAlign: 'center',
                    }}>
                    Удалить фотоотчет
                  </Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </KeyboardAvoidingView>
        </BottomSheet>
      ) : null}
      {is_warging_modal_open ? (
        <WarningModal
          CloseModal={() => SetIsWargingModalOpen(false)}
          warning={'Заполните название'}
        />
      ) : null}

      {is_cancel_modal_open ? (
        is_edit ? (
          <EditCancelModal
            CloseModal={() => {
              SetIsCancelModalOpen(false);
              navigation.navigate('ListOfCheckLists');
            }}
            CloseModalWithSave={async () => {
              if (!is_button_disabled) {
                await handleEditCheckList();
                navigation.navigate('ListOfCheckLists');
              } else SetIsWargingModalOpen(true);
              SetIsCancelModalOpen(false);
            }}
          />
        ) : (
          <AddCancelModal
            GoBack={() => {
              SetIsCancelModalOpen(false);
              navigation.goBack();
            }}
            Stay={() => SetIsCancelModalOpen(false)}
          />
        )
      ) : null}
      {is_delete_modal_open ? (
        <DeleteModal
          DeleteCheckList={handleDeleteCheckList}
          CloseModal={() => SetIsDeleteModalOpen(false)}
        />
      ) : null}

      <ModalPicker
        data={hours_values}
        onPick={SetHours}
        visible={is_hours_modal_visible}
        closeModal={() => SetIsHoursModalVisible(false)}
      />
      <ModalPicker
        data={minutes_values}
        onPick={SetMinutes}
        visible={is_minutes_modal_visible}
        closeModal={() => SetIsMinutesModalVisible(false)}
      />
    </NestableScrollContainer>
  );
};

const AddCancelModal = ({GoBack, Stay}) => {
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
            Сохранить изменения?
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
            При нажатии на кнопку “Выйти” данные не сохранятся
          </Text>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 10,
              borderTopColor: '#E5E3E2',
              borderTopWidth: 1,
            }}>
            <TouchableOpacity
              onPress={GoBack}
              style={{width: '50%', padding: 8}}>
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
            <View
              style={{backgroundColor: '#E5E3E2', width: 1, height: '100%'}}
            />
            <TouchableOpacity
              onPress={Stay}
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
                Остаться
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const EditCancelModal = ({CloseModal, CloseModalWithSave}) => {
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
            Сохранить изменения?
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
            При нажатии на кнопку “Не сохранять” данные вернутся в прошлое
            состояние
          </Text>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 10,
              borderTopColor: '#E5E3E2',
              borderTopWidth: 1,
            }}>
            <TouchableOpacity
              onPress={CloseModal}
              style={{width: '50%', padding: 8}}>
              <Text
                style={{
                  fontFamily: 'Inter-Regular',
                  fontSize: moderateScale(15),
                  color: '#E6443A',
                  textAlign: 'center',
                }}>
                Не сохранять
              </Text>
            </TouchableOpacity>
            <View
              style={{backgroundColor: '#E5E3E2', width: 1, height: '100%'}}
            />
            <TouchableOpacity
              onPress={CloseModalWithSave}
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
                Сохранить
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const WarningModal = ({CloseModal, warning}) => {
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
            {warning}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 10,
              borderTopColor: '#E5E3E2',
              borderTopWidth: 1,
            }}>
            <TouchableOpacity
              onPress={CloseModal}
              style={{
                width: '100%',
                padding: 8,
              }}>
              <Text
                style={{
                  fontFamily: 'Inter-SemiBold',
                  fontSize: moderateScale(15),
                  color: 'black',
                  textAlign: 'center',
                }}>
                Ок
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const DeleteModal = ({DeleteCheckList, CloseModal}) => {
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
            Удалить чек-лист?
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
            Вы уверены, что хотите удалить чек-лист? Все данные чек-листа
            удалятся без возможности восстановления
          </Text>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 10,
              borderTopColor: '#E5E3E2',
              borderTopWidth: 1,
            }}>
            <TouchableOpacity
              onPress={DeleteCheckList}
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
