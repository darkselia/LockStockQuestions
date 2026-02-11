<script setup lang="ts">
import { computed, onMounted, ref, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { QuestionRecord } from '@/types/types';
import { useQuestionsStore } from '@/stores/questions';
import DetailItem from '@/components/DetailItem.vue';

const route = useRoute();
const router = useRouter();
const questionsStore = useQuestionsStore();

const episodeId = computed(() => String(route.params.id ?? ''));
const questions = computed<QuestionRecord[]>(() => questionsStore.getByVideo(episodeId.value) ?? []);
const allowedIds = new Set(questions.value.map(q => String(q['question-id'])));


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
    <v-alert closable type="info" border="start" elevation="2" class="episode-alert"
             icon="mdi-information">
      Если вы заметили ошибку в вопросе, пожалуйста, напишите на почту снизу страницы
      с указанием номера выпуска, номера вопроса и описанием ошибки.
    </v-alert>

  <section class="page-shell">
    <header class="page-header">
      <p class="eyebrow">Выпуск</p>
      <h1>№ {{ episodeId }}</h1>
      <p class="subtitle">Вопросы, подсказки и ответы из шоу LockStock</p>
    </header>

    <div v-if="!questions.length" class="empty-state">
      <p>Для выпуска № {{ episodeId }} вопросов не загружено.</p>
    </div>

    <v-expansion-panels
      v-else
      v-model="panelModel"
      multiple
      variant="popout"
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
            <span class="panel-index">{{ idx + 1 }}</span>
            <span class="panel-question">{{ question.question }}</span>
            <span>{{ question['question-id'] }}</span>
          </div>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <div class="answer-card">
            <DetailItem
              v-if="hasText(question.hint1)"
              :text="String(question.hint1 ?? '')"
              :revealed="isRevealed(String(question['question-id']), 'hint1')"
              :onReveal="getRevealHandler(String(question['question-id']), 'hint1')"
              label="Подсказка 1"
              skeletonType="sentences"
            />

            <DetailItem
              v-if="hasText(question.hint2)"
              :text="String(question.hint2 ?? '')"
              :revealed="isRevealed(String(question['question-id']), 'hint2')"
              :onReveal="getRevealHandler(String(question['question-id']), 'hint2')"
              label="Подсказка 2"
              skeletonType="sentences"
            />

            <DetailItem
              v-if="hasText(question.answer)"
              :text="String(question.answer ?? '')"
              :revealed="isRevealed(String(question['question-id']), 'answer')"
              :onReveal="getRevealHandler(String(question['question-id']), 'answer')"
              label="Ответ"
              skeletonType="list-item"
            />

            <DetailItem
              v-if="hasText(question['answer-comm'])"
              :text="String(question['answer-comm'] ?? '')"
              :revealed="isRevealed(String(question['question-id']), 'answer')"
              :onReveal="getRevealHandler(String(question['question-id']), 'answer')"
              label="Комментарий к ответу"
              skeletonType="paragraph"
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
  font-size: 2.4rem;
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
  grid-template-columns: auto 1fr 10px;
  gap: 12px;
  align-items: center;
  width: 100%;
  margin-right: 14px;
}

.panel-index {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: rgb(var(--v-theme-secondary-lighten-1));
  color: rgb(var(--v-theme-on-secondary));
  font-weight: 1000;
}

.panel-question {
  color: rgb(var(--v-theme-on-surface));
  font-weight: 600;
  line-height: 1.4;
}

.answer-card {
  display: grid;
  gap: 14px;
}

.episode-alert{
  position: fixed;
  bottom: 10px;
  right: 12px;
  z-index: 2000;
  width: min(600px, 90vw);
  transition: opacity 0.18s ease, transform 0.18s ease;
}

.alert-email {
  color: inherit;
  font-weight: 600;
  margin: 0 4px;
  text-decoration: underline;
}


@media (max-width: 640px) {
  .panel-title {
    grid-template-columns: auto 1fr;
    gap: 10px;
  }

  .panel-question {
    font-size: 0.95rem;
  }
}
</style>
