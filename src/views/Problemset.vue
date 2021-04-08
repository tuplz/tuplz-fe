<template>
  <a-table
    :columns="table.columns"
    :data-source="table.data"
    :pagination="{
      showQuickJumper: true,
      showSizeChanger: true,
      pageSizeOptions: ['10', '20', '50', '100'],
      defaultPageSize: 20,
    }"
    :scroll="{ x: 720 }"
    :row-key="table.rowKey"
  >
    <template #id="{ text }">
      <router-link
        :to="{
          name: 'ProblemPage',
          params: text,
        }"
      >
        {{ text }}
      </router-link>
    </template>
    <template #tags="{ text: tags }">
      <span>
        <a-tag
          v-for="tag in tags"
          :key="tag"
          :color="tagColor(tag)"
        >
          {{ tag.toUpperCase() }}
        </a-tag>
      </span>
    </template>
  </a-table>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import { AxiosError } from 'axios';
import { notification } from 'ant-design-vue';

import { Problem, TagColorMap, GetProblemsResp } from '@/components/types';
import { problemClient } from '@/api';

const table = reactive({
  columns: [
    {
      title: 'ID',
      dataIndex: 'id',
      width: '10%',
      ellipsis: true,
      slots: { customRender: 'id' },
      sorter: (a: Problem, b: Problem) => a.id - b.id,
    },
    {
      title: 'Problem Name',
      dataIndex: 'content.title',
      ellipsis: true,
      sorter: (a: Problem, b: Problem) =>
        a.content.title.localeCompare(b.content.title),
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      width: '25%',
      slots: { customRender: 'tags' },
    },
    {
      title: 'Update Time',
      dataIndex: 'updateTime',
      align: 'right',
      width: '25%',
      ellipsis: true,
      sorter: (a: Problem, b: Problem) => a.updTime.localeCompare(b.updTime),
    },
  ],
  rowKey: 'problemId',
  data: [] as Problem[],
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
        .getProblems()
        .then((resp: GetProblemsResp) => {
          table.data = resp.prob;
          console.log(table.data);
        })
        .catch((err: AxiosError) => {
          openNotification(
            'error',
            `Failed to load problems, error: ${err.message}`
          );
        });
    };

    const tagColor = (tag: string): string =>
      tag in defaultTagColors ? defaultTagColors[tag] : 'purple';

    return {
      table,
      openNotification,
      refresh,
      tagColor,
    };
  },
  created() {
    this.refresh();
  },
});
</script>
