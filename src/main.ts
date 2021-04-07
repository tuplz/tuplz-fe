import { createApp } from 'vue';

import App from './App.vue';
import router from './router';

import {
  Avatar,
  BackTop,
  Card,
  Comment,
  Divider,
  Layout,
  Table,
  Tag,
} from 'ant-design-vue';

const app = createApp(App);
app.use(router);

app
  .use(Avatar)
  .use(BackTop)
  .use(Card)
  .use(Comment)
  .use(Divider)
  .use(Layout)
  .use(Table)
  .use(Tag);

app.mount('#app');
