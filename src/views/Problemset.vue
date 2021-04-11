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
    @finish="handleFinish"
  >
    <a-form-item
      label="Recommend URL"
      name="recommendUrl"
      required
      has-feedback
    >
      <a-input v-model:value="recommendForm.recommendUrl" />
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
import { AxiosError } from 'axios';
import { notification } from 'ant-design-vue';

import {
  Problem,
  TagColorMap,
  GetProblemsReq,
  GetProblemsResp,
  UploadRecommendReq,
  UploadRecommendResp,
} from '@/components/types';
import { problemClient, recommendClient } from '@/api';

export default defineComponent({
  setup() {
    const form = ref();

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
          dataIndex: 'tags',
          ellipsis: true,
          slots: { customRender: 'tags' },
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
          dataIndex: 'updateTime',
          align: 'right',
          width: 200,
          ellipsis: true,
          sorter: (a: Problem, b: Problem) =>
            a.updateTime.localeCompare(b.updateTime),
        },
      ],
      rowKey: 'id',
      data: [] as Problem[],
    });

    const defaultTagColors: TagColorMap = reactive({
      naive: 'blue',
      easy: 'green',
      normal: 'orange',
      hard: 'red',
    });

    const tagColor = (tag: string): string =>
      tag in defaultTagColors ? defaultTagColors[tag] : 'purple';

    const getProblems = (): void => {
      problemClient
        // TODO: remove mock data
        .getProblems({
          maxLength: 50,
          userId: 1,
          userKey: 'root',
        } as GetProblemsReq)
        .then((resp: GetProblemsResp) => {
          table.data = resp.problems;
        })
        .catch((err: AxiosError) => {
          openNotification(
            'error',
            `Failed to load problems, error: ${err.message}`
          );
        });
    };

    const refresh = (): void => {
      getProblems();
    };

    const recommendForm = reactive({
      recommendUrl: '',
      recommendReason: '',
    } as UploadRecommendReq);

    const layout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 15 },
    };

    const uploadRecommend = (): void => {
      recommendClient
        .uploadRecommend(recommendForm)
        .then((resp: UploadRecommendResp) => {
          console.log(resp);
        })
        .catch((err: AxiosError) => {
          openNotification(
            'error',
            `Failed to load problems, error: ${err.message}`
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
