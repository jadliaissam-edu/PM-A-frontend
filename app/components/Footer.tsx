"use client";
import React from "react";

const Footer: React.FC = () => (
  <footer className="bg-white border-t border-gray-100">
    <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between text-sm text-gray-600">
      <div>© {new Date().getFullYear()} Project Name. Open-source and community driven.</div>
      <div className="flex gap-4 mt-3 sm:mt-0">
        <a href="/docs" className="hover:underline">Docs</a>
        <a href="/contribute" className="hover:underline">Contribute</a>
        <a href="https://github.com" className="hover:underline">GitHub</a>
      </div>
    </div>
  </footer>
);

export default Footer;
