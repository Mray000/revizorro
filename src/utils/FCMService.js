import {ReactNativeFirebase} from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
import {Platform} from 'react-native';
class FCMService {
  register = async (onRegister, onNotification, onOpenNotification) => {
    await this.checkPermission(onRegister);
    await this.createNotifictionListenners(
      onRegister,
      onNotification,
      onOpenNotification,
    );
  };

  registerAppWithFCM = async () => {
    await messaging().registerDeviceForRemoteMessages();
    await messaging().setAutoInitEnabled(true);
  };

  checkPermission = onRegister => {
    messaging()
      .hasPermission()
      .then(enabled => {
        if (enabled) {
          this.getToken(onRegister);
        }
      })
      .catch(error => {
        console.error('FCM check permissions error-', error);
      });
  };

  getToken = onRegister => {
    messaging()
      .getToken()
      .then(fcmToken => {
        if (fcmToken) {
          onRegister(fcmToken);
        } else {
          console.log('FCM User does not have a device token');
        }
      })
      .catch(error => {
        console.error('FCM get token error-', error);
      });
  };

  reguestPermisions = onRegister => {
    messaging()
      .requestPermission()
      .then(() => {
        this.getToken(onRegister);
      })
      .catch(error => {
        console.error('FCM request permissions error-', error);
      });
  };

  deleteToken = () => {
    messaging()
      .deleteToken()
      .then(() => console.log('FCM token Deleted'))
      .catch(error => {
        console.error('FCM token deleted error-', error);
      });
  };

  createNotifictionListenners = (
    onRegister,
    onNotification,
    onOpenNotification,
  ) => {
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('FCM onNotificationOpenedApp caused app to open');
      if (remoteMessage) {
        let notification = remoteMessage.notification;
        onOpenNotification(notification);
      }
    });

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        console.log('FCM get initial message:', remoteMessage);

        if (remoteMessage) {
          let notification = remoteMessage.notification;
          onOpenNotification(notification);
        }
      });

    this.messageListenner = messaging().onMessage(remoteMessage => {
      console.log('FCM new message', remoteMessage);
      if (remoteMessage) {
        let notification = null;
        if (Platform.OS === 'ios') {
          notification = remoteMessage.notification.ios;
        } else {
          notification = remoteMessage.notification;
        }
        onNotification(notification);
      }
    });

    messaging().onTokenRefresh(fcmToken => {
      console.log('FCM new token');
      onRegister(fcmToken, true);
    });
  };

  unRegitster = () => {
    // if (this) this.messageListenner();
  };
}

export const fcmService = new FCMService();
