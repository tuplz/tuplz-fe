<template>
  <a-layout style="min-height: 100vh">
    <a-layout-header style="padding-left: 24px">
      <a-row
        type="flex"
        justify="space-between"
      >
        <router-link
          class="title"
          :to="{ name: 'Problemset' }"
        >
          <BulbFilled id="logo" />
          <span>{{ title }}</span>
        </router-link>

        <a-button
          v-if="isLoggedIn"
          shape="round"
          @click="logout"
        >
          <template #icon>
            <LogoutOutlined />
            Logout
          </template>
        </a-button>
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
import { defineComponent, reactive, ref } from 'vue';
import { mapGetters } from 'vuex';
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
  UserOutlined,
} from '@ant-design/icons-vue';
import { ValidateErrorEntity } from 'ant-design-vue/lib/form/interface';
import { notification } from 'ant-design-vue';

import {
  UserLoginReq,
  UserLoginResp,
  UserRegisterResp,
} from '@/components/types';

export default defineComponent({
  components: {
    BulbFilled,
    HeartFilled,
    ImportOutlined,
    LockOutlined,
    LoginOutlined,
    LogoutOutlined,
    MailOutlined,
    UserOutlined,
  },
  setup() {
    const store = useStore();

    const title = 'Teach Us Please!';

    const form = ref();

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
          required: true,
          message: 'Please input E-mail',
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

    const openNotification = (type: string, description: string): void => {
      notification[type]({
        message: type.toUpperCase(),
        description,
      });
    };

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
    };
  },
  computed: {
    ...mapGetters(['isLoggedIn']),
  },
});
</script>

<style lang="scss" scoped>
.ant-layout-header {
  .title {
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

  .ant-btn {
    margin: 16px 0;
  }
}

.ant-form {
  .modal-icon {
    margin-right: 6px;
    color: rgba(0, 0, 0, 0.25);
  }
}
</style>
