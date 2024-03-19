// pages/index.tsx
import type { NextPage } from 'next';
import Sidebar from '../components/NewSidebar';
import Header from '../components/Header';
import NotePreview from '../components/NotePreview';

const Home: NextPage = () => {
  const notes = [
    { id: 1, title: 'Note 1 Title', summary: 'This is a shortened summary of the actual note.' },
    // ...other notes
  ];

  return (
    <div className="flex h-screen bg-black">
      <aside className="w-60">
        <Sidebar />
      </aside>
      <main className="flex-1 flex flex-col">
        <Header />
        <div className="p-4 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {notes.map((note) => (
              <NotePreview key={note.id} title={note.title} summary={note.summary} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
