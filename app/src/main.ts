import { createApp } from 'vue';

import App from './App.vue';
import router from './router';

import { Divider, Table, Tag } from 'ant-design-vue';

const app = createApp(App);
app.use(router);

app.use(Divider).use(Table).use(Tag);

app.mount('#app');
