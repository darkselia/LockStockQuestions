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
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 28px;
  align-items: center;
  background: linear-gradient(
    135deg,
    rgb(var(--v-theme-primary-lighten-1)) 0%,
    rgb(var(--v-theme-primary-darken-1)) 100%
  );
  padding: clamp(25px, 2vw + 20px, 60px);
  box-shadow: 0 20px 50px rgba(var(--v-theme-primary-darken-1), 0.25);
  border-radius: 24px;
  margin: 0 20px 30px;
  border-bottom: 10px solid rgb(var(--v-theme-primary-darken-1));
  border-right: 10px solid rgb(var(--v-theme-primary-darken-1));
}

.card-text {
  display: grid;
  gap: 16px;
}

.card-eyebrow {
  letter-spacing: 0.3em;
  text-transform: uppercase;
  font-size: 0.75rem;
  font-weight: 700;
  color: rgba(var(--v-theme-on-primary), 0.85);
  margin: 0;
}

.card-title {
  font-size: clamp(2rem, 3vw, 2.6rem);
  margin: 0;
  line-height: 1.2;
  color: rgb(var(--v-theme-on-primary));
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.2);
}

.card-description {
  color: rgba(var(--v-theme-on-primary), 0.9);
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
    padding: 28px;
  }

  .card-title {
    font-size: 2rem;
  }
}
</style>

