<template>
  <a-table
    :columns="columns"
    :data-source="problems"
    :scroll="{ x: 1000 }"
    :pagination="{
      showQuickJumper: true,
      showSizeChanger: true,
      pageSizeOptions: ['10', '20', '50', '100'],
      defaultPageSize: 20,
    }"
    :loading="loading"
    row-key="id"
  >
    <template #name="{ text: title, record }">
      <router-link
        class="problem_link"
        :to="{
          name: 'ProblemPage',
          params: { id: record.id },
        }"
      >
        {{ title }}
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
    <template #datetime="{ text: datetime }">
      <span>
        {{ parseDatetime(datetime) }}
      </span>
    </template>
  </a-table>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

import { Problem } from '@/components/types';
import { parseDatetime, tagColor } from '@/mixins';

export default defineComponent({
  props: {
    problems: {
      type: Array as PropType<Problem[]>,
      default: () => [] as Problem[],
    },
    loading: {
      type: Boolean,
      default: () => false,
    },
  },
  setup() {
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        width: 100,
        ellipsis: true,
        sorter: (a: Problem, b: Problem) => a.id - b.id,
      },
      {
        title: 'Problem Name',
        dataIndex: 'content.title',
        width: '20%',
        ellipsis: true,
        slots: { customRender: 'name' },
        sorter: (a: Problem, b: Problem) =>
          a.content.title.localeCompare(b.content.title),
      },
      {
        title: 'Tags',
        dataIndex: 'content.tags',
        ellipsis: true,
        slots: { customRender: 'tags' },
      },
      {
        title: 'Visit',
        dataIndex: 'visit',
        width: 100,
        align: 'center',
        sorter: (a: Problem, b: Problem) => a.visit - b.visit,
      },
      {
        title: 'Like',
        dataIndex: 'like',
        width: 100,
        align: 'center',
        sorter: (a: Problem, b: Problem) => a.like - b.like,
      },
      {
        title: 'Dislike',
        dataIndex: 'dislike',
        width: 100,
        align: 'center',
        sorter: (a: Problem, b: Problem) => a.dislike - b.dislike,
      },
      {
        title: 'Update Time',
        dataIndex: 'content.meta.updated',
        align: 'right',
        width: 200,
        ellipsis: true,
        slots: { customRender: 'datetime' },
        sorter: (a: Problem, b: Problem) =>
          a.content.meta.updated.localeCompare(b.content.meta.updated),
      },
    ];

    return {
      parseDatetime,
      columns,
      tagColor,
    };
  },
});
</script>
