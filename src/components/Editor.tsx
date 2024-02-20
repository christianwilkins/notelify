import React, { useEffect, forwardRef, useImperativeHandle } from 'react';
import { useEditor, EditorContent, Editor, Content } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Typography from '@tiptap/extension-typography';
import Placeholder from '@tiptap/extension-placeholder';
import { Markdown } from "tiptap-markdown";
import TiptapUnderline from "@tiptap/extension-underline";

export interface ModifiedEditorHandle {
  setContent: (content: string) => void;
  appendContent: (content: string) => void;
}

const TiptapEditor = forwardRef<ModifiedEditorHandle>((props, ref) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Typography,
      Placeholder.configure({
        placeholder: ({ node, editor }) => {
          if (editor.isEmpty) {
            return "Untitled";
          }
          const headingPlaceholders: { [key: number]: string } = {
            1: "Heading 1",
            2: "Heading 2",
            3: "Heading 3",
          };
          return headingPlaceholders[node.attrs.level] || '';
        },
      }),
      Markdown.configure({
        html: false,
        transformCopiedText: true,
        transformPastedText: true,
      }),
      TiptapUnderline,
    ],
    enablePasteRules: true,
    onUpdate: ({ editor }) => {
      const transaction = editor.state.tr.setMeta('forceUpdatePlaceholder', true);
      editor.view.dispatch(transaction);
    },
  });

  useImperativeHandle(ref, () => ({
    setContent: (content: string) => {
      editor?.commands.setContent(content);
    },
    appendContent: (content: string) => {
      if (editor) {
        if (!editor.isEmpty) {
          editor.chain().focus().insertContent(content).run();
        } else {
          editor.commands.setContent(content);
        }
      }
    },
  }));

  useEffect(() => {
    if (editor) {
      editor.commands.setContent("Notes will be generated here...");
    }
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div style={{
      minHeight: '1000px',
      maxWidth: '800px', 
      minWidth: '1500px', 
      width: '80%', 
      margin: 'auto', 
      overflow: 'auto',
      padding: '20px',
    }}>    
      <EditorContent className="markdownPreview" editor={editor} />
    </div>
  );
});

export default TiptapEditor;


