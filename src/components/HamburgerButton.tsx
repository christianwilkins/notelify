// components/HamburgerButton.tsx
import React from 'react';

type HamburgerButtonProps = {
  toggle: () => void;
};

const HamburgerButton: React.FC<HamburgerButtonProps> = ({ toggle }) => {
  return (
    <button
      onClick={toggle}
      className="hamburger scale-70"
      type="button"
      aria-label="Menu"
      aria-controls="navigation"
    >
      <span className="hamburger-box inline-block relative">
        <span className="hamburger-inner bg-gray-700 block h-0.5 w-6 mb-1"></span> {/* Height and width adjusted */}
        <span className="hamburger-inner bg-gray-700 block h-0.5 w-6 mb-1"></span> {/* Margin for spacing */}
        <span className="hamburger-inner bg-gray-700 block h-0.5 w-6"></span>
      </span>
    </button>
  );
};

export default HamburgerButton;
