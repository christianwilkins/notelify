import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Typography from '@tiptap/extension-typography';
import Placeholder from '@tiptap/extension-placeholder';
import { markPasteRule } from '@tiptap/core'

const TiptapEditor = () => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Typography,
      Placeholder.configure({
        placeholder: ({ node}) => {
          const headingPlaceholders: { [key: number]: string } = {
            1: "Heading 1",
            2: "Heading 2",
            3: "Heading 3",
          };

          if (node.type.name === "heading") {
            return headingPlaceholders[node.attrs.level];
          }
          return "";
        },
      }),
    ],
    onUpdate: ({ editor }) => {
      const transaction = editor.state.tr.setMeta('forceUpdatePlaceholder', true);
      editor.view.dispatch(transaction);
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div style={{
      minHeight: '1000px',
      maxWidth: '800px', 
      minWidth: '500px', 
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

