import React from 'react';

export default function Sidebar() {
  return (
    <div className="w-64 bg-gray-800 text-white">
      <div className="p-4">
        <h2 className="text-2xl font-bold">ScholarTrack</h2>
      </div>
      <nav className="mt-4">
        <a href="#" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">Dashboard</a>
        <a href="#" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">Opportunities</a>
      </nav>
    </div>
  );
}
