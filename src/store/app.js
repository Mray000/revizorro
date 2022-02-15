import {makeAutoObservable} from 'mobx';
import {api} from 'utils/api';

class App {
  role = null;
  accesses = [];
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

  setMe = async () => {
    await api.getMe().then(me => {
      let accesses = [];
      if (me.manager_permission_cleaning) accesses.push('cleanings');
      // if (me.manager_permission_check_lists) accesses.push('check_lists');
      if (me.manager_permission_users) accesses.push('workers');
      this.setAccesses(accesses);
      this.setRole(me.role);
    });
  };
}

export const app = new App();
