<script setup lang="ts">
import { computed, onMounted, ref, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { QuestionRecord } from '@/types/types';
import { useQuestionsStore } from '@/stores/questions';
import DetailItem from '@/components/DetailItem.vue';
import { useSeoMeta } from '@/composables/useSeoMeta.ts';
import { buildAbsoluteUrl } from '@/constants/seo.ts';

const route = useRoute();
const router = useRouter();
const questionsStore = useQuestionsStore();

const episodeId = computed(() => String(route.params.id ?? ''));
const questions = computed<QuestionRecord[]>(() => questionsStore.getByVideo(episodeId.value) ?? []);
const allowedIds = new Set(questions.value.map(q => String(q['question-id'])));

useSeoMeta(() => ({
  title: `Выпуск №${episodeId.value} - Вопросы и ответы`,
  description: `Список вопросов, подсказок и ответов из выпуска №${episodeId.value} шоу LockStock.`,
  canonical: buildAbsoluteUrl(`/episode/${episodeId.value}`),
}));


const openPanels = ref<string[]>([]);
const panelModel = computed<string[]>({
  get() {
    return openPanels.value;
  },
  set(ids) {
    const normalized = Array.from(new Set(ids.map(id => String(id)))).filter(id => allowedIds.has(id));

    normalized.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

    const normalizedSet = new Set(normalized);
    const closed = openPanels.value.filter(id => !normalizedSet.has(id));
    resetRevealForIds(closed);

    openPanels.value = normalized;
    syncQueryFromPanels(normalized);
  },
});

type RevealState = { hint1: boolean; hint2: boolean; answer: boolean };
const revealMap = ref<Record<string, RevealState>>({});

questions.value.forEach(q => {
  revealMap.value[String(q['question-id'])] = { hint1: false, hint2: false, answer: false };
});


function isRevealed(id: string, key: keyof RevealState) {
  return Boolean(revealMap.value[id]?.[key]);
}

function revealOne(id: string, key: keyof RevealState) {
  if (!revealMap.value[id]) {
    return;
  }
  revealMap.value[id][key] = true;
}

function getRevealHandler(id: string, key: keyof RevealState) {
  return function() {
    revealOne(id, key);
  };
}

function syncQueryFromPanels(ids: string[]) {
  const query = { ...route.query };
  if (ids.length) {
    query.questions = ids.join(',');
  } else {
    delete query.questions;
  }
  router
    .replace({ name: 'episode', params: route.params, query })
    .catch(function() {
      return undefined;
    });
}

function parseQueryToPanels() {
  const raw = route.query.questions;
  const rawList = typeof raw === 'string'
    ? raw.split(',')
    : Array.isArray(raw)
      ? raw.flatMap(function(value) {
        return String(value);
      })
      : [];
  const allowedIds = new Set(questions.value.map(function(q) {
    return String(q['question-id']);
  }));
  const parsed = Array.from(new Set(rawList)).filter(function(id) {
    return allowedIds.has(id);
  })
    .sort(function(a, b) {
      return a.localeCompare(b, undefined, { numeric: true });
    });
  openPanels.value = parsed;
  return parsed;
}

function resetRevealForIds(ids: string[]) {
  ids.forEach(function(id) {
    revealMap.value[id] = { hint1: false, hint2: false, answer: false };
  });
}

function hasText(value: unknown) {
  if (value === null || value === undefined || value === '-') {
    return false;
  }
  return String(value).trim().length > 0;
}

onMounted(() => {
  const parsed = parseQueryToPanels();
  panelModel.value = parsed;
  if (parsed.length === 1) {
    const targetId = 'question-' + parsed[0];
    nextTick(function() {
      document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
    });
  }
});
</script>

<template>
  <v-alert
    closable
    type="info"
    border="start"
    class="episode-alert"
    icon="mdi-information"
    variant="tonal"
  >
    Если вы заметили ошибку в вопросе или хотите добавить свой, пожалуйста, напишите на почту внизу страницы
    с указанием номера выпуска, номера вопроса и описанием ошибки.
  </v-alert>

  <section class="page-shell">
    <header class="page-header">
      <p class="eyebrow">
        Выпуск
      </p>
      <h1>№ {{ episodeId }}</h1>
      <p class="subtitle">
        Вопросы, подсказки и ответы из шоу LockStock
      </p>
    </header>

    <div v-if="!questions.length" class="empty-state">
      <p>Для выпуска № {{ episodeId }} вопросов не загружено.</p>
    </div>

    <v-expansion-panels
      v-else
      v-model="panelModel"
      multiple
      variant="popout"
      class="custom-panels"
    >
      <v-expansion-panel
        v-for="(question, idx) in questions"
        :key="question['question-id']"
        :value="String(question['question-id'])"
        :id="'question-' + question['question-id']"
        class="question-panel"
      >
        <v-expansion-panel-title>
          <div class="panel-title">
            <span class="panel-index">#{{ idx + 1 }}</span>
            <span class="panel-question">{{ question.question }}</span>
            <span style="font-size: 10px">ID{{ question['question-id'] }}</span>
          </div>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <div class="answer-card">
            <DetailItem
              v-if="hasText(question.hint1)"
              :text="String(question.hint1 ?? '')"
              :revealed="isRevealed(String(question['question-id']), 'hint1')"
              :on-reveal="getRevealHandler(String(question['question-id']), 'hint1')"
              label="Подсказка 1"
              skeleton-type="sentences"
            />

            <DetailItem
              v-if="hasText(question.hint2)"
              :text="String(question.hint2 ?? '')"
              :revealed="isRevealed(String(question['question-id']), 'hint2')"
              :on-reveal="getRevealHandler(String(question['question-id']), 'hint2')"
              label="Подсказка 2"
              skeleton-type="sentences"
            />

            <DetailItem
              v-if="hasText(question.answer)"
              :text="String(question.answer ?? '')"
              :revealed="isRevealed(String(question['question-id']), 'answer')"
              :on-reveal="getRevealHandler(String(question['question-id']), 'answer')"
              label="Ответ"
              skeleton-type="list-item"
            />

            <DetailItem
              v-if="hasText(question['answer-comm'])"
              :text="String(question['answer-comm'] ?? '')"
              :revealed="isRevealed(String(question['question-id']), 'answer')"
              :on-reveal="getRevealHandler(String(question['question-id']), 'answer')"
              label="Комментарий к ответу"
              skeleton-type="paragraph"
            />
          </div>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </section>
</template>

<style scoped>
.page-shell {
  width: min(100%, 1200px);
  margin: 0 auto;
  padding: 32px 20px 48px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.page-header {
  display: flex;
  flex-direction: column;
  margin-left: 16px;
}

.page-header h1 {
  font-size: 48px;
  color: rgb(var(--v-theme-primary-lighten-1));
}

.eyebrow {
  letter-spacing: 0.25em;
  text-transform: uppercase;
  font-size: 0.75rem;
  font-weight: 700;
}

.empty-state {
  padding: 24px;
  border-radius: 16px;
  background: rgb(var(--v-theme-surface));
  border: 1px solid rgb(var(--v-theme-surface-variant));
  color: rgb(var(--v-theme-on-surface-variant));
}

.panel-title {
  display: grid;
  grid-template-columns: auto 1fr 20px;
  gap: 12px;
  align-items: center;
  width: 100%;
  margin-right: 14px;
}

.panel-index {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgb(var(--v-theme-secondary-lighten-1));
  color: rgb(var(--v-theme-primary));
  font-weight: 800;
  margin-top: -2px;
}

.panel-question {
  color: rgb(var(--v-theme-on-surface));
  font-weight: 600;
  line-height: 1.4;
  padding-top: 4px;
}

.answer-card {
  display: grid;
  gap: 14px;
}

.episode-alert{
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 100;
  max-width: 400px;
  width: 100%;
  font-size: 13px;
  line-height: 1.5;
  border-radius: 12px;
  background-color: rgba(var(--v-theme-surface), 0.95) !important;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0,0,0,0.15);
}


@media (max-width: 640px) {
  .panel-title {
    grid-template-columns: auto 1fr 20px;
    gap: 10px;
  }

  .panel-index {
    width: 32px;
    height: 32px;
    font-size: 14px;
  }

  .panel-question {
    font-size: 0.90rem;
  }

  .episode-alert {
    bottom: 16px;
    right: 16px;
    left: 16px;
    width: auto;
    max-width: none;
  }
}
</style>
