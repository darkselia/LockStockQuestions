<script setup lang="ts">
import { RouterView } from 'vue-router';
import AppBar from '@/components/AppBar.vue';
import PageFooter from '@/components/PageFooter.vue';

</script>

<template>
  <v-app>
    <a class="skip-link" href="#main-content">Перейти к основному содержимому</a>
    <AppBar />
    <v-main id="main-content" tag="main">
      <RouterView />
    </v-main>
    <PageFooter />
  </v-app>
</template>

<style></style>
