<template>
  <a-page-header
    title="Problemset"
    :ghost="false"
  >
    <problem-table
      :problems="problems.data"
      :loading="problems.loading"
      style="margin-top: 12px"
    />
  </a-page-header>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import { useStore } from '@/store';
import { AxiosError } from 'axios';

import { Problem, GetProblemsReq, GetProblemsResp } from '@/components/types';
import { ProblemTable } from '@/components';
import { problemClient } from '@/api';
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
    };

    return {
      problems,
      refresh,
    };
  },
  created() {
    this.refresh();
  },
});
</script>
