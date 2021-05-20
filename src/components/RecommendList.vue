<template>
  <a-card :title="`${recommends.length} Reviews`">
    <a-list
      item-layout="horizontal"
      :data-source="recommends"
      :loading="loading"
      row-key="recommendId"
    >
      <template #renderItem="{ item }">
        <a-list-item :key="item.recommendId">
          <router-link
            :to="{
              name: 'RecommendPage',
              params: { id: item.recommendId },
            }"
          >
            <a-list-item-meta :description="item.message">
              <template #title>
                <a-space>
                  <span>
                    {{ item.username || defaultUsername }}
                  </span>
                  <span style="color: #ccc; font-weight: 400">
                    {{ parseDatetime(item.updateTime) }}
                  </span>
                </a-space>
              </template>
              <template #avatar>
                <a-avatar
                  size="large"
                  style="font-size: 20px"
                >
                  {{ (item.username || defaultUsername)[0].toUpperCase() }}
                </a-avatar>
              </template>
            </a-list-item-meta>
          </router-link>
        </a-list-item>
      </template>
    </a-list>
  </a-card>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

import { Recommend } from '@/components/types';
import { parseDatetime } from '@/mixins';
import { defaultUsername } from '@/utils/config';

export default defineComponent({
  props: {
    recommends: {
      type: Array as PropType<Recommend[]>,
      default: () => [] as Recommend[],
    },
    loading: {
      type: Boolean,
      default: () => false,
    },
  },
  setup() {
    return {
      defaultUsername,
      parseDatetime,
    };
  },
});
</script>
