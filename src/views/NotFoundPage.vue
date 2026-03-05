<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useSeoMeta } from '@/composables/useSeoMeta';
import { buildAbsoluteUrl } from '@/constants/seo';

const route = useRoute();
const router = useRouter();

const displayPath = computed(() => decodeURIComponent(route.fullPath || '/'));

useSeoMeta(() => ({
  title: 'Страница не найдена (404)',
  description: 'Запрошенная страница не существует.',
  canonical: buildAbsoluteUrl('/404'),
}));

</script>

<template>
  <div class="not-found-page">
    <h1 class="error-code">
      404
    </h1>
    <h2 class="error-title">
      Страница не найдена
    </h2>
    <p class="error-description">
      К сожалению, страница <span class="path-highlight">{{ displayPath }}</span> исчезла или никогда не
      существовала. Проверьте адрес или вернитесь к выпускам.
    </p>

    <div class="actions">
      <v-btn
        class="action-btn primary-btn"
        size="x-large"
        variant="flat"
        color="primary"
        @click=" router.push('/');"
      >
        На главную
      </v-btn>

      <v-btn
        class="action-btn secondary-btn"
        size="x-large"
        variant="outlined"
        @click=" router.back();"
      >
        Назад
      </v-btn>
    </div>
  </div>
</template>

<style scoped>
.not-found-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 100%;
  max-width: 600px;
  min-height: 480px;
  width: 100%;
  margin: 0 auto;
}

.error-code {
  font-size: clamp(6rem, 15vw, 10rem);
  font-weight: 900;
  line-height: 1;
  text-shadow: 0 4px 12px rgba(185, 137, 19, 0.3);
  letter-spacing: -2px;
}

.error-title {
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  margin: 1rem 0;
  font-weight: 700;
}

.error-description {
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 3rem;
  color: rgb(var(--v-theme-surface));
  opacity: 0.9;
}

.path-highlight {
  font-family: monospace;
  background-color: rgb(var(--v-theme-surface-variant));
  padding: 0.2em 0.4em;
  border-radius: 4px;
  color: rgb(var(--v-theme-on-surface-variant));
  word-break: break-all;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.action-btn {
  min-width: 160px;
}

@media (max-width: 600px) {
  .actions {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
}
</style>

