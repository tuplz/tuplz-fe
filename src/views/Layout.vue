<template>
  <a-layout style="min-height: 100vh">
    <a-layout-header style="padding-left: 24px">
      <router-link
        class="title"
        :to="{ name: 'Problemset' }"
      >
        <BulbFilled id="logo" />
        <span>{{ title }}</span>
      </router-link>
    </a-layout-header>
    <a-layout style="padding: 24px 24px 0">
      <a-layout-content style="padding: 24px; min-height: 280px">
        <router-view />
      </a-layout-content>
      <a-layout-footer style="text-align: center">
        <span>
          Made with
          <HeartFilled style="color: red; padding: 3px" />
          by
          <i>Software Engineering (2021 Spring)</i>
          Team 4
        </span>
      </a-layout-footer>
      <a-back-top />
    </a-layout>
  </a-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { BulbFilled, HeartFilled } from '@ant-design/icons-vue';

export default defineComponent({
  components: {
    BulbFilled,
    HeartFilled,
  },
  setup() {
    const title = 'Teach Us Please!';

    return {
      title,
    };
  },
});
</script>

<style lang="scss" scoped>
.ant-layout-header {
  .title {
    height: 64px;

    > #logo {
      padding: 20px 0;
      margin-right: 12px;
      color: #e6fffb;
      font-size: 24px;
    }

    > span {
      color: #e6fffb;
      font-size: 24px;
      vertical-align: top;
    }
  }
}
</style>
