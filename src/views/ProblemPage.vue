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
        Sample Input & Output
      </a-typography-title>
      <div
        v-for="(sample, index) in problemInfo.data.content.sample"
        :key="index"
      >
        <a-typography-title :level="3">
          Sample Input {{ index }}
        </a-typography-title>
        <a-typography-paragraph>
          {{ sample.input }}
        </a-typography-paragraph>
        <a-typography-title :level="3">
          Sample Output {{ index }}
        </a-typography-title>
        <a-typography-paragraph>
          {{ sample.output }}
        </a-typography-paragraph>
        <a-typography-title :level="3">
          Explanation
        </a-typography-title>
        <a-typography-paragraph>
          {{ sample.explanation }}
        </a-typography-paragraph>
        <a-typography-title :level="3">
          Others
        </a-typography-title>
        <a-typography-paragraph>
          {{ sample.misc }}
        </a-typography-paragraph>
      </div>
      <a-typography-title :level="2">
        Constraints and Limitations
      </a-typography-title>
      <a-typography-paragraph>
        Time Limit: {{ problemInfo.data.content.rules.runtime }}
        Memory Limit: {{ problemInfo.data.content.rules.memory }}
        Stack Limit: {{ problemInfo.data.content.rules.stack }}
        Source: {{ problemInfo.data.content.rules.source }}
      </a-typography-paragraph>
      <a-typography-title :level="2">
        Others
      </a-typography-title>
      <a-typography-paragraph>
        {{ problemInfo.data.content.misc }}
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
  ProblemIOSamples,
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
          id: '',
          title: '',
          type: '',
          description: '',
          sample: [] as ProblemIOSamples[],
          tags: [] as string[],
          rules: {
            runtime: '',
            memory: '',
            stack: '',
            source: '',
          },
          meta: {
            created: '',
            updated: '',
            checked: '',
          },
          misc: ''
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
