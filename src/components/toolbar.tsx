import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Typography from '@tiptap/extension-typography';
import Placeholder from '@tiptap/extension-placeholder';

const TiptapEditor = () => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Typography,
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === 'heading') {
            return 'Type your header here...';
          }
          return 'Begin typing here...';
        },
      }),
    ],
    content: '<p>Hello World! 🌍</p>',
  });

  if (!editor) {
    return null;
  }

  return (
    <div style={{ minHeight: '400px', minWidth:'900px', overflow: 'auto' }}>
      <EditorContent className="markdownPreview" editor={editor} />
    </div>
  );
};

export default TiptapEditor;

