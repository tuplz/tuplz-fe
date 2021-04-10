import { createApp } from 'vue';

import App from './App.vue';
import router from './router';
import { store, key } from './store';

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
  Modal,
  Row,
  Space,
  Table,
  Tag,
  Typography,
} from 'ant-design-vue';

const app = createApp(App);

app.use(router).use(store, key);

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
  .use(Modal)
  .use(Row)
  .use(Space)
  .use(Table)
  .use(Tag)
  .use(Typography);

app.mount('#app');
