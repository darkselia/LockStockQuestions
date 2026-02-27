import { createRouter, createWebHistory } from 'vue-router';
import { loadEpisodePage, loadRulesPage } from './asyncViews';
import { useQuestionsStore } from '@/stores/questions';
import MainPage from '@/views/MainPage.vue';

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
      component: loadEpisodePage,
    },
    {
      path: '/rules',
      name: 'rules',
      component: loadRulesPage,
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    if (to.hash) {
      return {
        el: to.hash,
        top: 64,
        behavior: 'smooth',
      };
    }
    const isSameEpisode = to.name === 'episode' &&
      from.name === 'episode' &&
      to.params.id === from.params.id;
    if (isSameEpisode) {
      return false;
    }
    return { left: 0, top: 0 };
  },
});

router.beforeEach(async() => {
  const questionsStore = useQuestionsStore();
  if (questionsStore.allQuestions === null) {
    await questionsStore.loadQuestions();
  }
  return true;
});


export default router;
