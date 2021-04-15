<!-- eslint-disable vue/no-v-html -->
<template>
  <a-space
    direction="vertical"
    style="width: 100%"
  >
    <a-card
      :title="`Problem #${problemInfo.data.id}`"
      :loading="problemInfo.loading"
    >
      <a-typography>
        <a-typography-title>
          {{ problemInfo.data.content.title }}
        </a-typography-title>
        <div
          v-for="section in problemInfo.data.content.sections"
          :key="section.title"
        >
          <a-typography-title :level="2">
            <!-- Placeholder for prettier rendering. -->
          </a-typography-title>
          <a-typography-title :level="2">
            <span v-html="section.title" />
          </a-typography-title>
          <a-typography-paragraph>
            <span v-html="section.content" />
          </a-typography-paragraph>
          <a-typography-paragraph
            v-if="section.title.startsWith('限制')"
          >
            <ul>
              <li>
                <a-typography-text strong>
                  时间限制：
                </a-typography-text>
                <a-typography-text code>
                  {{ problemInfo.data.content.rules.runtime / 1e9 }}
                </a-typography-text>
                s
              </li>
              <li>
                <a-typography-text strong>
                  空间限制：
                </a-typography-text>
                <a-typography-text code>
                  {{ problemInfo.data.content.rules.memory / 1048576 }}
                </a-typography-text>
                MB
              </li>
            </ul>
          </a-typography-paragraph>
          <a-typography-paragraph v-if="section.misc.length > 0">
            <span v-html="section.misc" />
          </a-typography-paragraph>
        </div>
      </a-typography>
    </a-card>
    <a-card title="Reviews">
      <a-list
        item-layout="horizontal"
        :data-source="recommendsInfo.data"
        :loading="recommendsInfo.loading"
        :row-key="recommendsInfo.rowKey"
      >
        <template #renderItem="{ item }">
          <a-list-item>
            <a-list-item-meta :description="item.message">
              <template #title>
                <span>
                  {{ item.userId }}
                </span>
              </template>
              <template #avatar>
                <a-avatar
                  size="large"
                  style="font-size: 20px"
                >
                  {{ item.userId[0].toUpperCase() }}
                </a-avatar>
              </template>
            </a-list-item-meta>
          </a-list-item>
        </template>
      </a-list>
    </a-card>
  </a-space>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from '@/store';
import { AxiosError } from 'axios';
import { notification } from 'ant-design-vue';

import {
  GetProblemRecommendsReq,
  GetProblemRecommendsResp,
  GetProblemReq,
  GetProblemResp,
  Problem,
  Recommend,
} from '@/components/types';
import { problemClient, recommendClient } from '@/api';

export default defineComponent({
  setup() {
    const route = useRoute();
    const store = useStore();

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
      loading: false,
    });

    const recommendsInfo = reactive({
      data: [] as Recommend[],
      loading: false,
      rowKey: 'recommendId',
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
      problemInfo.loading = true;
      problemClient
        .getProblem({
          userId: store.state.id,
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
        })
        .finally((): void => {
          problemInfo.loading = false;
        });
    };

    const getRecommends = (): void => {
      recommendsInfo.loading = true;
      recommendClient
        .getProblemRecommends({
          userId: store.state.id,
          id: getProblemId(),
        } as GetProblemRecommendsReq)
        .then((resp: GetProblemRecommendsResp) => {
          recommendsInfo.data = resp.recommends;
        })
        .catch((err: AxiosError) => {
          openNotification(
            'error',
            `Failed to load recommendations, error: ${err.message}`
          );
        })
        .finally((): void => {
          recommendsInfo.loading = false;
        });
    };

    const refresh = (): void => {
      getProblem();
      getRecommends();
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
