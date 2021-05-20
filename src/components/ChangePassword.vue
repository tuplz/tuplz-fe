<template>
  <a-card title="Change Password">
    <a-form
      ref="passwordForm"
      :model="password.data"
      :rules="password.rules"
      v-bind="password.layout"
    >
      <a-form-item name="originalPassword">
        <a-input-password
          v-model:value="password.data.originalPassword"
          placeholder="Original password"
        >
          <template #prefix>
            <LockOutlined class="modal-icon" />
          </template>
        </a-input-password>
      </a-form-item>
      <a-form-item name="newPassword">
        <a-input-password
          v-model:value="password.data.newPassword"
          placeholder="New password"
        >
          <template #prefix>
            <LockOutlined class="modal-icon" />
          </template>
        </a-input-password>
      </a-form-item>
      <a-form-item name="confirmPassword">
        <a-input-password
          v-model:value="password.data.confirmPassword"
          placeholder="Confirm password"
        >
          <template #prefix>
            <LockOutlined class="modal-icon" />
          </template>
        </a-input-password>
      </a-form-item>
      <a-form-item>
        <a-space>
          <a-button
            type="primary"
            @click="submitPasswordForm"
          >
            Submit
          </a-button>
          <a-button @click="resetPasswordForm()">
            Reset
          </a-button>
        </a-space>
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';
import { useStore } from '@/store';
import { AxiosError } from 'axios';
import { LockOutlined } from '@ant-design/icons-vue';

import {
  PasswordForm,
  ChangePasswordReq,
  ChangePasswordResp,
} from '@/components/types';
import { userClient } from '@/api';
import { openNotification } from '@/mixins';
import {
  RuleObject,
  ValidateErrorEntity,
} from 'ant-design-vue/lib/form/interface';

export default defineComponent({
  components: {
    LockOutlined,
  },
  setup() {
    const store = useStore();

    const passwordForm = ref();

    const validatePassword = async (
      _rule: RuleObject,
      value: string
    ): Promise<void> => {
      if (!value) {
        return Promise.reject('Please input a new password');
      } else {
        if (password.data.confirmPassword) {
          passwordForm.value.validateField('confirmPassword');
        }
        return Promise.resolve();
      }
    };

    const validateConfirmPassword = async (
      _rule: RuleObject,
      value: string
    ): Promise<void> => {
      if (!value) {
        return Promise.reject('Please input your new password again');
      } else if (value !== password.data.newPassword) {
        return Promise.reject('Password and confirm password do not match');
      } else {
        return Promise.resolve();
      }
    };

    const passwordFormRules = {
      originalPassword: [
        {
          required: true,
          message: 'Please input your original password',
          trigger: 'blur',
        },
      ],
      newPassword: [
        {
          required: true,
          validator: validatePassword,
          trigger: 'blur',
        },
      ],
      confirmPassword: [
        {
          required: true,
          validator: validateConfirmPassword,
          trigger: 'blur',
        },
      ],
    };

    const password = reactive({
      data: {
        originalPassword: '',
        newPassword: '',
        confirmPassword: '',
      } as PasswordForm,
      rules: passwordFormRules,
      layout: {
        wrapperCol: { span: 16, offset: 4 },
      },
    });

    const changePassword = (): void => {
      const { originalPassword, newPassword } = password.data;
      userClient
        .changePassword({
          userId: store.state.id,
          originalPassword,
          newPassword,
        } as ChangePasswordReq)
        .then((resp: ChangePasswordResp): void => {
          console.log('changePassword', resp);
          if (resp.status !== 'success') {
            openNotification(
              'error',
              `Failed to change password, wrong original password.`
            );
          } else {
            openNotification('success', `Succeeded to change password.`);
          }
        })
        .catch((err: AxiosError): void => {
          openNotification(
            'error',
            `Failed to change password, error: ${err.message}`
          );
        })
        .finally(() => {
          resetPasswordForm();
        });
    };

    const submitPasswordForm = (): void => {
      passwordForm.value
        .validate()
        .then((): void => {
          changePassword();
        })
        .catch((_error: ValidateErrorEntity): void => {
          openNotification(
            'warn',
            'Please make sure all fields are filled in correctly.'
          );
        });
    };

    const resetPasswordForm = (): void => {
      passwordForm.value.resetFields();
    };

    return {
      passwordForm,
      password,
      submitPasswordForm,
      resetPasswordForm,
    };
  },
});
</script>

<style lang="scss" scoped>
.ant-form {
  .modal-icon {
    margin-right: 6px;
    color: rgba(0, 0, 0, 0.25);
  }
}
</style>
