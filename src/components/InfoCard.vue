<script setup lang="ts">
import { computed, useSlots } from 'vue';

defineProps<{
  eyebrow: string;
  title: string;
  description?: string;
}>();

const slots = useSlots();
const hasSideSlot = computed(() => Boolean(slots.default));
const hasContentSlot = computed(() => Boolean(slots.content));
</script>

<template>
  <section class="card">
    <div class="card-text">
      <p class="card-eyebrow">
        {{ eyebrow }}
      </p>
      <h1 class="card-title">
        {{ title }}
      </h1>
      <p v-if="description" class="card-description">
        {{ description }}
      </p>
      <div v-if="hasContentSlot" class="card-content">
        <slot name="content" />
      </div>
    </div>
    <div v-if="hasSideSlot" class="card-side">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.card {
  position: relative;
  isolation: isolate;
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(260px, 0.8fr);
  gap: clamp(28px, 5vw, 72px);
  align-items: center;
  overflow: hidden;
  padding: clamp(36px, 5vw, 72px);
  margin: 0 20px 30px;
  border: 1px solid rgba(var(--v-theme-primary-lighten-1), 0.7);
  border-radius: 4px;
  background:
    radial-gradient(circle at 50% 0%, rgba(var(--v-theme-primary), 0.12), transparent 45%),
    linear-gradient(145deg, rgb(var(--v-theme-surface)) 0%, rgb(var(--v-theme-background)) 70%);
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.42), inset 0 0 45px rgba(255, 255, 255, 0.025);
}

.card::before,
.card::after {
  position: absolute;
  z-index: -1;
  content: '';
  pointer-events: none;
}

.card::before {
  inset: 10px;
  border: 1px solid rgba(var(--v-theme-primary), 0.45);
}

.card::after {
  top: 18px;
  right: 50%;
  width: 14px;
  height: 14px;
  border: 1px solid rgb(var(--v-theme-primary-lighten-1));
  background: rgb(var(--v-theme-surface));
  transform: translateX(50%) rotate(45deg);
}

.card-text {
  display: grid;
  gap: 16px;
}

.card-eyebrow {
  letter-spacing: 0.34em;
  text-transform: uppercase;
  font-size: 0.75rem;
  font-weight: 700;
  color: rgb(var(--v-theme-primary-lighten-1));
  margin: 0;
}

.card-title {
  max-width: 720px;
  font-family: var(--font-display);
  font-size: clamp(2.25rem, 4.5vw, 4rem);
  font-weight: 600;
  letter-spacing: -0.035em;
  margin: 0;
  line-height: 1.02;
  color: rgb(var(--v-theme-primary));
  text-shadow: 0 3px 18px rgba(var(--v-theme-primary), 0.12);
}

.card-description {
  color: rgba(var(--v-theme-on-surface), 0.76);
  margin: 0;
  max-width: 560px;
}

.card-content {
  display: grid;
  gap: 16px;
}

.card-side {
  width: 100%;
}

@media (max-width: 720px) {
  .card {
    grid-template-columns: minmax(0, 1fr);
    padding: 36px 26px;
    margin-inline: 12px;
  }

  .card-title {
    font-size: clamp(2rem, 10vw, 3rem);
  }
}
</style>
