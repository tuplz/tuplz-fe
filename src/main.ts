import { createApp } from 'vue';

import App from './App.vue';
import router from './router';
import { store, key } from './store';

import {
  Avatar,
  BackTop,
  Button,
  Card,
  Carousel,
  Col,
  Comment,
  Descriptions,
  Divider,
  Dropdown,
  Form,
  Icon,
  Input,
  Layout,
  List,
  Menu,
  Modal,
  PageHeader,
  Popconfirm,
  Radio,
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
  .use(Carousel)
  .use(Col)
  .use(Comment)
  .use(Descriptions)
  .use(Divider)
  .use(Dropdown)
  .use(Form)
  .use(Icon)
  .use(Input)
  .use(Layout)
  .use(List)
  .use(Menu)
  .use(Modal)
  .use(PageHeader)
  .use(Popconfirm)
  .use(Radio)
  .use(Row)
  .use(Space)
  .use(Table)
  .use(Tag)
  .use(Typography);

app.mount('#app');
