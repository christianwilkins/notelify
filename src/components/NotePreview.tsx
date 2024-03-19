// components/NotePreview.tsx
interface NotePreviewProps {
    title: string;
    summary: string;
  }
  
  const NotePreview: React.FC<NotePreviewProps> = ({ title, summary }) => {
    return (
      <div className="border border-var(--note-border-color) rounded p-4 bg-var(--note-bg-color) text-var(--note-text-color) shadow-md">
      <h2 className="text-lg font-bold">{title}</h2>
      <p className="text-sm">{summary}</p>
      </div>
    );
  };
  
  export default NotePreview;
  