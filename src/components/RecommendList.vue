<template>
  <a-card
    :title="`${recommends.length} Review${recommends.length <= 1 ? '' : 's'}`"
  >
    <recommend-form
      :problem-id="problemId"
      @submit="$emit('submit')"
    />
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
                <a-row
                  type="flex"
                  justify="space-between"
                >
                  <span>
                    {{ item.username || defaultUsername }}
                  </span>
                  <span style="color: #ccc; font-weight: 400">
                    {{ parseDatetime(item.updateTime) }}
                  </span>
                </a-row>
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
import { RecommendForm } from '@/components';
import { parseDatetime } from '@/mixins';
import { defaultUsername } from '@/utils/config';

export default defineComponent({
  components: {
    RecommendForm,
  },
  props: {
    problemId: {
      type: Number,
      required: true,
    },
    recommends: {
      type: Array as PropType<Recommend[]>,
      default: () => [] as Recommend[],
    },
    loading: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['submit'],
  setup() {
    return {
      defaultUsername,
      parseDatetime,
    };
  },
});
</script>
