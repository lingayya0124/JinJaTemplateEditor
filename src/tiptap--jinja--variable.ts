import {
  Mark,
  markInputRule,
  markPasteRule,
  mergeAttributes
} from "@tiptap/core";
export interface BoldOptions {
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

export const starInputRegex = /(?:^|\s)((?:\*\*)|\{\{)([^*}]+)(?:\*\*|\}\})$/;
export const starPasteRegex = /(?:^|\s)((?:\*\*)((?:[^*]+))(?:\*\*))/g;
export const underscoreInputRegex = /(?:^|\s)((?:__)((?:[^__]+))(?:__))$/;
export const underscorePasteRegex = /(?:^|\s)((?:__)((?:[^__]+))(?:__))/g;

export const tiptapJinjaVariable = Mark.create<BoldOptions>({
  name: "tiptap--jinja--variable",

  addOptions() {
    return {
      HTMLAttributes: {}
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
        tag: "tiptap--jinja--variable"
      }
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "tiptap--jinja--variable",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        "data-type": this.name
      })
    ];
  },

  addCommands() {
    return {
      setBold: () => ({ commands }) => {
        return commands.setMark(this.name);
      },
      toggleBold: () => ({ commands }) => {
        return commands.toggleMark(this.name);
      },
      unsetBold: () => ({ commands }) => {
        return commands.unsetMark(this.name);
      }
    };
  },

  addKeyboardShortcuts() {
    return {
      "Mod-b": () => this.editor.commands.toggleBold(),
      "Mod-B": () => this.editor.commands.toggleBold()
    };
  },

  addInputRules() {
    return [
      markInputRule({
        find: starInputRegex,
        type: this.type
      }),
      markInputRule({
        find: underscoreInputRegex,
        type: this.type
      })
    ];
  },

  addPasteRules() {
    return [
      markPasteRule({
        find: starPasteRegex,
        type: this.type
      }),
      markPasteRule({
        find: underscorePasteRegex,
        type: this.type
      })
    ];
  }
});
