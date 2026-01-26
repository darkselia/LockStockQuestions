<script setup lang="ts">
import { RouterView } from 'vue-router';
import AppBar from '@/components/AppBar.vue';
import PageFooter from '@/components/PageFooter.vue';

</script>

<template>
  <v-app>
    <AppBar />
    <v-main>
      <RouterView />
    </v-main>
    <PageFooter />
  </v-app>
</template>

<style></style>
