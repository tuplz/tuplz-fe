import { createStore, Store, useStore as baseUseStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate';
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

export const store: Store<State> = createStore<State>({
  plugins: [createPersistedState()],
  state: {
    status: '',
    token: '',
    id: '',
    username: defaultUsername,
  },
  getters: {
    isLoggedIn: (state): boolean => Boolean(state.token),
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
              userClient.setAuthHeader();
              resolve(resp);
            }
          })
          .catch((err: AxiosError) => {
            commit('authError');
            userClient.removeAuthHeader();
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
              userClient.setAuthHeader();
              resolve(resp);
            }
          })
          .catch((err: AxiosError) => {
            commit('authError');
            userClient.removeAuthHeader();
            reject(err);
          });
      }),

    logout: ({ commit }): Promise<void> =>
      new Promise((resolve, _reject) => {
        commit('logout');
        userClient.removeAuthHeader();
        resolve();
      }),
  },
});

export const useStore = (): Store<State> => baseUseStore(key);
