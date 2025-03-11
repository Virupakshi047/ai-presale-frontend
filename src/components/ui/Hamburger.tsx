interface HamburgerProps {
  isOpen: boolean;
  onClick: () => void;
}

const Hamburger: React.FC<HamburgerProps> = ({ isOpen, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex flex-col justify-center items-center lg:hidden w-10 h-10 relative focus:outline-none"
      aria-label="Menu"
    >
      <span
        className={`block w-6 h-0.5 bg-gray-600 transform transition duration-300 ease-in-out ${
          isOpen ? "rotate-45 translate-y-1.5" : ""
        }`}
      />
      <span
        className={`block w-6 h-0.5 bg-gray-600 mt-1.5 transition-opacity duration-300 ${
          isOpen ? "opacity-0" : ""
        }`}
      />
      <span
        className={`block w-6 h-0.5 bg-gray-600 mt-1.5 transform transition duration-300 ease-in-out ${
          isOpen ? "-rotate-45 -translate-y-1.5" : ""
        }`}
      />
    </button>
  );
};

export default Hamburger;
