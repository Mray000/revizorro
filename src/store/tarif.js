import {makeAutoObservable} from 'mobx';

class Tarif {
  is_tarif_active = false;
  is_tarif_paid = false;

  constructor() {
    makeAutoObservable(this);
  }

  setIsTarifActive = is_tarif_active => {
    this.is_tarif_active = is_tarif_active;
  };

  setIsTarifPaid(is_tarif_paid) {
    this.is_tarif_paid = is_tarif_paid;
  }

  getSelectedTarifId = () => {
    return this.selected_tarf_id;
  };

  getIsTarifActive = () => {
    return this.is_tarif_active;
  };
}

export const tarif = new Tarif();
