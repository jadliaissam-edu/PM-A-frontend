"use client";
import React from "react";

const OpenSourceSection: React.FC = () => (
  <section className="py-12 bg-white">
    <div className="max-w-6xl mx-auto px-4">
      <h2 className="text-3xl font-extrabold text-center mb-2">Get started in 3 steps</h2>
      <p className="text-center text-gray-500 mb-8">From installation to your first flow in less than 5 minutes.</p>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="p-6 bg-white rounded-lg shadow text-center">
          <div className="text-4xl">💿</div>
          <h3 className="mt-4 font-bold">1. Install</h3>
          <p className="text-sm text-gray-600 mt-2">Run <span className="font-mono bg-[#f3f4f6] px-1 rounded">npm i</span> or <span className="font-mono bg-[#f3f4f6] px-1 rounded">yarn add</span> — quick and easy.</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow text-center">
          <div className="text-4xl">⚙️</div>
          <h3 className="mt-4 font-bold">2. Plug it in</h3>
          <p className="text-sm text-gray-600 mt-2">Import the pieces you need and drop them into your app — nothing fancy required.</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow text-center">
          <div className="text-4xl">🚀</div>
          <h3 className="mt-4 font-bold">3. Tweak & ship</h3>
          <p className="text-sm text-gray-600 mt-2">Make it yours, style it, then deploy — go live and celebrate.</p>
        </div>
      </div>

      <div className="mt-12 text-center">
        <h3 className="text-2xl font-extrabold">Open Source Repositories</h3>
        <p className="text-gray-500 mt-2">Explore the project repositories on GitHub.</p>
        <div className="mt-6 grid gap-6 max-w-3xl mx-auto sm:grid-cols-2 md:grid-cols-4">
          {[
            { name: 'PM-A-backend', href: 'https://github.com/jadliaissam-edu/PM-A-backend' },
            { name: 'PM-A-frontend', href: 'https://github.com/jadliaissam-edu/PM-A-frontend' },
            { name: 'PM-A-infra', href: 'https://github.com/jadliaissam-edu/PM-A-infra' },
            { name: 'PM-A-ia', href: 'https://github.com/jadliaissam-edu/PM-A-ia' },
          ].map((repo) => (
            <a key={repo.name} href={repo.href} target="_blank" rel="noopener noreferrer" className="inline-flex flex-col items-center gap-3 rounded-xl border border-[#eef2f5] bg-white p-4 text-center hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#00b884] font-bold text-white">{repo.name.split('-').map(s => s[0]).join('').toUpperCase()}</div>
              <div className="mt-1 font-semibold text-sm text-[#111827]">{repo.name}</div>
              <div className="text-xs text-[#6b7280]">View on GitHub</div>
            </a>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default OpenSourceSection;
