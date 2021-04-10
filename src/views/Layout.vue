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
          type="primary"
          shape="round"
          style="margin: 16px 0"
          @click="openModal"
        >
          <template #icon>
            <LoginOutlined />
            Login
          </template>
        </a-button>
      </a-row>

      <a-modal
        v-model:visible="modal.visible"
        :title="modal.title"
        :confirm-loading="modal.loading"
        width="400px"
        :closable="false"
        ok-text="Login"
        @ok="onLoginClick"
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
            <a-input
              v-model:value="modal.data.password"
              type="password"
              placeholder="Password"
            >
              <template #prefix>
                <LockOutlined class="modal-icon" />
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
import { AxiosError } from 'axios';
import {
  BulbFilled,
  HeartFilled,
  LockOutlined,
  LoginOutlined,
  UserOutlined,
} from '@ant-design/icons-vue';
import { ValidateErrorEntity } from 'ant-design-vue/lib/form/interface';
import { notification } from 'ant-design-vue';

import { UserLoginReq, UserLoginResp } from '@/components/types';
import { userClient } from '@/api';

export default defineComponent({
  components: {
    BulbFilled,
    HeartFilled,
    LockOutlined,
    LoginOutlined,
    UserOutlined,
  },
  setup() {
    const title = 'Teach Us Please!';

    const form = ref();

    const formRules = {
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

    const modal = reactive({
      visible: false,
      loading: false,
      title: 'Login',
      data: {
        username: '',
        password: '',
      } as UserLoginReq,
      rules: formRules,
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

    const openModal = (): void => {
      modal.visible = true;
    };

    const closeModal = (): void => {
      modal.visible = false;
      modal.loading = false;
      resetForm();
    };

    const login = (): void => {
      userClient
        .userLogin(modal.data)
        .then((resp: UserLoginResp) => {
          if (resp.status === 'success') {
            closeModal();
            // TODO: operations after user logged in
          }
        })
        .catch((err: AxiosError) => {
          openNotification('error', `Failed to login, error: ${err.message}`);
        })
        .finally((): void => {
          modal.loading = false;
        });
    };

    const onLoginClick = (): void => {
      modal.loading = true;
      form.value
        .validate()
        .then((): void => {
          login();
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

    return {
      title,
      form,
      modal,
      resetForm,
      openModal,
      closeModal,
      onLoginClick,
    };
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
}

.ant-form {
  .modal-icon {
    margin-right: 6px;
    color: rgba(0, 0, 0, 0.25);
  }
}
</style>
