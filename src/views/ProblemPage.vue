<!-- eslint-disable vue/no-v-html -->
<template>
  <a-space
    direction="vertical"
    size="large"
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

        <a-typography-title :level="2">
          题目描述
        </a-typography-title>
        <div
          v-for="section in problemInfo.data.content.sections"
          :key="section.title"
        >
          <a-typography-title :level="2">
            <!-- Placeholder for prettier rendering. -->
          </a-typography-title>
          <a-typography-title :level="3">
            <span v-html="section.title" />
          </a-typography-title>
          <a-typography-paragraph>
            <span v-html="section.content" />
          </a-typography-paragraph>
          <a-typography-paragraph v-if="section.title.startsWith('限制')">
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
          <a-typography-paragraph v-if="section.misc.length">
            <span v-html="section.misc" />
          </a-typography-paragraph>
        </div>

        <a-typography-title :level="2">
          测试样例
        </a-typography-title>
        <div
          v-for="sample in problemInfo.data.content.samples"
          :key="sample.title"
        >
          <a-typography-title :level="2">
            <!-- Placeholder for prettier rendering. -->
          </a-typography-title>
          <a-typography-title :level="3">
            <span v-html="sample.title" />
          </a-typography-title>
          <a-typography-title
            v-if="sample.input.length"
            :level="4"
          >
            Input
          </a-typography-title>
          <a-typography-paragraph v-if="sample.input.length">
            <span v-html="sample.input" />
          </a-typography-paragraph>
          <a-typography-title
            v-if="sample.output.length"
            :level="4"
          >
            Output
          </a-typography-title>
          <a-typography-paragraph v-if="sample.output.length">
            <span v-html="sample.output" />
          </a-typography-paragraph>
          <a-typography-title
            v-if="sample.explanation.length"
            :level="4"
          >
            Explanation
          </a-typography-title>
          <a-typography-paragraph v-if="sample.explanation.length">
            <span v-html="sample.explanation" />
          </a-typography-paragraph>
          <a-typography-paragraph v-if="sample.misc.length">
            <span v-html="sample.misc" />
          </a-typography-paragraph>
        </div>
      </a-typography>
    </a-card>

    <recommend-list
      :recommends="recommendsInfo.data"
      :loading="recommendsInfo.loading"
    />
    <recommend-form
      :problem-id="getProblemId()"
      @submit="getRecommends()"
    />
  </a-space>
</template>

<script lang="ts">
import { computed, defineComponent, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from '@/store';
import { AxiosError } from 'axios';

import {
  GetProblemRecommendsReq,
  GetProblemRecommendsResp,
  GetProblemReq,
  GetProblemResp,
  Problem,
  Recommend,
} from '@/components/types';
import { RecommendForm, RecommendList } from '@/components';
import { problemClient, recommendClient } from '@/api';
import { openNotification, title } from '@/mixins';

export default defineComponent({
  components: {
    RecommendForm,
    RecommendList,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useStore();
    const userId = computed((): string => store.state.id);

    const getProblemId = (): number => {
      if (Array.isArray(route.params.id)) {
        console.log('Invalid route for parsing Problem ID.');
        return parseInt(route.params.id[0]);
      }
      return parseInt(route.params.id);
    };

    const problemInfo = reactive({
      data: {
        id: getProblemId(),
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

    const getProblem = (): void => {
      problemInfo.loading = true;
      problemClient
        .getProblem({
          userId: userId.value,
          id: getProblemId(),
        } as GetProblemReq)
        .then((resp: GetProblemResp) => {
          if (!resp.problem.id) {
            openNotification(
              'error',
              `Problem not found, redirecting to home page.`
            );
            setTimeout((): void => {
              router.replace({ name: 'Problemset' });
            }, 3000);
          } else {
            console.log('getProblem', resp);
            problemInfo.data = resp.problem;
            document.title = `${getProblemId()}. ${
              problemInfo.data.content.title
            } - Problems - ${title}`;
            problemInfo.loading = false;
          }
        })
        .catch((err: AxiosError) => {
          openNotification(
            'error',
            `Failed to load problem, error: ${err.message}`
          );
        });
    };

    const recommendsInfo = reactive({
      data: [] as Recommend[],
      loading: false,
    });

    const getRecommends = (): void => {
      recommendsInfo.loading = true;
      recommendClient
        .getProblemRecommends({
          userId: userId.value,
          id: getProblemId(),
        } as GetProblemRecommendsReq)
        .then((resp: GetProblemRecommendsResp) => {
          console.log('getRecommends', resp);
          recommendsInfo.data = resp.recommends;
          recommendsInfo.loading = false;
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
      getRecommends();
    };

    return {
      getProblemId,
      problemInfo,
      recommendsInfo,
      getRecommends,
      refresh,
    };
  },
  created() {
    this.refresh();
  },
});
</script>
