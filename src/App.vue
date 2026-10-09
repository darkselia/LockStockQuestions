<script setup lang="ts">
import { RouterView } from 'vue-router';
import AppBar from '@/components/AppBar.vue';
import PageFooter from '@/components/PageFooter.vue';
import SiteMigrationNotice from '@/components/SiteMigrationNotice.vue';

defineProps<{ migrationTarget: string | null }>();
</script>

<template>
  <v-app>
    <SiteMigrationNotice v-if="migrationTarget" :target-url="migrationTarget" />
    <a class="skip-link" href="#main-content">Перейти к основному содержимому</a>
    <AppBar />
    <v-main id="main-content" tag="main">
      <RouterView />
    </v-main>
    <PageFooter />
  </v-app>
</template>

<style></style>
