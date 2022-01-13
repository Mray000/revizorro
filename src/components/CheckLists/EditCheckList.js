import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {R, Shadow} from 'react-native-shadow-2';
import {dimensions} from 'utils/dimisions';
import {Input} from 'utils/Input';
import ArrowRight from 'assets/arrow_right.svg';
import {colors} from 'utils/colors';
import {Header} from 'utils/Header';
import {moderateScale, scale, verticalScale} from 'utils/Normalize';
import BottomSheet from 'utils/BottomSheet';
import Check from 'assets/check.svg';
import {app} from 'store/app';
import X from 'assets/x.svg';
import {Button} from 'utils/Button';
import {api} from 'utils/api';
import {convertType, types} from 'utils/flat_types';
export const EditCheckList = ({navigation, route}) => {
  let check_list = route.params.check_list;
  console.log(check_list);

  const [title, SetTitle] = useState(check_list.name);
  const [price, SetPrice] = useState(
    check_list.cost ? String(check_list.cost) : '',
  );
  const [questions, SetQuestions] = useState(
    check_list.questions
      .filter(el => el.question_type == 'type_text')
      .map(el => ({id: el.id, text: el.question_text, answers: el.answer})),
  );
  const [photos_tasks, SetPhotosTasks] = useState(
    check_list.questions
      .filter(el => el.question_type == 'type_photo')
      .map(el => ({id: el.id, text: el.question_text})),
  );
  const [question, SetQuestion] = useState('');
  const [answers, SetAnswers] = useState([]);
  const [answer, SetAnswer] = useState('');
  const [photos_text, SetPhotosText] = useState('');
  const [photos_count, SetPhotosCount] = useState(0);
  const [edit_id, SetEditId] = useState(null);
  const [is_load, SetIsLoad] = useState(false);
  const [is_question_modal_visible, SetIsQuestionModalVisible] =
    useState(false);
  const [is_photo_modal_visible, SetIsPhotoModalVisible] = useState(false);
  const [is_info_visible, SetIsInfoVisible] = useState(false);
  const [is_delete_modal_open, SetIsDeleteModalOpen] = useState(false);
  const [is_cancel_modal_open, SetIsCancelModalOpen] = useState(false);

  let type = route.params?.type || convertType(check_list.type);

  let questionbBottomSheet = useRef();
  let photoBottomSheet = useRef();

  const ChangeIsOpenQuestionModal = () => {
    if (is_question_modal_visible) {
      SetEditId(null);
      SetQuestion('');
      SetAnswers([]);
    }
    app.setIsBottomNavigatorVisible(is_question_modal_visible);
    SetIsQuestionModalVisible(!is_question_modal_visible);
  };

  const ChangeIsOpenPhotoModal = () => {
    if (is_photo_modal_visible) {
      SetEditId(null);
      SetPhotosText('');
      SetPhotosCount(0);
    }
    app.setIsBottomNavigatorVisible(is_photo_modal_visible);
    SetIsPhotoModalVisible(!is_photo_modal_visible);
  };

  const AddAnswer = () => {
    if (!answers.includes(answer)) SetAnswers(prev => [...prev, answer]);
    SetAnswer('');
  };

  const AddQuestion = () => {
    if (!edit_id) {
      SetQuestions(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          answers,
          text: question,
          new: true,
        },
      ]);
    } else {
      SetQuestions(prev => {
        let new_questions = prev.map(el => {
          if (el.id == edit_id) {
            let new_task = {
              id: edit_id,
              text: question,
              answers,
              changed: true,
              new: el.new,
            };
            return new_task;
          } else return el;
        });
        return new_questions;
      });
      SetEditId(null);
    }
    ChangeIsOpenQuestionModal();
  };

  const AddPhotosTask = () => {
    if (!edit_id) {
      SetPhotosTasks(prev => [
        ...prev,
        {id: Date.now().toString(), text: photos_text, new: true},
      ]);
    } else {
      SetPhotosTasks(prev => {
        let new_questions = prev.map(el => {
          if (el.id == edit_id) {
            let new_task = {
              id: edit_id,
              text: photos_text,
              changed: true,
              new: el.new,
            };
            return new_task;
          } else return el;
        });
        return new_questions;
      });
      SetEditId(null);
    }
    ChangeIsOpenPhotoModal();
  };

  const EditQuestion = question => {
    SetQuestion(question.text);
    SetAnswers(question.answers);
    SetEditId(question.id);
    ChangeIsOpenQuestionModal();
  };

  const EditPhotoTask = task => {
    SetPhotosText(task.text);
    SetEditId(task.id);
    ChangeIsOpenPhotoModal();
  };

  const handleEditCheckList = async () => {
    SetIsLoad(true);
    await api.editCheckList({
      id: check_list.id,
      name: title,
      type: types[type],
      cost: Number(price),
    });

    await Promise.all(
      [
        ...questions.map(q => ({
          id: q.id,
          question_type: 'type_text',
          question_text: q.text,
          answer: q.answers,
          new: q.new,
          changed: q.changed,
        })),
        ...photos_tasks.map(q => ({
          id: q.id,
          question_type: 'type_photo',
          question_text: q.text,
          new: q.new,
          changed: q.changed,
        })),
      ].map(el => {
        if (el.new) return api.addQuestion(el);
        if (el.changed) return api.editQuestion(el);
      }),
    );
    navigation.navigate('ListOfCheckLists');
    SetIsLoad(false);
  };

  const handleDeleteCheckList = async () => {
    await api.deleteCheckList(check_list.id);
    SetIsDeleteModalOpen(false);
    navigation.navigate('ListOfCheckLists');
  };
  useEffect(() => {
    if (questionbBottomSheet.current) questionbBottomSheet.current.show();
  }, [is_question_modal_visible]);

  useEffect(() => {
    if (photoBottomSheet.current) photoBottomSheet.current.show();
  }, [is_photo_modal_visible]);

  let is_button_disabled =
    !(questions.length || photos_tasks.length || type || title) || is_load;

  return (
    <>
      <KeyboardAwareScrollView>
        <Header
          to={'ListOfCheckLists'}
          navigation={navigation}
          title={'Чек-лист'}
          onBack={() => SetIsCancelModalOpen(true)}
          children={
            <TouchableOpacity
              style={{position: 'absolute', right: 20}}
              disabled={is_button_disabled}
              onPress={handleEditCheckList}>
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
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('FlatTypes', {
                type,
                check_list,
                parent: 'EditCheckList',
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
            {title ? (
              <Text
                style={{
                  position: 'absolute',
                  padding: 3,
                  top: '-10%',
                  paddingLeft: 8,
                  paddingRight: 8,
                  backgroundColor: 'white',
                  left: '5%',
                  borderRadius: 8,
                  color: '#C5BEBE',
                }}>
                Подщодящий тип недвижимости
              </Text>
            ) : null}
          </TouchableOpacity>
          <View
            style={{
              height: dimensions.height / 10,
              marginTop: 15,
              width: '100%',
              justifyContent: 'center',
            }}>
            <Shadow
              startColor={'#00000008'}
              finalColor={'#00000001'}
              offset={[0, 5]}
              distance={8}
              containerViewStyle={{
                position: 'absolute',
                left: 10,
                zIndex: 1,
                elevation: 1,
                width: scale(20),
              }}
              viewStyle={{
                borderRadius: 30,
                aspectRatio: 1,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'white',
              }}>
              <TouchableOpacity
                onPress={() => SetIsInfoVisible(!is_info_visible)}>
                <Text
                  style={{
                    color: colors.orange,
                    fontSize: moderateScale(14),
                    fontFamily: 'Inter-SemiBold',
                  }}>
                  i
                </Text>
              </TouchableOpacity>
            </Shadow>
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
            <Text
              style={{
                position: 'absolute',
                padding: 3,
                top: '-10%',
                paddingLeft: 8,
                paddingRight: 8,
                backgroundColor: 'white',
                left: '5%',
                borderRadius: 8,
                color: '#C5BEBE',
              }}>
              стоимость
            </Text>
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
            {questions.length ? (
              <Text
                style={{
                  marginTop: 10,
                  color: 'rgb(159,156,155)',
                  fontFamily: 'Inter-Medium',
                  fontSize: moderateScale(15),
                }}>
                вопросы
              </Text>
            ) : null}

            {/* <TouchableOpacity
              onPress={ChangeIsOpenQuestionModal}
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
                Добавить вопрос
              </Text>
            </TouchableOpacity> */}
          </View>
        </View>
        <View style={{paddingHorizontal: 10}}>
          {questions.map(({text, answers, id}, i) => (
            <TouchableOpacity
              style={{
                backgroundColor: 'white',
                borderRadius: 20,
                padding: 15,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 10,
              }}
              onPress={() => EditQuestion({text, answers, id})}>
              <View>
                <Text
                  style={{
                    color: 'black',
                    fontSize: moderateScale(15),
                    fontFamily: 'Inter-Medium',
                  }}>
                  {i + 1}. {text}
                </Text>
                <Text
                  style={{
                    color: '#8C8383',
                    marginTop: 2,
                    fontSize: moderateScale(14),
                    fontFamily: 'Inter-Regular',
                  }}>
                  {answers.join(' / ')}
                </Text>
              </View>
              <ArrowRight fill="#CAC8C8" />
            </TouchableOpacity>
          ))}

          <View>
            {photos_tasks.length ? (
              <Text
                style={{
                  marginTop: 10,
                  color: 'rgb(159,156,155)',
                  fontFamily: 'Inter-Medium',
                  fontSize: moderateScale(15),
                }}>
                фото
              </Text>
            ) : null}

            {/* <TouchableOpacity
              onPress={ChangeIsOpenPhotoModal}
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
                Добавить задачу сделать фото
              </Text>
            </TouchableOpacity> */}
            {photos_tasks.map(({text, id}, i) => (
              <TouchableOpacity
                style={{
                  backgroundColor: 'white',
                  borderRadius: 20,
                  padding: 15,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: 10,
                }}
                onPress={() => EditPhotoTask({text, id})}>
                <View>
                  <Text
                    style={{
                      color: 'black',
                      fontSize: moderateScale(15),
                      fontFamily: 'Inter-Medium',
                    }}>
                    {questions.length + i + 1}. {text}
                  </Text>
                </View>
                <ArrowRight fill="#CAC8C8" />
              </TouchableOpacity>
            ))}
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
        </View>
      </KeyboardAwareScrollView>
      {is_question_modal_visible ? (
        <BottomSheet
          height={verticalScale(370)}
          radius={20}
          minus_height={answers.length ? 0 : 70}
          hasDraggableIcon
          ref={questionbBottomSheet}
          closeFunction={ChangeIsOpenQuestionModal}>
          <View style={{padding: 10, backgroundColor: 'white'}}>
            <View style={{height: verticalScale(150)}}>
              <TextInput
                multiline={true}
                style={{
                  height: '100%',
                  backgroundColor: 'white',
                  borderRadius: 20,
                  borderColor: '#E5E3E2',
                  borderWidth: 1,
                  padding: 25,
                  textAlignVertical: 'top',
                }}
                value={question}
                placeholderTextColor={`#979493`}
                placeholder="напр: вы нормально убрали?"
                onChangeText={SetQuestion}
              />
              <Text
                style={{
                  position: 'absolute',
                  padding: 3,
                  top: -10,
                  paddingLeft: 8,
                  paddingRight: 8,
                  backgroundColor: 'white',
                  left: '5%',
                  borderRadius: 8,
                  color: !question ? 'rgb(197, 190, 190)' : 'black',
                }}>
                ваш вопрос
              </Text>
            </View>
            <View
              style={{
                height: verticalScale(50),
                marginTop: 10,
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 10,
                alignItems: 'center',
              }}>
              <View style={{height: '100%', width: '85%'}}>
                <TextInput
                  style={{
                    height: '100%',
                    backgroundColor: 'white',
                    borderRadius: 20,
                    borderColor: '#E5E3E2',
                    borderWidth: 1,
                    paddingLeft: 25,
                  }}
                  placeholder="напр: безусловно"
                  placeholderTextColor={`#979493`}
                  value={answer}
                  onChangeText={SetAnswer}
                />
                <Text
                  style={{
                    position: 'absolute',
                    padding: 3,
                    top: -10,
                    paddingLeft: 8,
                    paddingRight: 8,
                    backgroundColor: 'white',
                    left: '5%',
                    borderRadius: 8,
                    color: !answer ? 'rgb(197, 190, 190)' : 'black',
                  }}>
                  вариант ответа
                </Text>
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
                }}>
                <Check fill={answer ? 'white' : '#FACCAB'} />
              </TouchableOpacity>
            </View>
            {answers.length ? (
              <ScrollView style={{height: verticalScale(60), marginBottom: 10}}>
                <View
                  style={{
                    flexWrap: 'wrap',
                    width: '100%',
                    flexDirection: 'row',
                  }}>
                  {answers.map(el => (
                    <View
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
                          fontFamily: 'Inter-Regualar',
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

            <Button
              height={verticalScale(50)}
              text={'Сохранить вопрос'}
              onPress={AddQuestion}
              disabled={!(question && answers.length)}
            />
          </View>
        </BottomSheet>
      ) : null}
      {is_photo_modal_visible ? (
        <BottomSheet
          height={verticalScale(310)}
          radius={20}
          minus_height={answers.length ? 0 : 70}
          hasDraggableIcon
          ref={photoBottomSheet}
          closeFunction={ChangeIsOpenPhotoModal}>
          <View style={{padding: 10, backgroundColor: 'white'}}>
            <View
              style={{
                height: verticalScale(150),
                marginBottom: verticalScale(10),
              }}>
              <TextInput
                multiline={true}
                style={{
                  height: '100%',
                  backgroundColor: 'white',
                  borderRadius: 20,
                  borderColor: '#E5E3E2',
                  borderWidth: 1,
                  padding: 25,
                  textAlignVertical: 'top',
                }}
                value={photos_text}
                placeholderTextColor={`#979493`}
                placeholder="напр: сделайте фото заправленной кровати"
                onChangeText={SetPhotosText}
              />
              <Text
                style={{
                  position: 'absolute',
                  padding: 3,
                  top: -10,
                  paddingLeft: 8,
                  paddingRight: 8,
                  backgroundColor: 'white',
                  left: '5%',
                  borderRadius: 8,
                  color: !question ? 'rgb(197, 190, 190)' : 'black',
                }}>
                какое фото нужно сделать
              </Text>
            </View>
            {/* <View
              style={{
                height: verticalScale(50),
                marginTop: 10,
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 10,
                alignItems: 'center',
              }}>
              <View
                style={{
                  height: '100%',
                  width: '100%',
                  justifyContent: 'center',
                }}>
                <TextInput
                  style={{
                    height: '100%',
                    backgroundColor: 'white',
                    borderRadius: 20,
                    borderColor: '#E5E3E2',
                    borderWidth: 1,
                    paddingLeft: 25,
                  }}
                  placeholderTextColor={`#979493`}
                  value={photos_count}
                  onChangeText={SetPhotosCount}
                  keyboardType="numeric"
                />
                <Text
                  style={{
                    position: 'absolute',
                    padding: 3,
                    top: -10,
                    paddingLeft: 8,
                    paddingRight: 8,
                    backgroundColor: 'white',
                    left: '5%',
                    borderRadius: 8,
                    color: !answer ? 'rgb(197, 190, 190)' : 'black',
                  }}>
                  сколько фото нужно сделать
                </Text>
                <View
                  style={{
                    position: 'absolute',
                    right: '5%',
                  }}>
                  <ArrowRight
                    fill={!photos_count ? '#CAC8C8' : colors.orange}
                  />
                </View>
              </View>
            </View> */}
            <Button
              height={verticalScale(50)}
              text={'Сохранить задачу сделать фото'}
              onPress={AddPhotosTask}
              disabled={!photos_text}
            />
          </View>
        </BottomSheet>
      ) : null}
      {is_delete_modal_open ? (
        <DeleteModal
          DeleteFlat={handleDeleteCheckList}
          CloseModal={() => SetIsDeleteModalOpen(false)}
        />
      ) : null}
      {is_cancel_modal_open ? (
        <CancelModal
          CloseModal={() => {
            SetIsCancelModalOpen(false);
            navigation.navigate('ListOfCheckLists');
          }}
          CloseModalWithSave={async () => {
            await handleEditCheckList();
            SetIsCancelModalOpen(false);
            navigation.navigate('ListOfCheckLists');
          }}
        />
      ) : null}
    </>
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

const CancelModal = ({CloseModal, CloseModalWithSave}) => {
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
