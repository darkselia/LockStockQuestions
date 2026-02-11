<script setup lang="ts">
import { ref } from 'vue';

const email = 'mailto:dasha2510929@yandex.ru'
const telegram = 'https://t.me/darkselia'
const github = 'https://github.com/darkselia'
const copiedEmail = ref(false);

function copyEmail() {
  // Попытка через современный API
  if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(email).then(() => {
      copiedEmail.value = true;
      setTimeout(() => (copiedEmail.value = false), 1800);
    }).catch(() => {
      // fallback
      fallbackCopyTextToClipboard(email);
    });
  } else {
    fallbackCopyTextToClipboard(email);
  }
}

function fallbackCopyTextToClipboard(text: string) {
  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textarea);
    if (successful) {
      copiedEmail.value = true;
      setTimeout(() => (copiedEmail.value = false), 1800);
    }
  } catch (e) {
    // окончательный fallback — ничего не делаем
    // можно логировать в консоль
    // console.warn('Copy failed', e);
  }
}
</script>

<template>
  <footer class="site-footer">
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
        <div class="footer-contacts">
          <div class="contact-item email-wrapper">
            <v-btn class="footer-contact" aria-label="Скопировать email" @click="copyEmail" icon="mdi-email"
                   size="small"/>
            <span v-if="copiedEmail" class="copy-notice" role="status" aria-live="polite">Скопировано</span>
          </div>

          <v-btn :href="telegram" target="_blank" rel="noopener" class="footer-contact" aria-label="Telegram"
                 icon="mdi-send"  size="small"/>

          <v-btn :href="github" target="_blank" rel="noopener" class="footer-contact" aria-label="GitHub"
                 icon="mdi-github" size="small"/>
          <span class="footer-text">2026 Darkselia</span>
        </div>
      </div>

    </div>
  </footer>
</template>

<style scoped>
.site-footer {
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

.footer-contacts {
  display: flex;
  gap: 10px;
  align-items: center;
}

.contact-item {
  position: relative;
}

.email-wrapper {
  display: inline-flex;
  align-items: center;
}

.copy-notice {
  position: absolute;
  top: -38px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(var(--v-theme-primary));
  color: rgb(var(--v-theme-on-primary));
  padding: 6px 8px;
  border-radius: 6px;
  font-size: 12px;
  white-space: nowrap;
  box-shadow: 0 6px 14px rgba(0,0,0,0.12);
  transition: opacity 0.18s ease, transform 0.18s ease;
  opacity: 1;
  pointer-events: none;
}

.footer-contact:hover {
  background: rgba(var(--v-theme-on-primary), 0.16);
  transform: translateY(-2px);
}
</style>
