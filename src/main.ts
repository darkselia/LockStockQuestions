import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';
import '@mdi/font/css/materialdesignicons.css';

import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

import { myCustomLightTheme } from '@/assets/theme';
import { ru } from 'vuetify/locale';

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'myCustomLightTheme',
    themes: { myCustomLightTheme },
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

const app = createApp(App);

app.use(vuetify);
app.use(createPinia());
app.use(router);

app.mount('#app');
