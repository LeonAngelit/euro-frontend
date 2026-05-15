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
  <div :class="isCollapsed ? 'collapsible uncollapsed' : 'collapsible collapsed'">
    <button class="collapsible-header" @click="toggle">
      <h3>{{ title }}</h3>
      <span>{{ isCollapsed ? '−' : '+' }}</span>
    </button>
    <div v-if="isCollapsed" class="collapsible-content">
      <slot />
    </div>
  </div>
</template>

<style src="../../Components/Collapsible/Collapsible.component.css"></style>