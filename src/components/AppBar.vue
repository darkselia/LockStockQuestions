<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { useDisplay, useTheme } from 'vuetify';

const { smAndUp } = useDisplay();
const theme = useTheme();
const isMenuOpen = ref(false);
const isLightTheme = computed(() => theme.global.name.value === 'myCustomLightTheme');
const themeButtonLabel = computed(() => isLightTheme.value ? 'Включить тёмную тему' : 'Включить светлую тему');
const themeButtonIcon = computed(() => isLightTheme.value ? 'mdi-weather-night' : 'mdi-white-balance-sunny');

function toggleTheme() {
  const nextTheme = isLightTheme.value ? 'myCustomGoldTheme' : 'myCustomLightTheme';
  theme.global.name.value = nextTheme;
  localStorage.setItem('lockstock-theme', nextTheme);
}

onMounted(() => {
  setTimeout(() => {
    const mainElement = document.querySelector('.v-main');
    if (mainElement) {
      (mainElement as HTMLElement).style.paddingTop = '60px';
    }
  }, 0);
});
</script>

<template>
  <v-navigation-drawer v-if="!smAndUp" v-model="isMenuOpen" aria-label="Мобильное меню">
    <v-list-item title="Вопросы из шоу LockStock" />
    <v-divider class="mb-2" color="rgb(var(--v-theme-primary-darken-1))" />
    <v-list-item :to="{ path: '/', hash: '#episodes' }" link title="Все выпуски" />
    <v-list-item :to="{ name: 'rules' }" link title="Правила шоу" />
  </v-navigation-drawer>

  <v-app-bar
    :class="{ 'app-bar': !smAndUp }"
    color="surface"
    flat
    tag="nav"
    aria-label="Основная навигация"
  >
    <v-app-bar-title>
      <div v-if="smAndUp" class="prepend">
        <router-link class="title" to="/" aria-label="На главную LockStock Questions">
          <img
            alt="Карточки шоу LockStock"
            class="icon"
            src="/cards.webp"
            loading="eager"
            decoding="async"
          />
          <span class="brand-name">Вопросы из шоу LockStock</span>
        </router-link>
      </div>
      <div v-else class="text-center mr-4 mobile-title">
        Вопросы из шоу LockStock
      </div>
    </v-app-bar-title>

    <template v-if="!smAndUp" #prepend>
      <v-btn icon="mdi-menu" @click="isMenuOpen = true" />
    </template>

    <template #append>
      <div v-if="smAndUp" class="container">
        <v-btn :to="{ path: '/', hash: '#episodes' }" variant="text" color="primary-lighten-1">
          Все выпуски
        </v-btn>
        <v-btn :to="{ name: 'rules' }" variant="text" color="primary-lighten-1">
          Правила шоу
        </v-btn>
      </div>
      <v-btn
        :aria-label="themeButtonLabel"
        :aria-pressed="isLightTheme"
        :icon="themeButtonIcon"
        :title="themeButtonLabel"
        color="primary-lighten-1"
        variant="text"
        class="theme-toggle"
        @click="toggleTheme"
      />
    </template>
  </v-app-bar>
</template>

<style scoped>
.title {
  color: rgb(var(--v-theme-primary-lighten-1));
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: opacity 0.2s ease;
  height: 100%;
}

.title:hover {
  opacity: 0.85;
}

.mobile-title {
  color: rgb(var(--v-theme-primary-lighten-1));
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 0.95rem;
}

.prepend {
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 15px;
}

.app-bar {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
}

:deep(.v-toolbar) {
  border-bottom: 1px solid rgba(var(--v-theme-primary), 0.55);
  background-image: linear-gradient(
    90deg,
    rgb(var(--v-theme-background)),
    rgb(var(--v-theme-surface)) 50%,
    rgb(var(--v-theme-background))
  ) !important;
}

.app-bar :deep(.v-toolbar__content) {
  height: 50px !important;
}

.container {
  display: flex;
  gap: 12px;
  align-items: center;
  height: 100%;
  margin-right: 16px;
  color: rgb(var(--v-theme-primary-lighten-1));
}

.theme-toggle {
  margin-right: 10px;
}

.brand-name {
  font-family: var(--font-display);
  font-size: 1.05rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.icon {
  transform: scale(0.85);
  height: 55px;
  filter: sepia(0.65) saturate(0.75) drop-shadow(0 2px 5px rgba(0, 0, 0, 0.5));
  transition: transform 0.2s ease;
}

.icon:hover {
  transform: scale(1.00);
}
</style>
