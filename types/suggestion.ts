import { Editor, Range } from "@tiptap/core";

export type SuggestionItem = {
  name: string;
  description: string;
  icon: string;
  command: (props: { editor: Editor; range: Range }) => void;
};
