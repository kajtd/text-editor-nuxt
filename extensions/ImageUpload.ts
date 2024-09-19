import { Node, mergeAttributes } from "@tiptap/core";
import { VueNodeViewRenderer } from "@tiptap/vue-3";
import ImageUpload from "~/components/ImageUpload.vue";

export interface ImageUploadAttributes {
  src: string | null;
  alt: string | null;
  caption: string | null;
}

export const ImageUploadNode = Node.create<never, ImageUploadAttributes>({
  name: "imageUpload",

  group: "block",
  selectable: true,

  atom: true,
  draggable: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      alt: {
        default: undefined,
      },
      caption: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "image-upload",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["image-upload", mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return VueNodeViewRenderer(ImageUpload);
  },
});

export default ImageUploadNode;
