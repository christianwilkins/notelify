import React, { useState, useEffect, useRef } from 'react';

const MarkdownEditor = () => {
  const [markdown, setMarkdown] = useState('');
  const editorRef = useRef(null); // Ref for the contentEditable div
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      // Set cursor position to the end of the text after state update
      setCaretToEnd();
    }
  }, [markdown]);

  const setCaretToEnd = () => {
    const range = document.createRange();
    const sel = window.getSelection();
    const childNodes = editorRef.current.childNodes;

    if (childNodes.length > 0) {
      const lastChild = childNodes[childNodes.length - 1];
      range.setStart(lastChild, lastChild.length || 0);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
    }
  };

  const handleDivInput = (e) => {
    // Update the state with the current content
    setMarkdown(e.currentTarget.textContent);
  };

  return (
    <div
      ref={editorRef}
      contentEditable
      onInput={handleDivInput}
      style={{
        width: '100%',
        minHeight: '200px',
        padding: '10px',
        border: '1px solid #ccc',
        lineHeight: '1.5',
        outline: 'none' // Removes default focus outline
      }}
      suppressContentEditableWarning={true}
    >
      {markdown}
    </div>
  );
};

export default MarkdownEditor;
