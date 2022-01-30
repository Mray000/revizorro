import {makeAutoObservable} from 'mobx';
import moment from 'moment';
import {api} from 'utils/api';
import {getRepeatValue, getTermValue} from 'utils/RepeatUtils';

class Cleaning {
  flat = null;
  check_lists = [];
  housemaid = null;
  date = Date.now();
  time = Date.now();
  repeat = '7-ой день';
  term = '1-го месяца';
  is_repeat_active = false;
  constructor() {
    makeAutoObservable(this);
  }

  setFlat(flat) {
    this.flat = flat;
  }

  setCheckList(check_list) {
    if (this.check_lists.find(el => el.id == check_list.id))
      this.check_lists = this.check_lists.filter(el => el.id != check_list.id);
    else this.check_lists.push(check_list);
  }

  setHousemaid(housemaid) {
    this.housemaid = housemaid;
  }

  setDate = day => {
    this.date = day;
  };

  setTime(time) {
    this.time = time;
  }

  setIsRepeatActive(is_active) {
    this.is_repeat_active = is_active;
  }

  setRepeat = repeat => {
    this.repeat = repeat;
    this.setIsRepeatActive(true);
  };

  setTerm = term => {
    this.term = term;
    this.setIsRepeatActive(true);
  };

  deleteCheckLists = () => {
    this.check_lists = [];
  };

  addCleaning = async () => {
    let new_cleanings = {
      flat_id: this.flat.id,
      check_list_ids: this.check_lists.map(el => el.id),
      maid_id: this.housemaid.id,
      list_time: this.getCleaningDates(),
    };
    let data = await api.addCleaning(new_cleanings);
    if (data.time) {
      if (data.detail[0].includes('Cleaning')) return {error_dates: data.time};
      else return {error_housemaid_dates: data.time};
    } else this.clearAllData();
  };

  editCleaning = async () => {
    let new_cleanings = {
      flat_id: this.flat.id,
      check_list_ids: this.check_lists.map(el => el.id),
      maid_id: this.housemaid.id,
      list_time: this.getCleaningDates(),
    };
    let data = await api.addCleaning(new_cleanings);
    if (data.time) {
      if (data.detail[0].includes('Cleaning')) return {error_dates: data.time};
      else return {error_housemaid_dates: data.time};
    } else this.clearAllData();
  };


  clearAllData() {
    flat = null;
    check_lists = [];
    housemaid = null;
    date = Date.now();
    time = Date.now();
    repeat = '7-ой день';
    term = '1-го месяца';
    is_repeat_active = false;
  }

  getCleaningDates() {
    let h = moment(this.time).get('h');
    let m = moment(this.time).get('m');
    if (!this.is_repeat_active)
      return [moment(this.date).set('h', h).set('m', m)];
    else {
      let array_of_dates = [];
      let repeat_number = getRepeatValue(this.repeat);
      let term_number = getTermValue(this.term);

      for (let i = 0; i < Math.ceil(term_number / repeat_number); i++) {
        array_of_dates.push(
          moment(this.date)
            .add(i * repeat_number, 'd')
            .set('h', h)
            .set('m', m),
        );
      }
      return array_of_dates;
    }
  }
}

export const cleaning = new Cleaning();
