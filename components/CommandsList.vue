<template>
  <div
    ref="containerRef"
    class="bg-white max-h-80 overflow-y-auto overflow-x-hidden border border-gray-200 shadow-lg rounded-lg py-2 flex flex-col items-start justify-start w-64"
  >
    <div class="px-3 py-2 text-sm text-gray-500 font-medium">BASIC BLOCKS</div>
    <button
      v-for="(item, index) in items"
      :key="item.name"
      :ref="(el) => setItemRef(el as HTMLElement | null, index)"
      class="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-100 transition-colors duration-150"
      :class="{ 'bg-gray-100': index === selectedIndex }"
      @click="selectItem(index)"
    >
      <div
        class="bg-gray-200 rounded-sm h-8 w-8 flex items-center justify-center"
      >
        <Icon :name="item.icon" class="w-5 h-5 text-gray-600" />
      </div>
      <div class="flex flex-col text-left">
        <span class="text-gray-900 font-medium text-sm">{{ item.name }}</span>
        <span class="text-gray-500 text-xs">{{ item.description }}</span>
      </div>
    </button>
  </div>
</template>

<script setup lang="ts">
import type { SuggestionItem } from "~/types/suggestion";

interface Props {
  items: SuggestionItem[];
  command: (item: SuggestionItem) => void;
}

const props = defineProps<Props>();

const selectedIndex = ref(0);
const containerRef = ref<HTMLElement | null>(null);
const itemRefs = ref<(HTMLElement | null)[]>([]);

const setItemRef = (el: HTMLElement | null, index: number) => {
  itemRefs.value[index] = el;
};

const selectItem = (index: number) => {
  props.command(props.items[index]);
};

const scrollToSelected = () => {
  nextTick(() => {
    const selectedElement = itemRefs.value[selectedIndex.value];
    if (selectedElement && containerRef.value) {
      const container = containerRef.value;
      const elementTop = selectedElement.offsetTop;
      const elementBottom = elementTop + selectedElement.offsetHeight;
      const containerTop = container.scrollTop;
      const containerBottom = containerTop + container.clientHeight;

      if (elementTop < containerTop) {
        container.scrollTop = elementTop;
      } else if (elementBottom > containerBottom) {
        container.scrollTop = elementBottom - container.clientHeight;
      }
    }
  });
};

const onKeyDown = (event: KeyboardEvent): boolean => {
  if (event.key === "ArrowUp") {
    selectedIndex.value =
      (selectedIndex.value - 1 + props.items.length) % props.items.length;
    scrollToSelected();
    return true;
  }
  if (event.key === "ArrowDown") {
    selectedIndex.value = (selectedIndex.value + 1) % props.items.length;
    scrollToSelected();
    return true;
  }
  if (event.key === "Enter") {
    selectItem(selectedIndex.value);
    return true;
  }
  return false;
};

watch(
  () => props.items,
  () => {
    selectedIndex.value = 0;
    scrollToSelected();
  }
);

onMounted(() => {
  scrollToSelected();
});

defineExpose({ onKeyDown });
</script>
