import {PermissionsAndroid, Platform} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';

export async function requestLocationPermission() {
  try {
    if (Platform.OS == 'android') {
      const granted = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION, {
        message: 'Необходимо разрешить доступ приложения к вашей геолокации',
      });
      if (granted === 'granted') {
        console.log('You can use the location');
        return true;
      } else {
        alert('Необходимо разрешить доступ приложения к вашей геолокации');
        return false;
      }
    } else {
      await Geolocation.requestAuthorization();
      return true;
    }
  } catch (err) {
    console.warn(err);
    return false;
  }
}

export async function requestCameraPermission() {
  try {
    const granted = await request(
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.CAMERA
        : PERMISSIONS.ANDROID.CAMERA,
      {
        message: 'Необходимо разрешить доступ приложения к вашей камере',
      },
    );
    console.log(granted);

    if (granted === 'granted') {
      console.log('You can use the caera');
      return true;
    } else {
      alert('Необходимо разрешить доступ приложения к вашей камере');
      return false;
    }
  } catch (err) {
    console.warn(err);
    return false;
  }
}

export async function requestATTPermission() {
  try {
    const result = await check(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY);
    if (result === RESULTS.DENIED) {
      await request(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY);
    }
  } catch (err) {
    console.warn(err);
    return false;
  }
}

// const granted = await getLocationPermissions();
