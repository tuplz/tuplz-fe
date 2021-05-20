<template>
  <a-form
    ref="commentForm"
    :model="comment.data"
    :rules="comment.rules"
    v-bind="comment.layout"
  >
    <a-form-item name="commentContent">
      <a-textarea
        v-model:value="comment.data.commentContent"
        :rows="4"
      />
    </a-form-item>
    <a-form-item>
      <a-space>
        <a-button
          type="primary"
          @click="submitCommentForm"
        >
          Submit
        </a-button>
        <a-button @click="resetCommentForm()">
          Cancel
        </a-button>
      </a-space>
    </a-form-item>
  </a-form>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref } from 'vue';
import { useStore } from '@/store';
import { AxiosError } from 'axios';

import {
  CommentForm,
  UploadCommentReq,
  UploadCommentResp,
} from '@/components/types';
import { commentClient } from '@/api';
import { openMessage, openNotification } from '@/mixins';
import { ValidateErrorEntity } from 'ant-design-vue/lib/form/interface';

export default defineComponent({
  props: {
    recommendId: {
      type: Number,
      required: true,
    },
    replyTo: {
      type: Number,
      required: true,
    },
  },
  emits: ['submit'],
  setup(props, { emit }) {
    const store = useStore();
    const userId = computed((): string => store.state.id);

    const commentFormRules = {
      commentContent: [
        {
          required: true,
          message: 'Please input at least one word',
        },
      ],
    };

    const comment = reactive({
      data: {
        recommendId: props.recommendId,
        commentContent: '',
        userId: userId.value,
        replyTo: props.replyTo,
      } as CommentForm,
      rules: commentFormRules,
      layout: {
        wrapperCol: { span: 24 },
      },
    });

    const commentForm = ref();

    const uploadComment = (): void => {
      commentClient
        .uploadComment({
          ...comment.data,
        } as UploadCommentReq)
        .then((resp: UploadCommentResp): void => {
          console.log('uploadComment', resp);
          if (resp.status !== 'success') {
            openNotification('error', `Failed to comment, not logged in.`);
          } else {
            resetCommentForm();
            emit('submit');
            openMessage('success', `Succeeded to comment.`);
          }
        })
        .catch((err: AxiosError): void => {
          openNotification('error', `Failed to comment, error: ${err.message}`);
        });
    };

    const submitCommentForm = (): void => {
      commentForm.value
        .validate()
        .then((): void => {
          uploadComment();
        })
        .catch((_error: ValidateErrorEntity): void => {
          openNotification(
            'warning',
            'Please make sure all fields are filled in correctly.'
          );
        });
    };

    const resetCommentForm = (): void => {
      commentForm.value.resetFields();
    };

    return {
      commentForm,
      comment,
      submitCommentForm,
      resetCommentForm,
    };
  },
});
</script>
