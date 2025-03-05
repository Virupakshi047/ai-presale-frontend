
import Image from 'next/image';
import { User } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between p-4 bg-white shadow-sm">
      <div className="flex items-center space-x-4">
        {/* Logo Placeholder */}
        <div className="w-10 h-10 bg-gray-200 rounded"></div>
        
        {/* Middle Nav (Empty for now) */}
        
        <div className="flex-grow"></div>
      </div>
      
      {/* Profile Photo */}
      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
        <User className="text-white" />
      </div>
    </nav>
  );
}