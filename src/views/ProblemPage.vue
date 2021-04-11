<!-- eslint-disable vue/no-v-html -->
<template>
  <a-card :title="`Problem #${problemInfo.data.id}`">
    <a-typography>
      <a-typography-title>
        {{ problemInfo.data.content.title }}
      </a-typography-title>
      <div
        v-for="section in problemInfo.data.content.sections"
        :key="section.title"
      >
        <a-typography-title :level="2">
          <span v-html="section.title" />
        </a-typography-title>
        <a-typography-paragraph>
          <span v-html="section.content" />
        </a-typography-paragraph>
        <a-typography-paragraph v-if="section.misc.length > 0">
          <span v-html="section.misc" />
        </a-typography-paragraph>
      </div>
      <div>
        <a-typography-title :level="2">
          Constraints and Limitations
        </a-typography-title>
        <a-typography-paragraph>
          <a-space direction="vertical">
            <span>
              Time Limit:
              <a-typography-text code>
                {{ problemInfo.data.content.rules.runtime }}
              </a-typography-text>
            </span>
            <span>
              Memory Limit:
              <a-typography-text code>
                {{ problemInfo.data.content.rules.memory }}
              </a-typography-text>
            </span>
            <span>
              Stack Limit:
              <a-typography-text code>
                {{ problemInfo.data.content.rules.stack }}
              </a-typography-text>
            </span>
            <span>
              Source:
              <a-typography-text code>
                {{ problemInfo.data.content.rules.source }}
              </a-typography-text>
            </span>
          </a-space>
        </a-typography-paragraph>
      </div>
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
      <span>
        {{ item.userId }}
      </span>
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
import { defineComponent, reactive } from 'vue';
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

    const problemInfo = reactive({
      data: {
        id: 0,
        like: 0,
        dislike: 0,
        visit: 0,
        content: {
          title: '',
          type: '',
          sections: [],
          samples: [],
          tags: [],
          rules: {
            runtime: 0,
            memory: 0,
            stack: 0,
            source: 0,
          },
          meta: {
            created: '',
            updated: '',
            checked: '',
          },
          misc: '',
        },
      } as Problem,
    });

    const recommendsInfo = reactive({
      data: [] as Recommend[],
    });

    const openNotification = (type: string, description: string): void => {
      notification[type]({
        message: type.toUpperCase(),
        description,
      });
    };

    const getProblemId = (): number => {
      if (Array.isArray(route.params.id)) {
        console.log('Invalid route for parsing Problem ID.');
        return parseInt(route.params.id[0]);
      }
      return parseInt(route.params.id);
    };

    const getProblem = (): void => {
      problemClient
        .getProblem({
          id: getProblemId(),
        } as GetProblemReq)
        .then((resp: GetProblemResp) => {
          problemInfo.data = resp.problem;
          console.log(resp.problem);
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
          recommendsInfo.data = resp.recommends;
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
