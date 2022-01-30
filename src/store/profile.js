import {makeAutoObservable} from 'mobx';
import {api} from 'utils/api';

class Profile {
  id = 0;
  role = '';
  username = '';
  email = '';
  first_name = '';
  last_name = '';
  middle_name = '';
  phone = '';
  gender = '';
  rating = 0;
  avatar = '';
  is_staff = false;
  is_superuser = false;
  is_active = false;
  date_joined = '';
  notification = '';
  autocheck_time = 0;
  constructor() {
    makeAutoObservable(this);
  }
  setAllProfile(data) {
    Object.keys(data).forEach(key => (this[key] = data[key]));
  }
  setProfile() {
    api.getProfile().then(this.setAllProfile);
  }
}

export const profile = new Profile();
