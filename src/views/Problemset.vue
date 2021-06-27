<template>
  <a-tabs>
    <a-tab-pane
      key="1"
      tab="Problemset"
    >
      <a-page-header :ghost="false">
        <problem-table
          :problems="problems.data"
          :loading="problems.loading"
          style="margin-top: 12px"
        />
      </a-page-header>
    </a-tab-pane>
    <a-tab-pane
      key="2"
      tab="Recommendations"
    >
      <a-page-header :ghost="false">
        <problem-table
          :problems="recommendations.data"
          :loading="recommendations.loading"
          style="margin-top: 12px"
        />
      </a-page-header>
    </a-tab-pane>
  </a-tabs>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import { useStore } from '@/store';
import { AxiosError } from 'axios';

import {
  Problem,
  GetProblemsReq,
  GetProblemsResp,
  GetRecommendedProblemsReq,
  GetRecommendedProblemsResp,
} from '@/components/types';
import { ProblemTable } from '@/components';
import { problemClient, recommendClient } from '@/api';
import { openNotification, title } from '@/mixins';

export default defineComponent({
  components: {
    ProblemTable,
  },
  setup() {
    const store = useStore();

    const problems = reactive({
      data: [] as Problem[],
      loading: false,
    });

    const recommendations = reactive({
      data: [] as Problem[],
      loading: false,
    });

    const getRecommendations = (): void => {
      recommendations.loading = true;
      recommendClient
        .getProblems({
          userId: store.state.id,
          maxLength: 10000,
        } as GetRecommendedProblemsReq)
        .then((resp: GetRecommendedProblemsResp): void => {
          console.log(resp);
          recommendations.data = resp.problems;
          console.log(recommendations);
        })
        .catch((err: AxiosError): void => {
          openNotification(
            'error',
            `Failed to load problems, error: ${err.message}`
          );
        })
        .finally((): void => {
          recommendations.loading = false;
          console.log(recommendations);
        });
    };

    const getProblems = (): void => {
      problems.loading = true;
      problemClient
        .getProblems({
          userId: store.state.id,
          maxLength: 10000,
        } as GetProblemsReq)
        .then((resp: GetProblemsResp): void => {
          problems.data = resp.problems;
        })
        .catch((err: AxiosError): void => {
          openNotification(
            'error',
            `Failed to load problems, error: ${err.message}`
          );
        })
        .finally((): void => {
          problems.loading = false;
        });
    };

    const refresh = (): void => {
      document.title = `All Problems - ${title}`;
      getProblems();
      getRecommendations();
    };

    return {
      problems,
      recommendations,
      refresh,
    };
  },
  created() {
    this.refresh();
  },
});
</script>

<style lang="scss">
.ant-carousel {
  .slick-dots {
    > li {
      background: #107dfa;
      opacity: 0.5;
      > button {
        width: 100px;
      }
    }
  }
}
</style>
