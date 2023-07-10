import { Extension } from "@tiptap/core";

import {
  JinjaVariableOptions,
  tiptapJinjaVariable
} from "./tiptap--jinja--variable";
import {
  JinjaCommentOptions,
  tiptapJinjaComment
} from "./tiptap--jinja--comment";

export interface StarterKitOptions {
  tiptap_jinja_comment: Partial<JinjaCommentOptions> | false;
  tiptap_jinja_variable: Partial<JinjaVariableOptions> | false;
}

export const JinjaStarter = Extension.create<StarterKitOptions>({
  name: "starterKit",

  addExtensions() {
    const extensions = [];

    if (this.options.tiptap_jinja_comment !== false) {
      extensions.push(
        tiptapJinjaComment.configure(this.options?.tiptap_jinja_comment)
      );
    }
    if (this.options.tiptap_jinja_variable !== false) {
      extensions.push(
        tiptapJinjaVariable.configure(this.options?.tiptap_jinja_variable)
      );
    }

    return extensions;
  }
});
