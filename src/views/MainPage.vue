<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useQuestionsStore } from '@/stores/questions';

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

function handleRandom(type: 'episode' | 'question') {
  const list = episodeSummaries.value;
  if (!list.length) {
    return;
  }
  const choice = list[Math.floor(Math.random() * list.length)];
  if (type === 'episode') {
    void router.push({ name: 'episode', params: { id: choice.id } });
    return;
  }
  if (type === 'question') {
    const questions = questionsStore.getByVideo(choice.id);
    if (!questions || !questions.length) {
      return;
    }
    const questionChoice = questions[Math.floor(Math.random() * questions.length)];
    void router.push({
      name: 'episode',
      params: { id: choice.id },
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
        <a href="https://vkvideo.ru/playlist/-214484275_24"
           target="_blank"
           rel="noopener noreferrer"
        >'LockStock Ставка на знания'</a>.
        Все материалы принадлежат авторам шоу и используются здесь без коммерческой выгоды.
      </v-alert>
    </section>

    <div class="hero">
      <div class="hero-text">
        <p class="eyebrow">LockStock. Ставка на знания</p>
        <h1>Все вопросы шоу в одном каталоге</h1>
        <p>Этот проект создан исключительно в образовательных и некоммерческих целях
          и не связан с создателями шоу.</p>
        <p>Всего доступно:</p>
        <div class="hero-stats">
          <span>{{ metadata.totalEpisodes }} выпусков</span>
          <span>{{ metadata.totalQuestions }} вопросов</span>
        </div>
      </div>
      <div class="hero-card">
        <h3>Что внутри</h3>
        <ul>
          <li>На сайте собраны вопросы, подсказки и ответы из выпусков шоу LockStock.</li>
          <li>Номера эпизодов ведут на страницы с полным набором вопросов выпуска.</li>
          <li>Каждый вопрос содержит подсказки, ответы и пояснения к ответам.</li>
          <li>Кнопки "Случайный выпуск" и "Случайный вопрос" ведут на случайные страницы</li>
        </ul>
      </div>
    </div>

    <section class="content-wrapper">
      <section id="episodes" class="episodes-block">
        <div class="episodes-header">
          <div>
            <h2>Выпуски</h2>
            <p>Выберите номер, чтобы открыть вопросы конкретного выпуска шоу. </p>
          </div>
          <div class="random-buttons">
            <v-btn color="primary" variant="tonal" density="comfortable" @click="handleRandom('episode')">
              Случайный выпуск
            </v-btn>
            <v-btn color="primary" variant="tonal" density="comfortable" @click="handleRandom('question')">
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

.hero {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 28px;
  align-items: center;
  background: linear-gradient(
    135deg,
    rgb(var(--v-theme-primary-lighten-1)) 0%,
    rgb(var(--v-theme-primary-darken-1)) 100%
  );
  padding: clamp(25px, 2vw + 20px, 60px);
  box-shadow: 0 20px 50px rgba(var(--v-theme-primary-darken-1), 0.25);
  border-radius: 24px;
  margin: 0 20px 30px;
  border-bottom: 10px solid rgb(var(--v-theme-primary-darken-1));
  border-right: 10px solid rgb(var(--v-theme-primary-darken-1));
}

.hero-text h1 {
  font-size: 2.6rem;
  margin: 12px 0 20px;
  line-height: 1.2;
  color: rgb(var(--v-theme-on-primary));
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.2);
}

.hero-text p {
  color: rgba(var(--v-theme-on-primary), 0.9);
  margin-bottom: 18px;
  max-width: 560px;
}

.eyebrow {
  letter-spacing: 0.3em;
  text-transform: uppercase;
  font-size: 0.75rem;
  font-weight: 700;
  color: rgba(var(--v-theme-on-primary), 0.85);
}

.hero-stats {
  display: flex;
  gap: 20px;
  font-weight: 600;
  font-size: 1.1rem;
  flex-wrap: wrap;
}

.hero-stats span {
  background: rgba(var(--v-theme-on-primary), 0.15);
  padding: 10px 18px;
  border-radius: var(--v-border-radius);
  color: rgb(var(--v-theme-on-primary));
  border: 1px solid rgba(var(--v-theme-on-primary), 0.25);
}

.hero-card {
  background: rgb(var(--v-theme-surface));
  border-radius: 20px;
  padding: 28px;
  border-bottom: 4px solid rgb(var(--v-theme-surface-variant));
  border-right: 4px solid rgb(var(--v-theme-surface-variant));
  color: rgb(var(--v-theme-on-surface));
  backdrop-filter: blur(8px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  width: 100%;
  height: min-content;
}

.hero-card h3 {
  margin-top: 0;
  margin-bottom: 16px;
  color: rgb(var(--v-theme-primary-darken-1));
  font-size: 1.4rem;
}

.hero-card ul {
  padding-left: 20px;
  color: rgb(var(--v-theme-on-surface));
}

.hero-card li {
  margin-bottom: 8px;
}

.content-wrapper {
  width: min(100%, 1200px);
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.alert {
  border-radius: 18px;
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
  margin: 0;
  font-size: 2rem;
  color: rgb(var(--v-theme-on-background));
}

.episodes-header p {
  margin: 6px 0 0;
  color: rgb(var(--v-theme-primary-lighten-1));
}

.episode-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 16px;
}

.episode-card {
  padding: 20px;
  border-radius: 16px;
  border: 2px solid rgb(var(--v-theme-surface-variant));
  background: rgb(var(--v-theme-surface));
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  text-decoration: none;
  color: rgb(var(--v-theme-on-surface-variant));
  box-shadow: 0 4px 12px rgba(var(--v-theme-on-background), 0.06);
  transition: all 0.3s ease;
}

.episode-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 32px rgba(var(--v-theme-primary), 0.2);
  border-color: rgb(var(--v-theme-primary));
  background: linear-gradient(135deg, rgb(var(--v-theme-surface)) 45%, rgba(var(--v-theme-primary)) 100%);
}

.episode-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: rgb(var(--v-theme-primary-darken-1));
}

.episode-count {
  font-size: 0.9rem;
  color: rgb(var(--v-theme-on-surface));
  font-weight: 500;
}

.random-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

@media (max-width: 720px) {
  .hero {
    padding: 28px;
  }

  .hero-text h1 {
    font-size: 2rem;
  }

  .episodes-block {
    padding: 24px;
  }
}
</style>
