<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { SITE_ORIGIN } from '@/constants/seo';

const props = defineProps<{ targetUrl: string }>();
const redirectSeconds = 15;
const remainingSeconds = ref(redirectSeconds);
let redirectTimer: number | undefined;
let countdownTimer: number | undefined;

function redirect() {
  window.clearTimeout(redirectTimer);
  window.clearInterval(countdownTimer);
  window.location.replace(props.targetUrl);
}

onMounted(() => {
  countdownTimer = window.setInterval(() => {
    remainingSeconds.value = Math.max(0, remainingSeconds.value - 1);
  }, 1000);
  redirectTimer = window.setTimeout(redirect, redirectSeconds * 1000);
});
onBeforeUnmount(() => {
  window.clearTimeout(redirectTimer);
  window.clearInterval(countdownTimer);
});
</script>

<template>
  <v-dialog
    :model-value="true"
    persistent
    max-width="600"
    aria-labelledby="site-move-title"
    aria-describedby="site-move-description"
  >
    <v-card>
      <v-card-title id="site-move-title" tag="h2" class="text-wrap">
        Сайт переехал!
      </v-card-title>
      <v-card-text id="site-move-description" class="migration-copy">
        <p>
          Основной адрес:
          <a :href="targetUrl" @click.prevent="redirect">{{ SITE_ORIGIN }}</a>
        </p>
        <p>
          Сохраните новый адрес сайта в закладках.
          Старые адреса GitHub Pages и Vercel перестанут работать с 2027 года.
        </p>
        <p>
          Автоматический переход на страницу через
          <strong role="timer">{{ remainingSeconds }} с.</strong>
        </p>
        <v-progress-linear
          :model-value="remainingSeconds / redirectSeconds * 100"
          color="primary"
          height="6"
          rounded
          class="mt-3"
          aria-label="Оставшееся время до перехода"
        />
      </v-card-text>
      <v-card-actions>
        <v-btn :href="targetUrl" @click.prevent="redirect">
          Перейти сейчас
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.migration-copy p + p {
  margin-top: 16px;
}

.migration-copy a {
  color: rgb(var(--v-theme-primary));
  overflow-wrap: anywhere;
}
</style>
