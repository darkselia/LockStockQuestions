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
  background: rgba(255, 255, 255, 0.025);
  border-radius: 2px;
  padding: 14px;
  border: 1px solid rgba(var(--v-theme-primary), 0.22);
}

.detail-label {
  font-size: 0.9rem;
  color: rgb(var(--v-theme-primary-lighten-1));
  letter-spacing: 0.08em;
  text-transform: uppercase;
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
  line-height: 1.37;
  margin: 10px 16px;
}

.list-item {
  line-height: 1.5;
}

.paragraph{
  line-height: 1.33;
}
</style>
