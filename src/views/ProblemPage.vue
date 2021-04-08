<template>
  <a-card
    :title="info.data.id"
    style="width: 1500px; margin: 0 auto; margin-top: 2cm"
  >
    <h1>{{ info.data.content.title }}</h1>
    <h2>Description</h2>
    <p>{{ info.data.content.description }}</p>
    <h2>Input Format</h2>
    <p>{{ info.data.content.inputFormat }}</p>
    <h2>Output Format</h2>
    <p>{{ info.data.content.outputFormat }}</p>
    <h2>Sample</h2>
    <p>{{ info.data.content.sample }}</p>
    <h2>Constraints and Limitations</h2>
    <p>{{ info.data.content.con }}</p>
  </a-card>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { AxiosError } from 'axios';
import { notification } from 'ant-design-vue';

import { GetProblemContentResp, Problem } from '@/components/types';
import { problemClient } from '@/api';
import { useRoute } from  'vue-router';

export default defineComponent({
  setup() {
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

    const openNotification = (type: string, description: string) => {
      notification[type]({
        message: type.toUpperCase(),
        description,
      });
    };

    const route = useRoute();

    const refresh = () => {
      problemClient
        .getProblemContent(route.params.id)
        .then((resp: GetProblemContentResp) => {
          info.value.data = resp.prob;
        })
        .catch((err: AxiosError) => {
          openNotification('error', `Failed to load problems, error: ${err}`);
        });
    };

    return {
      info,
      openNotification,
      refresh,
    };
  },
  data() {
    return {
      problemId: this.$route.params.id
    }
  },
  created() {
    console.log('params: ' + this.$route.params.id);
    this.refresh();
  },
  methods: {
    gotoProblemPages(id: string) {
      console.log('jump to problem #' + id + '...');
    },
  },
});
</script>
