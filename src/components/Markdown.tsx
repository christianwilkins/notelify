import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const MarkdownEditor = () => {
  const [markdown, setMarkdown] = useState('');
  const [editing, setEditing] = useState(true);

  const handleDivContentChange = (e) => {
    setMarkdown(e.currentTarget.textContent);
  };

  useEffect(() => {
    const div = document.querySelector('.markdown-editor div[contenteditable]');
    if (div) {
      div.innerHTML = markdown;
    }
  }, [markdown]);

  return (
    <div className="markdown-editor">
      {editing ? (
        <div
          contentEditable
          onInput={handleDivContentChange}
          onBlur={() => setEditing(false)}
          style={{
            width: '100%',
            minHeight: '200px',
            padding: '10px',
            border: '1px solid #ccc',
          }}
        >
          {markdown}
        </div>
      ) : (
        <div onClick={() => setEditing(true)}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
        </div>
      )}
    </div>
  );
};

export default MarkdownEditor;
