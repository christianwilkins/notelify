import React, { useEffect } from 'react';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Typography from '@tiptap/extension-typography';
import Placeholder from '@tiptap/extension-placeholder';
import { Markdown } from "tiptap-markdown";
import TiptapUnderline from "@tiptap/extension-underline";

interface TiptapEditorProps {
  onEditorReady?: (editor: Editor) => void; // Callback prop to pass the editor instance to the parent
}

const TiptapEditor: React.FC<TiptapEditorProps> = ({ onEditorReady }) => {
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

  useEffect(() => {
    if (editor) {
      onEditorReady?.(editor);
    }
    return () => {
    };
  }, [onEditorReady]);

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
};

export default TiptapEditor;


