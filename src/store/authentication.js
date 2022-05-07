import {makeAutoObservable} from 'mobx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {api, getTokensFromStorage} from 'utils/api';
import {app} from './app';
import {rate, tarif} from './tarif';

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

  logout = () => {
    this.SetAccessToken('');
    this.SetRefreshToken('');
    AsyncStorage.removeItem('accessToken');
    AsyncStorage.removeItem('refreshToken');
    app.setAccesses([]);
    app.setRole(null);
    app.setName('');
    app.setId(null);
    tarif.setIsTarifActive(false);
    tarif.setIsTarifPaid(false);
  };

  registration = async (name, surname, company, email, password) => {
    let body = {
      first_name: name,
      last_name: surname,
      company_name: company,
      email,
      password,
    };
    let data = await api.registration(body);
    console.log(data);
    if (data?.detail) return 'email_exist';
    if (data?.email) return 'email_incorrect';
    await this.login(email, password);
    return 'is_ok';
  };

  onAppOpen = async () => {
    let tokens = await getTokensFromStorage();
    console.log(tokens);
    if (tokens) {
      this.SetAccessToken(tokens.accessToken);
      this.SetRefreshToken(tokens.refreshToken);
      let is_token_normal = await api.refresh_token();
      if (is_token_normal) await app.setMe();
    }
  };
}

export const authentication = new Authentication();
