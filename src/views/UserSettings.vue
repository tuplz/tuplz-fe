<template>
  <a-space
    direction="vertical"
    size="large"
    style="width: 100%"
  >
    <change-password />
  </a-space>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { ChangePassword } from '@/components';
import { title } from '@/mixins';

export default defineComponent({
  components: {
    ChangePassword,
  },
  setup() {
    const refresh = (): void => {
      document.title = `Settings - ${title}`;
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
