import {makeAutoObservable} from 'mobx';

class Rate {
  selected_tarf_id = 'revizorro_1';
  is_subscription_active = false;
  is_rate_choice_screen = false;
  is_subscription_paid = false;

  constructor() {
    makeAutoObservable(this);
  }

  setSelectedTarifId = selected_tarf_id => {
    this.selected_tarf_id = selected_tarf_id;
  };

  setIsSubscriptionActive = is_subscription_active => {
    this.is_subscription_active = is_subscription_active;
  };
  setIsRateChoiceScreen = is_rate_choice_screen => {
    this.is_rate_choice_screen = is_rate_choice_screen;
  };
  setIsSubscriptionPaid(is_subscription_paid) {
    this.is_subscription_paid = is_subscription_paid;
  }

  getSelectedTarifId = () => {
    return this.selected_tarf_id;
  };
}

export const rate = new Rate();
