<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useDisplay } from 'vuetify';

const { smAndUp } = useDisplay();
const isMenuOpen = ref(false);

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
  <v-navigation-drawer v-if="!smAndUp" v-model="isMenuOpen">
    <v-list-item title="Вопросы из шоу LockStock" />
    <v-divider class="mb-2" color="rgb(var(--v-theme-primary-darken-1))" />
    <v-list-item href="/" link title="Все выпуски" />
  </v-navigation-drawer>

  <v-app-bar :class="{ 'app-bar': !smAndUp }" color="primary-lighten-1">
    <v-app-bar-title>
      <div v-if="smAndUp" class="prepend">
        <router-link class="title" to="/">
          <img alt="logo" class="icon" src="/cards.webp" />
          <v-btn color="on-primary" text="Вопросы из шоу LockStock" variant="text" />
        </router-link>
      </div>
      <div v-else class="text-center mr-4 mobile-title">Вопросы из шоу LockStock</div>
    </v-app-bar-title>

    <template v-if="!smAndUp" #prepend>
      <v-btn icon="mdi-menu" @click="isMenuOpen = true" />
    </template>

    <template #append>
      <div class="container">
        <template v-if="smAndUp">
          <!--          <v-btn href="/" variant="text" color="on-primary">Вопросы из шоу LockStock</v-btn>-->
        </template>
      </div>
    </template>
  </v-app-bar>
</template>

<style scoped>
.title {
  color: rgb(var(--v-theme-on-primary));
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: opacity 0.2s ease;
}

.title:hover {
  opacity: 0.85;
}

.mobile-title {
  color: rgb(var(--v-theme-on-primary));
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
  box-shadow: 0 4px 16px rgba(var(--v-theme-primary-darken-1), 0.15);
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
  color: rgb(var(--v-theme-on-primary));
}

.icon {
  height: 50px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
  transition: transform 0.2s ease;
}

.icon:hover {
  transform: scale(1.05);
}

:deep(.v-btn) {
  font-weight: 600;
}
</style>
