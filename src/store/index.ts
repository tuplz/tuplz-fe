import { createStore, Store, useStore as baseUseStore } from 'vuex';
import { InjectionKey } from '@vue/runtime-core';
import axios, { AxiosError } from 'axios';

import {
  State,
  UserLoginReq,
  UserLoginResp,
  UserRegisterReq,
  UserRegisterResp,
} from '@/components/types';
import { userClient } from '@/api';

export const key: InjectionKey<Store<State>> = Symbol();

const saveLocalStorage = (resp: UserLoginResp | UserRegisterResp): void => {
  const { id, username, key } = resp;
  localStorage.setItem('token', key);
  localStorage.setItem('id', id);
  localStorage.setItem('username', username);
  axios.defaults.headers.common['Authorization'] = `Bearer ${key}`;
};

const removeLocalStorage = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('id');
  localStorage.removeItem('username');
  delete axios.defaults.headers.common['Authorization'];
};

export const store: Store<State> = createStore<State>({
  state: {
    status: '',
    token: localStorage.getItem('token') || '',
    id: localStorage.getItem('id') || '',
    username: localStorage.getItem('username') || 'undefined',
  },
  getters: {
    isLoggedIn: (state): boolean => !!state.token,
  },
  mutations: {
    authRequest(state): void {
      state.status = 'loading';
    },
    authSuccess(state, resp: UserLoginResp): void {
      state.status = 'success';
      state.token = resp.key || '';
      state.id = resp.id || '';
      state.username = resp.username || 'undefined';
    },
    authError(state) {
      state.status = 'error';
    },
    logout(state) {
      state.status = '';
      state.token = '';
    },
  },
  actions: {
    register({ commit }, req: UserRegisterReq): Promise<UserRegisterResp> {
      return new Promise((resolve, reject) => {
        commit('authRequest');
        userClient
          .userRegister(req)
          .then((resp: UserRegisterResp) => {
            if (resp.status === 'success') {
              saveLocalStorage(resp);
              commit('authSuccess', resp);
              resolve(resp);
            }
          })
          .catch((err: AxiosError) => {
            commit('authError');
            removeLocalStorage();
            reject(err);
          });
      });
    },

    login({ commit }, req: UserLoginReq): Promise<UserLoginResp> {
      return new Promise((resolve, reject) => {
        commit('authRequest');
        userClient
          .userLogin(req)
          .then((resp: UserLoginResp) => {
            if (resp.status === 'success') {
              saveLocalStorage(resp);
              commit('authSuccess', resp);
              resolve(resp);
            }
          })
          .catch((err: AxiosError) => {
            commit('authError');
            removeLocalStorage();
            reject(err);
          });
      });
    },

    logout({ commit }): Promise<void> {
      return new Promise((resolve, _reject) => {
        commit('logout');
        removeLocalStorage();
        resolve();
      });
    },
  },
});

export const useStore = (): Store<State> => {
  return baseUseStore(key);
};
