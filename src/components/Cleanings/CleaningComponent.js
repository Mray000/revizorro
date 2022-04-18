import React from 'react';
import ArrowRight from 'assets/arrow_right.svg';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {Shadow} from 'react-native-shadow-2';
import {moderateScale, scale} from 'utils/normalize';
import moment from 'moment';
import {cleaning as cleaning_store} from 'store/cleaning';
import {colors} from 'utils/colors';
import CleaningOnCheck from 'assets/cleaning_on_check';

export const CleaningComponent = React.memo(
  ({
    cleaning,
    is_completed,
    is_need_check,
    is_housemaid,
    navigation,
    is_on_check,
    housemaid,
    disabled,
  }) => {
    let {
      id,
      flat,
      check_lists,
      maid,
      time_cleaning,
      amount_checks,
      fill_questions,
    } = cleaning;
    if (housemaid) maid = housemaid;
    const getDate = () => {
      let today = moment();
      let date = moment(time_cleaning);
      let time = date.format('HH:mm');
      if (date.format('YYYY-MM-DD') == today.format('YYYY-MM-DD')) return time;
      if (date.format('YYYY-MM-DD') == today.add(1, 'day').format('YYYY-MM-DD'))
        return 'завтра ' + time;
      return date.format('D MMM') + ' ' + time;
    };

    const onPress = () => {
      console.log(is_housemaid)
      if (is_housemaid && is_need_check) {
        console.log(34)
        return navigation.navigate('CompleteCleaning', {cleaning});
      }

      if (is_completed || is_need_check) {
        return navigation.navigate('ReportCleaning', {cleaning});
      }

      cleaning_store.setEditId(id);
      cleaning_store.setFlat(flat);
      cleaning_store.setCheckLists(check_lists);
      cleaning_store.setHousemaid(maid);
      cleaning_store.setTime(time_cleaning);
      cleaning_store.setDate(time_cleaning);
      navigation.navigate('EditCleaning');
    };

    const getDeclinationQuestion = (word, count) => {
      if (count == 0 || count > 4) word += 'ов';
      if (count >= 2 && count <= 4) word += 'а';
      return word;
    };

    const getDeclinationAmountChecks = (word, count) => {
      if (count == 0 || count > 4) word += 'ок';
      if (count == 1) word += 'ка';
      if (count >= 2 && count <= 4) word += 'ки';
      return word;
    };

    const getQuestionsCount = () => {
      let count = 0;
      if (!(is_housemaid && (is_need_check || is_on_check) && amount_checks)) {
        check_lists.forEach(check_list => {
          count += check_list.questions.filter(
            el => el.question_type == 'type_text',
          ).length;
        });
      } else {
        fill_questions
          .filter(el => !el.checked)
          .forEach(el => {
            let check_list_with_questions = check_lists.find(check_list =>
              check_list.questions.find(q => q.id == el.question),
            );
            count +=
              check_list_with_questions.questions.find(q => q.id == el.question)
                .question_type == 'type_text'
                ? 1
                : 0;
          });
      }

      return count;
    };

    const getPhotosCount = () => {
      let count = 0;
      if (!(is_housemaid && (is_need_check || is_on_check) && amount_checks)) {
        check_lists.forEach(check_list => {
          count += check_list.questions.filter(
            el => el.question_type == 'type_photo',
          ).length;
        });
      } else {
        fill_questions
          .filter(el => !el.checked)
          .forEach(el => {
            let check_list_with_questions = check_lists.find(check_list =>
              check_list.questions.find(q => q.id == el.question),
            );
            count +=
              check_list_with_questions.questions.find(q => q.id == el.question)
                .question_type == 'type_photo'
                ? 1
                : 0;
          });
      }
      return count;
    };

    return (
      <Shadow
        startColor={!is_completed ? '#00000003' : '#0000'}
        finalColor={!is_completed ? '#00000002' : '#0000'}
        offset={!is_completed ? [0, 5] : [0, 0]}
        distance={is_completed ? 0 : undefined}
        corners={is_completed ? [] : undefined}
        sides={is_completed ? [] : undefined}
        size={is_completed ? 0 : undefined}
        viewStyle={{width: '100%', paddingHorizontal: 1}}>
        <TouchableOpacity
          disabled={disabled}
          onPress={onPress}
          style={{
            backgroundColor: is_completed ? 'transparent' : 'white',
            width: '100%',
            padding: 15,
            borderRadius: 20,
            marginTop: 10,
            borderWidth: 1,
            borderColor: is_completed ? '#D8D6D5' : 'white',
            paddingBottom: 5,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                {is_on_check ? (
                  <View style={{marginRight: 10}}>
                    <CleaningOnCheck />
                  </View>
                ) : null}
                {is_need_check ? (
                  <View
                    style={{
                      width: scale(15),
                      aspectRatio: 1,
                      borderRadius: scale(40),
                      backgroundColor: '#FCE5E3',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: 5,
                    }}>
                    <View
                      style={{
                        width: scale(8),
                        aspectRatio: 1,
                        borderRadius: scale(20),
                        backgroundColor: '#E8443A',
                      }}
                    />
                  </View>
                ) : null}
                <Text
                  style={{
                    fontSize: moderateScale(16),
                    color: 'black',
                    fontFamily: 'Inter-SemiBold',
                  }}>
                  {flat?.title || moment(time_cleaning).format('D MMMM HH:mm')}
                </Text>
              </View>
              {!is_housemaid ? (
                <Text
                  style={{
                    color: '#8B8887',
                    fontFamily: 'Inter-Regular',
                    fontSize: moderateScale(14),
                    marginTop: 5,
                  }}>
                  {check_lists.map(
                    (el, i) =>
                      el.name + (i == check_lists.length - 1 ? ' ' : ', '),
                  )}
                </Text>
              ) : null}

              {!is_housemaid ? (
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: 5,
                    alignItems: 'center',
                  }}>
                  <Image
                    source={{uri: maid.avatar}}
                    style={{
                      width: scale(30),
                      aspectRatio: 1,
                      borderRadius: 30,
                      marginRight: 10,
                    }}
                  />
                  <Text
                    style={{
                      fontFamily: 'Inter-Medium',
                      fontSize: moderateScale(15),
                      color: 'black',
                    }}>
                    {maid.first_name + ' ' + maid.last_name}
                  </Text>
                </View>
              ) : (
                <View>
                  <Text
                    style={{
                      color: 'black',
                      fontSize: moderateScale(15),
                      fontFamily: 'Inter-Regular',
                      marginTop: 6,
                    }}>
                    {flat.address}
                  </Text>
                </View>
              )}
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop:
                (amount_checks > 0 && !is_completed) || is_housemaid ? 5 : -5,
            }}>
            {!is_housemaid ? (
              amount_checks > 0 && !is_completed ? (
                <View
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    backgroundColor: '#FDF2F2',
                    borderRadius: 10,
                  }}>
                  <Text
                    style={{
                      color: '#EA5A51',
                      fontSize: moderateScale(14),
                      fontFamily: 'Inter-Regular',
                    }}>
                    {amount_checks + 1}-я проверка
                  </Text>
                </View>
              ) : (
                <View />
              )
            ) : !is_on_check ? (
              <Text
                style={{
                  color: '#8B8887',
                  fontFamily: 'Inter-Regular',
                  fontSize: moderateScale(15),
                }}>
                {is_completed
                  ? amount_checks +
                    ' ' +
                    getDeclinationAmountChecks('провер', amount_checks)
                  : getQuestionsCount() +
                    ' ' +
                    getDeclinationQuestion('вопрос', getQuestionsCount()) +
                    ', ' +
                    getPhotosCount() +
                    ' фото'}
              </Text>
            ) : (
              <Text
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  backgroundColor: '#FEF3EB',
                  color: colors.orange,
                  fontSize: moderateScale(14),
                  fontFamily: 'Inter-Regular',
                  borderRadius: 10,
                }}>
                на проверке
              </Text>
            )}

            <View
              style={{
                borderColor: '#EEEDED',
                borderRadius: 10,
                borderWidth: 1,
                paddingHorizontal: 5,
                paddingVertical: 3,
              }}>
              <Text
                style={{
                  color: '#8B8887',
                  fontSize: moderateScale(14),
                  fontFamily: 'Inter-Regular',
                }}>
                {getDate()}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={{position: 'absolute', top: '50%', right: 15}}>
            <ArrowRight fill="black" />
          </TouchableOpacity>
        </TouchableOpacity>
      </Shadow>
    );
  },
);
