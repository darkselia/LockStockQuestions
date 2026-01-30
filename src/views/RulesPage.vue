<script setup lang="ts">

const ruleSections = [
  {
    title: 'Участники',
    items: [ 'В игре участвует любое количество игроков.', 'Ведущий задает вопросы и озвучивает подсказки.', 'Крупье объявляет ставки и следит за ходом игры.' ],
  },
  {
    title: 'Какие бывают вопросы',
    items: [ 'Все вопросы требуют только числового ответа (например: год, количество, расстояние, процент и т.д.).', 'Каждый игрок записывает свой ответ на карточке.', 'Ответы скрыты — никто не знает, какие числа указали другие участники.' ],
  },
  {
    title: 'Ход игры',
    steps: [
      {
        title: '1. Запись ответа',
        text: 'Игроки записывают свой вариант ответа на карточке.',
      },
      {
        title: '2. Первый круг ставок',
        text: 'Игроки делают ставки, как в покере. Уверенные ставят больше, сомневающиеся могут выйти из раунда.',
      },
      {
        title: '3. Первая подсказка',
        text: 'Ведущий дает подсказку, которая помогает точнее оценить правильный ответ.',
      },
      {
        title: '4. Второй круг ставок',
        text: 'После подсказки игроки снова решают: повысить ставку, оставить ее без изменений или пасовать.',
      },
      {
        title: '5. Вторая подсказка',
        text: 'Ведущий дает еще одну подсказку.',
      },
      {
        title: '6. Третий круг ставок',
        text: 'Игроки принимают окончательное решение — продолжать игру или выйти.',
      },
      {
        title: '7. Оглашение правильного ответа',
        text: 'Ведущий называет правильное число.',
      },
      {
        title: '8. Финальный круг ставок и вскрытие',
        text:
          'Оставшиеся игроки играют последний круг вставок и вскрывают свои ответы. Побеждает тот, чье число ближе всего к правильному ответу.',
      },
    ],
  },
  {
    title: 'Ставки и решения игроков',
    items: [ 'Игрок может повышать ставку, если уверен в своем ответе.', 'Если игрок понимает, что его число далеко от правильного, он может пасовать и выйти из раунда.', 'Если никто не хочет повышать ставку, игроки могут объявить «чек» — тогда ведущий дает подсказку, но деньги не теряются.' ],
  },
  {
    title: 'Блеф',
    paragraphs: [ 'Игроки могут блефовать, создавая впечатление уверенности в своем ответе, чтобы заставить соперников пасовать.', 'Иногда именно блеф приносит победу.' ],
  },
  {
    title: 'Выбывание и победа',
    paragraphs: [ 'Игрок, оставшийся без фишек, выбывает из игры.', 'Игра продолжается до тех пор, пока не останется один игрок с фишками.', 'Он и становится победителем, забирая все.' ],
  },
];
</script>

<template>
  <section class="rules-page">
    <header class="rules-header">
      <p class="rules-eyebrow">Правила игры</p>
      <h1 class="rules-title">«Лок Сток»</h1>
      <p class="rules-subtitle">
        — интеллектуальное шоу, в котором логика, интуиция и блеф важны не меньше, чем точный ответ.
      </p>
    </header>

    <section class="rules-card">
      <article v-for="section in ruleSections" :key="section.title" class="rules-section">
        <h2 class="rules-section-title">{{ section.title }}</h2>

        <div v-if="section.paragraphs" class="rules-block">
          <p v-for="paragraph in section.paragraphs" :key="paragraph" class="rules-paragraph">
            {{ paragraph }}
          </p>
        </div>

        <ul v-if="section.items" class="rules-list">
          <li v-for="item in section.items" :key="item" class="rules-list-item">
            {{ item }}
          </li>
        </ul>

        <div v-if="section.steps" class="rules-steps">
          <div v-for="step in section.steps" :key="step.title" class="rules-step">
            <div class="rules-step-title">{{ step.title }}</div>
            <div class="rules-step-text">{{ step.text }}</div>
          </div>
        </div>
      </article>
    </section>

    <section class="rules-card rules-card--accent">
      <h2 class="rules-section-title">Видео</h2>
      <p class="rules-paragraph">
        Все выпуски шоу и игровые раунды можно посмотреть в <a
          href="https://vkvideo.ru/playlist/-214484275_24"
          class="rules-link"
          target="_blank"
          rel="noopener noreferrer"
        >официальном плейлисте «Лок Сток»</a>
      </p>

    </section>
  </section>
</template>

<style scoped>
.rules-page {
  width: min(100%, 1100px);
  margin: 0 auto;
  padding: 32px 20px 64px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.rules-header {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-left: 8px;
}

.rules-eyebrow {
  letter-spacing: 0.25em;
  text-transform: uppercase;
  font-size: 0.75rem;
  font-weight: 700;
  color: rgba(var(--v-theme-on-background), 0.65);
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
  background: rgb(var(--v-theme-surface));
  border-radius: var(--v-border-radius);
  padding: 24px;
  border: 1px solid rgb(var(--v-theme-surface-variant));
  display: flex;
  flex-direction: column;
  gap: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
}

.rules-card--accent {
  border-color: rgba(var(--v-theme-primary-darken-1), 0.4);
}

.rules-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.rules-section-title {
  margin: 0;
  font-size: 1.3rem;
  color: rgb(var(--v-theme-primary-darken-1));
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
</style>
