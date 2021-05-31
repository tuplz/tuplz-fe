<template>
  <a-space
    direction="vertical"
    size="large"
    style="width: 100%"
  >
    <my-profile />
    <my-collections />
  </a-space>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { MyCollections, MyProfile } from '@/components';
import { title } from '@/mixins';

export default defineComponent({
  components: {
    MyCollections,
    MyProfile,
  },
  setup() {
    const refresh = (): void => {
      document.title = `My Profile - ${title}`;
    };

    return {
      refresh,
    };
  },
  created() {
    this.refresh();
  },
});
</script>
