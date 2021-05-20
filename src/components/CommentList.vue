<template>
  <a-card
    :title="`${comments.length} Comment${comments.length <= 1 ? '' : 's'}`"
  >
    <comment-form
      :recommend-id="recommendId"
      :reply-to="0"
      @submit="$emit('submit')"
    />
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
              <a-button @click="item.reply.visible = !item.reply.visible">
                Reply
              </a-button>
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
            <template #datetime>
              <span>
                {{ parseDatetime(item.updateTime) }}
              </span>
              <a-divider type="vertical" />
              <span>#{{ item.commentId }}</span>
            </template>
            <template #content>
              <a-typography>
                <a-typography-paragraph>
                  <blockquote>Re: #{{ item.replyTo }}</blockquote>
                  {{ item.commentContent }}
                </a-typography-paragraph>
              </a-typography>
            </template>
            <comment-form
              v-show="item.reply.visible"
              :recommend-id="item.reply.data.recommendId"
              :reply-to="item.commentId"
              style="margin: 16px 0 0 8px"
              @submit="getComments()"
            />
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
import { parseDatetime } from '@/mixins';
import { defaultUsername } from '@/utils/config';

export default defineComponent({
  components: {
    CommentForm,
  },
  props: {
    recommendId: {
      type: Number,
      required: true,
    },
    comments: {
      type: Array as PropType<Comment[]>,
      default: () => [] as Comment[],
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
