import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
} from 'react-native';
import {colors} from 'utils/colors';
import {Header} from 'styled_components/Header';
import {moderateScale, verticalScale} from 'utils/normalize';
import {dimensions} from 'utils/dimisions';
import Map from 'assets/map.svg';
import {getBlocks} from 'utils/get_blocks';
import {Button} from 'styled_components/Button';
import {QuestionButton} from './QuestionButton';
import ArrowLeft from 'assets/arrow_left.svg';
import ArrowRight from 'assets/arrow_right.svg';
import Camera from 'assets/camera.svg';
import Swiper from 'react-native-swiper';
import {launchCamera} from 'react-native-image-picker';
import {PhotoComponent} from 'styled_components/PhotoComponent';
import {
  requestCameraPermission,
  requestLocationPermission,
} from 'utils/PermisionsAccess';
import Geolocation from '@react-native-community/geolocation';
import {api} from 'utils/api';
export const CompleteCleaning = ({navigation, route}) => {
  let cleaning = route.params.cleaning;
  let check_lists = cleaning.check_lists;
  let is_rejected = !!cleaning.amount_checks;
  console.log(is_rejected);
  let fill_questions = cleaning.fill_questions.filter(el => !el.checked);
  let questions_and_photos = check_lists
    .reduce((acc, el) => {
      acc = [...acc, ...el.questions];
      return acc;
    }, [])
    .sort(el => (el.question_type == 'type_text' ? -1 : 1));
  if (is_rejected)
    questions_and_photos = questions_and_photos.filter(el =>
      fill_questions.find(f_q => f_q.question == el.id),
    );
  const [index, SetIndex] = useState(0);
  const [question_index, SetQuestionIndex] = useState(0);
  const [is_questions, SetIsQuestions] = useState(is_rejected);
  const [photo_modal, SetPhotoModal] = useState(null);
  const [first_answer, SetFirstAnswer] = useState(null);
  const [is_load, SetIsLoad] = useState(false);
  const [questions_and_photos_with_answers, SetQuestionsAndPhotosWithAnswers] =
    useState([
      ...questions_and_photos.map(q => ({
        id: q.id,
        answer: q.question_type === 'type_text' ? null : [],
      })),
    ]);
  let swipper = useRef();
  let current_answer = questions_and_photos_with_answers[question_index].answer;
  let is_first_question = question_index == 0;
  let is_last_question = question_index == questions_and_photos.length - 1;
  let is_back_disabled = is_first_question;
  let is_next_disabled =
    !(Array.isArray(current_answer) ? current_answer.length : current_answer) ||
    is_last_question;
  let is_button_disabled =
    !(Array.isArray(current_answer) ? current_answer.length : current_answer) ||
    is_load;

  const GetCoords = async () => {
    let is_ok = await requestLocationPermission();
    console.log(is_ok, '@1434');
    if (is_ok) {
      Geolocation.getCurrentPosition(
        coords => {
          console.log(coords);
          api.sendCoords(cleaning.id, coords);
        },
        alert.error,
        {
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 60 * 60 * 60 * 10,
        },
      );
      SetIndex(index + 1);
    }
  };

  const handleCompleteCleaning = async () => {
    SetIsLoad(true);
    if (!is_rejected) {
      await api.comepleteCleaning(
        cleaning.id,
        questions_and_photos_with_answers,
      );
    } else {
      await api.resendCleaning(
        questions_and_photos_with_answers.map(el => {
          el.id = fill_questions.find(q => q.question == el.id).id;
          return el;
        }),
      );
    }
    navigation.navigate('Success', {
      to: 'HousemaidCleanings',
      title: 'Ваш отчет принят',
      description: 'Спасибо за уборку!',
    });
    SetIsLoad(false);
  };

  const SetAnswer = (id, answer) => {
    SetQuestionsAndPhotosWithAnswers(prev => {
      let new_data = prev.map(el => {
        if (el.id == id) el.answer = answer;
        return el;
      });
      return new_data;
    });
  };
  const AddPhoto = async id => {
    let is_ok = await requestCameraPermission();
    if (is_ok) {
      const result = await launchCamera({mediaType: 'photo'});
      if (!result.didCancel)
        SetQuestionsAndPhotosWithAnswers(prev => {
          console.log(result);
          let new_data = prev.map(el => {
            if (el.id == id) el.answer = [...el.answer, ...result.assets];
            return el;
          });
          return new_data;
        });
    }
  };

  const DeletePhoto = async (id, photo) => {
    SetQuestionsAndPhotosWithAnswers(prev => {
      let new_data = prev.map(el => {
        if (el.id == id) el.answer = el.answer.filter(el => el != photo);
        return el;
      });
      return new_data;
    });
  };

  let steps = is_rejected
    ? []
    : [
        <View style={{width: '75%', alignItems: 'center'}}>
          <Text
            style={{
              fontFamily: 'Inter-SemiBold',
              fontSize: moderateScale(20),
              color: 'black',
              textAlign: 'center',
            }}>
            Подтвердите ваше местоположение
          </Text>
          <TouchableOpacity
            onPress={GetCoords}
            style={{
              backgroundColor: '#FEF3EB',
              padding: 7,
              borderRadius: 10,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 10,
            }}>
            <Map fill={colors.orange} />
            <Text
              style={{
                color: colors.orange,
                marginLeft: 10,
                fontFamily: 'Inter-Regular',
                fontSize: moderateScale(16),
              }}>
              Поделиться местоположением
            </Text>
          </TouchableOpacity>
        </View>,
        <View
          style={{
            paddingHorizontal: 10,
            width: '100%',
          }}>
          <Text
            style={{
              fontFamily: 'Inter-SemiBold',
              fontSize: moderateScale(19),
              color: 'black',
              textAlign: 'center',
            }}>
            Посмотрите на фотографии, как должна выглядеть чистая квартира
          </Text>
          <Text
            style={{
              textAlign: 'center',
              color: '#AEACAB',
              fontSize: moderateScale(15),
              fontFamily: 'Inter-Regular',
            }}>
            нажмите чтобы увеличить
          </Text>
          <ScrollView style={{height: '70%'}}>
            {getBlocks([...cleaning.flat.images], 3).map(block => (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  marginTop: 10,
                }}>
                {block.map(el => (
                  <TouchableOpacity
                    style={{width: '30%', aspectRatio: 1}}
                    onPress={() => SetPhotoModal(el.image)}>
                    <Image
                      style={{width: '100%', aspectRatio: 1, borderRadius: 10}}
                      source={{uri: el.image}}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </ScrollView>
          <Button
            text={'Понятно, дальше'}
            onPress={() => SetIndex(index + 1)}
          />
          <ModalPhoto
            CloseModal={() => SetPhotoModal(null)}
            photo_modal={photo_modal}
          />
        </View>,
        <View
          style={{
            width: '100%',
            paddingHorizontal: 20,
            height: '100%',
            justifyContent: 'space-between',
          }}>
          <View style={{width: '100%', alignItems: 'center'}}>
            <Text
              style={{
                fontFamily: 'Inter-SemiBold',
                fontSize: moderateScale(16),
                color: 'black',
              }}>
              {1}
              <Text
                style={{
                  fontFamily: 'Inter-SemiBold',
                  fontSize: moderateScale(16),
                  color: '#DCDBDB',
                }}>
                {' '}
                / {questions_and_photos.length + 1}
              </Text>
            </Text>
          </View>
          <View>
            <Text
              style={{
                fontFamily: 'Inter-SemiBold',
                fontSize: moderateScale(20),
                color: 'black',
                textAlign: 'center',
              }}>
              Квартира после уборки выглядит так же, как на фото, которые мы вам
              показали?
            </Text>
            <View>
              {['Да', 'Нет'].map(answer => (
                <QuestionButton
                  text={answer}
                  selected={first_answer == answer}
                  marginTop={10}
                  onPress={() => {
                    SetFirstAnswer(answer);
                    setTimeout(() => SetIsQuestions(true), 500);
                  }}
                />
              ))}
            </View>
          </View>
          <View />
        </View>,
      ];

  let complete_procent =
    ((index +
      question_index +
      (!is_rejected ? 1 : 0) +
      (is_questions ? 1 : 0)) /
      (steps.length + questions_and_photos.length)) *
    100;

  let questions_and_photos_views = questions_and_photos.map(question => {
    let question_answer = questions_and_photos_with_answers.find(
      el => el.id == question.id,
    )?.answer;
    if (question.question_type == 'type_text') {
      return (
        <ScrollView
          style={{
            width: '100%',
            height: '100%',
            paddingHorizontal: 20,
          }}
          contentContainerStyle={{
            width: '100%',
            height: '100%',
            justifyContent: 'center',
          }}>
          <View>
            <Text
              style={{
                fontFamily: 'Inter-SemiBold',
                fontSize: moderateScale(20),
                color: 'black',
                textAlign: 'center',
              }}>
              {question.question_text}
            </Text>
            <View style={{maxHeight: '90%'}}>
              <ScrollView style={{flexGrow: 0}}>
                {question.answer.map(answer => (
                  <QuestionButton
                    text={answer}
                    marginTop={10}
                    selected={question_answer == answer}
                    onPress={() => SetAnswer(question.id, answer)}
                  />
                ))}
              </ScrollView>
            </View>
          </View>
        </ScrollView>
      );
    } else {
      return (
        <View
          style={{
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            padding: 20,
          }}>
          <Text
            style={{
              fontFamily: 'Inter-SemiBold',
              fontSize: moderateScale(20),
              color: 'black',
              textAlign: 'center',
              marginBottom: 10,
            }}>
            {question.question_text}
          </Text>
          {question_answer?.length ? (
            <View style={{maxHeight: '85%', paddingBottom: 10}}>
              <ScrollView style={{flexGrow: 0}}>
                {question_answer.map(photo => (
                  <PhotoComponent
                    photo={photo}
                    DeletePhoto={() => DeletePhoto(question.id, photo)}
                  />
                ))}
              </ScrollView>
            </View>
          ) : null}
          <TouchableOpacity
            onPress={() => AddPhoto(question.id)}
            style={{
              height: dimensions.height / 10,
              backgroundColor: '#FEF3EB',
              borderRadius: 20,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
            }}>
            <Camera />
            <Text
              style={{
                fontFamily: 'Inter-Medium',
                color: colors.orange,
                fontSize: moderateScale(16),
                marginLeft: 10,
              }}>
              Сделать фото
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
  });

  steps = [...steps, ...questions_and_photos_views];

  return (
    <>
      <View
        style={{
          height: 5,
          backgroundColor: '#E6E6E6',
          width: '100%',
          marginVertical: 10,
        }}>
        <View
          style={{
            height: '100%',
            backgroundColor: colors.orange,
            width: complete_procent + '%',
            position: 'absolute',
          }}
        />
      </View>
      <Header
        navigation={navigation}
        to="HousemaidCleanings"
        title={cleaning.flat.title}
      />
      {is_questions ? (
        <View style={{width: '100%', alignItems: 'center'}}>
          <Text
            style={{
              fontFamily: 'Inter-SemiBold',
              fontSize: moderateScale(16),
              color: 'black',
            }}>
            {question_index + (!is_rejected ? 2 : 1)}
            <Text
              style={{
                fontFamily: 'Inter-SemiBold',
                fontSize: moderateScale(16),
                color: '#DCDBDB',
              }}>
              {' '}
              / {questions_and_photos.length + (!is_rejected ? 1 : 0)}
            </Text>
          </Text>
        </View>
      ) : null}
      {is_rejected ? (
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 20,
            marginTop: 10,
          }}>
          <Text
            style={{
              color: '#9F9494',
              fontSize: moderateScale(15),
              fontFamily: 'Inter-Regular',
            }}>
            Комментарий:
          </Text>
          <View
            style={{
              width: '100%',
              padding: 10,
              borderWidth: 1,
              borderColor: '#E5E3E2',
              borderRadius: 15,
              marginTop: 10,
            }}>
            <Text
              style={{
                color: '#E8443A',
                fontFamily: 'Inter-Medium',
                fontSize: moderateScale(15),
                textAlign: 'center',
              }}>
              {
                fill_questions.find(
                  el => el.question == questions_and_photos[question_index].id,
                ).comment
              }
            </Text>
          </View>
        </View>
      ) : null}
      {!is_questions ? (
        <View
          style={{
            height: dimensions.height - verticalScale(50) - 40,
            justifyContent: !(!is_rejected && index == 1) ? 'center' : undefined,
            alignItems: 'center',
          }}>
          {steps[index]}
        </View>
      ) : (
        <Swiper
          ref={swipper}
          autoplay={false}
          onIndexChanged={SetQuestionIndex}
          scrollEnabled={!(is_next_disabled || is_back_disabled)}
          showsHorizontalScrollIndicator={false}
          showsPagination={false}
          showsButtons={false}
          loop={false}
          index={question_index}
          dotStyle={{width: 0}}
          style={{
            height: dimensions.height - verticalScale(50) - 40,
          }}>
          {questions_and_photos_views.map(el => el)}
        </Swiper>
      )}

      {is_last_question ? (
        <View style={{paddingHorizontal: 20, marginBottom: 10}}>
          <Button
            onPress={handleCompleteCleaning}
            disabled={is_button_disabled}
            text={'Отправить отчет на проверку'}
          />
        </View>
      ) : null}
      {is_questions ? (
        <View
          style={{
            flexDirection: 'row',
            marginBottom: 20,
            justifyContent: 'center',
          }}>
          <TouchableOpacity
            disabled={is_back_disabled}
            onPress={() => swipper.current.scrollBy(-1)}
            style={{flexDirection: 'row', alignItems: 'center'}}>
            <ArrowLeft fill={is_back_disabled ? '#D7D5D5' : colors.orange} />
            <Text
              style={{
                color: is_back_disabled ? '#AEACAB' : colors.orange,
                fontSize: moderateScale(16),
                fontFamily: 'Inter-Medium',
                marginLeft: 10,
              }}>
              Назад
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => swipper.current.scrollBy(1)}
            disabled={is_next_disabled}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: 50,
            }}>
            <Text
              style={{
                color: is_next_disabled ? '#AEACAB' : colors.orange,
                fontSize: moderateScale(16),
                fontFamily: 'Inter-Medium',
                marginRight: 8,
              }}>
              Вперед
            </Text>
            <ArrowRight fill={is_next_disabled ? '#D7D5D5' : colors.orange} />
          </TouchableOpacity>
        </View>
      ) : null}
    </>
  );
};

const ModalPhoto = ({CloseModal, photo_modal}) => {
  if (!photo_modal) return null;
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
            width: '90%',
            alignItems: 'center',
            overflow: 'hidden',
          }}>
          <Image
            source={{uri: photo_modal}}
            style={{width: '100%', aspectRatio: 1}}
          />
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
                Закрыть
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
