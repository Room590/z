import React from 'react';
import Navbar from './Navbar.jsx';

const Layout = ({ children }) => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1 container py-6">{children}</main>
    <footer className="bg-gray-900 text-white py-4 text-center text-sm">Marketplace MVP</footer>
  </div>
);

export default Layout;
