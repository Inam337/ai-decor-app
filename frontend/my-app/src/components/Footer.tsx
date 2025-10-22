'use client';

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-16">
      <div className="max-w-6xl  mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">A</span>
            </div>
            <span className="text-gray-700 font-medium text-sm">Art.Decor.AI</span>
          </div>
         
          
          {/* Copyright */}
          <div className="text-gray-400 text-xs">
            &copy; 2024
          </div>
        </div>
      </div>
    </footer>
  );
}
