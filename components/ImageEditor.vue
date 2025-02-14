<template>
  <node-view-wrapper>
    <div ref="containerRef">
      <div v-if="!initialImage && !props.node.attrs.src" class="relative">
        <div
          class="cursor-pointer border rounded-lg w-full bg-white text-black border-gray-300/80 shadow-xs h-96 flex flex-col items-center justify-center"
          @click="onImageClick"
        >
          <input
            type="file"
            accept="image/*"
            ref="fileInput"
            class="hidden"
            @change="handleFileSelect"
          />
          <div
            class="bg-gray-300/30 rounded-full w-8 h-8 grid place-items-center"
          >
            <Icon name="solar:add-folder-bold" class="w-3.5 h-3.5 text-black" />
          </div>
          <p class="text-sm font-medium">Upload Image</p>
        </div>
        <ImageActionMenu v-if="isSelected" :actions="actionItems" />
      </div>

      <div v-else-if="initialImage && !props.node.attrs.src" class="h-[80vh]">
        <PinturaEditor
          v-bind="editorProps"
          :src="initialImage"
          @pintura:load="handleInlineLoad"
          @pintura:process="handleProcess"
        />
      </div>

      <div v-else class="relative">
        <img
          :src="props.node.attrs.src"
          alt="Processed image"
          class="w-full object-contain transition-all"
          :class="{
            'ring-2 ring-offset-2 ring-gray-300/30 rounded-md': isSelected,
          }"
          @click="onImageClick"
        />
        <ImageActionMenu v-if="isSelected" :actions="actionItems" />
      </div>
    </div>
  </node-view-wrapper>
</template>

<script setup lang="ts">
import { NodeViewWrapper } from "@tiptap/vue-3";
import "@pqina/pintura/pintura.css";
import { PinturaEditor } from "@pqina/vue-pintura";
import { getEditorDefaults, createDefaultImageWriter } from "@pqina/pintura";
import type { Editor } from "@tiptap/core";

const props = defineProps<{
  node: { attrs: { src: string | undefined }; nodeSize: number };
  updateAttributes: (attrs: { src: string | undefined }) => void;
  editor: Editor;
}>();

const containerRef = ref<HTMLElement | null>(null);
const initialImage = ref<string | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);
const editorProps = {
  ...getEditorDefaults(),
  imageWriter: createDefaultImageWriter({
    quality: 0.7,
    mimeType: "image/webp",
  }),
};
const isSelected = ref(false);

const actionItems = computed(() => [
  {
    label: props.node.attrs.src ? "Replace" : "Upload",
    icon: props.node.attrs.src
      ? "solar:refresh-circle-linear"
      : "solar:add-folder-bold",
    handler: replaceImage,
  },
  {
    label: "Remove",
    icon: "mdi:trash-can",
    handler: removeImage,
  },
]);

function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    initialImage.value = URL.createObjectURL(file);
  }
}

function handleInlineLoad(event: CustomEvent) {
  console.log("Pintura load event:", event);
}

async function handleProcess(event: CustomEvent) {
  console.log("Pintura process event:", event);
  const processedFile: Blob = event.detail.dest;
  await finalizeImage(processedFile);
}

async function finalizeImage(file: Blob) {
  console.log("Finalizing image, processed image blob:", file);
  const processedImageUrl = URL.createObjectURL(file);
  props.updateAttributes({ src: processedImageUrl });
}

function onImageClick() {
  isSelected.value = !isSelected.value;
}

function replaceImage() {
  isSelected.value = false;
  props.updateAttributes({ src: undefined });
  initialImage.value = null;
  fileInput.value?.click();
}

function removeImage() {
  props.editor.commands.deleteSelection();
}

function handleClickOutside() {
  if (isSelected.value) {
    isSelected.value = false;
  }
}

function onDocumentClick(event: MouseEvent) {
  if (
    !containerRef.value ||
    containerRef.value.contains(event.target as Node)
  ) {
    return;
  }
  handleClickOutside();
}

onMounted(() => {
  document.addEventListener("click", onDocumentClick);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", onDocumentClick);
});
</script>
