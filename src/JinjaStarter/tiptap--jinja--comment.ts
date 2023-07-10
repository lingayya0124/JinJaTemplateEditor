import {
  ReactNodeViewRenderer,
  NodeViewWrapper,
  NodeViewContent,
} from "@tiptap/react";
import {
  Mark,
  markInputRule,
  markPasteRule,
  mergeAttributes,
  Node,
} from "@tiptap/core";
import { Node as ProseMirrorNode } from "@tiptap/pm/model";
export interface JinjaCommentOptions {
  HTMLAttributes: Record<string, any>;
}
// import Component from "./Component";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    bold: {
      /**
       * Set a bold mark
       */
      setBold: () => ReturnType;
      /**
       * Toggle a bold mark
       */
      toggleBold: () => ReturnType;
      /**
       * Unset a bold mark
       */
      unsetBold: () => ReturnType;
    };
  }
}

export const starInputRegex = /(?:^|\s)\{#([^}]+)#\}$/;
export const starPasteRegex = /(?:^|\s)((?:\*\*)((?:[^*]+))(?:\*\*))/g;
export const underscoreInputRegex = /(?:^|\s)((?:__)((?:[^__]+))(?:__))$/;
export const underscorePasteRegex = /(?:^|\s)((?:__)((?:[^__]+))(?:__))/g;

export const tiptapJinjaComment = Mark.create<JinjaCommentOptions>({
  name: "tiptap--jinja--comment",
  group: "block",

  // spanning: true,
  // exitable: false,
  // onUpdate() {
  //   console.log(this.editor);
  // },
  // onSelectionUpdate() {
  //   console.log(this.editor);
  // },
  addStorage() {
    return {
      values: ["sfsf"],
    };
  },
  // onSelectionUpdate() {
  //   console.log(
  //     this.editor,
  //     this.name,
  //     this.options,
  //     this.parent,
  //     this.storage,
  //     this.type
  //   );
  // },
  // onTransaction() {
  //   console.log(
  //     this.editor,
  //     this.name,
  //     this.options,
  //     this.parent,
  //     this.storage,
  //     this.type
  //   );
  // },
  // onUpdate() {
  //   console.log(
  //     this.editor,
  //     this.name,
  //     this.options,
  //     this.parent,
  //     this.storage,
  //     this.type
  //   );
  //   this.storage.values.push(this.options);
  // },
  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  // addAttributes() {
  //   return {
  //     attrs: {
  //       default: { color: "blue" },
  //       parseHTML: (element) => element.getAttribute("data-text-color"),
  //       renderHTML: ({ attrs }) => {
  //         if (!attrs || !attrs.color) {
  //           return {};
  //         }
  //         const { color, ...leftAttrs } = attrs;
  //         if (!leftAttrs.style || typeof leftAttrs.style !== "string") {
  //           leftAttrs.style = "";
  //         }
  //         leftAttrs.style = `color: ${color}; ${leftAttrs.style}`;
  //         console.log(leftAttrs, attrs);
  //         return {
  //           "data-text-color": color,
  //           class: "bold",
  //           ...leftAttrs
  //         };
  //       }
  //     }
  //   };
  // },

  parseHTML() {
    return [
      {
        tag: "tiptap--jinja--comment",
        preserveWhitespace: "full",
      },
    ];
  },

  renderHTML({ mark, HTMLAttributes }) {
    return [
      "tiptap--jinja--comment",
      // ["p", 0]
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        "data-type": this.name,
      }),
      [
        "text",
        // {
        //   class: mark.attrs.language
        //     ? this.options.languageClassPrefix + mark.attrs.language
        //     : null
        // },
        0,
      ],
    ];
  },

  addCommands() {
    return {
      setBold:
        () =>
        ({ commands }) => {
          console.log(this.options);

          return commands.setMark(this.name);
        },
      toggleBold:
        () =>
        ({ commands }) => {
          console.log(this.editor);
          return commands.toggleMark(this.name);
        },
      unsetBold:
        () =>
        ({ commands }) => {
          return commands.unsetMark(this.name);
        },
    };
  },

  addKeyboardShortcuts() {
    return {
      // Enter: () => this.editor.commands.setHardBreak()
    };
  },
  addInputRules() {
    return [
      markInputRule({
        find: starInputRegex,
        type: this.type,
      }),
      markInputRule({
        find: underscoreInputRegex,
        type: this.type,
      }),
    ];
  },

  addPasteRules() {
    return [
      markPasteRule({
        find: starPasteRegex,
        type: this.type,
      }),
      markPasteRule({
        find: underscorePasteRegex,
        type: this.type,
      }),
    ];
  },
});
