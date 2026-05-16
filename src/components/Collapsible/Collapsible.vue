<script setup lang="ts">
import { ref } from 'vue'

interface CollapsibleProps {
  title: string
  collapsed?: boolean
}

const props = withDefaults(defineProps<CollapsibleProps>(), {
  collapsed: false,
})

const emit = defineEmits<{
  toggle: []
}>()

const isCollapsed = ref(props.collapsed)

function toggle() {
  isCollapsed.value = !isCollapsed.value
  emit('toggle')
}
</script>

<template>
  <div class="collapsible-wrapper">
    <div :class="isCollapsed ? 'collapsible-title' : 'collapsible-title title-collapsed'">
      <button class="collapsible-button" @click="toggle">
        <svg :class="isCollapsed ? 'rotated' : ''" stroke="currentColor" fill="currentColor" stroke-width="0"
          viewBox="0 0 16 16" height="25px" width="25px" xmlns="http://www.w3.org/2000/svg" style="color: black;">
          <path fill-rule="evenodd" clip-rule="evenodd"
            d="M10.072 8.024L5.715 3.667l.618-.62L11 7.716v.618L6.333 13l-.618-.619 4.357-4.357z"></path>
        </svg>
      </button>
      <p>{{ title }}</p>
    </div>
    <div :class="isCollapsed ? 'uncollapsed' : 'collapsed'">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.collapsed {
  overflow: hidden;
  max-height: 0px;
}

.uncollapsed {
  display: block;
  max-height: max-content;
}

.collapsible-wrapper {
  max-width: 100vw;
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid var(--primary-color);
  margin-bottom: 1rem;
}

.collapsible-title {
  border-bottom: 1px solid var(--primary-color);
  width: 90%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  margin: 0 auto;
}

.collapsible-button {
  border: none;
  background: none;
}

.title-collapsed {
  border: none;
}

.rotated {
  transform: rotate(90deg);
  transition: transform 0.1s ease-in-out;
}
</style>