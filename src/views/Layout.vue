<template>
  <a-layout style="min-height: 100vh">
    <a-layout-header style="padding-left: 24px">
      <a-row
        type="flex"
        justify="space-between"
      >
        <router-link
          class="router-link"
          :to="{ name: 'Problemset' }"
        >
          <BulbFilled id="logo" />
          <span>{{ title }}</span>
        </router-link>

        <a-dropdown
          v-if="isLoggedIn"
          placement="bottomRight"
        >
          <div>
            <a-avatar
              size="large"
              style="font-size: 20px"
            >
              {{ username[0].toUpperCase() }}
            </a-avatar>
          </div>
          <template #overlay>
            <a-menu>
              <a-menu-item key="profile">
                <router-link
                  class="router-link"
                  :to="{ name: 'UserProfile' }"
                >
                  <ProfileOutlined class="menu-icon" />
                  Profile
                </router-link>
              </a-menu-item>
              <a-menu-item key="logout">
                <span @click="logout">
                  <LogoutOutlined class="menu-icon" />
                  Logout
                </span>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>

        <a-space v-else>
          <a-button
            shape="round"
            @click="openSignUpModal"
          >
            <template #icon>
              <ImportOutlined />
              Sign up
            </template>
          </a-button>
          <a-button
            type="primary"
            shape="round"
            @click="openLoginModal"
          >
            <template #icon>
              <LoginOutlined />
              Login
            </template>
          </a-button>
        </a-space>
      </a-row>

      <a-modal
        v-model:visible="modal.visible"
        :title="modal.title"
        :confirm-loading="modal.loading"
        width="400px"
        :closable="false"
        :ok-text="modal.title"
        @ok="submitForm"
        @cancel="closeModal"
      >
        <a-form
          ref="form"
          name="form"
          :model="modal.data"
          :rules="modal.rules"
          v-bind="modal.layout"
        >
          <a-form-item name="username">
            <a-input
              v-model:value="modal.data.username"
              placeholder="Username"
            >
              <template #prefix>
                <UserOutlined class="modal-icon" />
              </template>
            </a-input>
          </a-form-item>
          <a-form-item name="password">
            <a-input-password
              v-model:value="modal.data.password"
              placeholder="Password"
            >
              <template #prefix>
                <LockOutlined class="modal-icon" />
              </template>
            </a-input-password>
          </a-form-item>
          <a-form-item
            v-if="modal.signUpMode"
            name="email"
          >
            <a-input
              v-model:value="modal.data.email"
              placeholder="E-mail"
            >
              <template #prefix>
                <MailOutlined class="modal-icon" />
              </template>
            </a-input>
          </a-form-item>
        </a-form>
      </a-modal>
    </a-layout-header>

    <a-layout style="padding: 24px 24px 0">
      <a-layout-content style="padding: 24px; min-height: 280px">
        <router-view />
      </a-layout-content>

      <a-layout-footer style="text-align: center">
        <span>
          Made with
          <HeartFilled style="color: red; padding: 3px" />
          by
          <i>Software Engineering (2021 Spring)</i>
          Team 4
        </span>
      </a-layout-footer>
      <a-back-top />
    </a-layout>
  </a-layout>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from '@/store';
import { AxiosError } from 'axios';
import {
  BulbFilled,
  HeartFilled,
  ImportOutlined,
  LockOutlined,
  LoginOutlined,
  LogoutOutlined,
  MailOutlined,
  ProfileOutlined,
  UserOutlined,
} from '@ant-design/icons-vue';
import { ValidateErrorEntity } from 'ant-design-vue/lib/form/interface';

import {
  UserLoginReq,
  UserLoginResp,
  UserRegisterResp,
} from '@/components/types';
import { userClient } from '@/api';
import { openNotification, title, validateEmail } from '@/mixins';

export default defineComponent({
  components: {
    BulbFilled,
    HeartFilled,
    ImportOutlined,
    LockOutlined,
    LoginOutlined,
    LogoutOutlined,
    MailOutlined,
    ProfileOutlined,
    UserOutlined,
  },
  setup() {
    const form = ref();
    const router = useRouter();
    const store = useStore();
    const username = computed((): string => store.state.username);
    const isLoggedIn = computed((): boolean => store.getters.isLoggedIn);

    const loginFormRules = {
      username: [
        {
          required: true,
          message: 'Please input username',
          trigger: 'blur',
        },
      ],
      password: [
        {
          required: true,
          message: 'Please input password',
          trigger: 'blur',
        },
      ],
    };

    const registerFormRules = {
      ...loginFormRules,
      email: [
        {
          validator: validateEmail,
          trigger: 'blur',
        },
      ],
    };

    const modal = reactive({
      visible: false,
      loading: false,
      title: 'Login',
      signUpMode: false,
      data: {
        username: '',
        password: '',
        email: '',
      },
      callback: Function() as () => void,
      rules: {},
      layout: {
        wrapperCol: {
          span: 20,
          offset: 2,
        },
      },
    });

    const resetForm = (): void => {
      form.value.resetFields();
    };

    const openSignUpModal = (): void => {
      modal.visible = true;
      modal.title = 'Sign up';
      modal.signUpMode = true;
      modal.callback = register;
      modal.rules = registerFormRules;
    };

    const openLoginModal = (): void => {
      modal.visible = true;
      modal.title = 'Login';
      modal.signUpMode = false;
      modal.callback = login;
      modal.rules = loginFormRules;
    };

    const closeModal = (): void => {
      modal.visible = false;
      modal.loading = false;
      resetForm();
    };

    const submitForm = (): void => {
      modal.loading = true;
      form.value
        .validate()
        .then((): void => {
          modal.callback();
        })
        .catch((_error: ValidateErrorEntity<UserLoginReq>): void => {
          openNotification(
            'warn',
            'Please make sure all fields are filled in correctly.'
          );
        })
        .finally((): void => {
          modal.loading = false;
        });
    };

    const register = (): void => {
      store
        .dispatch('register', modal.data)
        .then((resp: UserRegisterResp): void => {
          console.log('Registered.', resp);
          closeModal();
          router.go(0);
        })
        .catch((err: AxiosError): void => {
          openNotification(
            'error',
            `Failed to register, error: ${err.message}`
          );
        })
        .finally((): void => {
          modal.loading = false;
        });
    };

    const login = (): void => {
      store
        .dispatch('login', modal.data)
        .then((resp: UserLoginResp): void => {
          console.log('Logged in.', resp);
          closeModal();
          router.go(0);
        })
        .catch((err: AxiosError): void => {
          openNotification('error', `Failed to login, error: ${err.message}`);
        })
        .finally((): void => {
          modal.loading = false;
        });
    };

    const logout = (): void => {
      store.dispatch('logout').then((): void => {
        console.log('Logged out.');
        router.go(0);
      });
    };

    return {
      title,
      form,
      modal,
      resetForm,
      openSignUpModal,
      openLoginModal,
      closeModal,
      submitForm,
      register,
      login,
      logout,
      username,
      isLoggedIn,
    };
  },
  created() {
    userClient.setAuthHeader();
  },
});
</script>

<style lang="scss" scoped>
.ant-layout-header {
  .ant-row > .router-link {
    height: 64px;

    > #logo {
      padding: 20px 0;
      margin-right: 12px;
      color: #e6fffb;
      font-size: 24px;
    }

    > span {
      color: #e6fffb;
      font-size: 24px;
      vertical-align: top;
    }
  }
}

.ant-dropdown-menu-item {
  > span > .menu-icon,
  > a > .menu-icon {
    min-width: 14px;
    margin-right: 8px;
    font-size: 14px;
  }
}

.ant-form {
  .modal-icon {
    margin-right: 6px;
    color: rgba(0, 0, 0, 0.25);
  }
}
</style>
