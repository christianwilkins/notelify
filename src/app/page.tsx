// pages/index.tsx
import type { NextPage } from 'next';
import Sidebar from '../components/NewSidebar';
import Header from '../components/Header';
import NotePreview from '../components/NotePreview';

const Home: NextPage = () => {
  // Dummy data for the notes list
  const notes = [
    { id: 1, title: 'Note 1 Title', summary: 'This is a shortened summary of the actual note.' },
    { id: 2, title: 'Note 2 Title', summary: 'This is a shortened summary of the actual note.' },
    { id: 3, title: 'Note 3 Title', summary: 'This is a shortened summary of the actual note.' },
    { id: 4, title: 'Note 4 Title', summary: 'This is a shortened summary of the actual note.' },
    { id: 5, title: 'Note 5 Title', summary: 'This is a shortened summary of the actual note.' },
    // ... add more notes as needed
  ];

  return (
    <div className="flex h-screen bg-gray-800">
      <aside className="w-1/5 bg-gray-900 p-4">
        <Sidebar />
      </aside>
      <main className="flex-1 overflow-hidden">
        <Header />
        <div className="p-4 overflow-y-auto">
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
