<script setup lang="ts">
/* eslint-disable max-len */
import { computed, ref, onMounted, nextTick } from 'vue';
import { useDisplay } from 'vuetify';
import TableOfContents from '@/components/TableOfContents.vue';

const { mdAndUp } = useDisplay();
const isDesktop = computed(() => mdAndUp.value);

const activeSection = ref('game-rules');

onMounted(() => {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        activeSection.value = entry.target.id;
      }
    });
  }, {
    rootMargin: '-20% 0px -50% 0px',
    threshold: 0.1,
  });

  nextTick(() => {
    document.querySelectorAll('.rules-card[id]').forEach(section => {
      observer.observe(section);
    });
  });
});

const ruleBlocks = [
  {
    id: 'game-rules',
    title: 'Правила игры',
    paragraphs: [
      'В игре участвует любое количество игроков.',
      'Ведущий задаёт вопрос с числовым ответом (например: год, количество, расстояние, процент и т.д.). Каждый игрок пишет свой вариант на карточке.',
      'Игроки не видят ответы друг друга. Побеждает тот, чей ответ ближе к правильному — он забирает банк раунда.',
    ],
    subsections: [
      {
        title: 'Перед началом раунда — обязательная ставка',
        paragraphs:
          ['В начале каждого раунда все делают обязательную ставку (анте). Это делает банк в начале и заставляет думать о риске.'],
      },
      {
        title: 'Пошаговый ход раунда',
        steps: [
          {
            title: '1. Ведущий задаёт вопрос',
            text: 'Например: «Сколько букв в английском алфавите?»',
          },
          {
            title: '2. Запись ответа',
            text:
              'Игроки пишут своё число на карточке и делают начальную фиксированную ставку. Ответ изменить нельзя — он остаётся скрытым до конца раунда.',
          },
          {
            title: '3. Первый круг ставок',
            text:
              'Игроки по очереди делают ход: повышают или сравнивают ставку, или пасуют и выходят из раунда.',
          },
          {
            title: '4. Первая подсказка и круг ставок',
            text:
              'Ведущий даёт подсказку. После подсказки игроки снова решают: повышать ставку, оставить неизменной или пасовать.',
          },
          {
            title: '5. Вторая подсказка и круг ставок',
            text: 'Ведущий дает ещё одну подсказку. И ставки проводятся ещё раз.',
          },
          {
            title: '6. Озвучивание правильного ответа и круг ставок',
            text: 'Ведущий объявляет правильное число. Однако игроки снова делают круг ставок, зная уже правильный ответ. Это позволяет блефовать и пытаться выбить других из игры, даже если ваш ответ далёк.',
          },
          {
            title: '7. Вскрытие и определение победителя',
            text: 'Игроки показывают карточки. Кто ближе по модулю к правильному числу — берёт банк раунда.',
          },
        ],
      },
      {
        title: 'Ставки — как принимать решения',
        items: [
          'Если вы уверены в своём ответе — ставьте больше, чтобы выиграть больше.',
          'Если вы не уверены — можно пасовать и выйти, чтобы не терять фишки.',
          'Иногда лучше чекнуть (не повышать) и дождаться подсказки, если сомневаетесь.',
        ],
      },
      {
        title: 'Блеф и психологическая игра',
        items: [ 'Блеф — важная часть: можно делать большие ставки, чтобы заставить других выйти, даже если вы не уверены.', 'Однако блеф рискован: если ваш ответ далёк, вы потеряете фишки, а кто-то с более точным ответом заберёт банк.' ],
      },
      {
        title: 'Выбывание и финал',
        paragraphs: [ 'Если игрок теряет все фишки — он выбывает из игры.', 'Игра идёт до тех пор, пока не останется один игрок с фишками — он и становится победителем турнира.' ],
      },
    ],
  },
  {
    id: 'show-bets',
    title: 'Пример ставок в шоу',
    paragraphs:
      ['В передаче используется большой стартовый банк, и ставки растут по ходу игры. Это увеличивает азарт и риск.'],
    items: [
      'Стартовый банк игрока — 25 000 фишек.',
      'Минимальная обязательная ставка в начале раунда — 500 фишек.',
      'Каждый новый вопрос может повышать обязательную ставку на фиксированную сумму.',
    ],
  },
  {
    id: 'home-bets',
    title: 'Правила для домашней игры',
    paragraphs:
      [ 'Для домашней игры ставки и набор фишек можно упростить, чтобы играть было удобно и интересно. ', 'Пример для 5 игроков и комплекта из 200 фишек:' ],
    items: [
      'На6ор фишек на игрока: 10х5 + 10х25 + 10х50 = 800. ',
      'Пропорция от шоу: 800 / 25 000 = 0,03',
      'Стартовая обязательная ставка: 500 * 0,03 = 15 фишек. ',
      'Увеличение обязательной ставки в каждом раунде: +15 фишек. ',
    ],
  },
];

const tocSections = computed(() => ruleBlocks.map(section => ({
  id: section.id,
  title: section.title,
})));

function handleTocSelect(id: string) {
  const target = document.getElementById(id);
  if (!target) {
    return;
  }

  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
</script>

<template>
  <div class="rules-page-wrapper">
    <aside v-if="isDesktop" class="rules-sidebar-sticky">
      <TableOfContents
        :sections="tocSections"
        :active-id="activeSection"
        @select="handleTocSelect"
      />
    </aside>

    <main class="rules-page-main">
      <header class="rules-header">
        <h1 class="rules-title">«Лок Сток»</h1>
        <p class="rules-subtitle">
          — интеллектуальное шоу, в котором логика, интуиция и блеф важны не меньше, чем точный ответ.
        </p>
      </header>

      <div class="rules-cards">
        <section
          v-for="block in ruleBlocks"
          :key="block.id"
          :id="block.id"
          class="rules-card"
        >
          <h2 class="rules-section-title">{{ block.title }}</h2>

          <div v-if="block.paragraphs" class="rules-block">
            <p v-for="paragraph in block.paragraphs" :key="paragraph" class="rules-paragraph">
              {{ paragraph }}
            </p>
          </div>

          <ul v-if="block.items" class="rules-list">
            <li v-for="item in block.items" :key="item" class="rules-list-item">
              {{ item }}
            </li>
          </ul>

          <div v-if="block.subsections" class="rules-subsections">
            <div v-for="subsection in block.subsections" :key="subsection.title" class="rules-subsection">
              <h3 class="rules-subsection-title">{{ subsection.title }}</h3>

              <div v-if="subsection.paragraphs" class="rules-block">
                <p v-for="paragraph in subsection.paragraphs" :key="paragraph" class="rules-paragraph">
                  {{ paragraph }}
                </p>
              </div>

              <ul v-if="subsection.items" class="rules-list">
                <li v-for="item in subsection.items" :key="item" class="rules-list-item">
                  {{ item }}
                </li>
              </ul>

              <div v-if="subsection.steps" class="rules-steps">
                <div v-for="step in subsection.steps" :key="step.title" class="rules-step">
                  <div class="rules-step-title">{{ step.title }}</div>
                  <div class="rules-step-text">{{ step.text }}</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="video-rules" class="rules-card rules-card--accent">
          <p class="rules-paragraph">
            Все выпуски шоу и игровые раунды можно посмотреть в
            <a
              href="https://vkvideo.ru/playlist/-214484275_24"
              class="rules-link"
              target="_blank"
              rel="noopener noreferrer"
            >официальном плейлисте «Лок Сток»</a>
          </p>
        </section>
      </div>
    </main>
  </div>
</template>

<style scoped>
.rules-page-wrapper {
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 32px 20px 64px;
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 48px;
  align-items: start;
}

.rules-sidebar-sticky {
  position: sticky;
  top: 96px;
}

.rules-page-main {
  display: flex;
  flex-direction: column;
  gap: 32px;
  min-width: 0;
}

.rules-cards {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.rules-header {
  display: flex;
  flex-direction: column;
  gap: 12px;
}


.rules-title {
  font-size: clamp(2rem, 2.5vw + 1.6rem, 2.8rem);
  color: rgb(var(--v-theme-primary-lighten-1));
  margin: 0;
}

.rules-subtitle {
  color: rgb(var(--v-theme-on-background));
  line-height: 1.5;
  margin: 0;
}

.rules-card {
  scroll-margin-top: 96px;
  background: rgb(var(--v-theme-surface));
  border-radius: var(--v-border-radius);
  padding: 32px;
  border: 1px solid rgb(var(--v-theme-surface-variant));
  display: flex;
  flex-direction: column;
  gap: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
}

.rules-card--accent {
  border-color: rgba(var(--v-theme-primary-darken-1), 0.4);
}

.rules-section-title {
  margin: 0;
  font-size: 1.5rem;
  color: rgb(var(--v-theme-primary-darken-1));
}

.rules-subsections {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.rules-subsection {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}

.rules-subsection:first-child {
  padding-top: 0;
  border-top: none;
}

.rules-subsection-title {
  margin: 0;
  font-size: 1.15rem;
  color: rgb(var(--v-theme-primary-darken-1));
  font-weight: 600;
}

.rules-block {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.rules-paragraph {
  margin: 0;
  color: rgb(var(--v-theme-on-surface));
  line-height: 1.6;
}

.rules-list {
  list-style: disc;
  margin: 0;
  padding-left: 18px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.rules-list-item {
  color: rgb(var(--v-theme-on-surface));
  line-height: 1.5;
}

.rules-steps {
  display: grid;
  gap: 12px;
  margin-top: 4px;
}

.rules-step {
  background: rgba(var(--v-theme-primary), 0.08);
  border-radius: var(--v-border-radius);
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.rules-step-title {
  font-weight: 700;
  color: rgb(var(--v-theme-primary-darken-1));
}

.rules-step-text {
  color: rgb(var(--v-theme-on-surface));
  line-height: 1.5;
}

.rules-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: rgb(var(--v-theme-primary));
  text-decoration: none;
}

.rules-link:hover {
  color: rgb(var(--v-theme-primary-lighten-1));
  text-decoration: underline;
}

@media (max-width: 960px) {
  .rules-page-wrapper {
    grid-template-columns: 1fr;
    gap: 24px;
    padding: 24px 16px 48px;
  }
}
</style>
