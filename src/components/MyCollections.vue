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
                  <BarsOutlined class="list-icon" />
                  {{ item.problemCount }} problems
                </span>
                <a-divider type="vertical" />
                <span>
                  <ClockCircleOutlined class="list-icon" />
                  Updated at {{ item.updateTime }}
                </span>
              </div>
            </template>
          </a-list-item-meta>
          <template #actions>
            <div>
              <span @click="openEditModal(item)">
                <EditOutlined class="list-icon" />
                Edit
              </span>
              <a-divider type="vertical" />
              <a-popconfirm
                title="Are you sure to delete this collection?"
                placement="topRight"
                ok-text="Delete"
                cancel-text="Cancel"
                @confirm="deleteCollection(item.collectionId)"
              >
                <span>
                  <DeleteOutlined class="list-icon" />
                  Delete
                </span>
              </a-popconfirm>
            </div>
          </template>
        </a-list-item>
      </template>
    </a-list>
  </a-card>

  <a-modal
    v-model:visible="collectionModal.visible"
    :title="collectionModal.title"
    :confirm-loading="collectionModal.loading"
    width="500px"
    :closable="false"
    @ok="collectionModal.callback"
    @cancel="closeCollectionModal"
  >
    <a-form
      ref="collectionForm"
      name="collectionForm"
      :model="collectionModal.data"
      :rules="collectionModal.rules"
      v-bind="collectionModal.layout"
    >
      <a-form-item
        label="Title"
        name="title"
      >
        <a-input v-model:value="collectionModal.data.title" />
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
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
} from '@ant-design/icons-vue';

import {
  CollectionForm,
  CollectionInfo,
  CreateCollectionReq,
  CreateCollectionResp,
  DeleteCollectionReq,
  DeleteCollectionResp,
  EditCollectionReq,
  EditCollectionResp,
  GetCollectionsReq,
  GetCollectionsResp,
} from '@/components/types';
import { collectionClient } from '@/api';
import { openMessage, openNotification } from '@/mixins';

export default defineComponent({
  components: {
    BarsOutlined,
    ClockCircleOutlined,
    DeleteOutlined,
    EditOutlined,
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

    const collectionFormRules = {
      title: [
        {
          required: true,
          message: 'Please input the title of collection',
          trigger: 'blur',
        },
      ],
    };

    const collectionModal = reactive({
      visible: false,
      loading: false,
      title: '',
      data: {
        title: '',
      } as CollectionForm,
      callback: Function() as () => void,
      rules: collectionFormRules,
      layout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 18 },
      },
    });

    const collectionForm = ref();

    const resetCollectionForm = (): void => {
      collectionForm.value.resetFields();
    };

    const openCreateModal = (): void => {
      collectionModal.visible = true;
      collectionModal.title = 'Create new collection';
      collectionModal.data = {
        title: '',
      };
      collectionModal.callback = createCollection;
    };

    const openEditModal = (collection: CollectionInfo): void => {
      collectionModal.visible = true;
      collectionModal.title = 'Edit collection';
      collectionModal.data = {
        title: collection.title,
      };
      collectionModal.callback = () => editCollection(collection.collectionId);
    };

    const closeCollectionModal = (): void => {
      collectionModal.visible = false;
      collectionModal.loading = false;
      resetCollectionForm();
    };

    const createCollection = (): void => {
      collectionClient
        .createCollection({
          userId: userId.value,
          ...collectionModal.data,
        } as CreateCollectionReq)
        .then((resp: CreateCollectionResp) => {
          console.log('createCollection', resp);
          if (resp.status !== 'success') {
            openNotification(
              'error',
              `Failed to create collection, not logged in or not verified.`
            );
          } else {
            resetCollectionForm();
            collectionModal.visible = false;
            getCollections();
            openMessage('success', `Succeeded to create collection.`);
          }
        })
        .catch((err: AxiosError) => {
          openNotification(
            'error',
            `Failed to create collection, error: ${err.message}`
          );
        });
    };

    const deleteCollection = (collectionId: number): void => {
      collectionClient
        .deleteCollection({
          collectionId,
        } as DeleteCollectionReq)
        .then((resp: DeleteCollectionResp) => {
          console.log('deleteCollection', resp);
          if (resp.status !== 'success') {
            openNotification(
              'error',
              `Failed to delete collection, not logged in or not verified.`
            );
          } else {
            getCollections();
            openMessage('success', `Succeeded to delete collection.`);
          }
        })
        .catch((err: AxiosError) => {
          openNotification(
            'error',
            `Failed to delete collection, error: ${err.message}`
          );
        });
    };

    const editCollection = (collectionId: number): void => {
      collectionModal.loading = true;
      collectionClient
        .editCollection({
          collectionId,
          ...collectionModal.data,
        } as EditCollectionReq)
        .then((resp: EditCollectionResp) => {
          console.log('editCollection', resp);
          if (resp.status !== 'success') {
            openNotification(
              'error',
              `Failed to edit collection, not logged in or not verified.`
            );
          } else {
            resetCollectionForm();
            collectionModal.visible = false;
            getCollections();
            openMessage('success', `Succeeded to edit collection.`);
          }
        })
        .catch((err: AxiosError) => {
          openNotification(
            'error',
            `Failed to edit collection, error: ${err.message}`
          );
        })
        .finally(() => {
          collectionModal.loading = false;
        });
    };

    return {
      collections,
      getCollections,
      collectionForm,
      collectionModal,
      openCreateModal,
      openEditModal,
      closeCollectionModal,
      deleteCollection,
    };
  },
  created() {
    this.getCollections();
  },
});
</script>

<style lang="scss" scoped>
.ant-list-item {
  .list-icon {
    padding: 3px;
  }
}
</style>
