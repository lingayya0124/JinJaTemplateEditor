import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { tiptapJinjaVariable } from "./tiptap--jinja--variable";
import { tiptapJinjaComment } from "./tiptap--jinja--comment";

import "./style.css";
import { useEffect, useState } from "react";
interface Values {
  unique: string[];
  duplicates: string[];
}
export default function Editor() {
  const [variableValues, setVariableValues] = useState<Values>({} as Values);
  const [commentValues, setCommentValues] = useState<Values>({} as Values);

  const editor = useEditor({
    extensions: [StarterKit, tiptapJinjaVariable, tiptapJinjaComment],
    content: `<p>
    This is still the text editor you’re used to, but enriched with node views.
  </p>
  <react-component count="0"></react-component>
  <p>
    Did you see that? That’s a React component. We are really living in the future.
  </p>`
  });

  const handleApplyCustomMark = () => {
    editor!.chain().focus().toggleMark("tiptap--jinja--variable").run();
  };
  const handleApplyCustomComment = () => {
    editor!.chain().focus().toggleMark("tiptap--jinja--comment").run();
  };
  const html = editor ? editor?.getHTML() : "";
  const doc = new DOMParser().parseFromString(html, "text/html");

  useEffect(() => {
    const getValues = (tagName: string) => {
      const elements = Array.from(doc.getElementsByTagName(tagName));
      const uniqueValues: string[] = [];
      const duplicateValues: Set<string> = new Set();

      elements.forEach((element) => {
        const value = element.textContent;

        if (uniqueValues.includes(value!)) {
          duplicateValues.add(value!);
        } else {
          uniqueValues.push(value!);
        }
      });

      return { unique: uniqueValues, duplicates: Array.from(duplicateValues) };
    };
    setCommentValues(getValues("tiptap--jinja--comment"));
    setVariableValues(getValues("tiptap--jinja--variable"));
  }, [html]);

  console.log("variable:", variableValues.unique);
  console.log("comment:", commentValues.unique);
  console.log("Duplicate variables:", variableValues.duplicates);
  console.log("Duplicate comment", commentValues.duplicates);

  return (
    <div>
      <EditorContent editor={editor} />
      <button onClick={handleApplyCustomMark}>Apply Custom Variable </button>
      <button onClick={handleApplyCustomComment}>Apply Custom Comment</button>
    </div>
  );
}
