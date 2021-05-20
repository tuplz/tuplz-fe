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
        :title="recommendInfo.data.username || defaultUsername"
        :description="recommendInfo.data.message"
      >
        <template #avatar>
          <a-avatar
            size="large"
            style="font-size: 20px"
          >
            {{
              (recommendInfo.data.username || defaultUsername)[0].toUpperCase()
            }}
          </a-avatar>
        </template>
      </a-card-meta>
    </a-card>

    <comment-list
      :comments="commentsInfo.data"
      :loading="commentsInfo.loading"
    />
    <comment-form
      :recommend-id="recommendId"
      :reply-to="0"
      @submit="getComments()"
    />
  </a-space>
</template>

<script lang="ts">
import { computed, defineComponent, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { AxiosError } from 'axios';

import {
  Comment,
  GetCommentsReq,
  GetCommentsResp,
  GetRecommendReq,
  GetRecommendResp,
  Recommend,
} from '@/components/types';
import { CommentForm, CommentList } from '@/components';
import { commentClient, recommendClient } from '@/api';
import { openNotification, title } from '@/mixins';
import { defaultUsername } from '@/utils/config';

export default defineComponent({
  components: {
    CommentForm,
    CommentList,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const recommendId = computed((): number => {
      if (Array.isArray(route.params.id)) {
        console.log('Invalid route for parsing Recommend ID.');
        console.log(parseInt(route.params.id[0]));
        return parseInt(route.params.id[0]);
      }
      return parseInt(route.params.id);
    });

    const recommendInfo = reactive({
      data: {
        recommendId: recommendId.value,
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
          recommendId: recommendId.value,
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
          recommendId: recommendId.value,
        } as GetCommentsReq)
        .then((resp: GetCommentsResp) => {
          console.log('getComments', resp);
          commentsInfo.data = resp.comments.map((comment: Comment) =>
            Object.assign(comment, {
              reply: {
                data: {
                  recommendId: recommendId.value,
                  commentContent: '',
                },
                visible: false,
              },
            })
          );
          document.title = `Review by ${recommendInfo.data.username} - ${title}`;
          commentsInfo.loading = false;
        })
        .catch((err: AxiosError) => {
          openNotification(
            'error',
            `Failed to load recommendations, error: ${err.message}`
          );
        });
    };

    const refresh = (): void => {
      getRecommend();
      getComments();
    };

    return {
      defaultUsername,
      recommendId,
      recommendInfo,
      commentsInfo,
      refresh,
      getComments,
    };
  },
  created() {
    this.refresh();
  },
});
</script>
