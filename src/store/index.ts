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

export const store: Store<State> = createStore<State>({
  state: {
    status: '',
    token: localStorage.getItem('token') || '',
    id: 0,
  },
  getters: {
    isLoggedIn: (state): boolean => !!state.token,
    authStatus: (state): string => state.status,
  },
  mutations: {
    authRequest(state): void {
      state.status = 'loading';
    },
    authSuccess(state, { token, id }: { token: string; id: number }): void {
      state.status = 'success';
      state.token = token;
      state.id = id;
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
              const id = resp.id;
              // FIXME: require a JSON Web Token (JWT) instead of id
              const token = id.toString();
              localStorage.setItem('token', token);
              axios.defaults.headers.common[
                'Authorization'
              ] = `Bearer ${token}`;
              commit('authSuccess', { token, id });
              resolve(resp);
            }
          })
          .catch((err: AxiosError) => {
            commit('authError');
            localStorage.removeItem('token');
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
              const id = resp.id;
              // FIXME: require a JSON Web Token (JWT) instead of id
              const token = id.toString();
              localStorage.setItem('token', token);
              axios.defaults.headers.common['Authorization'] = token;
              commit('authSuccess', { token, id });
              resolve(resp);
            }
          })
          .catch((err: AxiosError) => {
            commit('authError');
            localStorage.removeItem('token');
            reject(err);
          });
      });
    },

    logout({ commit }): Promise<void> {
      return new Promise((resolve, _reject) => {
        commit('logout');
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        resolve();
      });
    },
  },
});

export const useStore = (): Store<State> => {
  return baseUseStore(key);
};
