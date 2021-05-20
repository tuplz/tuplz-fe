<template>
  <a-card title="Comments">
    <a-list
      item-layout="horizontal"
      :data-source="comments"
      :loading="loading"
      row-key="commentId"
    >
      <template #renderItem="{ item }">
        <a-list-item :key="item.commentId">
          <a-comment>
            <template #actions>
              <a-space
                direction="vertical"
                size="large"
              >
                <a-button @click="item.reply.visible = !item.reply.visible">
                  Reply to
                </a-button>
                <comment-form
                  v-show="item.reply.visible"
                  :recommend-id="item.reply.data.recommendId"
                  :reply-to="item.commentId"
                  @submit="getComments()"
                />
              </a-space>
            </template>
            <template #author>
              <span>
                {{ item.username || defaultUsername }}
              </span>
            </template>
            <template #avatar>
              <a-avatar
                size="large"
                style="font-size: 20px"
              >
                {{ (item.username || defaultUsername)[0].toUpperCase() }}
              </a-avatar>
            </template>
            <template #content>
              {{ item.commentContent }}
            </template>
          </a-comment>
        </a-list-item>
      </template>
    </a-list>
  </a-card>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

import { Comment } from '@/components/types';
import { CommentForm } from '@/components';
import { defaultUsername } from '@/utils/config';

export default defineComponent({
  components: {
    CommentForm,
  },
  props: {
    comments: {
      type: Array as PropType<Comment[]>,
      default: () => [] as Comment[],
    },
    loading: {
      type: Boolean,
      default: () => false,
    },
  },
  setup() {
    return {
      defaultUsername,
    };
  },
});
</script>
