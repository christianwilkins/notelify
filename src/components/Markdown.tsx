  import React, { useState, useEffect, useRef } from 'react';
  import ReactMarkdown from 'react-markdown';
  import remarkGfm from 'remark-gfm';

  const MarkdownEditor = () => {
    const [markdown, setMarkdown] = useState('');
    const [isEditing, setIsEditing] = useState(true);
    const editorRef = useRef(null);
    const selectionRef = useRef(null);

    useEffect(() => {
      if (isEditing && editorRef.current && selectionRef.current !== null) {
        const sel = window.getSelection();
        const range = document.createRange();
        const textNodes = getTextNodes(editorRef.current);
    
        let position = selectionRef.current;
        for (const node of textNodes) {
            if (node.nodeType === Node.TEXT_NODE && node.textContent && position <= node.textContent.length) {
            range.setStart(node, position);
            range.collapse(true);
            if (sel) {
              sel.removeAllRanges();
            }
            if (sel) {
              sel.addRange(range);
            }
            break;
          } else {
            if (node.nodeType === Node.TEXT_NODE && node.textContent && typeof node.textContent === 'string') {
              if (position !== null) {
                position = position - node.textContent.length;
              } else {
                position = null;
              }
            }
          }
        }
      }
    }, [markdown, isEditing]);
    
    // Helper function to get all text nodes inside a parent node
    function getTextNodes(node: Node): Node[] {
      const textNodes: Node[] = [];
      if (!node) {
        return textNodes;
      }
    
      if (node.nodeType === Node.TEXT_NODE) {
        textNodes.push(node);
      } else {
        const children = node.childNodes;
        for (let i = 0; i < children.length; i++) {
          textNodes.push(...getTextNodes(children[i]));
        }
      }
    
      return textNodes;
    }
    
    const handleContentEditableInput = (e) => {
      // Save the current cursor position before updating the state
      const anchorOffset = window.getSelection()?.anchorOffset;
      if (anchorOffset !== undefined) {
        selectionRef.current = anchorOffset;
      } else {
        selectionRef.current = null;
      }
      setMarkdown(e.target.innerText);
    };

    const switchToEdit = () => {
      setIsEditing(true);
    };

    const switchToPreview = () => {
      setIsEditing(false);
    };

    return (
      <div className="markdown-editor" onClick={switchToEdit}>
        {isEditing ? (
          <div
            ref={editorRef}
            contentEditable
            onInput={handleContentEditableInput}
            onBlur={switchToPreview}
            suppressContentEditableWarning={true}
            style={{
              minHeight: '200px',
              padding: '10px',
              border: '1px solid #ccc',
              lineHeight: '1.5',
              outline: 'none',
            }}
          >
            {markdown}
          </div>
        ) : (
          <ReactMarkdown remarkPlugins={[remarkGfm]} children={markdown} />
        )}
      </div>
    );
  };

  export default MarkdownEditor;
