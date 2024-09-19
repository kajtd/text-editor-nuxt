<template>
  <node-view-wrapper class="max-w-full w-full my-6">
    <input
      type="file"
      accept="image/*"
      @change="handleFileUpload"
      ref="fileInput"
      class="hidden"
    />
    <div v-if="!node.attrs.src" class="upload-placeholder">
      <button
        @click="triggerFileInput"
        class="bg-gray-300/40 hover:bg-gray-100 text-gray-800 font-medium py-2 px-4 rounded-lg shadow-sm flex items-center justify-center w-full h-16 transition duration-150 ease-in-out"
      >
        <Icon name="mdi:image-plus" class="w-6 h-6 mr-3 text-gray-400" />
        <span class="text-gray-500 text-sm">Click to upload an image</span>
      </button>
    </div>
    <div v-else class="relative group">
      <div class="rounded-lg overflow-hidden">
        <img
          :src="node.attrs.src"
          :alt="node.attrs.alt"
          class="w-full h-auto object-cover !my-1"
        />
        <div
          class="image-actions absolute top-1 left-0 right-0 h-12 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-800/10 flex items-center justify-end px-2 space-x-2"
        >
          <button
            class="bg-gray-100/90 rounded shadow-xs h-6 px-3 text-black font-medium text-xs"
            @click="triggerFileInput"
          >
            Replace
          </button>
          <button
            class="bg-gray-800/90 rounded shadow-xs h-6 px-3 text-white font-medium text-xs"
            @click="removeImage"
          >
            Delete
          </button>
        </div>
      </div>
      <div class="flex items-center relative">
        <input
          type="text"
          v-model="inputText"
          @input="updateText"
          @keydown.enter.prevent="handleEnter"
          :placeholder="showAltText ? 'Add alt text' : 'Add a caption'"
          class="w-full px-1 py-1 text-sm text-gray-700 bg-transparent focus:outline-none transition duration-150 ease-in-out placeholder-gray-400"
        />
        <button
          @click="toggleAltText"
          class="absolute right-0 bottom-1 bg-transparent text-gray-900 text-[10px] font-medium px-2 py-1 rounded transition duration-150 ease-in-out flex items-center"
        >
          <Icon
            :name="showAltText ? 'mdi:text-short' : 'mdi:text-recognition'"
            class="size-3 mr-1"
          />
          {{ showAltText ? "Caption" : "Alt Text" }}
        </button>
      </div>
    </div>
  </node-view-wrapper>
</template>

<script setup lang="ts">
import { NodeViewWrapper } from "@tiptap/vue-3";
import type { Editor } from "@tiptap/core";

interface Props {
  node: {
    attrs: {
      src: string | null;
      alt: string | undefined;
      caption: string | null;
    };
  };
  updateAttributes: (attrs: Partial<Props["node"]["attrs"]>) => void;
  editor: Editor;
}

const props = defineProps<Props>();

const fileInput = ref<HTMLInputElement | null>(null);
const caption = ref(props.node.attrs.caption || "");
const altText = ref(props.node.attrs.alt || "");
const showAltText = ref(false);

const inputText = computed({
  get: () => (showAltText.value ? altText.value : caption.value),
  set: (value: string) => {
    if (showAltText.value) {
      altText.value = value;
    } else {
      caption.value = value;
    }
  },
});

const handleEnter = () => {
  updateText();
  props.editor.commands.focus();
  props.editor.commands.enter();
};

const updateText = () => {
  showAltText.value ? updateAltText() : updateCaption();
};

const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === "string") {
        props.updateAttributes({
          src: result,
          alt: file.name,
        });
        altText.value = file.name;
      }
    };
    reader.readAsDataURL(file);
  }
};

const removeImage = () => {
  props.updateAttributes({
    src: null,
    alt: undefined,
    caption: null,
  });
  caption.value = "";
  altText.value = "";
};

const updateCaption = () => {
  props.updateAttributes({
    caption: caption.value,
  });
};

const updateAltText = () => {
  props.updateAttributes({
    alt: altText.value,
  });
};

const toggleAltText = () => {
  showAltText.value = !showAltText.value;
};

watch(
  () => props.node.attrs.caption,
  (newCaption) => {
    caption.value = newCaption || "";
  }
);

watch(
  () => props.node.attrs.alt,
  (newAltText) => {
    altText.value = newAltText || "";
  }
);

onMounted(() => {
  props.editor.commands.blur();
});
</script>
