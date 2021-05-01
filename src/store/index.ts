import { createStore, Store, useStore as baseUseStore } from 'vuex';
import { InjectionKey } from '@vue/runtime-core';
import { AxiosError } from 'axios';

import {
  State,
  UserLoginReq,
  UserLoginResp,
  UserRegisterReq,
  UserRegisterResp,
} from '@/components/types';
import { userClient } from '@/api';
import { defaultUsername } from '@/utils/config';

export const key: InjectionKey<Store<State>> = Symbol();

const saveLocalStorage = (resp: UserLoginResp | UserRegisterResp): void => {
  const { id, username, key } = resp;
  localStorage.setItem('token', key);
  localStorage.setItem('id', id);
  localStorage.setItem('username', username || defaultUsername);
  userClient.setAuthHeader();
};

const removeLocalStorage = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('id');
  localStorage.removeItem('username');
  userClient.removeAuthHeader();
};

export const store: Store<State> = createStore<State>({
  state: {
    status: localStorage.getItem('token') ? 'success' : '',
    token: localStorage.getItem('token') || '',
    id: localStorage.getItem('id') || '',
    username: localStorage.getItem('username') || defaultUsername,
  },
  getters: {
    isLoggedIn: (state): boolean => !!state.token,
  },
  mutations: {
    authRequest: (state): void => {
      state.status = 'loading';
    },
    authSuccess: (state, resp: UserLoginResp): void => {
      state.status = 'success';
      state.token = resp.key || '';
      state.id = resp.id || '';
      state.username = resp.username || defaultUsername;
    },
    authError: (state) => {
      state.status = 'error';
    },
    logout: (state) => {
      state.status = '';
      state.token = '';
    },
  },
  actions: {
    register: ({ commit }, req: UserRegisterReq): Promise<UserRegisterResp> =>
      new Promise((resolve, reject) => {
        commit('authRequest');
        userClient
          .userRegister(req)
          .then((resp: UserRegisterResp) => {
            if (resp.status === 'success') {
              commit('authSuccess', resp);
              saveLocalStorage(resp);
              resolve(resp);
            }
          })
          .catch((err: AxiosError) => {
            commit('authError');
            removeLocalStorage();
            reject(err);
          });
      }),

    login: ({ commit }, req: UserLoginReq): Promise<UserLoginResp> =>
      new Promise((resolve, reject) => {
        commit('authRequest');
        userClient
          .userLogin(req)
          .then((resp: UserLoginResp) => {
            if (resp.status === 'success') {
              commit('authSuccess', resp);
              saveLocalStorage(resp);
              resolve(resp);
            }
          })
          .catch((err: AxiosError) => {
            commit('authError');
            removeLocalStorage();
            reject(err);
          });
      }),

    logout: ({ commit }): Promise<void> =>
      new Promise((resolve, _reject) => {
        commit('logout');
        removeLocalStorage();
        resolve();
      }),
  },
});

export const useStore = (): Store<State> => baseUseStore(key);
