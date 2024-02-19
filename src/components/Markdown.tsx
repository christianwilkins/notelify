import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import styles from "./MarkdownEditor.module.css";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ value, onChange }) => {
  const [markdown, setMarkdown] = useState("");
  const [isEditing, setIsEditing] = useState(true);
  const editorRef = useRef(null);
  const selectionRef = React.useRef<number | null>(null);

  useEffect(() => {
    if (isEditing && editorRef.current && selectionRef.current !== null) {
      const sel = window.getSelection();
      const range = document.createRange();
      const textNodes = getTextNodes(editorRef.current);

      let position: number | null = null; // Provide a valid initial value for position
      for (const node of textNodes) {
        if (
          node.nodeType === Node.TEXT_NODE &&
          node.textContent &&
          position !== null &&
          position <= node.textContent.length
        ) {
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
          if (
            node.nodeType === Node.TEXT_NODE &&
            node.textContent &&
            typeof node.textContent === "string"
          ) {
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

  const handleContentEditableInput = (e: {
    target: { innerText: React.SetStateAction<string> };
  }) => {
    // Save the current cursor position before updating the state
    const anchorOffset = window.getSelection()?.anchorOffset;
    if (anchorOffset !== undefined) {
      selectionRef.current = anchorOffset;
    } else {
      selectionRef.current = null;
    }
    onChange(e.target.innerText);
  };

  const handleTextareaChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    onChange(e.target.value);
  };

  const switchToEdit = () => {
    setIsEditing(true);
  };

  const switchToPreview = () => {
    setIsEditing(false);
  };

  /* const handleTextareaChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setMarkdown(e.target.value);
  }; */

  const handleKeyDown = (e: { key: string; preventDefault: () => void }) => {
    if (e.key === "Enter") {
      document.execCommand("insertHTML", false, "\n"); // insert a newline character
      e.preventDefault(); // prevent the default behavior
    }
  };

  return (
    <div
      className="styles.markdownEditor"
      onDoubleClick={switchToEdit}
      style={{ width: "100%", maxWidth: "800px", margin: "auto" }}
    >
      {isEditing ? (
        <textarea
          ref={editorRef}
          onChange={handleTextareaChange}
          onKeyDown={handleKeyDown}
          onBlur={switchToPreview}
          suppressContentEditableWarning={true}
          style={{
            width: "100%", // Use 100% of the container's width
            minHeight: "200px", // Minimum height to start with
            maxHeight: "600px", // Maximum height before scrolling
            padding: "10px",
            border: "1px solid #ccc",
            lineHeight: "1.5",
            outline: "none",
            overflowY: "auto", // Enable vertical scroll
            resize: "vertical", // Allow only vertical resizing
            boxSizing: "border-box", // Include padding and border in the element's width and height
            backgroundColor: isEditing ? "black" : "", // Set background color to black when editing
            color: isEditing ? "white" : "", // Ensure text color is white when editing
          }}
        >
          {markdown}
        </textarea>
      ) : (
        <div className={styles.markdownPreview}>
          <ReactMarkdown remarkPlugins={[remarkGfm]} children={markdown} />
        </div>
      )}
    </div>
  );
};

export default MarkdownEditor;
