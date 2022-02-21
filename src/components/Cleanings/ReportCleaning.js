import moment from 'moment';
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from 'react-native';
import {api, ImageURL} from 'utils/api';
import {Header} from 'utils/Header';
import {Loader} from 'utils/Loader';
import {moderateScale} from 'utils/Normalize';
import Map from 'assets/map.svg';
import Home from 'assets/home.svg';
import Check from 'assets/check.svg';
import CheckList from 'assets/check_list.svg';
import RedNext from 'assets/red_next.svg';
import Star from 'assets/star.svg';
import ArrowRight from 'assets/arrow_right.svg';
import SelectedLocation from 'assets/selected_location.svg';
import selected_location from 'assets/location.png';
import {dimensions} from 'utils/dimisions';
import {convertType} from 'utils/flat_types';
import {colors} from 'utils/colors';
import {Button} from 'utils/Button';
import MapView, {Marker} from 'react-native-maps';
import {app} from 'store/app';
export const ReportCleaning = ({navigation, route}) => {
  let id = route.params.cleaning.id;
  const [cleaning, SetCleaning] = useState(null);
  const [is_reject, SetIsReject] = useState(false);
  const [rejected_answers, SetRejectedAnswers] = useState([]);
  const [rating, SetRating] = useState(0);
  const [is_map_visible, SetIsMapVisible] = useState(false);
  useEffect(() => {
    api.getCleaning(id).then(SetCleaning);
  }, []);

  if (!cleaning) return <Loader />;

  let {
    flat,
    check_lists,
    maid,
    inspector,
    time_cleaning,
    fill_questions,
    status,
    amount_checks,
    amount_defects,
    location,
  } = cleaning;
  console.log(cleaning.id, 'AMOUNT');
  let is_repeat = amount_checks;
  let is_complited = status == 'accepted';
  if (!is_complited && is_repeat)
    fill_questions = fill_questions.filter(el => !el.checked);
  const handleReportCleaning = async () => {
    await api.reportCleaning(
      is_reject ? 0 : rating,
      id,
      fill_questions.map(answer =>
        rejected_answers.find(el => el.id == answer.id)
          ? {
              fill_question_id: answer.id,
              checked: false,
              comment: rejected_answers.find(el => el.id == answer.id)
                .reject_text,
            }
          : {
              fill_question_id: answer.id,
              checked: true,
            },
      ),
    );
    navigation.navigate('Success', {
      to: 'CleaningsList',
      title: !is_reject ? 'Уборка принята' : 'Отказ успешно отправлен',
      description: !is_reject
        ? 'Исполнитель получит уведомление'
        : 'Исполнитель получит ваши комментарии и отправит отчёт на проверку повторно',
    });
  };
  if (is_map_visible)
    return (
      <View>
        <Header
          onBack={() => SetIsMapVisible(false)}
          title={'Местоположение горничной'}
        />
        <MapView
          region={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0,
            longitudeDelta: 0,
          }}
          style={{width: '100%', height: '100%'}}>
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}>
            <Image source={selected_location} style={{height: 40, width: 35}} />
          </Marker>
        </MapView>
      </View>
    );
  return (
    <ScrollView>
      <Header onBack={() => navigation.goBack()} />
      <View style={{paddingHorizontal: 20, paddingTop: 10}}>
        <Text
          style={{
            fontFamily: 'Inter-SemiBold',
            fontSize: moderateScale(18),
            color: 'black',
          }}>
          {is_reject
            ? 'Отметьте пункты, которые вы не принимаете:'
            : flat.title}
        </Text>
        {!is_reject ? (
          <Text
            style={{
              fontSize: moderateScale(15),
              fontFamily: 'Inter-Medium',
              color: '#9E9494',
            }}>
            {moment(time_cleaning).format('DD MMM HH:mm')}
          </Text>
        ) : null}

        {!is_reject ? (
          <View style={{width: '100%'}}>
            <View
              style={{
                height: dimensions.height / 10,
                backgroundColor: 'white',
                marginTop: 10,
                shadowColor: '#C8C7C7',
                shadowOffset: {
                  width: 0,
                  height: 0,
                },
                shadowOpacity: 0.51,
                shadowRadius: 13.16,
                elevation: 20,
                paddingHorizontal: 20,
                alignItems: 'center',
                justifyContent: 'center',
                padding: 10,
                borderRadius: 20,
                flexDirection: 'row',
                width: '100%',
              }}>
              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    width: '5%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 10,
                  }}>
                  <Map fill="#C5BFBE" />
                </View>
                <Text
                  numberOfLines={2}
                  style={{
                    fontFamily: 'Inter-Regular',
                    fontSize: moderateScale(15),
                    color: 'black',
                    marginTop: 5,
                  }}>
                  {flat.title}
                </Text>
              </View>
            </View>

            <View
              style={{
                width: '100%',
                height: dimensions.height / 10,
                backgroundColor: 'white',
                marginTop: 10,
                shadowColor: '#C8C7C7',
                shadowOffset: {
                  width: 0,
                  height: 0,
                },
                shadowOpacity: 0.51,
                shadowRadius: 13.16,
                elevation: 20,
                paddingHorizontal: 20,
                alignItems: 'center',
                justifyContent: 'center',
                padding: 10,
                borderRadius: 20,
                flexDirection: 'row',
              }}>
              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    width: '5%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 10,
                  }}>
                  <Home fill="#C5BFBE" />
                </View>
                <Text
                  numberOfLines={2}
                  style={{
                    fontFamily: 'Inter-Regular',
                    fontSize: moderateScale(15),
                    color: 'black',
                  }}>
                  {convertType(flat.type)}
                </Text>
              </View>
            </View>
            <View
              style={{
                height: dimensions.height / 10,
                backgroundColor: 'white',
                marginTop: 10,
                shadowColor: '#C8C7C7',
                shadowOffset: {
                  width: 0,
                  height: 0,
                },
                shadowOpacity: 0.51,
                shadowRadius: 13.16,
                elevation: 20,
                paddingHorizontal: 20,
                alignItems: 'center',
                justifyContent: 'center',
                padding: 10,
                borderRadius: 20,
                flexDirection: 'row',
              }}>
              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    width: '5%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 10,
                  }}>
                  <CheckList fill="#C5BFBE" />
                </View>
                <Text
                  style={{
                    color: 'black',
                    fontFamily: 'Inter-Regular',
                    fontSize: moderateScale(15),
                    marginTop: 5,
                  }}>
                  {check_lists.map(
                    (el, i) =>
                      el.name + (i == check_lists.length - 1 ? ' ' : ', '),
                  )}
                </Text>
              </View>
            </View>
            {is_complited ? (
              <TouchableOpacity
                disabled={inspector.role == 'role_admin'}
                onPress={() => {
                  if (
                    app.role == 'role_admin' ||
                    app.accesses.includes('workers')
                  ) {
                    navigation.navigate('Workers', {
                      screen: 'WorkerProfile',
                      params: {worker: inspector},
                    });
                  } else {
                    navigation.navigate('WorkerProfile', {worker: inspector});
                  }
                }}
                style={{width: '100%'}}>
                <Text
                  style={{
                    marginTop: 10,
                    fontFamily: 'Inter-Regular',
                    fontSize: moderateScale(15),
                    color: '#AAA8A7',
                    marginLeft: 10,
                  }}>
                  проверил
                </Text>
                <View
                  style={{
                    height: dimensions.height / 10,
                    backgroundColor: 'white',
                    marginTop: 10,
                    shadowColor: '#C8C7C7',
                    shadowOffset: {
                      width: 0,
                      height: 0,
                    },
                    shadowOpacity: 0.51,
                    shadowRadius: 13.16,
                    elevation: 20,
                    paddingHorizontal: 20,
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 10,
                    borderRadius: 20,
                    flexDirection: 'row',
                    width: '100%',
                  }}>
                  <View
                    style={{
                      width: '100%',
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <View
                      style={{
                        width: '15%',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 10,
                      }}>
                      <Image
                        source={{uri: inspector.avatar}}
                        style={{
                          width: '100%',
                          aspectRatio: 1,
                          borderRadius: 100,
                        }}
                      />
                    </View>
                    <Text
                      numberOfLines={2}
                      style={{
                        fontFamily: 'Inter-Regular',
                        fontSize: moderateScale(15),
                        color: 'black',
                        width: '50%',
                      }}>
                      {inspector.first_name + ' ' + inspector.last_name}
                    </Text>
                    <View style={{position: 'absolute', right: 10}}>
                      <ArrowRight fill="#C4C2C2" />
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ) : null}

            <TouchableOpacity
              onPress={() => {
                if (
                  app.role == 'role_admin' ||
                  app.accesses.includes('workers')
                ) {
                  navigation.navigate('Workers', {
                    screen: 'WorkerProfile',
                    params: {worker: maid},
                  });
                } else {
                  navigation.navigate('WorkerProfile', {worker: maid});
                }
              }}
              style={{width: '100%'}}>
              <Text
                style={{
                  marginTop: 10,
                  fontFamily: 'Inter-Regular',
                  fontSize: moderateScale(15),
                  color: '#AAA8A7',
                  marginLeft: 10,
                }}>
                горинчная
              </Text>
              <View
                style={{
                  height: dimensions.height / 10,
                  backgroundColor: 'white',
                  marginTop: 10,
                  shadowColor: '#C8C7C7',
                  shadowOffset: {
                    width: 0,
                    height: 0,
                  },
                  shadowOpacity: 0.51,
                  shadowRadius: 13.16,
                  elevation: 20,
                  paddingHorizontal: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 10,
                  borderRadius: 20,
                  flexDirection: 'row',
                  width: '100%',
                }}>
                <View
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      width: '15%',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: 10,
                    }}>
                    <Image
                      source={{uri: maid.avatar}}
                      style={{width: '100%', aspectRatio: 1, borderRadius: 100}}
                    />
                  </View>
                  <Text
                    numberOfLines={2}
                    style={{
                      fontFamily: 'Inter-Regular',
                      fontSize: moderateScale(15),
                      color: 'black',
                      width: '50%',
                    }}>
                    {maid.first_name + ' ' + maid.last_name}
                  </Text>
                  {!is_complited ? (
                    <TouchableOpacity
                      onPress={() => SetIsMapVisible(true)}
                      style={{
                        backgroundColor: '#FEF3EB',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 10,
                        padding: 10,
                      }}>
                      <Map fill={colors.orange} />
                      <Text
                        style={{
                          fontSize: moderateScale(15),
                          color: colors.orange,
                          fontFamily: 'Inter-Medium',
                          marginLeft: 5,
                        }}>
                        на карте
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={{position: 'absolute', right: 10}}>
                      <ArrowRight fill="#C4C2C2" />
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
            {!is_complited ? (
              <View
                style={{flexDirection: 'row', marginLeft: 10, marginTop: 10}}>
                <Text
                  style={{
                    fontFamily: 'Inter-Regular',
                    fontSize: moderateScale(15),
                    color: '#AAA8A7',
                  }}>
                  результаты уборки
                </Text>
                {is_repeat ? (
                  <Text
                    style={{
                      color: '#E8443A',
                      fontFamily: 'Inter-Regular',
                      fontSize: moderateScale(15),
                    }}>
                    {' '}
                    ({amount_checks + 1}-я проверка)
                  </Text>
                ) : null}
              </View>
            ) : (
              <View style={{marginTop: 10}}>
                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                  <Text
                    style={{
                      fontFamily: 'Inter-SemiBold',
                      color: 'black',
                      fontSize: moderateScale(17),
                      marginTop: 10,
                    }}>
                    Результаты уборки
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 10,
                      justifyContent: 'center',
                    }}>
                    {[1, 2, 3, 4, 5].map(el => (
                      <View style={{marginLeft: 3}} key={el}>
                        <Star
                          fill={
                            Number(cleaning.rating) < el ? '#DFDCDC' : '#F38434'
                          }
                          width={45}
                          height={45}
                        />
                      </View>
                    ))}
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: '100%',
                    marginTop: 10,
                  }}>
                  <View
                    style={{
                      backgroundColor: '#F8ECEC',
                      padding: 10,
                      width: '48%',
                      borderRadius: 10,
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        color: '#E8443A',
                        fontFamily: 'Inter-SemiBold',
                        fontSize: moderateScale(15),
                      }}>
                      Проверок: {amount_checks}
                    </Text>
                  </View>
                  <View
                    style={{
                      backgroundColor: '#F8ECEC',
                      padding: 10,
                      width: '48%',
                      borderRadius: 10,
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        color: '#E8443A',
                        fontFamily: 'Inter-SemiBold',
                        fontSize: moderateScale(15),
                      }}>
                      Недочетов: {amount_defects}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </View>
        ) : null}
      </View>
      <View style={{paddingHorizontal: 20, marginBottom: 20}}>
        {fill_questions.map((fill_question, index) => (
          <AnswerComponent
            index={index}
            question={fill_question}
            is_reject={is_reject}
            is_answer_rejected={rejected_answers.find(
              el => el.id == fill_question.id,
            )}
            question_text={
              check_lists
                .find(check_list =>
                  check_list.questions.find(
                    el => el.id == fill_question.question,
                  ),
                )
                .questions.find(el => el.id == fill_question.question)
                .question_text
            }
            SetIsRejected={() =>
              SetRejectedAnswers(() => {
                if (!rejected_answers.find(el => el.id == fill_question.id))
                  return [
                    ...rejected_answers,
                    {...fill_question, reject_text: ''},
                  ];
                else
                  return rejected_answers.filter(
                    el => el.id != fill_question.id,
                  );
              })
            }
            reject_text={
              rejected_answers.find(el => el.id == fill_question.id)
                ?.reject_text
            }
            SetRejectText={reject_text => {
              SetRejectedAnswers(() => {
                let new_rejected_answers = rejected_answers.map(el => {
                  if (el.id == fill_question.id) el.reject_text = reject_text;
                  return el;
                });
                return new_rejected_answers;
              });
            }}
          />
        ))}
        {!is_complited ? (
          !is_reject ? (
            <View>
              <View style={{alignItems: 'center', justifyContent: 'center'}}>
                <Text
                  style={{
                    fontFamily: 'Inter-SemiBold',
                    color: 'black',
                    fontSize: moderateScale(17),
                    marginTop: 10,
                  }}>
                  Оцените качество уборки
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 10,
                    justifyContent: 'center',
                  }}>
                  {[1, 2, 3, 4, 5].map(el => (
                    <TouchableOpacity
                      onPress={() => SetRating(el)}
                      style={{marginLeft: 3}}
                      key={el}>
                      <Star
                        fill={Number(rating) < el ? '#DFDCDC' : '#F38434'}
                        width={45}
                        height={45}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: 20,
                }}>
                <TouchableOpacity
                  onPress={handleReportCleaning}
                  disabled={!rating}
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '49%',
                    borderRadius: 20,
                    height: dimensions.height / 10,
                    backgroundColor: rating ? colors.orange : '#ECEAEA',
                  }}>
                  <Text
                    style={{
                      fontSize: moderateScale(16),
                      fontFamily: 'Inter-Medium',
                      color: rating ? 'white' : '#A19E9D',
                    }}>
                    Принять
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => SetIsReject(true)}
                  style={{
                    backgroundColor: '#F8ECEC',
                    width: '49%',
                    borderRadius: 20,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderColor: '#F5CAC8',
                    height: dimensions.height / 10,
                    borderWidth: 1,
                  }}>
                  <Text
                    style={{
                      fontSize: moderateScale(16),
                      fontFamily: 'Inter-Medium',
                      color: '#E8443A',
                    }}>
                    Отклонить
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity
              disabled={!rejected_answers.every(el => el.reject_text)}
              onPress={handleReportCleaning}
              style={{
                height: dimensions.height / 10,
                backgroundColor: '#F8ECEC',
                width: '100%',
                borderRadius: 20,
                justifyContent: 'center',
                alignItems: 'center',
                borderColor: '#F5CAC8',
                borderWidth: 1,
                marginTop: 15,
              }}>
              <Text
                style={{
                  color: '#E8443A',
                  fontSize: moderateScale(15),
                  fontFamily: 'Inter-Medium',
                }}>
                Отправить отказ
              </Text>
              <RedNext
                width={23}
                height={23}
                style={{position: 'absolute', right: 20}}
              />
            </TouchableOpacity>
          )
        ) : null}
      </View>
    </ScrollView>
  );
};

const AnswerComponent = ({
  index,
  question,
  is_reject,
  is_answer_rejected,
  question_text,
  reject_text,
  SetRejectText,
  SetIsRejected,
}) => {
  const [is_input_active, SetIsInputActive] = useState(false);
  return (
    <TouchableOpacity
      disabled={!is_reject || is_input_active}
      onPress={SetIsRejected}
      style={{alignItems: 'center', marginTop: 10}}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        {is_reject ? (
          <View style={{width: '5%', marginRight: 10}}>
            <View
              style={{
                width: 20,
                height: 20,
                borderRadius: 100,
                borderWidth: 1,
                borderColor: !is_answer_rejected ? '#C5BEBE' : '#E8443A',
                marginRight: 10,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: !is_answer_rejected ? 'white' : '#E8443A',
              }}>
              {is_answer_rejected ? (
                <Check fill="white" width={12} height={14} />
              ) : null}
            </View>
          </View>
        ) : null}
        <View
          style={{
            backgroundColor: is_answer_rejected ? '#FEF7F5' : 'white',
            shadowColor: '#C8C7C7',
            shadowOffset: {
              width: 0,
              height: 0,
            },
            shadowOpacity: 0.51,
            shadowRadius: 13.16,
            elevation: 20,
            paddingHorizontal: 20,
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: is_answer_rejected ? '#E8443A' : 'white',
            padding: 10,
            borderRadius: 20,
            width: is_reject ? '95%' : '100%',
          }}>
          <Text
            style={{
              fontSize: moderateScale(14),
              color: '',
              fontFamily: 'Inter-Regular',
            }}>
            {index + 1 + '.' + ' ' + question_text}
          </Text>
          {question.answer ? (
            <Text
              style={{
                color: 'black',
                fontFamily: 'Inter-Medium',
                fontSize: moderateScale(15),
              }}>
              {question.answer}
            </Text>
          ) : (
            <View style={{width: '100%', flex: 1}}>
              {question.images.map(el => {
                const [ratio, SetRatio] = useState(null);
                Image.getSize(el.image, (w, h) => SetRatio(w / h));
                return (
                  <Image
                    resizeMode="contain"
                    style={{
                      width: '100%',
                      aspectRatio: ratio,
                      marginTop: 10,
                      borderRadius: 20,
                    }}
                    source={{uri: el.image}}
                  />
                );
              })}
            </View>
          )}
        </View>
      </View>
      {is_answer_rejected ? (
        <View style={{width: '100%', flexDirection: 'row', marginTop: 10}}>
          <View style={{width: '5%', marginRight: 10}} />
          <View
            style={{
              shadowColor: '#C8C7C7',
              shadowOffset: {
                width: 0,
                height: 0,
              },
              shadowOpacity: 0.51,
              shadowRadius: 13.16,
              elevation: 20,
              backgroundColor: 'white',
              width: '95%',
              borderRadius: 15,
              padding: 10,
            }}>
            <Text
              style={{
                color: '#E8443A',
                fontFamily: 'Inter-Regular',
                fontSize: moderateScale(14),
              }}>
              Ваш комментарий к пункту № {index + 1}:
            </Text>
            <TextInput
              multiline={true}
              value={reject_text}
              onChangeText={SetRejectText}
              onFocus={() => SetIsInputActive(true)}
              onBlur={() => SetIsInputActive(false)}
              style={{
                borderBottomWidth: 1,
                borderColor: is_input_active
                  ? '#E8443A'
                  : reject_text
                  ? 'white'
                  : '#E8443A',
                paddingVertical: 3,
                fontSize: moderateScale(16),
                fontFamily: 'Inter-Medium',
              }}
            />
          </View>
        </View>
      ) : null}
    </TouchableOpacity>
  );
};
