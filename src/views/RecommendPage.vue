<!-- eslint-disable vue/no-v-html -->
<template>
  <a-space
    direction="vertical"
    style="width: 100%"
  >
    <a-card
      :title="`Problem #${recommendInfo.data.problemId}`"
      :loading="recommendInfo.loading"
    >
      <a-card-meta
        :title="recommendInfo.data.username"
        :description="recommendInfo.data.message"
      >
        <template #avatar>
          <a-avatar
            size="large"
            style="font-size: 20px"
          >
            {{ recommendInfo.data.username[0].toUpperCase() }}
          </a-avatar>
        </template>
      </a-card-meta>
    </a-card>

    <a-card title="Comments">
      <a-list
        item-layout="horizontal"
        :data-source="commentsInfo.data"
        :loading="commentsInfo.loading"
        :row-key="commentsInfo.rowKey"
      >
        <template #renderItem="{ item }">
          <a-list-item>
            <a-comment>
              <template #actions>
                <span
                  key="comment-nested-reply-to"
                  @click="item.isReply = !item.isReply"
                >
                  Reply to
                </span>
                <span v-show="item.isReply">
                  <a-form
                    ref="form"
                    :model="commentForm"
                    style="margin-top: 24px"
                    @finish="handleFinish(item.commentId)"
                  >
                    <a-form-item>
                      <a-textarea
                        v-model:value="commentForm.commentContent"
                        :rows="4"
                      />
                    </a-form-item>
                    <a-form-item>
                      <a-button
                        html-type="submit"
                        type="primary"
                      >
                        Submit
                      </a-button>
                    </a-form-item>
                  </a-form>
                </span>
              </template>
              <template #author>
                <span>
                  {{ item.username }}
                </span>
              </template>
              <template #avatar>
                <a-avatar
                  size="large"
                  style="font-size: 20px"
                >
                  {{ (item.username || defaultUsername)[0].toUpperCase() }}
                </a-avatar>
              </template>
              <template #content>
                {{ item.commentContent }}
              </template>
            </a-comment>
          </a-list-item>
        </template>
      </a-list>
    </a-card>
  </a-space>
  <a-form
    ref="form"
    :model="commentForm"
    style="margin-top: 24px"
    @finish="handleFinish(-1)"
  >
    <a-form-item>
      <a-textarea
        v-model:value="commentForm.commentContent"
        :rows="4"
      />
    </a-form-item>
    <a-form-item>
      <a-button
        html-type="submit"
        type="primary"
      >
        Submit
      </a-button>
    </a-form-item>
  </a-form>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from '@/store';
import { AxiosError } from 'axios';

import {
  Comment,
  CommentForm,
  GetCommentsReq,
  GetCommentsResp,
  GetRecommendReq,
  GetRecommendResp,
  Recommend,
  UploadCommentReq,
  UploadCommentResp,
} from '@/components/types';
import { commentClient, recommendClient } from '@/api';
import { openNotification } from '@/mixins';
import { defaultUsername } from '@/utils/config';

export default defineComponent({
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useStore();
    const userId = computed((): string => store.state.id);
    const form = ref();

    const getRecommendId = (): number => {
      if (Array.isArray(route.params.id)) {
        console.log('Invalid route for parsing Recommend ID.');
        console.log(parseInt(route.params.id[0]));
        return parseInt(route.params.id[0]);
      }
      return parseInt(route.params.id);
    };

    const recommendInfo = reactive({
      data: {
        recommendId: getRecommendId(),
        problemId: 0,
        userId: '',
        username: '',
        message: '',
        updateTime: '',
      } as Recommend,
      loading: false,
    });

    const commentsInfo = reactive({
      data: [] as Comment[],
      loading: false,
    });

    const getRecommend = (): void => {
      recommendInfo.loading = true;
      recommendClient
        .getRecommend({
          recommendId: getRecommendId(),
          userId: userId,
        } as GetRecommendReq)
        .then((resp: GetRecommendResp) => {
          if (!resp.recommend.recommendId) {
            openNotification(
              'error',
              `Recommend not found, redirecting to home page.`
            );
            setTimeout((): void => {
              router.replace({ name: 'Problemset' });
            }, 3000);
          } else {
            console.log('getRecommend', resp);
            recommendInfo.data = resp.recommend;
            recommendInfo.loading = false;
          }
        })
        .catch((err: AxiosError) => {
          openNotification(
            'error',
            `Failed to load problem, error: ${err.message}`
          );
        });
    };

    const getComments = (): void => {
      commentsInfo.loading = true;
      commentClient
        .getComments({
          userId: userId.value,
          recommendId: getRecommendId(),
        } as GetCommentsReq)
        .then((resp: GetCommentsResp) => {
          console.log('getComments', resp);

          commentsInfo.data = resp.comments;
          commentsInfo.loading = false;
        })
        .catch((err: AxiosError) => {
          openNotification(
            'error',
            `Failed to load recommendations, error: ${err.message}`
          );
        });
    };

    const commentForm = reactive({
      recommendId: getRecommendId(),
      commentContent: '',
    } as CommentForm);

    const resetForm = (): void => {
      form.value.resetFields();
    };

    const uploadComment = (id: number): void => {
      console.log(id);
      commentClient
        .uploadComment({
          userId: store.state.id,
          replyTo: id,
          ...commentForm,
        } as UploadCommentReq)
        .then((resp: UploadCommentResp): void => {
          console.log(resp);
          if (resp.status !== 'success') {
            openNotification(
              'error',
              `Failed to upload recommendation, user not logged in.`
            );
          } else {
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

    const handleFinish = (id: number): void => {
      uploadComment(id);
    };

    const doReply = (id: number): void => {
      console.log(id);
      commentsInfo.data[id].isReply = !commentsInfo.data[id].isReply;
    };

    const refresh = (): void => {
      getRecommend();
      getComments();
    };

    return {
      defaultUsername,
      getRecommendId,
      recommendInfo,
      commentsInfo,
      commentForm,
      refresh,
      getComments,
      handleFinish,
      doReply,
    };
  },
  created() {
    this.refresh();
  },
});
</script>
