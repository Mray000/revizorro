import {makeAutoObservable} from 'mobx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {api} from 'utils/api';
import {app} from './app';

class Authentication {
  accessToken = '';
  refreshToken = '';
  constructor() {
    makeAutoObservable(this);
  }
  login = async (login, password) => {
    let is_login = await api.login(login, password);
    if (is_login) await app.setMe();
    return is_login;
  };

  SetAccessToken = accessToken => {
    this.accessToken = accessToken;
  };

  SetRefreshToken = refreshToken => {
    this.refreshToken = refreshToken;
  };

  logout() {
    this.SetAccessToken('');
    this.SetRefreshToken('');
    
    AsyncStorage.removeItem('accessToken');
    AsyncStorage.removeItem('refreshToken');
  }
  registration = async (name, surname, company, email, password) => {
    let body = {
      first_name: name,
      last_name: surname,
      company_name: company,
      email,
      password, 
    };
    let data = await api.registration(body);
    if (data.Error)
      return data.Error.includes('email') ? 'email_exist' : 'phone_exist';
    if (data.email) return 'email_incorrect';
    await api.login(email, password);
    await api.setTarif(1);
    return 'is_ok';
  };
}

export const authentication = new Authentication();
