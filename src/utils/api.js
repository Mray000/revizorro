import AsyncStorage from '@react-native-async-storage/async-storage';
import {app} from 'store/app';
import {authentication} from 'store/authentication';
// import {error} from '../store/error';
export const URL = 'http://92.53.97.165/api';
export const ImageURL = 'http://92.53.97.165';
const getJson = async responce => {
  try {
    return await responce.json();
  } catch (e) {
    return null;
  }
};
const middleware = async responce => {
  console.log(responce.url, responce.status, authentication.accessToken);
  let status = String(responce.status);
  let data = await getJson(responce);
  if (status == '401') {
    await api.refresh_token();
    return 'try_again';
  }
  return data;
};

export const getAsyncData = async () => {
  let storage_data = await AsyncStorage.multiGet([
    'accessToken',
    'refreshToken',
  ]);

  return storage_data[0] && storage_data[0][1]
    ? {
        accessToken: storage_data[0][1],
        refreshToken: storage_data[1][1],
      }
    : null;
};

export const SetAuthData = async (accessToken, refreshToken) => {
  await AsyncStorage.multiSet([
    ['accessToken', accessToken],
    ['refreshToken', refreshToken],
  ]);
  authentication.SetAccessToken(accessToken);
  authentication.SetRefreshToken(refreshToken);
};

const request = {
  post: async (url, body) => {
    let responce = await fetch(URL + url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          authentication.accessToken && `Bearer ${authentication.accessToken}`,
      },
      body: JSON.stringify(body),
    });
    let data = await middleware(responce);
    if (data == 'try_again') {
      return await request.post(url, body);
    } else return data;
  },
  put: async (url, body) => {
    let responce = await fetch(URL + url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          authentication.accessToken && `Bearer ${authentication.accessToken}`,
      },
      body: JSON.stringify(body),
    });
    let data = await middleware(responce);
    if (data == 'try_again') {
      return await request.put(url, body);
    } else return data;
  },
  post_form_data: async (url, body) => {
    let responce = await fetch(URL + url, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization:
          authentication.accessToken && `Bearer ${authentication.accessToken}`,
      },
      body,
    });
    let data = await middleware(responce);
    if (data == 'try_again') {
      return await request.post_form_data(url, body);
    } else return data;
  },
  put_form_data: async (url, body) => {
    let responce = await fetch(URL + url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization:
          authentication.accessToken && `Bearer ${authentication.accessToken}`,
      },
      body,
    });
    let data = await middleware(responce);
    if (data == 'try_again') {
      return await request.put_form_data(url, body);
    } else return data;
  },
  delete: async (url, body) => {
    let responce = await fetch(URL + url, {
      method: 'DELETE',
      headers: {
        Authorization:
          authentication.accessToken && `Bearer ${authentication.accessToken}`,
      },
      body: body,
    });
    let data = await middleware(responce);
    if (data == 'try_again') {
      return await request.delete(url, body);
    } else return data;
  },

  get: async url => {
    let responce = await fetch(URL + url, {
      method: 'GET',
      headers: {
        Authorization:
          authentication.accessToken && `Bearer ${authentication.accessToken}`,
      },
    });
    let data = await middleware(responce);
    if (data == 'try_again') {
      console.log(authentication.accessToken);
      return await request.get(url);
    } else return data;
  },
  patch: async (url, body) => {
    let responce = await fetch(URL + url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          authentication.accessToken && `Bearer ${authentication.accessToken}`,
      },
      body: JSON.stringify(body),
    });
    let data = await middleware(responce);
    if (data == 'try_again') {
      return await request.patch(url, body);
    } else return data;
  },
};

export const api = {
  registration: async body => {
    let data = await request.post('/users/auth/register/', body);
    console.log(data);
    return data;
  },
  login: async (email, password) => {
    let data = await await fetch(URL + '/users/auth/token/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({email, password}),
    }).then(res => res.json());
    console.log(data);
    if (data?.access) {
      await SetAuthData(data.access, data.refresh);
      return true;
    } else return false;
  },

  refresh_token: async () => {
    let refresh = authentication.refreshToken;
    try {
      let data = await fetch(URL + '/users/auth/token/refresh/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({refresh}),
      }).then(res => res.json());

      if (data?.access) await SetAuthData(data.access, data.refresh);
      else {
        await AsyncStorage.removeItem('accessToken');
        await AsyncStorage.removeItem('refreshToken');
        authentication.SetAccessToken('');
        authentication.SetRefreshToken('');
      }
      return data?.access;
    } catch {
      return false;
    }
  },

  getProfile: async () => {
    let data = await request.get('/users/company/staff');
    return data;
  },

  addWorker: async (
    role,
    first_name,
    last_name,
    middle_name,
    email,
    gender,
    manager_permission_check_lists,
    manager_permission_users,
    manager_permission_cleaning,
  ) => {
    let body = {
      role,
      first_name,
      last_name,
      middle_name,
      email,
      gender,
      manager_permission_check_lists,
      manager_permission_users,
      manager_permission_cleaning,
    };
    let data = await request.post(`/users/company/staff/`, body);
    console.log(data);
    return typeof data != 'string';
  },

  editWorker: async (
    id,
    role,
    first_name,
    last_name,
    middle_name,
    email,
    gender,
    manager_permission_check_lists,
    manager_permission_users,
    manager_permission_cleaning,
  ) => {
    let body = {
      role,
      first_name,
      last_name,
      middle_name,
      email,
      gender,
      manager_permission_check_lists,
      manager_permission_users,
      manager_permission_cleaning,
    };
    console.log(body);
    let data = await request.put(`/users/staff/${id}/`, body);
    console.log(data);
    return typeof data != 'string';
  },

  getWorker: async id => {
    let data = await request.get(`/users/staff/${id}/`);
    return data;
  },

  deleteWorker: async id => {
    let data = await request.delete(`/users/staff/${id}/`);
    return data;
  },

  getCompanyWorkers: async () => {
    let data = await request.get(`/users/company/staff/`);

    return data;
  },

  setTarif: async rate_id => {
    let data = await request.post(`/rates/order`, {rate_id});
    return data;
  },

  getHousemaids: async () => {
    let data = await api.getCompanyWorkers();
    return data.filter(w => w.role == 'role_maid');
  },

  addFlat: async body => {
    let form_data = new FormData();
    Object.keys(body).forEach(key => {
      if (key == 'images') {
        body.images.forEach(el => form_data.append('images', el));
      } else form_data.append(key, body[key]);
    });
    let data = await request.post_form_data('/flats', form_data);
    return data;
  },

  editFlat: async (id, body) => {
    let data = await request.put(`/flats/${id}`, body);
    return data;
  },

  deleteFlatImage: async id => {
    let data = await request.delete(`/flats/images/${id}`);
    return data;
  },

  addFlatImage: async (id, image) => {
    let form_data = new FormData();
    form_data.append('flat_id', id);
    form_data.append('image', image);
    let data = await request.post_form_data('/flats/images', form_data);
    return data;
  },

  deleteFlat: async id => {
    let data = await request.delete(`/flats/${id}`);
    return data;
  },

  getFlats: async () => {
    let flats = await request.get('/flats/company');
    return flats;
  },

  getFlat: async id => {
    let flat = await request.get(`/flats/${id}`);
    return flat;
  },

  addCheckList: async body => {
    let data = await request.post('/check-lists', body);
    return data;
  },

  getCheckLists: async () => {
    let data = await request.get('/check-lists/company');
    return data;
  },

  deleteCheckList: async id => {
    let data = await request.delete(`/check-lists/${id}`);
    return data;
  },

  addQuestion: async body => {
    let data = await request.post('/questions', body);
    return data;
  },

  editQuestion: async body => {
    let data = await request.put(`/questions/${body.id}`, body);
    return data;
  },

  editCheckList: async body => {
    let data = await request.put(`/check-lists/${body.id}`, body);
    return data;
  },

  addCleaning: async body => {
    let data = await request.post(`/cleaning/multiply`, body);
    return data;
  },

  editCleaning: async body => {
    let data = await request.put(`/cleaning/${body.id}`, body);
    return data;
  },

  deleteCleaning: async id => {
    let data = await request.delete(`/cleaning/${id}`);
    return data;
  },
  getCleanings: async () => {
    let cleanings = await request.get('/cleaning/me');
    return cleanings;
  },

  getMe: async () => {
    let me = await request.get('/users/me/');
    return me;
  },

  comepleteCleaning: async (cleaning_id, questions) => {
    let form_data = new FormData();
    form_data.append('cleaning_id', cleaning_id);
    let fill_questions = [];
    questions.forEach(question => {
      let answer = question.answer;
      if (Array.isArray(answer)) {
        let photo_filenames = [];
        answer.forEach(photo_answer => {
          photo_filenames.push(photo_answer.fileName);
          form_data.append('images', {
            uri: photo_answer.uri,
            type: photo_answer.type,
            name: photo_answer.fileName,
          });
        });
        fill_questions.push({
          question: question.id,
          photo_filename: photo_filenames,
        });
      } else {
        fill_questions.push({
          question: question.id,
          answer,
        });
      }
    });
    form_data.append('fill_questions', JSON.stringify(fill_questions));
    let data = await request.post_form_data('/fill-questions/send', form_data);
    console.log(data);
    return data;
  },

  resendCleaning: async questions => {
    let form_data = new FormData();
    let fill_questions = [];
    questions.forEach(question => {
      let answer = question.answer;
      if (Array.isArray(answer)) {
        let photo_filenames = [];
        answer.forEach(photo_answer => {
          photo_filenames.push(photo_answer.fileName);
          form_data.append('images', {
            uri: photo_answer.uri,
            type: photo_answer.type,
            name: photo_answer.fileName,
          });
        });
        fill_questions.push({
          fill_question: question.id,
          photo_filename: photo_filenames,
        });
      } else {
        fill_questions.push({
          fill_question: question.id,
          answer,
        });
      }
    });
    form_data.append('fill_questions', JSON.stringify(fill_questions));
    let data = await request.put_form_data('/fill-questions/resend', form_data);
    return data;
  },

  getCleaning: async id => {
    let cleaning = await request.get(`/cleaning/${id}`);
    return cleaning;
  },

  reportCleaning: async (assessment, cleaning_id, fill_questions) => {
    let body = {cleaning_id, fill_questions};
    if (assessment) body.assessment = assessment;
    let data = await request.post(`/fill-questions/check`, body);
    return data;
  },

  sendCoords: async (cleaning_id, {coords}) => {
    let body = {
      location: {latitude: coords.latitude, longitude: coords.longitude},
    };
    let data = await request.patch(`/cleaning/${cleaning_id}`, body);
    return data;
  },

  changePassword: async (old_password, new_password) => {
    let body = {old_password, new_password};
    let data = await request.put('/users/auth/change-password/', body);
    console.log(data);
    if (data?.non_field_errors) return false;
    return true;
  },

  registerNotifys: async (token, device) => {
    let data = await request.post('/fcm-tokens', {token, device});
    console.log(data);
    return data;
  },

  refreshNotifys: async (token, device) => {
    let data = await request.put('/fcm-tokens/update', {token, device});
    return data;
  },

  changeCompany: async (title, active) => {
    let data = await request.put('/company', {title, active});
    console.log(data, 'CO');
    return data;
  },
  getCompany: async () => {
    let data = await request.get('/company');
    return data;
  },

  getRate: async () => {
    let tarif = await request.get('/rates/company');
    return tarif;
  },
  setNotification: async notification => {
    let data = await request.patch(
      app.role != 'role_admin'
        ? `/users/staff/${app.getId()}/`
        : `/users/admin/${app.getId()}/`,
      {notification},
    );
    return data;
  },
  getPasswordCode: async email => {
    let data = await request.put('/users/auth/recovery-password/', {email});
    console.log(email, data)
    return !(data?.reason || data.email);
  },
  sendCodeWithNewPassword: async (key, password) => {
    let data = await request.patch('/users/auth/recovery-password-key/', {
      key,
      password,
    });
    return !data?.reason;
  },

  editAdmin: async (
    first_name,
    last_name,
    email,
    notification,
    autocheck_time,
  ) => {
    let body = {
      first_name,
      last_name,
      email,
      notification,
      autocheck_time,
    };
    let data = await request.put(`/users/admin/${app.getId()}/`, body);
    console.log(data);
    return Array.isArray(data?.email) ? data.email[0] : null;
  },

  setInterval: async autocheck_time => {
    let data = await request.put(`/users/admin/${app.getId()}/`, {
      autocheck_time,
    });
    return data;
  },

  getDollarCourse: async () => {
    let data = await fetch('https://www.cbr-xml-daily.ru/latest.js').then(res => res.json());
    
    return data.rates.USD;
  },
};
