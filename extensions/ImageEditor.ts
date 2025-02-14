import { Node, mergeAttributes } from "@tiptap/core";
import { VueNodeViewRenderer } from "@tiptap/vue-3";
import ImageEditor from "~/components/ImageEditor.vue";

export interface ImageEditorAttributes {
  src?: string;
}

export const ImageEditorNode = Node.create<ImageEditorAttributes>({
  name: "imageEditor",
  group: "block",
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="image-editor"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, { "data-type": "image-editor" }),
    ];
  },

  addNodeView() {
    return VueNodeViewRenderer(ImageEditor);
  },
});
