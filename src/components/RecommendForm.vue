<template>
  <a-form
    ref="recommendForm"
    :model="recommend.data"
    :rules="recommend.rules"
    v-bind="recommend.layout"
    @finish="uploadRecommend"
  >
    <a-form-item name="recommendReason">
      <a-textarea v-model:value="recommend.data.recommendReason" />
    </a-form-item>
    <a-form-item :wrapper-col="{ offset: 10 }">
      <a-space>
        <a-button
          type="primary"
          @click="uploadRecommend"
        >
          Submit
        </a-button>
        <a-button @click="resetForm">
          Reset
        </a-button>
      </a-space>
    </a-form-item>
  </a-form>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';
import { useStore } from '@/store';
import { AxiosError } from 'axios';

import {
  RecommendForm,
  UploadRecommendReq,
  UploadRecommendResp,
} from '@/components/types';
import { recommendClient } from '@/api';
import { openNotification } from '@/mixins';

export default defineComponent({
  props: {
    problemId: {
      type: Number,
      required: true,
    },
  },
  emits: ['submit'],
  setup(props, { emit }) {
    const store = useStore();

    const recommendFormRules = {
      recommendReason: [
        {
          required: true,
          message: 'Please input recommend reason',
          trigger: 'blur',
        },
      ],
    };

    const recommend = reactive({
      data: {
        recommendReason: '',
      } as RecommendForm,
      rules: recommendFormRules,
      layout: {
        wrapperCol: { span: 24 },
      },
    });

    const recommendForm = ref();

    const uploadRecommend = (): void => {
      recommendClient
        .uploadRecommend({
          userId: store.state.id,
          problemId: props.problemId,
          ...recommend.data,
        } as UploadRecommendReq)
        .then((resp: UploadRecommendResp): void => {
          console.log('uploadRecommend', resp);
          if (resp.status !== 'success') {
            openNotification(
              'error',
              `Failed to upload recommendation, user not logged in or not verified.`
            );
          } else {
            emit('submit');
            resetForm();
          }
        })
        .catch((err: AxiosError): void => {
          openNotification(
            'error',
            `Failed to upload recommendation, error: ${err.message}`
          );
        });
    };

    const resetForm = (): void => {
      recommendForm.value.resetFields();
    };

    return {
      recommendForm,
      recommend,
      uploadRecommend,
      resetForm,
    };
  },
});
</script>
