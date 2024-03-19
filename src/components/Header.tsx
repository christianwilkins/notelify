// components/Header.tsx
const Header: React.FC = () => {
    return (
      <header className="flex justify-between items-center p-4 bg-var(--header-bg-color) text-var(--sidebar-active-color)">
      <h1 className="text-xl font-semibold">Your Notelify</h1>
      <button className="p-2 bg-var(--accent-color) rounded-full">
          <img src="/magic-wand.svg" alt="Add note" width="20px" height="20px"/>
          <span>Add Note</span>
        </button>
      </header>
    );
  };
  
  export default Header;
  