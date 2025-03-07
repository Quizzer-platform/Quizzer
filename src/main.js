import './assets/main.css';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router.js';
import store from './store'; // Add store import

const app = createApp(App);

app.use(router);
app.use(store); // Add store to Vue instance

app.mount('#app');
