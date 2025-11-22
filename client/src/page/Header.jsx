// Header.jsx
import React from "react";

export default function Header() {
  return (
    <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center font-bold">
          P
        </div>
        <span className="text-lg font-semibold">Puzzle</span>
      </div>

      <ul className="hidden md:flex space-x-8 text-gray-300">
        <li className="hover:text-white cursor-pointer">Product</li>
        <li className="hover:text-white cursor-pointer">Customers</li>
        <li className="hover:text-white cursor-pointer">Company</li>
        <li className="hover:text-white cursor-pointer">Pricing</li>
      </ul>

      <div className="space-x-4">
        <button className="px-4 py-2 border border-gray-500 rounded-md hover:bg-gray-800 transition">
          Log in
        </button>
        <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black rounded-md transition">
          Get started for free
        </button>
      </div>
    </nav>
  );
}