<template>
  <div
    class="absolute top-2 left-1/2 transform -translate-x-1/2 flex space-x-4 bg-white border border-gray-300/30 backdrop-blur-sm shadow rounded-md z-10 py-0.5 px-1"
  >
    <button
      v-for="(action, index) in actions"
      :key="index"
      @click.stop="action.handler"
      class="flex items-center space-x-2 text-black transition hover:bg-gray-300/30 p-1.5 rounded-md"
    >
      <Icon :name="action.icon" class="w-3.5 h-3.5" />
      <span class="text-sm">{{ action.label }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
interface ActionItem {
  label: string;
  icon: string;
  handler: () => void;
}

defineProps<{
  actions: ActionItem[];
}>();
</script>
