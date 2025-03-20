import './assets/main.css';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router.js';
import store from './store'; // Add store import
import { createI18n } from 'vue-i18n' // localization library
import en from "./locale/en.json";
import ar from "./locale/ar.json";

const app = createApp(App);
const i18n = createI18n({
    locale: localStorage.getItem("locale") || "en",
    fallbackLocale: "en",
    messages: {
      en: en,
      ar: ar,
    },
  });

app.use(router);
app.use(store); // Add store to Vue instance
app.use(i18n);

app.mount('#app');
