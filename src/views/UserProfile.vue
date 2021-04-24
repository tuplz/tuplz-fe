<template>
  <a-card :loading="userInfo.loading">
    <a-descriptions
      title="My Profile"
      :column="{ xxl: 4, xl: 3, lg: 2, md: 1, sm: 1, xs: 1 }"
      bordered
    >
      <template #extra>
        <a-button type="primary">
          <FormOutlined />
          Edit
        </a-button>
      </template>
      <a-descriptions-item label="Username">
        {{ userInfo.data.username }}
      </a-descriptions-item>
      <a-descriptions-item label="Email">
        <a-row
          type="flex"
          justify="space-between"
        >
          <span>
            {{ userInfo.data.email }}
          </span>
          <a-button
            :v-if="!userInfo.isVerified"
            shape="round"
            size="small"
            @click="openVerifyModal"
          >
            Verify
          </a-button>
        </a-row>
      </a-descriptions-item>
    </a-descriptions>
  </a-card>

  <a-modal
    v-model:visible="verifyModal.visible"
    title="Verify Email"
    :confirm-loading="verifyModal.loading"
    width="550px"
    :closable="false"
    @ok="submitVerifyForm"
    @cancel="closeVerifyModal"
  >
    <a-form
      ref="verifyForm"
      name="verifyForm"
      :model="verifyModal.data"
      :rules="verifyModal.rules"
      v-bind="verifyModal.layout"
    >
      <a-form-item
        label="E-mail"
        name="email"
        has-feedback
      >
        <a-input
          v-model:value="verifyModal.data.email"
          placeholder="Please type your E-mail to confirm"
        >
          <template #prefix>
            <MailOutlined class="modal-icon" />
          </template>
        </a-input>
      </a-form-item>
      <a-form-item
        label="Verify Code"
        name="verifyCode"
      >
        <a-space>
          <a-input
            v-model:value="verifyModal.data.verifyCode"
            placeholder="Verify Code"
          >
            <template #prefix>
              <KeyOutlined class="modal-icon" />
            </template>
          </a-input>
          <a-button
            :disabled="disableSendVerifyEmail()"
            @click="sendVerifyEmail"
          >
            {{ countdownText() }}
          </a-button>
        </a-space>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref } from 'vue';
import { useStore } from '@/store';
import { AxiosError } from 'axios';
import { FormOutlined, KeyOutlined, MailOutlined } from '@ant-design/icons-vue';

import {
  User,
  GetUserProfileReq,
  GetUserProfileResp,
  SendVerifyEmailReq,
  SendVerifyEmailResp,
  VerifyEmailReq,
  VerifyEmailResp,
} from '@/components/types';
import { userClient } from '@/api';
import { openNotification, title } from '@/mixins';
import {
  RuleObject,
  ValidateErrorEntity,
} from 'ant-design-vue/lib/form/interface';

export default defineComponent({
  components: {
    FormOutlined,
    KeyOutlined,
    MailOutlined,
  },
  setup() {
    const verifyForm = ref();
    const store = useStore();
    const userId = computed((): string => store.state.id);

    const userInfo = reactive({
      data: {
        userId: '',
        username: '',
        email: '',
        isVerified: false,
      } as User,
      loading: false,
    });

    const getUserProfile = (): void => {
      userInfo.loading = true;
      userClient
        .getUserProfile({
          userId: userId.value,
        } as GetUserProfileReq)
        .then((resp: GetUserProfileResp) => {
          console.log('getUserProfile', resp);
          userInfo.data = resp.user;
          userInfo.loading = false;
        })
        .catch((err: AxiosError) => {
          openNotification(
            'error',
            `Failed to load user profile, error: ${err.message}`
          );
        });
    };

    const validateVerifyEmail = async (
      _rule: RuleObject,
      value: string
    ): Promise<string | void> => {
      if (value !== userInfo.data.email) {
        return Promise.reject(`Please type ${userInfo.data.email} to confirm`);
      } else {
        return Promise.resolve();
      }
    };

    const verifyFormRules = {
      email: [
        {
          validator: validateVerifyEmail,
          required: true,
          trigger: 'blur',
        },
      ],
      verifyCode: [
        {
          required: true,
          message: 'Please input verify code',
          trigger: 'blur',
        },
      ],
    };

    const verifyModal = reactive({
      visible: false,
      loading: false,
      countdown: 0,
      data: {
        email: '',
        verifyCode: '',
      },
      rules: verifyFormRules,
      layout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 16 },
      },
    });

    const resetVerifyForm = (): void => {
      verifyForm.value.resetFields();
    };

    const openVerifyModal = (): void => {
      verifyModal.visible = true;
    };

    const closeVerifyModal = (): void => {
      verifyModal.visible = false;
      verifyModal.loading = false;
      resetVerifyForm();
    };

    const disableSendVerifyEmail = (): boolean =>
      verifyModal.countdown > 0 ||
      verifyModal.data.email !== userInfo.data.email;

    const startCountdown = (duration: number): void => {
      verifyModal.countdown = duration;
      const timer = setInterval((): void => {
        if (--verifyModal.countdown <= 0) {
          verifyModal.countdown = 0;
          clearInterval(timer);
        }
      }, 1000);
    };

    const countdownText = (): string =>
      verifyModal.countdown > 0 ? `Send (${verifyModal.countdown} s)` : 'Send';

    const sendVerifyEmail = (): void => {
      userClient
        .sendVerifyEmail({
          userId: userId.value,
          email: verifyModal.data.email,
        } as SendVerifyEmailReq)
        .then((resp: SendVerifyEmailResp) => {
          console.log('sendVerifyEmail', resp);
          if (resp.status !== 'success') {
            openNotification(
              'error',
              'Failed to send verify email, please try again later.'
            );
          }
          if (verifyModal.countdown === 0) {
            startCountdown(30); // wait for 30s
          }
        })
        .catch((err: AxiosError) => {
          openNotification(
            'error',
            `Failed to send verify email, error: ${err.message}`
          );
        });
    };

    const verifyEmail = (): void => {
      userClient
        .verifyEmail({
          userId: userId.value,
          ...verifyModal.data,
        } as VerifyEmailReq)
        .then((resp: VerifyEmailResp) => {
          console.log('verifyEmail', resp);
          if (resp.status !== 'success') {
            openNotification(
              'error',
              'Failed to verify email, wrong verify code.'
            );
          } else {
            verifyModal.visible = false;
          }
        })
        .catch((err: AxiosError) => {
          openNotification(
            'error',
            `Failed to verify email, error: ${err.message}`
          );
        })
        .finally((): void => {
          verifyModal.loading = false;
        });
    };

    const submitVerifyForm = (): void => {
      verifyModal.loading = true;
      verifyForm.value
        .validate()
        .then((): void => {
          verifyEmail();
        })
        .catch((_error: ValidateErrorEntity): void => {
          openNotification(
            'warn',
            'Please make sure all fields are filled in correctly.'
          );
        })
        .finally((): void => {
          verifyModal.loading = false;
        });
    };

    const refresh = (): void => {
      document.title = `My Profile - ${title}`;
      getUserProfile();
    };

    return {
      userInfo,
      verifyForm,
      verifyModal,
      resetVerifyForm,
      openVerifyModal,
      closeVerifyModal,
      disableSendVerifyEmail,
      countdownText,
      sendVerifyEmail,
      submitVerifyForm,
      refresh,
    };
  },
  created() {
    this.refresh();
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
