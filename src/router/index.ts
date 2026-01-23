import { createRouter, createWebHistory } from 'vue-router';
import MainPage from '@/views/MainPage.vue';
import { useQuestionsStore } from '@/stores/questions';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: MainPage,
    },
    {
      path: '/episode/:id',
      name: 'episode',
      component: MainPage,
    },
  ],

});

router.beforeEach(() => {
  const questionsStore = useQuestionsStore();
  if (questionsStore.allQuestions === null) {
    return questionsStore.loadQuestions();
  }
});


export default router;
