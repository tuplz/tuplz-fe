<template>
  <a-card
    title="My Collections"
    :loading="collections.loading"
  >
    <template #extra>
      <a-button
        type="primary"
        @click="openCreateModal"
      >
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

  <a-modal
    v-model:visible="createModal.visible"
    title="Create new collection"
    :confirm-loading="createModal.loading"
    width="500px"
    :closable="false"
    @ok="createCollection"
    @cancel="closeCreateModal"
  >
    <a-form
      ref="createForm"
      name="createForm"
      :model="createModal.data"
      :rules="createModal.rules"
      v-bind="createModal.layout"
    >
      <a-form-item
        label="Title"
        name="title"
      >
        <a-input v-model:value="createModal.data.title" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref } from 'vue';
import { useStore } from '@/store';
import { AxiosError } from 'axios';
import {
  BarsOutlined,
  ClockCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons-vue';

import {
  CollectionForm,
  CollectionInfo,
  CreateCollectionReq,
  CreateCollectionResp,
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

    const createFormRules = {
      title: [
        {
          required: true,
          message: 'Please input the title of collection',
          trigger: 'blur',
        },
      ],
    };

    const createModal = reactive({
      visible: false,
      loading: false,
      data: {
        title: '',
      } as CollectionForm,
      rules: createFormRules,
      layout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 18 },
      },
    });

    const createForm = ref();

    const resetCreateForm = (): void => {
      createForm.value.resetFields();
    };

    const openCreateModal = (): void => {
      createModal.visible = true;
    };

    const closeCreateModal = (): void => {
      createModal.visible = false;
      createModal.loading = false;
      resetCreateForm();
    };

    const createCollection = (): void => {
      collectionClient
        .createCollection({
          userId: userId.value,
          ...createModal.data,
        } as CreateCollectionReq)
        .then((resp: CreateCollectionResp) => {
          console.log('createCollection', resp);
          if (resp.status !== 'success') {
            openNotification(
              'error',
              `Failed to create collection, user not logged in or not verified.`
            );
          } else {
            resetCreateForm();
            createModal.visible = false;
            getCollections();
          }
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
      createForm,
      createModal,
      openCreateModal,
      closeCreateModal,
      createCollection,
    };
  },
  created() {
    this.getCollections();
  },
});
</script>
