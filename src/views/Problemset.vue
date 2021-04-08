<template>
  <a-table
    :columns="table.columns"
    :data-source="table.data"
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
          params: text,
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
    @finish="handleFinish"
    @finishFailed="handleFinishFailed"
  >
    <a-form-item
      required
      has-feedback
      label="Recommend URL"
      name="recommendUrl"
    >
      <a-input v-model:value="recommendForm.recommendUrl" />
    </a-form-item>
    <a-form-item
      required
      has-feedback
      label="Recommend Reason"
      name="recommendReason"
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
import { defineComponent, reactive, ref, UnwrapRef } from 'vue';
import { AxiosError } from 'axios';
import { notification } from 'ant-design-vue';

import {
  Problem,
  RecommendFormState,
  TagColorMap,
  GetProblemsResp,
} from '@/components/types';
import { problemClient, recommendClient } from '@/api';

const defaultTagColors: TagColorMap = reactive({
  naive: 'blue',
  easy: 'green',
  normal: 'orange',
  hard: 'red',
});

export default defineComponent({
  setup() {
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
          width: '10%',
          ellipsis: true,
          slots: { customRender: 'id' },
          sorter: (a: Problem, b: Problem) => a.id - b.id,
        },
        {
          title: 'Problem Name',
          dataIndex: 'content.title',
          ellipsis: true,
          sorter: (a: Problem, b: Problem) =>
            a.content.title.localeCompare(b.content.title),
        },
        {
          title: 'Tags',
          dataIndex: 'tags',
          width: '25%',
          slots: { customRender: 'tags' },
        },
        {
          title: 'Update Time',
          dataIndex: 'updateTime',
          align: 'right',
          width: '25%',
          ellipsis: true,
          sorter: (a: Problem, b: Problem) =>
            a.updateTime.localeCompare(b.updateTime),
        },
      ],
      rowKey: 'id',
      data: [] as Problem[],
    });

    const refresh = () => {
      problemClient
        .getProblems()
        .then((resp: GetProblemsResp) => {
          table.data = resp.problems;
          console.log(table.data);
        })
        .catch((err: AxiosError) => {
          openNotification(
            'error',
            `Failed to load problems, error: ${err.message}`
          );
        });
    };

    const tagColor = (tag: string): string =>
      tag in defaultTagColors ? defaultTagColors[tag] : 'purple';

    const form = ref();

    const recommendForm: UnwrapRef<RecommendFormState> = reactive({
      recommendUrl: '',
      recommendReason: '',
    });

    const handleFinish = () => {
      recommendClient
        .uploadRecommendation({
          recommendUrl: recommendForm.recommendUrl,
          recommendReason: recommendForm.recommendReason,
        })
        .then((resp: void) => {
          console.log(resp);
        })
        .catch((err: AxiosError) => {
          openNotification('error', `Failed to load problems, error: ${err}`);
        });
    };

    const layout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 15 },
    };

    return {
      table,
      openNotification,
      refresh,
      tagColor,
      recommendForm,
      form,
      handleFinish,
      layout,
    };
  },
  created() {
    this.refresh();
  },
});
</script>

<style lang="scss" scoped>
.ant-col {
  width: 1000;
}
</style>
