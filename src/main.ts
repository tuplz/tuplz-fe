import { createApp } from 'vue';

import App from './App.vue';
import router from './router';

import { BackTop, Divider, Layout, Table, Tag } from 'ant-design-vue';

const app = createApp(App);
app.use(router);

app.use(BackTop).use(Divider).use(Layout).use(Table).use(Tag);

app.mount('#app');
