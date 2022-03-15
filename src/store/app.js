import {makeAutoObservable} from 'mobx';
import {Platform} from 'react-native';
import {api} from 'utils/api';
import {fcmService} from 'utils/FCMService';
import {localNotificationService} from 'utils/LocalNotificationService';

class App {
  id = null;
  role = null;
  accesses = [];
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

  setAccesses(accesses) {
    this.accesses = accesses;
  }

  setNotification = is_notify => {
    api.setNotification(is_notify)
    this.is_notify = is_notify;
  };

  setId = id => {
    this.id = id;
  };

  getId = () => this.id;

  setMe = async () => {
    const onRegister = async (token, is_refresh) => {
      if (!is_refresh) {
        await api.registerNotifys(token, Platform.OS);
      } else {
        await api.refreshNotifys(token, Platform.OS);
      }
      console.log('APP registered token: ', token);
    };

    const onNotification = notify => {
      console.log('APP get notify:', notify);
      if (app.is_notify) {
        const options = {
          soundName: 'default',
          playSound: true,
        };
        localNotificationService.showNotification(
          0,
          notify.title,
          notify.body,
          notify,
          options,
        );
      }
    };
    const onOpenNotification = notify => {
      console.log('APP get open notify', notify);
    };

    await api.getMe().then(me => {
      let accesses = [];
      if (me.manager_permission_cleaning) accesses.push('cleanings');
      if (me.manager_permission_check_lists) accesses.push('check_lists');
      if (me.manager_permission_users) accesses.push('workers');
      this.setId(me.id);
      this.setNotification(me.notification);
      this.setAccesses(accesses);
      this.setRole(me.role);
      fcmService.registerAppWithFCM();
      fcmService.register(onRegister, onNotification, onOpenNotification);
      localNotificationService.createChannel();
      localNotificationService.configure(onOpenNotification);
    });
  };
}

export const app = new App();
