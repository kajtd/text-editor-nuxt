<template>
  <bubble-menu
    :editor="editor"
    :tippy-options="{ duration: 100 }"
    v-if="editor"
    :should-show="shouldShow"
    class="flex bg-white rounded-md shadow-md p-1 mb-2.5"
  >
    <div class="flex items-center relative">
      <button
        @click="toggleContentTypeMenu"
        :class="{ 'bg-gray-100/80': showContentTypeMenu }"
        class="flex items-center text-sm px-2.5 py-1.5 rounded hover:bg-gray-100/80"
      >
        {{ currentContentType }}
        <Icon name="mdi:chevron-down" class="w-3.5 h-3.5 ml-1" />
      </button>
      <div
        v-if="showContentTypeMenu"
        class="absolute top-full left-0 bg-white rounded-md shadow-md z-10 py-1.5 min-w-[140px]"
      >
        <button
          v-for="type in contentTypes"
          :key="type.name"
          @click="setContentType(type.command)"
          :class="{
            'bg-gray-100/80 rounded': editor.isActive(type.name, type.attrs),
          }"
          class="flex items-center justify-center w-full text-left px-3 py-2 hover:bg-gray-100/80 rounded"
        >
          <div
            class="border border-gray-200 rounded-full w-5 h-5 grid place-items-center"
          >
            <Icon :name="type.icon" class="w-2.5 h-2.5" />
          </div>
          <span class="flex-grow text-sm ml-2">{{ type.label }}</span>
        </button>
      </div>
    </div>
    <div class="w-px my-auto h-8 bg-gray-200/70 mx-1"></div>
    <div class="flex items-center space-x-2">
      <button
        v-for="action in textActions"
        :key="action.name"
        @click="action.command()"
        :class="{
          'bg-gray-100/80 text-gray-900': editor.isActive(action.name),
        }"
        :title="action.label"
        class="rounded hover:bg-gray-100/80 w-8 h-8 grid place-items-center"
      >
        <Icon :name="action.icon" class="h-5 w-5" />
      </button>
    </div>
    <div class="flex items-center relative">
      <button
        @click="toggleColorMenu"
        :class="{ 'bg-gray-100/80 text-gray-900': showColorMenu }"
        class="rounded hover:bg-gray-100/80 w-8 h-8 grid place-items-center"
        title="Text color"
      >
        <Icon name="material-symbols-light:format-color-text" class="w-5 h-5" />
      </button>
      <div
        v-if="showColorMenu"
        class="absolute top-full left-0 bg-white rounded-md shadow-md z-10 py-1.5"
      >
        <button
          v-for="color in colors"
          :key="color.name"
          @click="setTextColor(color.value)"
          :class="{
            'bg-gray-100/80': editor.isActive('textStyle', {
              color: color.value,
            }),
          }"
          class="flex items-center w-full text-left px-3 py-2 hover:bg-gray-100/80 rounded"
        >
          <span
            class="w-4 h-4 rounded-full mr-2 border-2 border-gray-200"
            :style="{ backgroundColor: color.value }"
          ></span>
          <span class="text-sm font-medium text-gray-600">{{
            color.name
          }}</span>
        </button>
      </div>
    </div>
  </bubble-menu>
</template>

<script setup lang="ts">
import { Editor, BubbleMenu } from "@tiptap/vue-3";
import type { EditorState } from "@tiptap/pm/state";
import type { EditorView } from "@tiptap/pm/view";

interface ContentType {
  name: string;
  label: string;
  icon: string;
  command: () => void;
  attrs?: Record<string, unknown>;
}

interface TextAction {
  name: string;
  label: string;
  icon: string;
  command: () => void;
}

interface Color {
  name: string;
  value: string;
}

const props = defineProps<{
  editor?: Editor;
}>();

const showContentTypeMenu = ref(false);
const showColorMenu = ref(false);

const shouldShow = (props: {
  editor: Editor;
  view: EditorView;
  state: EditorState;
  oldState?: EditorState;
  from: number;
  to: number;
}) => {
  const { state, from } = props;
  const { doc, selection } = state;
  const { empty } = selection;

  if (empty) return false;

  const nodeAtSelection = doc.nodeAt(from);
  if (nodeAtSelection && nodeAtSelection.type.name === "imageUpload") {
    return false;
  }

  return true;
};

const contentTypes: ContentType[] = [
  {
    name: "paragraph",
    label: "Text",
    icon: "mdi:text",
    command: () => props.editor?.chain().focus().setParagraph().run(),
  },
  {
    name: "heading",
    label: "Heading 1",
    icon: "mdi:format-header-1",
    command: () =>
      props.editor?.chain().focus().toggleHeading({ level: 1 }).run(),
    attrs: { level: 1 },
  },
  {
    name: "heading",
    label: "Heading 2",
    icon: "mdi:format-header-2",
    command: () =>
      props.editor?.chain().focus().toggleHeading({ level: 2 }).run(),
    attrs: { level: 2 },
  },
  {
    name: "heading",
    label: "Heading 3",
    icon: "mdi:format-header-3",
    command: () =>
      props.editor?.chain().focus().toggleHeading({ level: 3 }).run(),
    attrs: { level: 3 },
  },
  {
    name: "bulletList",
    label: "Bullet List",
    icon: "material-symbols-light:format-list-bulleted",
    command: () => props.editor?.chain().focus().toggleBulletList().run(),
  },
  {
    name: "orderedList",
    label: "Numbered List",
    icon: "material-symbols-light:format-list-numbered",
    command: () => props.editor?.chain().focus().toggleOrderedList().run(),
  },
  {
    name: "codeBlock",
    label: "Code Block",
    icon: "mdi:code-tags",
    command: () => props.editor?.chain().focus().toggleCodeBlock().run(),
  },
  {
    name: "blockquote",
    label: "Quote",
    icon: "mdi:format-quote-close",
    command: () => props.editor?.chain().focus().toggleBlockquote().run(),
  },
];

const textActions: TextAction[] = [
  {
    name: "bold",
    label: "Bold",
    icon: "material-symbols-light:format-bold",
    command: () => props.editor?.chain().focus().toggleBold().run(),
  },
  {
    name: "italic",
    label: "Italic",
    icon: "material-symbols-light:format-italic",
    command: () => props.editor?.chain().focus().toggleItalic().run(),
  },
  {
    name: "strike",
    label: "Strikethrough",
    icon: "material-symbols-light:format-strikethrough",
    command: () => props.editor?.chain().focus().toggleStrike().run(),
  },
  {
    name: "bulletList",
    label: "Bullet List",
    icon: "material-symbols-light:format-list-bulleted",
    command: () => props.editor?.chain().focus().toggleBulletList().run(),
  },
  {
    name: "orderedList",
    label: "Numbered List",
    icon: "material-symbols-light:format-list-numbered",
    command: () => props.editor?.chain().focus().toggleOrderedList().run(),
  },
];

const colors: Color[] = [
  { name: "Default", value: "inherit" },
  { name: "Gray", value: "#6B7280" },
  { name: "Brown", value: "#92400E" },
  { name: "Orange", value: "#EA580C" },
  { name: "Yellow", value: "#CA8A04" },
  { name: "Green", value: "#16A34A" },
  { name: "Blue", value: "#2563EB" },
  { name: "Purple", value: "#9333EA" },
  { name: "Pink", value: "#DB2777" },
  { name: "Red", value: "#DC2626" },
];

const currentContentType = computed(() => {
  if (props.editor?.isActive("heading", { level: 1 })) return "Heading 1";
  if (props.editor?.isActive("heading", { level: 2 })) return "Heading 2";
  if (props.editor?.isActive("heading", { level: 3 })) return "Heading 3";
  if (props.editor?.isActive("bulletList")) return "Bullet List";
  if (props.editor?.isActive("orderedList")) return "Numbered List";
  if (props.editor?.isActive("codeBlock")) return "Code Block";
  if (props.editor?.isActive("blockquote")) return "Quote";
  return "Text";
});

const toggleContentTypeMenu = () => {
  showContentTypeMenu.value = !showContentTypeMenu.value;
  showColorMenu.value = false;
};

const toggleColorMenu = () => {
  showColorMenu.value = !showColorMenu.value;
  showContentTypeMenu.value = false;
};

const setContentType = (command: () => void) => {
  command();
  showContentTypeMenu.value = false;
};

const setTextColor = (color: string) => {
  props.editor?.chain().focus().setColor(color).run();
  showColorMenu.value = false;
};
</script>
