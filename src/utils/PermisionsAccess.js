import { PermissionsAndroid } from "react-native";

export async function requestLocationPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        message: 'Необходимо разрешить доступ приложения к вашей геолокации',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can use the location');
      return true;
    } else {
      console.log('location permission denied');
      alert('Необходимо разрешить доступ приложения к вашей геолокации');
      return false;
    }
  } catch (err) {
    console.warn(err);
    return false;
  }
}
