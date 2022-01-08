import AsyncStorage from '@react-native-async-storage/async-storage';
import {authentication} from 'store/authentication';
// import {error} from '../store/error';
const URL = 'http://92.53.97.165/api';

const getJson = async responce => {
  try {
    return await responce.json();
  } catch (e) {
    return null;
  }
};
const middleware = async responce => {
  console.log(responce, authentication.accessToken);
  let status = String(responce.status);
  let data = await getJson(responce);
  console.log(responce);
  if (status == '401') {
    api.refresh_token();
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
      return request.post(url, body);
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
      return request.put(url, body);
    } else return data;
  },
  post_form_data: async (url, body) => {
    console.log(body);
    let responce = await fetch(URL + url, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization:
          authentication.accessToken && `Bearer ${authentication.accessToken}`,
      },
      body: body,
    });

    let data = await middleware(responce);
    if (data == 'try_again') {
      return request.post_form_data(url, body);
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
      return request.delete(url, body);
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
      return request.get(url);
    } else return data;
  },
};

export const api = {
  registration: async body => {
    let data = await request.post('/users/auth/register', body);
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

    if (data?.access) {
      await SetAuthData(data.access, data.refresh);
      return true;
    } else return false;
  },

  refresh_token: async () => {
    let refresh = authentication.refreshToken;
    let data = await request.post('/users/auth/token/refresh/', {refresh});
    if (data?.access) await SetAuthData(data.access, data.refresh);
    else {
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('refreshToken');
      authentication.SetAccessToken('');
      authentication.SetRefreshToken('');
    }
    return data?.access;
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
    let data = await request.post(`/users/company/staff`, body);
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
    let data = await request.put(`/users/staff/${id}`, body);
    return typeof data != 'string';
  },

  deleteWorker: async id => {
    let data = await request.delete(`/users/staff/${id}`);
    return data;
  },

  getCompanyWorkers: async () => {
    let data = await request.get(`/users/company/staff`);
    return data;
  },

  setTarif: async rate_id => {
    let data = await request.post(`/rates/order`, {rate_id});
    return data;
  },

  addFlat: async body => {
    let form_data = new FormData();
    Object.keys(body).forEach(key => {
      if (key == 'images') {
        body.images.forEach(el => {
          form_data.append('images', el);
        });
      } else form_data.append(key, body[key]);
    });
    let data = await request.post_form_data('/flats', form_data);
    console.log(data, 'AFDSFDSKLGJSFGSDGKKKKKKKKKKKKKKK');
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
    console.log(flats);
    return flats;
  },
};
