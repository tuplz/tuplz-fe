<template>
  <a-card :title="`Problem #${problemInfo.data.id}`">
    <a-typography>
      <a-typography-title>
        {{ problemInfo.data.content.title }}
      </a-typography-title>
      <div
        v-for="(sample, index) in problemInfo.data.content.sections"
        :key="index"
      >
        <a-typography-title :level="3">
          <div v-html="sample.title" />
        </a-typography-title>
        <a-typography-paragraph>
          <div v-html="sample.content" />
        </a-typography-paragraph>
        <a-typography-paragraph v-if="sample.misc.length>0">
          <div v-html="sample.misc" />
        </a-typography-paragraph>
      </div>
      <a-typography-title :level="2">
        Constraints and Limitations
      </a-typography-title>
      <a-typography-paragraph>
        Time Limit: {{ problemInfo.data.content.Rules.runtime }} <br>
        Memory Limit: {{ problemInfo.data.content.Rules.memory }} <br>
        Stack Limit: {{ problemInfo.data.content.Rules.stack }} <br>
        Source: {{ problemInfo.data.content.Rules.source }} <br>
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
  ProblemSections,
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
        updTime: '',
        content: {
          id: '',
          title: '',
          type: '',
          sections: [] as ProblemSections[],
          tags: [] as string[],
          Rules: {
            runtime: '',
            memory: '',
            stack: '',
            source: '',
          },
        }
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
          problemInfo.value.data = resp.prob;
          console.log(resp.prob);
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
    this.refresh();
  },
});
</script>
