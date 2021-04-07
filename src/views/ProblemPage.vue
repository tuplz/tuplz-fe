<!--prettier-ignore-->
<template>
  <a-card
    :title="info.data.id"
    style="width: 1500px; margin: 0 auto; margin-top:2cm;"
  >
    <h1> {{ info.data.content.title }} </h1>
    <h2> Description </h2>
    <p> {{ info.data.content.description }} </p>
    <h2> Input Format </h2>
    <p> {{ info.data.content.inputFormat }} </p>
    <h2> Output Format </h2>
    <p> {{ info.data.content.outputFormat }} </p>
    <h2> Sample </h2>
    <p> {{ info.data.content.sample }} </p>
    <h2> Constraints and Limitations </h2>
    <p> {{ info.data.content.con }} </p>
  </a-card>
  <br>
</template>




<script lang="ts">
import { defineComponent, reactive } from 'vue';
import { AxiosError } from 'axios';
import { notification } from 'ant-design-vue';

import { TagColorMap, GetProblemContentResp } from '@/components/types';
import { problemClient } from '@/api';

const info = reactive({
  data: {},
});

const defaultTagColors: TagColorMap = reactive({
  naive: 'blue',
  easy: 'green',
  normal: 'orange',
  hard: 'red',
});

export default defineComponent({
  setup() {
    const openNotification = (type: string, description: string) => {
      notification[type]({
        message: type.toUpperCase(),
        description,
      });
    };

    const refresh = () => {
      problemClient
        .getProblemContent()
        .then((resp: GetProblemContentResp) => {
          console.log(info)
          info.data = resp.prob;
          console.log(resp)
          console.log(info)
          console.log(info.data)
        })
        .catch((err: AxiosError) => {
          openNotification('error', `Failed to load problems, error: ${err}`);
        });
    };

    const tagColor = (tag: string): string =>
      tag in defaultTagColors ? defaultTagColors[tag] : 'purple';

    return {
      info,
      openNotification,
      refresh,
      tagColor
    };
  },
  data() {
    return {
      programId: this.$route.params.id
    }
  },
  created() {
    console.log("params: " + this.$route.params.id)
    this.refresh();
  },
  methods: {
    gotoProblemPages(id: string) {
      console.log("jump to problem #" + id + "...")
    }

  }
});
</script>
