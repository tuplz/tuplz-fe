<template>
  <a-card
    :title="info.data.id"
    style="width: 1500px; margin: 0 auto; margin-top: 2cm"
  >
    <a-typography>
      <a-typography-title>
        {{ info.data.content.title }}
      </a-typography-title>
      <a-typography-title :level="2">
        Description
      </a-typography-title>
      <a-typography-paragraph>
        {{ info.data.content.description }}
      </a-typography-paragraph>
      <a-typography-title :level="2">
        Input Format
      </a-typography-title>
      <a-typography-paragraph code>
        {{ info.data.content.inputFormat }}
      </a-typography-paragraph>
      <a-typography-title :level="2">
        Output Format
      </a-typography-title>
      <a-typography-paragraph code>
        {{ info.data.content.outputFormat }}
      </a-typography-paragraph>
    </a-typography>
  </a-card>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRoute } from 'vue-router';
import { AxiosError } from 'axios';
import { notification } from 'ant-design-vue';

import { GetProblemReq, GetProblemResp, Problem } from '@/components/types';
import { problemClient } from '@/api';

export default defineComponent({
  setup() {
    const route = useRoute();

    const info = ref({
      data: {
        id: 0,
        like: 0,
        dislike: 0,
        visit: 0,
        tags: [] as string[],
        updTime: '',
        content: {
          title: '',
          description: '',
          inputFormat: '',
          outputFormat: '',
        },
      } as Problem,
    });

    const openNotification = (type: string, description: string): void => {
      notification[type]({
        message: type.toUpperCase(),
        description,
      });
    };

    const refresh = (): void => {
      problemClient
        .getProblem({
          id: route.params.id,
          userId: 'root',
          userKey: 'root',
        } as GetProblemReq)
        .then((resp: GetProblemResp) => {
          info.value.data = resp.prob;
        })
        .catch((err: AxiosError) => {
          openNotification(
            'error',
            `Failed to load problems, error: ${err.message}`
          );
        });
    };

    return {
      info,
      openNotification,
      refresh,
    };
  },
  created() {
    console.log(`params: ${this.$route.params.id}`);
    this.refresh();
  },
});
</script>
