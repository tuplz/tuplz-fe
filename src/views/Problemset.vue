<template>
  <a-table
    :columns="table.columns"
    :data-source="table.data"
    :scroll="{ x: 1000 }"
    :pagination="{
      showQuickJumper: true,
      showSizeChanger: true,
      pageSizeOptions: ['10', '20', '50', '100'],
      defaultPageSize: 20,
    }"
    :loading="table.loading"
    :row-key="table.rowKey"
  >
    <template #id="{ text }">
      <router-link
        :to="{
          name: 'ProblemPage',
          params: { id: text },
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
  <a-form
    ref="form"
    :model="recommendForm"
    v-bind="layout"
    style="margin-top: 24px"
    @finish="handleFinish"
  >
    <a-form-item
      label="Problem ID"
      name="problemId"
      required
      has-feedback
    >
      <a-input v-model:value="recommendForm.problemId" />
    </a-form-item>
    <a-form-item
      label="Recommend Reason"
      name="recommendReason"
      required
      has-feedback
    >
      <a-textarea
        v-model:value="recommendForm.recommendReason"
        :auto-size="{ minRows: 5 }"
      />
    </a-form-item>
    <a-form-item :wrapper-col="{ span: 14, offset: 11 }">
      <a-button
        type="primary"
        html-type="submit"
      >
        Submit
      </a-button>
      <a-button
        style="margin-left: 10px"
        @click="resetForm"
      >
        Reset
      </a-button>
    </a-form-item>
  </a-form>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';
import { useStore } from '@/store';
import { AxiosError } from 'axios';
import { notification } from 'ant-design-vue';

import {
  Problem,
  TagColorMap,
  RecommendForm,
  GetProblemsReq,
  GetProblemsResp,
  UploadRecommendReq,
  UploadRecommendResp,
} from '@/components/types';
import { problemClient, recommendClient } from '@/api';

export default defineComponent({
  setup() {
    const form = ref();
    const store = useStore();

    const openNotification = (type: string, description: string) => {
      notification[type]({
        message: type.toUpperCase(),
        description,
      });
    };

    const table = reactive({
      columns: [
        {
          title: 'ID',
          dataIndex: 'id',
          width: 100,
          ellipsis: true,
          slots: { customRender: 'id' },
          sorter: (a: Problem, b: Problem) => a.id - b.id,
        },
        {
          title: 'Problem Name',
          dataIndex: 'content.title',
          width: '25%',
          ellipsis: true,
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
          sorter: (a: Problem, b: Problem) =>
            a.content.meta.updated.localeCompare(b.content.meta.updated),
        },
      ],
      rowKey: 'id',
      data: [] as Problem[],
      loading: false,
    });

    const defaultTagColors: TagColorMap = reactive({
      naive: 'blue',
      easy: 'green',
      normal: 'orange',
      hard: 'red',
    });

    const tagColor = (tag: string): string => defaultTagColors[tag] || 'purple';

    const getProblems = (): void => {
      table.loading = true;
      problemClient
        .getProblems({
          userId: store.state.id,
          maxLength: 10000,
        } as GetProblemsReq)
        .then((resp: GetProblemsResp): void => {
          table.data = resp.problems;
        })
        .catch((err: AxiosError): void => {
          openNotification(
            'error',
            `Failed to load problems, error: ${err.message}`
          );
        })
        .finally((): void => {
          table.loading = false;
        });
    };

    const refresh = (): void => {
      getProblems();
    };

    const recommendForm = reactive({
      problemId: undefined,
      recommendReason: '',
    } as RecommendForm);

    const layout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 15 },
    };

    const uploadRecommend = (): void => {
      recommendClient
        .uploadRecommend({
          userId: store.state.id,
          ...recommendForm,
        } as UploadRecommendReq)
        .then((resp: UploadRecommendResp): void => {
          console.log(resp);
          resetForm();
        })
        .catch((err: AxiosError): void => {
          openNotification(
            'error',
            `Failed to upload recommendation, error: ${err.message}`
          );
        });
    };

    const resetForm = (): void => {
      form.value.resetFields();
    };

    const handleFinish = (): void => {
      uploadRecommend();
    };

    return {
      form,
      openNotification,
      table,
      tagColor,
      refresh,
      recommendForm,
      layout,
      resetForm,
      handleFinish,
    };
  },
  created() {
    this.refresh();
  },
});
</script>

<style lang="scss" scoped></style>
