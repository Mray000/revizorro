import {observer} from 'mobx-react-lite';
import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {authentication} from 'store/authentication';
import {profile} from 'store/profile';

export const CleaningList = observer(({navigation}) => {
  const logout = () => {
    authentication.logout();
    navigation.navigate('Login');
  };
  return (
    <View>
      <Text style={{color: 'black'}}>Нужна проверка</Text>
      <TouchableOpacity onPress={logout}>
        <Text style={{color: 'black'}}>Выйти из аккаунта(для теста)</Text>
      </TouchableOpacity>
    </View>
  );
});

const Card = () => {
  return (
    <View>
      <Text>{card.flat.id}</Text>
      <View>
        {card.check_lists.map(el => (
          <Text>{el.name}</Text>
        ))}
      </View>
      <View>
        <Image source={card.maid.avatar} />
        <Text>{card.maid.first_name + card.maid.last_name}</Text>
      </View>
    </View>
  );
};
