import { VueRenderer } from "@tiptap/vue-3";
import tippy, { Instance as TippyInstance } from "tippy.js";
import { Editor, Range } from "@tiptap/core";
import CommandsList from "~/components/CommandsList.vue";

interface SuggestionItem {
  name: string;
  description: string;
  icon: string;
  command: (props: { editor: Editor; range: Range }) => void;
}

interface SuggestionProps {
  query: string;
  editor: Editor;
  range: Range;
  clientRect: () => DOMRect;
}

const items: SuggestionItem[] = [
  {
    name: "Text",
    description: "Just start writing with plain text.",
    icon: "mdi:text",
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setParagraph().run();
    },
  },
  {
    name: "Heading 1",
    description: "Big section heading.",
    icon: "mdi:format-header-1",
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode("heading", { level: 1 })
        .run();
    },
  },
  {
    name: "Heading 2",
    description: "Medium section heading.",
    icon: "mdi:format-header-2",
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode("heading", { level: 2 })
        .run();
    },
  },
  {
    name: "Heading 3",
    description: "Small section heading.",
    icon: "mdi:format-header-3",
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode("heading", { level: 3 })
        .run();
    },
  },
  {
    name: "Bullet List",
    description: "Create a simple bullet list.",
    icon: "mdi:format-list-bulleted",
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBulletList().run();
    },
  },
  {
    name: "Numbered List",
    description: "Create a list with numbering.",
    icon: "mdi:format-list-numbered",
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleOrderedList().run();
    },
  },
  {
    name: "Quote",
    description: "Capture a quote.",
    icon: "mdi:format-quote-close",
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBlockquote().run();
    },
  },
  {
    name: "Code Block",
    description: "Add a code block with syntax highlighting",
    icon: "mdi:code-tags",
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode("codeBlock").run();
    },
  },
  {
    name: "Image",
    description: "Edit an image",
    icon: "mdi:image",
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertContent({
          type: "imageEditor",
          attrs: {},
        })
        .run();
    },
  },
  {
    name: "Divider",
    description: "Insert a horizontal divider.",
    icon: "mdi:minus",
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setHorizontalRule().run();
    },
  },
];

export const suggestion = {
  items: ({ query }: { query: string }): SuggestionItem[] => {
    return items.filter((item) =>
      item.name.toLowerCase().startsWith(query.toLowerCase())
    );
  },

  render: () => {
    let component: VueRenderer;
    let popup: TippyInstance[];

    return {
      onStart: (props: SuggestionProps) => {
        component = new VueRenderer(CommandsList, {
          props,
          editor: props.editor,
        });

        if (!props.clientRect) {
          return;
        }

        popup = tippy("body", {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: "manual",
          placement: "bottom-start",
        });
      },

      onUpdate(props: SuggestionProps) {
        component.updateProps(props);

        if (!props.clientRect) {
          return;
        }

        popup[0].setProps({
          getReferenceClientRect: props.clientRect,
        });
      },

      onKeyDown(props: { event: KeyboardEvent }) {
        if (props.event.key === "Escape") {
          popup[0].hide();
          return true;
        }

        return component.ref?.onKeyDown(props.event);
      },

      onExit() {
        popup[0].destroy();
        component.destroy();
      },
    };
  },
};

export default suggestion;
