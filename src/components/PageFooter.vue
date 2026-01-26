<script setup lang="ts">
</script>

<template>
  <footer>
    <div class="footer">
      <div class="footer-column">
        <span class="footer-title">О проекте</span>
        <span class="footer-text">
          Неофициальная коллекция вопросов из шоу LockStock. <br>
          Создано фанатом для фанатов.
        </span>
      </div>

      <div class="footer-column">
        <span class="footer-title">Контакты разработчика</span>
        <a href="mailto:dasha2510929@yandex.ru" class="footer-link">dasha2510929@yandex.ru</a>
        <span class="footer-text">2026 Darkselia</span>
      </div>

    </div>
  </footer>
</template>

<style scoped>
footer {
  padding: 20px;
  background: linear-gradient(135deg, rgb(var(--v-theme-primary)) 0%, rgb(var(--v-theme-primary-darken-1)) 100%);
  color: rgb(var(--v-theme-on-primary));
}

.footer {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
  max-width: 1000px;
  margin: 0 auto;

  @media (width <= 600px) {
    grid-template-columns: 1fr;
    gap: 28px;
  }
}

.footer-column {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.footer-title {
  font-size: 16px;
  font-weight: 1000;
  color: rgb(var(--v-theme-secondary-lighter-1));
  margin-bottom: 6px;
  letter-spacing: 0.02em;
}

.footer-text {
  color: rgba(var(--v-theme-on-primary), 0.85);
}

.footer-link {
  color: rgb(var(--v-theme-on-primary));
  text-decoration: none;
  font-weight: 500;
}

.footer-link:hover {
  color: rgb(var(--v-theme-on-primary));
  text-decoration: underline;
}
</style>
