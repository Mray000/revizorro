import moment from 'moment';
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {api} from 'utils/api';
import {Header} from 'utils/Header';
import {Loader} from 'utils/Loader';
import {moderateScale} from 'utils/Normalize';
import Map from 'assets/map.svg';
import Home from 'assets/home.svg';
import Check from 'assets/check.svg';
import CheckList from 'assets/check_list.svg';
import {dimensions} from 'utils/dimisions';
import {convertType} from 'utils/flat_types';
import {colors} from 'utils/colors';
export const ReportCleaning = ({navigation, route}) => {
  let id = route.params.id;

  const [cleaning, SetCleaning] = useState(null);
  const [is_reject, SetIsReject] = useState(true);
  const [rejected_answers, SetRejectedAnswers] = useState([]);

  useEffect(() => {
    api.getCleaning(id).then(SetCleaning);
  }, []);

  if (!cleaning) return <Loader />;
  let {flat, check_lists, maid, time_cleaning, fill_questions} = cleaning;

  return (
    <ScrollView>
      <Header onBack={() => navigation.goBack()} />
      <View style={{padding: 20}}>
        <Text
          style={{
            fontFamily: 'Inter-SemiBold',
            fontSize: moderateScale(17),
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
                  }}>
                  ул Пушкино, д. 12, корп. 2, кв. 33
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
                <TouchableOpacity
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
              </View>
            </View>
            <Text
              style={{
                marginTop: 10,
                fontFamily: 'Inter-Regular',
                fontSize: moderateScale(15),
                color: '#AAA8A7',
                marginLeft: 10,
              }}>
              результаты уборки
            </Text>
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
                  return [...rejected_answers, fill_question];
                else
                  return rejected_answers.filter(
                    el => el.id != fill_question.id,
                  );
              })
            }
          />
        ))}
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
  SetIsRejected,
}) => {
  const [is_input_active, SetIsInputActive] = useState(false);
  const [reject_text, SetRejectText] = useState('');
  return (
    <TouchableOpacity
      disabled={!is_reject || is_input_active}
      onPress={SetIsRejected}
      style={{alignItems: 'center'}}>
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
