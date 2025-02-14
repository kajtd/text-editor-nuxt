<template>
  <div class="relative inline-block text-left">
    <button
      @click="exportDocument"
      class="inline-flex items-center gap-2 px-3 py-1.5 border border-gray-300/90 shadow-xs text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-400/80"
    >
      Export
      <Icon name="mdi:language-markdown" class="size-5" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { Editor } from "@tiptap/vue-3";
import type { JSONContent } from "@tiptap/core";

interface Props {
  editor?: Editor;
}

const props = defineProps<Props>();

interface MarkType {
  type: string;
}

interface TextNode {
  type: "text";
  text: string;
  marks?: MarkType[];
}

interface ContentNode {
  type: string;
  attrs?: Record<string, unknown>;
  content?: (ContentNode | TextNode)[];
}

const exportDocument = () => {
  try {
    const json = props.editor?.getJSON();
    if (json) {
      const markdown = convertToMarkdown(json);
      downloadMarkdown(markdown);
    }
  } catch (error) {
    console.error("Error during export:", error);
  }
};

const convertToMarkdown = (json: JSONContent): string => {
  let markdown = "";

  const processNode = (node: ContentNode | TextNode): string => {
    switch (node.type) {
      case "paragraph":
        return processContentNodes(node.content) + "\n\n";
      case "heading":
        const level = "#".repeat(node.attrs?.level as number);
        return `${level} ${processContentNodes(node.content)}\n\n`;
      case "text":
        return isTextNode(node) ? processTextNode(node) : "";
      case "bulletList":
        return processListItems(node.content, "- ") + "\n";
      case "orderedList":
        return (
          processListItems(node.content, (index: number) => `${index + 1}. `) +
          "\n"
        );
      case "listItem":
        return processContentNodes(node.content).trim();
      case "codeBlock":
        const code = processContentNodes(node.content);
        const language = node.attrs?.language || "";
        return `\`\`\`${language}\n${code}\n\`\`\`\n\n`;
      case "blockquote":
        return (
          node.content?.map((n: any) => `> ${processNode(n)}`).join("") + "\n\n"
        );
      case "horizontalRule":
        return "___\n\n";
      case "imageEditor": {
        const { src, alt, caption } = node.attrs as {
          src: string;
          alt?: string;
          caption?: string;
        };
        return src
          ? `![${alt || "Image"}](${src}${caption ? ` "${caption}"` : ""})\n\n`
          : "";
      }
      default:
        return "";
    }
  };

  const isTextNode = (node: ContentNode | TextNode): node is TextNode => {
    return node.type === "text" && "text" in node;
  };

  const processContentNodes = (
    content?: (ContentNode | TextNode)[]
  ): string => {
    return content?.map(processNode).join("") || "";
  };

  const processTextNode = (node: TextNode): string => {
    let text = node.text;
    if (node.marks) {
      node.marks.forEach((mark) => {
        switch (mark.type) {
          case "bold":
            text = `**${text}**`;
            break;
          case "italic":
            text = `*${text}*`;
            break;
          case "code":
            text = `\`${text}\``;
            break;
        }
      });
    }
    return text;
  };

  const processListItems = (
    content: (ContentNode | TextNode)[] | undefined,
    prefix: string | ((index: number) => string)
  ): string => {
    if (!content) return "";
    return (
      content
        .map((item, index) => {
          const itemPrefix =
            typeof prefix === "function" ? prefix(index) : prefix;
          return `${itemPrefix}${processNode(item)}`;
        })
        .join("\n") + "\n"
    );
  };

  if (Array.isArray(json.content)) {
    json.content.forEach((node) => {
      markdown += processNode(node as TextNode);
    });
  }

  return markdown.trim();
};

const downloadMarkdown = (markdown: string) => {
  const blob = new Blob([markdown], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "exported_document.md";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
</script>
