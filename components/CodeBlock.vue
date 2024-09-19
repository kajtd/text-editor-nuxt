<template>
  <node-view-wrapper class="code-block relative">
    <div class="absolute right-2 top-2 z-10">
      <div class="relative">
        <select
          v-model="selectedLanguage"
          @change="selectLanguage"
          class="appearance-none flex items-center space-x-1 px-2 py-1 pr-8 text-xs font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors duration-200"
        >
          <option :value="null">auto</option>
          <option
            v-for="language in languages"
            :key="language"
            :value="language"
          >
            {{ language }}
          </option>
        </select>
        <div
          class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-600"
        >
          <Icon name="heroicons:chevron-down-20-solid" class="w-4 h-4" />
        </div>
      </div>
    </div>
    <pre><code><node-view-content /></code></pre>
  </node-view-wrapper>
</template>

<script setup lang="ts">
import { NodeViewContent, nodeViewProps, NodeViewWrapper } from "@tiptap/vue-3";

const props = defineProps(nodeViewProps);

const languages = computed(() =>
  props.extension.options.lowlight.listLanguages()
);

const selectedLanguage = computed({
  get: () => props.node.attrs.language,
  set: (language: string | null) => props.updateAttributes({ language }),
});

const selectLanguage = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  selectedLanguage.value = target.value;
};
</script>
