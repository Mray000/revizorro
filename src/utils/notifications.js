import {api} from './api';
import {fcmService} from './FCMService';
import {localNotificationService} from './LocalNotificationService';

const onRegister = async (token, is_refresh) => {
  if (!is_refresh) {
    await api.registerNotifys(token, Platform.OS);
  } else {
    await api.refreshNotifys(token, Platform.OS);
  }
};

const onNotification = notify => {
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
};

const onOpenNotification = notify => {
  console.log('APP get open notify', notify);
};

export const NotifysRegister = () => {
  fcmService.registerAppWithFCM();
  fcmService.register(onRegister, onNotification, onOpenNotification);
  localNotificationService.createChannel();
  localNotificationService.configure(onOpenNotification);
};

export const NotifysUnregister = () => {
  fcmService.unRegitster();
  localNotificationService.unregister();
};
