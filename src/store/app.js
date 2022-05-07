import {makeAutoObservable} from 'mobx';
import {Platform} from 'react-native';
import {api} from 'utils/api';
import {fcmService} from 'utils/FCMService';
import {localNotificationService} from 'utils/LocalNotificationService';
import {NotifysRegister, NotifysUnregister} from 'utils/notifications';
import {rate, tarif} from './tarif';

class App {
  id = null;
  role = null;
  accesses = [];
  name = '';
  is_notify = true;
  is_bottom_navigator_visible = true;
  bottom_navigator_color = null;

  constructor() {
    makeAutoObservable(this);
  }

  setIsBottomNavigatorVisible(is_visible) {
    this.is_bottom_navigator_visible = is_visible;
  }

  setBottomNavigatorColor(color) {
    this.bottom_navigator_color = color;
  }

  setRole(role) {
    this.role = role;
  }

  setName(name) {
    this.name = name;
  }

  setAccesses(accesses) {
    this.accesses = accesses;
  }

  setNotification = is_notify => {
    api.setNotification(is_notify);
    this.is_notify = is_notify;
  };

  setId = id => {
    this.id = id;
  };

  getId = () => this.id;

  setMe = async () => {
    let me = await api.getMe();
    let accesses = [];
    if (me.manager_permission_cleaning) accesses.push('cleanings');
    if (me.manager_permission_check_lists) accesses.push('check_lists');
    if (me.manager_permission_users) accesses.push('workers');
    this.setId(me.id);
    this.setNotification(me.notification);
    this.setAccesses(accesses);
    this.setRole(me.role);
    this.setName(me.first_name);
    NotifysRegister();
    let company = await api.getCompany();
    tarif.setIsTarifActive(company?.active);
  };

  onAppClose = () => {
    NotifysUnregister();
    console.log('APP unreigster');
  };
}

export const app = new App();
