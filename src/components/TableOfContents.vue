<script setup lang="ts">
import { computed } from 'vue';

type TocSection = {
  id: string;
  title: string;
};

const props = defineProps<{
  sections: TocSection[];
  activeId?: string;
}>();

const emit = defineEmits<{(event: 'select', id: string): void }>();

const activeId = computed(() => props.activeId ?? '');

function handleLinkClick(id: string, event: MouseEvent) {
  event.preventDefault();
  emit('select', id);
}
</script>

<template>
  <nav class="toc" aria-label="Оглавление">
    <div class="toc-title">Оглавление</div>
    <div class="toc-list">
      <a
        v-for="section in sections"
        :key="section.id"
        :class="{ 'toc-link--active': section.id === activeId }"
        :href="`#${section.id}`"
        :aria-current="section.id === activeId ? 'location' : undefined"
        class="toc-link"
        @click="handleLinkClick(section.id, $event)"
      >{{ section.title }}</a>
    </div>
  </nav>
</template>

<style scoped>
.toc {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.toc-title {
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.25em;
  font-size: 0.75rem;
  color: rgba(var(--v-theme-on-background));
  padding-left: 16px;
}

.toc-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.toc-link {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  border-radius: 0 24px 24px 0;
  border-left: 3px solid transparent;
  color: rgb(var(--v-theme-primary));
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
}

.toc-link--active {
  background: rgba(var(--v-theme-primary), 0.12);
  border-left-color: rgb(var(--v-theme-primary));
  color: rgb(var(--v-theme-primary-lighten-1));
  font-weight: 600;
}

.toc-link:hover {
  color: rgb(var(--v-theme-primary-lighten-1));
}

</style>
