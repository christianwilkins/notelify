// ./src/components/NewSidebar.tsx
'use client'
import { useRouter } from 'next/navigation';

export const config = { amp: 'hybrid' }; // If you're using AMP

const navigation = [
    { name: 'Dashboard', href: '/' },
    { name: 'Users', href: '/users' },
    { name: 'Settings', href: '/settings' },
];

const NewSidebar = () => {
  const router = useRouter();

  const handleNavigation = (href: string) => {
    router.push(href);
  };

  return (
    <nav className="h-full bg-var(--sidebar-bg-color) text-var(--sidebar-text-color)">
      <div className="space-y-1">
        {navigation.map((item) => (
          <a 
            key={item.name}
            href={item.href}
            onClick={(e) => {
              e.preventDefault();
              handleNavigation(item.href);
            }}
            className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white cursor-pointer"
          >
            {item.name}
          </a>
        ))}
      </div>
    </nav>
  );
};

export default NewSidebar;
