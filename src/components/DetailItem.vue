<script setup lang="ts">
defineProps<{
  label: string;
  text: string;
  revealed: boolean;
  skeletonType: 'sentences' | 'list-item' | 'paragraph';
  onReveal:() => void;
}>();
</script>

<template>
  <div class="detail">
    <span class="detail-label">{{ label }}</span>
    <div class="detail-content">
      <Transition name="detail-fade" mode="out-in">
        <v-skeleton-loader
          v-if="!revealed"
          key="skeleton"
          :type="skeletonType"
          boilerplate
          class="spoiler-skeleton"
          @click="onReveal"
        />
        <span v-else key="text" :class="skeletonType" class="detail-value">{{ text }}</span>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.detail {
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: rgb(var(--v-theme-surface));
  border-radius: 12px;
  padding: 12px;
  border: 2px solid rgb(var(--v-theme-surface-variant));
}

.detail-label {
  font-size: 0.9rem;
  color: rgb(var(--v-theme-secondary-darken-1));
  font-weight: 700;
}

.detail-content{
  display: grid;
}

.detail-fade-enter-active,
.detail-fade-leave-active {
  transition: opacity 180ms ease, transform 220ms ease;
}

.detail-fade-enter-from {
  opacity: 0;
  transform: translateY(4px);
}

.detail-fade-leave-to {
  opacity: 0;
}

.spoiler-skeleton {
  cursor: pointer;
}

.detail-value {
  color: rgb(var(--v-theme-on-surface));
  line-height: 1.5;
}

.sentences{
  margin: 16px 16px;
}

.list-item {
  margin: 10px 16px;
}

.paragraph {
  margin: 8px 16px;
}
</style>
