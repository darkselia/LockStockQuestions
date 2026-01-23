import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { QuestionsByVideo } from '@/types/types';

const QUESTIONS_JSON_URL = new URL('../../data/questions.json', import.meta.url);

export const useQuestionsStore = defineStore('questions', () => {
  const data = ref<QuestionsByVideo | null>(null);
  const loadPromise = ref<Promise<QuestionsByVideo> | null>(null);
  const allQuestions = computed(() => data.value);
  const getByVideo = (videoId: string | number) => {
    if (!data.value) {
      return undefined;
    }
    const key = typeof videoId === 'number' ? String(videoId) : videoId;
    return data.value[key];
  };

  async function loadQuestions(): Promise<QuestionsByVideo> {
    if (data.value) {
      return data.value;
    }
    if (loadPromise.value) {
      return loadPromise.value;
    }

    const request = (async() => {
      const response = await fetch(QUESTIONS_JSON_URL.href);
      if (!response.ok) {
        throw new Error(`Не удалось загрузить вопросы: ${response.status}`);
      }

      const payload = (await response.json()) as QuestionsByVideo;
      data.value = payload;
      return payload;
    })();

    loadPromise.value = request;

    try {
      return await request;
    } finally {
      loadPromise.value = null;
    }
  }

  return {
    allQuestions,
    getByVideo,
    loadQuestions,
  };
});
