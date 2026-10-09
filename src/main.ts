import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';
import { SITE_ORIGIN } from '@/constants/seo';
import '@mdi/font/css/materialdesignicons.css';
import '@/assets/site.css';

import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

import { myCustomGoldTheme, myCustomLightTheme } from '@/assets/theme';
import { ru } from 'vuetify/locale';

const { hostname, pathname, search, hash } = window.location;
const siteUrl = new URL(SITE_ORIGIN);
let migrationTarget: string | null = null;

if (hostname !== siteUrl.hostname && !['localhost', '127.0.0.1', '[::1]'].includes(hostname)) {
  const route = hostname === 'github.io' || hostname.endsWith('.github.io')
    ? pathname.replace(/^\/LockStockQuestions(?=\/|$)/i, '') || '/'
    : pathname;
  migrationTarget = `${siteUrl.origin}${route}${search}${hash}`;
}

const savedTheme = localStorage.getItem('lockstock-theme');
const initialTheme = savedTheme === 'myCustomLightTheme' ? savedTheme : 'myCustomGoldTheme';

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: initialTheme,
    themes: { myCustomGoldTheme, myCustomLightTheme },
  },
  locale: {
    locale: 'ru',
    messages: { ru },
  },
  defaults: {
    global: {
      hideDetails: true,
      noDataText: 'Нет таких данных',
    },
    VBtn: {
      variant: 'flat',
      class: 'font-weight-bold text-none',
      color: 'primary',
    },
    VTextField: {
      variant: 'outlined',
      hideDetails: true,
    },
    VRadioGroup: { hideDetails: true },
    VCheckbox: { hideDetails: true },
  },
});

const app = createApp(App, { migrationTarget });

app.use(vuetify);
app.use(createPinia());
app.use(router);

app.mount('#app');
