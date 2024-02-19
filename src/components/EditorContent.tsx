import React, { createContext, useContext, ReactNode, useState } from "react";
import { Editor } from "@tiptap/react";

interface EditorContextType {
  editor: Editor | null;
  setEditor: (editor: Editor | null) => void;
  setContent: (content: string) => void;
  appendContent: (content: string) => void;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

interface EditorProviderProps {
  children: ReactNode;
}

export const EditorProvider: React.FC<EditorProviderProps> = ({ children }) => {
  const [editor, setEditor] = useState<Editor | null>(null);

  const setContent = (content: string) => {
    if (editor) {
      editor.commands.setContent(content);
    }
  };

  const appendContent = (content: string) => {
    // Implement the appendContent method
    if (editor) {
      const currentContent = editor.getHTML();
      editor.commands.setContent(`${currentContent}${content}`, false); // The 'false' parameter ensures the content is appended, not replaced
    }
  };

  return (
    <EditorContext.Provider
      value={{ editor, setEditor, setContent, appendContent }}
    >
      {children}
    </EditorContext.Provider>
  );
};

export const useEditorContext = (): EditorContextType => {
  const context = useContext(EditorContext);
  if (context === undefined) {
    throw new Error("useEditorContext must be used within a EditorProvider");
  }
  return context;
};
