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
import {Header} from 'utils/Header';
import {moderateScale, verticalScale} from 'utils/Normalize';
import {dimensions} from 'utils/dimisions';
import Map from 'assets/map.svg';
import {GetBlocks} from 'utils/GetBlocks';
import {Button} from 'utils/Button';
import {QuestionButton} from './QuestionButton';
import ArrowLeft from 'assets/arrow_left.svg';
import ArrowRight from 'assets/arrow_right.svg';
import Camera from 'assets/camera.svg';
import Swiper from 'react-native-swiper';
import {launchCamera} from 'react-native-image-picker';
import {PhotoComponent} from 'utils/PhotoComponent';
import {requestLocationPermission} from 'utils/PermisionsAccess';
import Geolocation from '@react-native-community/geolocation';
import {api} from 'utils/api';
export const CompleteCleaning = ({navigation, route}) => {
  let cleaning = route.params.cleaning;
  let check_lists = cleaning.check_lists;
  let questions_and_photos = check_lists
    .reduce((acc, el) => {
      acc = [...acc, ...el.questions];
      return acc;
    }, [])
    .sort(el => (el.question_type == 'type_text' ? -1 : 1));
  const [index, SetIndex] = useState(0);
  const [question_index, SetQuestionIndex] = useState(0);
  const [is_questions, SetIsQuestions] = useState(false);
  const [coords, SetCoords] = useState(null);
  const [photo_modal, SetPhotoModal] = useState(null);
  const [first_answer, SetFirstAnswer] = useState(null);
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

  const GetCoords = async () => {
    let is_ok = await requestLocationPermission();
    if (is_ok) {
      Geolocation.getCurrentPosition(SetCoords, alert.error, {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 60 * 60,
      });
      SetIndex(index + 1);
    }
    // SetIndex(index + 1);
  };

  const handleCompleteCleaning = async () => {
    await api.comepleteCleaning(cleaning.id, questions_and_photos_with_answers);
    navigation.navigate('Success', {
      to: 'HousemaidCleanings',
      title: 'Ваша отчет принят',
      description: 'Спасибо за уборку!',
    });
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
    const result = await launchCamera({mediaType: 'photo'});
    if (!result.didCancel)
      SetQuestionsAndPhotosWithAnswers(prev => {
        let new_data = prev.map(el => {
          if (el.id == id) el.answer = [...el.answer, ...result.assets];
          return el;
        });
        return new_data;
      });
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

  let complete_procent =
    ((index + question_index + 1 + (is_questions ? 1 : 0)) /
      (3 + questions_and_photos.length)) *
    100;

  let steps = [
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
    <View style={{paddingHorizontal: 10, width: '100%', marginVertical: 10}}>
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
      <ScrollView style={{height: '75%'}}>
        {GetBlocks(
          [
            ...cleaning.flat.images,
            ...cleaning.flat.images,
            ...cleaning.flat.images,
            ...cleaning.flat.images,
            ...cleaning.flat.images,
          ],
          3,
        ).map(block => (
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
        marginTop={10}
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

  let questions_and_photos_views = questions_and_photos.map(question => {
    let question_answer = questions_and_photos_with_answers.find(
      el => el.id == question.id,
    ).answer;
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
          {question_answer.length ? (
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
            {question_index + 2}
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
      ) : null}
      {!is_questions ? (
        <View
          style={{
            height: dimensions.height - verticalScale(50) - 40,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {steps[index]}
        </View>
      ) : (
        <Swiper
          ref={swipper}
          autoplay={false}
          onIndexChanged={SetQuestionIndex}
          //   scrollEnabled={!(question_index == 0 || is_next_disabled)}
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
            disabled={
              !(Array.isArray(current_answer)
                ? current_answer.length
                : current_answer)
            }
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
