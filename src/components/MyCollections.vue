<template>
  <a-card
    title="My Collections"
    :loading="collections.loading"
  >
    <template #extra>
      <a-button type="primary">
        <PlusOutlined /> New
      </a-button>
    </template>
    <a-list :data-source="collections.data">
      <template #renderItem="{ item }">
        <a-list-item :key="item.collectionId">
          <a-list-item-meta>
            <template #title>
              <router-link
                :to="{
                  name: 'CollectionPage',
                  params: { id: item.collectionId },
                }"
              >
                {{ item.title }}
              </router-link>
            </template>
            <template #description>
              <div>
                <span>
                  <BarsOutlined style="padding: 3px" />
                  {{ item.problemCount }} problems
                </span>
                <a-divider type="vertical" />
                <span>
                  <ClockCircleOutlined style="padding: 3px" />
                  Updated at {{ item.updateTime }}
                </span>
              </div>
            </template>
          </a-list-item-meta>
        </a-list-item>
      </template>
    </a-list>
  </a-card>
</template>

<script lang="ts">
import { computed, defineComponent, reactive } from 'vue';
import { useStore } from '@/store';
import { AxiosError } from 'axios';
import {
  BarsOutlined,
  ClockCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons-vue';

import {
  CollectionInfo,
  GetCollectionsReq,
  GetCollectionsResp,
} from '@/components/types';
import { collectionClient } from '@/api';
import { openNotification } from '@/mixins';

export default defineComponent({
  components: {
    BarsOutlined,
    ClockCircleOutlined,
    PlusOutlined,
  },
  setup() {
    const store = useStore();
    const userId = computed((): string => store.state.id);

    const collections = reactive({
      data: [] as CollectionInfo[],
      loading: false,
    });

    const getCollections = (): void => {
      collections.loading = true;
      collectionClient
        .getCollections({
          userId: userId.value,
        } as GetCollectionsReq)
        .then((resp: GetCollectionsResp) => {
          console.log('getCollections', resp);
          collections.data = resp.collections;
          collections.loading = false;
        })
        .catch((err: AxiosError) => {
          openNotification(
            'error',
            `Failed to load collections, error: ${err.message}`
          );
        });
    };

    return {
      collections,
      getCollections,
    };
  },
  created() {
    this.getCollections();
  },
});
</script>
