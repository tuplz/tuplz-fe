import { createApp } from 'vue';

import App from './App.vue';
import router from './router';
import { store, key } from './store';

import {
  Avatar,
  BackTop,
  Button,
  Card,
  Col,
  Divider,
  Dropdown,
  Form,
  Icon,
  Input,
  Layout,
  List,
  Menu,
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
  .use(Col)
  .use(Divider)
  .use(Dropdown)
  .use(Form)
  .use(Icon)
  .use(Input)
  .use(Layout)
  .use(List)
  .use(Menu)
  .use(Modal)
  .use(Row)
  .use(Space)
  .use(Table)
  .use(Tag)
  .use(Typography);

app.mount('#app');
