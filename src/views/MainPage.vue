<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useSeoMeta } from '@/composables/useSeoMeta';
import { useStructuredData } from '@/composables/useStructuredData';
import { buildAbsoluteUrl } from '@/constants/seo';
import { useQuestionsStore } from '@/stores/questions';
import Card from '@/components/InfoCard.vue';

const router = useRouter();
const questionsStore = useQuestionsStore();
const episodeSummaries = computed(() => {
  const dictionary = questionsStore.allQuestions;
  if (!dictionary) {
    return [];
  }

  return Object.entries(dictionary)
    .map(([ id, entries ]) => ({
      id,
      questionCount: entries.length,
    }))
    .sort((a, b) => Number(a.id || 0) - Number(b.id || 0));
});

const metadata = computed(() => {
  const dictionary = questionsStore.allQuestions;
  const totalQuestions = dictionary ? Object.values(dictionary).reduce((sum, list) => sum + list.length, 0) : 0;
  return {
    totalEpisodes: episodeSummaries.value.length,
    totalQuestions,
  };
});

const heroImageUrl = buildAbsoluteUrl('/cards.webp');
const seoCopy = {
  description:
    `Просматривайте вопросы, подсказки и ответы из ${metadata.value.totalEpisodes} выпусков шоу Лок Сток.`,
};

useSeoMeta(() => ({
  description: seoCopy.description,
  canonical: '/',
  image: heroImageUrl,
}));

useStructuredData('home-website', () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Вопросы из шоу Лок Сток',
  url: buildAbsoluteUrl('/'),
  description: seoCopy.description,
  image: heroImageUrl,
  potentialAction: {
    '@type': 'SearchAction',
    target: `${buildAbsoluteUrl('/')}?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
}));

useStructuredData('home-item-list', () => {
  if (!episodeSummaries.value.length) {
    return null;
  }
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Список выпусков Лок Сток',
    itemListElement: episodeSummaries.value.map((episode, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: `Выпуск ${episode.id}`,
      url: buildAbsoluteUrl(`/episode/${episode.id}`),
    })),
  };
});

function handleRandom(type: 'episode' | 'question') {
  const list = episodeSummaries.value;
  if (!list.length) {
    return;
  }
  const choice: any = list[Math.floor(Math.random() * list.length)];
  if (type === 'episode') {
    void router.push({ name: 'episode', params: { id: choice?.id } });
    return;
  }
  if (type === 'question') {
    const questions = questionsStore.getByVideo(choice?.id);
    if (!questions || !questions.length) {
      return;
    }
    const questionChoice = questions[Math.floor(Math.random() * questions.length)];
    if (!questionChoice) {
      return;
    }
    void router.push({
      name: 'episode',
      params: { id: choice?.id },
      query: { questions: String(questionChoice['question-id']) },
    });
    return;
  }
}
</script>

<template>
  <section class="page-shell">
    <section class="content-wrapper">
      <v-alert
        type="error"
        border="start"
        variant="tonal"
        class="alert"
        prominent
      >
        Вопросы, представленные на этом сайте, взяты из шоу
        <a
          href="https://vkvideo.ru/playlist/-214484275_24"
          target="_blank"
          rel="noopener noreferrer"
        >'LockStock Ставка на знания'</a>.
        Все материалы принадлежат авторам шоу и используются здесь без коммерческой выгоды.
      </v-alert>
    </section>

    <Card
      eyebrow="LockStock. Ставка на знания"
      title="Все вопросы шоу Лок Сток в одном каталоге"
      description="Этот проект создан исключительно в образовательных и некоммерческих целях
          и не связан с создателями шоу."
    >
      <template #content>
        <p class="card-lead">
          Всего доступно:
        </p>
        <div class="card-stats">
          <span class="card-stats-item">{{ metadata.totalEpisodes }} выпусков</span>
          <span class="card-stats-item">{{ metadata.totalQuestions }} вопросов</span>
        </div>
      </template>
      <div class="card-side-panel">
        <h3 class="card-side-title">
          Что внутри
        </h3>
        <ul class="card-side-list">
          <li>На сайте собраны вопросы, подсказки и ответы из выпусков шоу Лок Сток.</li>
          <li>Номера эпизодов ведут на страницы с полным набором вопросов выпуска.</li>
          <li>Каждый вопрос содержит подсказки, ответы и пояснения к ответам.</li>
          <li>Кнопки "Случайный выпуск" и "Случайный вопрос" ведут на случайные страницы</li>
        </ul>
      </div>
    </Card>

    <section class="content-wrapper">
      <section id="episodes" class="episodes-block">
        <div class="episodes-header">
          <div>
            <h2>Выпуски</h2>
            <p>Выберите номер, чтобы открыть вопросы конкретного выпуска шоу. </p>
          </div>
          <div class="random-buttons">
            <v-btn
              prepend-icon="mdi-dice-multiple"
              color="primary"
              variant="flat"
              density="comfortable"
              @click="handleRandom('episode')"
            >
              Случайный выпуск
            </v-btn>
            <v-btn
              prepend-icon="mdi-help-circle-outline"
              color="primary-darken-1"
              variant="flat"
              density="comfortable"
              @click="handleRandom('question')"
            >
              Случайный вопрос
            </v-btn>
          </div>
        </div>

        <div class="episode-grid">
          <RouterLink
            v-for="episode in episodeSummaries"
            :key="episode.id"
            :to="{ name: 'episode', params: { id: episode.id } }"
            class="episode-card"
          >
            <span class="episode-number">{{ episode.id }}</span>
            <span class="episode-count">{{ episode.questionCount }} вопросов</span>
          </RouterLink>
        </div>
      </section>
    </section>
  </section>
</template>

<style scoped>
.page-shell {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding-top: 32px;
  padding-bottom: 64px;
}

.card-lead {
  color: rgba(var(--v-theme-on-surface), 0.72);
  margin: 0;
}

.card-stats {
  display: flex;
  gap: 20px;
  font-weight: 600;
  font-size: 1.1rem;
  flex-wrap: wrap;
}

.card-stats-item {
  background: rgba(var(--v-theme-primary), 0.1);
  padding: 10px 18px;
  border-radius: var(--v-border-radius);
  color: rgb(var(--v-theme-primary-lighten-1));
  border: 1px solid rgba(var(--v-theme-primary), 0.4);
}

.card-side-panel {
  background: rgba(var(--v-theme-on-background), 0.055);
  border-radius: 2px;
  padding: 24px;
  border: 1px solid rgba(var(--v-theme-primary), 0.35);
}

.card-side-title {
  margin: 0 0 16px;
  color: rgb(var(--v-theme-primary-lighten-1));
  font-family: var(--font-display);
  font-size: 20px;
}

.card-side-list {
  padding-left: 20px;
  color: rgb(var(--v-theme-on-surface));
  margin: 0;
  display: grid;
  gap: 8px;
}

.content-wrapper {
  width: min(100%, 1000px);
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.alert {
  border-radius: 2px;
}

.alert a {
  color: rgb(var(--v-theme-primary));
  font-weight: 600;
}

.alert a:hover {
  color: rgb(var(--v-theme-primary-lighten-1));
  text-decoration: underline;
}

.episodes-block {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.episodes-header {
  display: flex;
  justify-content: space-between;
  align-items: end;
  flex-wrap: wrap;
  gap: 20px;
}

.episodes-header h2 {
  margin: 0 0 8px 0;
  font-size: 32px;
  font-weight: 700;
  color: rgb(var(--v-theme-on-background));
  font-family: var(--font-display);
  letter-spacing: 0.02em;
}

.episodes-header p {
  margin: 0;
  color: rgba(var(--v-theme-on-background), 0.64);
}

.random-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.episode-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 16px;
}

.episode-card {
  position: relative;
  overflow: hidden;
  padding: 20px;
  border-radius: 3px;
  border: 1px solid rgba(var(--v-theme-primary), 0.45);
  background: linear-gradient(145deg, rgb(var(--v-theme-surface)), rgb(var(--v-theme-background)));
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  text-decoration: none;
  color: rgb(var(--v-theme-on-surface));
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18), inset 0 0 0 5px rgb(var(--v-theme-background)), inset 0 0 0 6px rgba(var(--v-theme-primary), 0.16);
  transition: all 0.3s ease;
}

.episode-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 14px 32px rgba(0, 0, 0, 0.36), 0 0 22px rgba(var(--v-theme-primary), 0.1);
  border-color: rgb(var(--v-theme-primary-lighten-1));
  background: linear-gradient(145deg, rgb(var(--v-theme-surface-variant)), rgb(var(--v-theme-surface)));
}

.episode-number {
  color: rgb(var(--v-theme-primary-lighten-1));
  font-family: var(--font-display);
  font-size: 32px;
  font-weight: 800;
}

.episode-count {
  font-size: 0.9rem;
  color: rgba(var(--v-theme-on-surface), 0.66);
  font-weight: 500;
}

@media (max-width: 720px) {

  .episodes-block {
    padding: 24px;
  }
}
</style>
