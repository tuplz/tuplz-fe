<template>
  <a-space
    direction="vertical"
    size="large"
    style="width: 100%"
  >
    <a-card
      :title="collection.data.title"
      :loading="collection.loading"
    >
      <a-card-meta>
        <template #description>
          <span>
            <ClockCircleOutlined class="card-icon" />
            Updated at {{ collection.data.updateTime }}
          </span>
        </template>
      </a-card-meta>
    </a-card>
    <a-card
      :title="`${collection.data.problems.length} problems`"
      :loading="collection.loading"
    >
      <problem-table
        :problems="collection.data.problems"
        :loading="collection.loading"
      />
    </a-card>
  </a-space>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import { useRoute } from 'vue-router';
import { AxiosError } from 'axios';
import { ClockCircleOutlined } from '@ant-design/icons-vue';

import {
  Collection,
  Problem,
  GetCollectionReq,
  GetCollectionResp,
} from '@/components/types';
import { ProblemTable } from '@/components';
import { collectionClient } from '@/api';
import { openNotification, title } from '@/mixins';

export default defineComponent({
  components: {
    ProblemTable,
    ClockCircleOutlined,
  },
  setup() {
    const route = useRoute();

    const getCollectionId = (): number => {
      if (Array.isArray(route.params.id)) {
        console.log('Invalid route for parsing Collection ID.');
        return parseInt(route.params.id[0]);
      }
      return parseInt(route.params.id);
    };

    const collection = reactive({
      data: {
        collectionId: 0,
        userId: '',
        title: '',
        problems: [],
        updateTime: '',
      } as Collection,
      loading: false,
    });

    const getCollection = (): void => {
      collection.loading = true;
      collectionClient
        .getCollection({
          collectionId: getCollectionId(),
        } as GetCollectionReq)
        .then((resp: GetCollectionResp) => {
          console.log('getCollection', resp);
          collection.data = resp.collection;
          document.title = `${collection.data.title} - Collections - ${title}`;
          collection.loading = false;
        })
        .catch((err: AxiosError) => {
          openNotification(
            'error',
            `Failed to load collection, error: ${err.message}`
          );
        });
    };

    const table = reactive({
      columns: [
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
      ],
      rowKey: 'id',
      data: [] as Problem[],
      loading: false,
    });

    const refresh = (): void => {
      getCollection();
    };

    return {
      collection,
      table,
      refresh,
    };
  },
  created() {
    this.refresh();
  },
});
</script>

<style lang="scss" scoped>
.ant-card-body {
  .card-icon {
    padding: 3px;
  }
}
</style>
