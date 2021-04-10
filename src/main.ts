import { createApp } from 'vue';

import App from './App.vue';
import router from './router';

import {
  Avatar,
  BackTop,
  Button,
  Card,
  Comment,
  Divider,
  Form,
  Input,
  Layout,
  Table,
  Tag,
  Typography,
} from 'ant-design-vue';

const app = createApp(App);
app.use(router);

app
  .use(Avatar)
  .use(BackTop)
  .use(Button)
  .use(Card)
  .use(Comment)
  .use(Divider)
  .use(Form)
  .use(Input)
  .use(Layout)
  .use(Table)
  .use(Tag)
  .use(Typography);

app.mount('#app');
