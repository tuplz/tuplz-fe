<template>
  <a-card :title="`Problem #${problemInfo.data.id}`">
    <a-typography>
      <a-typography-title>
        {{ problemInfo.data.content.title }}
      </a-typography-title>
      <a-typography-title :level="2">
        Description
      </a-typography-title>
      <a-typography-paragraph>
        {{ problemInfo.data.content.description }}
      </a-typography-paragraph>
      <a-typography-title :level="2">
        Input Format
      </a-typography-title>
      <a-typography-paragraph code>
        {{ problemInfo.data.content.inputFormat }}
      </a-typography-paragraph>
      <a-typography-title :level="2">
        Output Format
      </a-typography-title>
      <a-typography-paragraph code>
        {{ problemInfo.data.content.outputFormat }}
      </a-typography-paragraph>
      <a-typography-title :level="2">
        Sample
      </a-typography-title>
      <a-typography-paragraph>
        {{ problemInfo.data.content.sample }}
      </a-typography-paragraph>
      <a-typography-title :level="2">
        Constraints and Limitations
      </a-typography-title>
      <a-typography-paragraph>
        {{ problemInfo.data.content.constraints }}
      </a-typography-paragraph>
    </a-typography>
  </a-card>
  <a-comment
    v-for="item in recommendsInfo.data"
    :key="item.recommendId"
  >
    <template #actions>
      <span>
        {{ item.message }}
      </span>
    </template>
    <template #author>
      <a>
        {{ item.userId }}
      </a>
    </template>
    <template #avatar>
      <a-avatar
        src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
        alt="Han Solo"
      />
    </template>
  </a-comment>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRoute } from 'vue-router';
import { AxiosError } from 'axios';
import { notification } from 'ant-design-vue';

import {
  GetProblemReq,
  GetProblemResp,
  GetRecommendsResp,
  Problem,
  Recommend,
} from '@/components/types';
import { problemClient, recommendClient } from '@/api';

export default defineComponent({
  setup() {
    const route = useRoute();

    const problemInfo = ref({
      data: {
        id: 0,
        like: 0,
        dislike: 0,
        visit: 0,
        updateTime: '',
        content: {
          title: '',
          tags: [] as string[],
          description: '',
          inputFormat: '',
          outputFormat: '',
          sample: '',
          constraints: '',
        },
      } as Problem,
    });

    const recommendsInfo = ref({
      data: [] as Recommend[],
    });

    const openNotification = (type: string, description: string): void => {
      notification[type]({
        message: type.toUpperCase(),
        description,
      });
    };

    const getProblem = (): void => {
      problemClient
        .getProblem({
          id: parseInt(route.params.id as string),
          userId: 1,
          userKey: 'root',
        } as GetProblemReq)
        .then((resp: GetProblemResp) => {
          problemInfo.value.data = resp.problem;
        })
        .catch((err: AxiosError) => {
          openNotification(
            'error',
            `Failed to load problem, error: ${err.message}`
          );
        });
    };

    const getRecommendation = (): void => {
      recommendClient
        .getRecommends()
        .then((resp: GetRecommendsResp) => {
          recommendsInfo.value.data = resp.recommends;
          console.log(recommendsInfo.value.data);
        })
        .catch((err: AxiosError) => {
          openNotification(
            'error',
            `Failed to load recommendations, error: ${err.message}`
          );
        });
    };

    const refresh = (): void => {
      getProblem();
      getRecommendation();
    };

    return {
      problemInfo,
      recommendsInfo,
      openNotification,
      refresh,
    };
  },
  created() {
    console.log(`problemId: ${this.$route.params.id}`);
    this.refresh();
  },
});
</script>
