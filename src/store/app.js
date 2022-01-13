import {makeAutoObservable} from 'mobx';

class App {
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
}

export const app = new App();
