<!--prettier-ignore-->
<template>
  <a-table
    :columns="columns" 
    :data-source="data"
  >
    <template #name="{ text }">
      <a>{{ text }}</a>
    </template>
    <template #customTitle>
      <span>
        Problem ID
      </span>
    </template>
    <template #tags="{ text: tags }">
      <span>
        <a-tag
          v-for="tag in tags"
          :key="tag"
          :color="tag === 'loser' ? 'volcano' : tag.length > 5 ? 'geekblue' : 'green'"
        >
          {{ tag.toUpperCase() }}
        </a-tag>
      </span>
    </template>
  </a-table>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
const columns = [
  {
    dataIndex: 'problemId',
    key: 'problemId',
    slots: { title: 'customTitle', customRender: 'name' },
  },
  {
    title: 'Problem Name',
    dataIndex: 'problemName',
    key: 'problemName',
  },
  {
    title: 'Tags',
    key: 'tags',
    dataIndex: 'tags',
    slots: { customRender: 'tags' },
  },
  {
    title: 'Update Time',
    dataIndex: 'updateTime',
    key: 'updateTime',
  },
];

const data = [
  {
    problemId: '1001',
    problemName: 'A + B problem',
    tags: ['naive'],
    updateTime: '2021-03-25 17:29:03'
  },
  {
    problemId: '1002',
    problemName: 'Hello World',
    tags: ['not naive'],
    updateTime: '2021-03-25 17:29:04'
  },
  {
    problemId: '1003',
    problemName: 'Good Bye',
    tags: ['test'],
    updateTime: '2021-03-25 17:29:05'
  },
];

export default defineComponent({
  components: {
  },
  setup() {
    return {
      data,
      columns,
    };
  },
});
</script>
