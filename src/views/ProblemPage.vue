<!-- eslint-disable vue/no-v-html -->
<template>
  <a-space
    direction="vertical"
    size="large"
    style="width: 100%"
  >
    <a-page-header
      title="Back to Problemset"
      :ghost="false"
      @back="() => $router.push({ name: 'Problemset' })"
    >
      <a-card
        :loading="problemInfo.loading"
        :bordered="false"
      >
        <a-typography>
          <a-typography-title>
            <span @click="openCollectionModal">
              <StarOutlined
                v-show="problemInfo.data.favourite"
                :style="{ color: '#FBC740' }"
              />
              <StarFilled
                v-show="!problemInfo.data.favourite"
                :style="{ color: '#87CEFA' }"
              />
            </span>
            {{ problemId }}. {{ problemInfo.data.problem.content.title }}
          </a-typography-title>

          <a-typography-title :level="2">
            题目描述
          </a-typography-title>
          <div
            v-for="section in problemInfo.data.problem.content.sections"
            :key="section.title"
          >
            <a-typography-title :level="2">
              <!-- Placeholder for prettier rendering. -->
            </a-typography-title>
            <a-typography-title :level="3">
              <span v-html="section.title" />
            </a-typography-title>
            <a-typography-paragraph>
              <span v-html="section.content" />
            </a-typography-paragraph>
            <a-typography-paragraph v-if="section.title.startsWith('限制')">
              <ul>
                <li>
                  <a-typography-text strong>
                    时间限制：
                  </a-typography-text>
                  <a-typography-text code>
                    {{ problemInfo.data.problem.content.rules.runtime / 1e9 }}
                  </a-typography-text>
                  s
                </li>
                <li>
                  <a-typography-text strong>
                    空间限制：
                  </a-typography-text>
                  <a-typography-text code>
                    {{
                      problemInfo.data.problem.content.rules.memory / 1048576
                    }}
                  </a-typography-text>
                  MB
                </li>
              </ul>
            </a-typography-paragraph>
            <a-typography-paragraph v-if="section.misc.length">
              <span v-html="section.misc" />
            </a-typography-paragraph>
          </div>

          <a-typography-title
            v-if="problemInfo.data.problem.content.samples.length"
            :level="2"
          >
            测试样例
          </a-typography-title>
          <div
            v-for="(sample, index) in problemInfo.data.problem.content.samples"
            :key="sample.title"
          >
            <a-typography-title :level="2">
              <!-- Placeholder for prettier rendering. -->
            </a-typography-title>
            <a-typography-title :level="3">
              <span v-html="sample.title" />
            </a-typography-title>
            <a-typography-title
              v-if="sample.input.length"
              :level="4"
            >
              Input {{ index + 1 }}
            </a-typography-title>
            <a-typography-paragraph v-if="sample.input.length">
              <span v-html="sample.input" />
            </a-typography-paragraph>
            <a-typography-title
              v-if="sample.output.length"
              :level="4"
            >
              Output {{ index + 1 }}
            </a-typography-title>
            <a-typography-paragraph v-if="sample.output.length">
              <span v-html="sample.output" />
            </a-typography-paragraph>
            <a-typography-title
              v-if="sample.explanation.length"
              :level="4"
            >
              Explanation
            </a-typography-title>
            <a-typography-paragraph v-if="sample.explanation.length">
              <span v-html="sample.explanation" />
            </a-typography-paragraph>
            <a-typography-paragraph v-if="sample.misc.length">
              <span v-html="sample.misc" />
            </a-typography-paragraph>
          </div>
        </a-typography>
      </a-card>
    </a-page-header>

    <recommend-list
      :problem-id="problemId"
      :recommends="recommendsInfo.data"
      :loading="recommendsInfo.loading"
      @submit="getRecommends()"
    />
    <a-modal
      v-model:visible="collectionsModal.visible"
      :title="collectionsModal.title"
      :confirm-loading="collectionsModal.loading"
      width="500px"
      :closable="false"
      @ok="collectionsModal.callback"
      @cancel="closeCollectionModal"
    >
      <a-list
        item-layout="horizontal"
        :data-source="collectionsModal.data"
        row-key="collectionsId"
      >
        <template #renderItem="{ item }">
          <a-radio-group
            v-model:value="selectedCollection.data"
            button-style="solid"
          >
            <a-list-item :key="item.collectionId">
              <a-radio-button :value="item.collectionId">
                {{ item.title }}
              </a-radio-button>
              <br>
            </a-list-item>
          </a-radio-group>
        </template>
      </a-list>
    </a-modal>
  </a-space>
</template>

<script lang="ts">
import { computed, defineComponent, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from '@/store';
import { AxiosError } from 'axios';

import {
  AddFavouriteReq,
  AddFavouriteResp,
  CollectionInfo,
  GetCollectionsReq,
  GetCollectionsResp,
  GetProblemRecommendsReq,
  GetProblemRecommendsResp,
  GetProblemReq,
  GetProblemResp,
  Problem,
  Recommend,
} from '@/components/types';
import { RecommendList } from '@/components';
import { collectionClient, problemClient, recommendClient } from '@/api';
import { openNotification, title } from '@/mixins';
import { StarOutlined, StarFilled } from '@ant-design/icons-vue';

export default defineComponent({
  components: {
    RecommendList,
    StarOutlined,
    StarFilled,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useStore();
    const userId = computed((): string => store.state.id);
    const problemId = computed((): number => {
      if (Array.isArray(route.params.id)) {
        console.log('Invalid route for parsing Problem ID.');
        return parseInt(route.params.id[0]);
      }
      return parseInt(route.params.id);
    });

    const problemInfo = reactive({
      data: {
        problem: {
          id: problemId.value,
          like: 0,
          dislike: 0,
          visit: 0,
          content: {
            title: '',
            type: '',
            sections: [],
            samples: [],
            tags: [],
            rules: {
              runtime: 0,
              memory: 0,
              stack: 0,
              source: 0,
            },
            meta: {
              created: '',
              updated: '',
              checked: '',
            },
            misc: '',
          },
        } as Problem,
        favourite: false,
      },
      loading: false,
    });

    const selectedCollection = reactive({
      data: 0,
    });

    const getProblem = (): void => {
      problemInfo.loading = true;
      problemClient
        .getProblem({
          userId: userId.value,
          id: problemId.value,
        } as GetProblemReq)
        .then((resp: GetProblemResp) => {
          if (!resp.problem.id) {
            openNotification(
              'error',
              `Problem not found, redirecting to home page.`
            );
            setTimeout((): void => {
              router.replace({ name: 'Problemset' });
            }, 3000);
          } else {
            console.log('getProblem', resp);
            problemInfo.data.problem = resp.problem;
            problemInfo.data.favourite = resp.favourite;
            document.title = `${problemId.value}. ${problemInfo.data.problem.content.title} - Problems - ${title}`;
            problemInfo.loading = false;
          }
        })
        .catch((err: AxiosError) => {
          openNotification(
            'error',
            `Failed to load problem, error: ${err.message}`
          );
        });
    };

    const recommendsInfo = reactive({
      data: [] as Recommend[],
      loading: false,
    });

    const getRecommends = (): void => {
      recommendsInfo.loading = true;
      recommendClient
        .getProblemRecommends({
          userId: userId.value,
          id: problemId.value,
        } as GetProblemRecommendsReq)
        .then((resp: GetProblemRecommendsResp) => {
          console.log('getRecommends', resp);
          recommendsInfo.data = resp.recommends;
          recommendsInfo.loading = false;
        })
        .catch((err: AxiosError) => {
          openNotification(
            'error',
            `Failed to load reviews, error: ${err.message}`
          );
        });
    };

    const handleFavourite = (): void => {
      console.log('handle Favourite...');
      problemClient
        .addFavourite({
          userId: store.state.id,
          id: problemId.value,
          collectionId: selectedCollection.data,
        } as AddFavouriteReq)
        .then((resp: AddFavouriteResp): void => {
          console.log(resp);
          if (resp.status !== 'success') {
            openNotification(
              'error',
              `Failed to add favourite, user not logged in.`
            );
          } else {
            problemInfo.data.favourite = !problemInfo.data.favourite;
            collectionsModal.visible = false;
          }
        })
        .catch((err: AxiosError): void => {
          openNotification(
            'error',
            `Failed to upload recommendation, error: ${err.message}`
          );
        });
    };

    const collectionsModal = reactive({
      visible: false,
      loading: false,
      title: '',
      data: [] as CollectionInfo[],
      callback: Function() as () => void,
      layout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 18 },
      },
    });

    const getCollections = (): void => {
      collectionsModal.loading = true;
      collectionClient
        .getCollections({
          userId: userId.value,
        } as GetCollectionsReq)
        .then((resp: GetCollectionsResp) => {
          console.log('getCollections', resp);
          collectionsModal.data = resp.collections;
          collectionsModal.loading = false;
        })
        .catch((err: AxiosError) => {
          openNotification(
            'error',
            `Failed to load collections, error: ${err.message}`
          );
        });
    };

    const openCollectionModal = (): void => {
      console.log('show collections');
      collectionsModal.visible = true;
      collectionsModal.title = 'My Collections';
      getCollections();
      collectionsModal.callback = handleFavourite;
    };

    const closeCollectionModal = (): void => {
      collectionsModal.visible = false;
      collectionsModal.loading = false;
    };

    const refresh = (): void => {
      getProblem();
      getRecommends();
    };

    return {
      collectionsModal,
      problemId,
      problemInfo,
      recommendsInfo,
      refresh,
      getRecommends,
      handleFavourite,
      openCollectionModal,
      closeCollectionModal,
      selectedCollection,
    };
  },
  created() {
    this.refresh();
  },
});
</script>
