"use client";

import React from "react";
import Link from "next/link";
import {
  Rocket,
  Shield,
  Zap,
  BarChart3,
  Users2,
  Layout,
  CheckCircle2,
  ArrowRight,
  ZapOffIcon,
} from "lucide-react";

export default function InfoPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 selection:bg-zinc-900 selection:text-white">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-silver bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-sm font-bold text-white">
              A
            </div>
            <span className="text-xl font-bold tracking-tight">AgileFlow</span>
          </div>
          <div className="hidden items-center gap-8 text-sm font-medium text-zinc-600 md:flex">
            <a href="#features" className="transition hover:text-zinc-900">Features</a>

            <a href="#about" className="transition hover:text-zinc-900">About us</a>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-zinc-600 transition hover:text-zinc-900">
              Sign in
            </Link>
            <Link
              href="/register"
              className="rounded-full bg-zinc-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-zinc-800"
            >
              Login in
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 pt-32 pb-20 md:pt-48 md:pb-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="max-w-3xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-semibold text-zinc-600">
                <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
                Now in Public Beta
              </div>
              <h1 className="text-5xl font-bold leading-[1.1] tracking-tight md:text-7xl">
                Stop
                <br />
                <span className="bg-gradient-to-r from-zinc-900 via-zinc-500 to-zinc-400 bg-clip-text text-transparent">
                  fighting your workflow.
                </span>
              </h1>
              <p className="mt-8 text-lg leading-relaxed text-zinc-600 md:text-xl">
                AgileFlow streamlines your engineering workflow, connects your team, and gives you back the time to focus on what matters: building great software.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/register"
                  className="flex items-center justify-center gap-2 rounded-full bg-zinc-900 px-8 py-4 text-base font-semibold text-white transition hover:bg-zinc-800"
                >
                  Join the beta <ArrowRight size={18} />
                </Link>
                <button className="flex items-center justify-center gap-2 rounded-full border border-zinc-200 bg-white px-8 py-4 text-base font-semibold text-zinc-900 transition hover:bg-zinc-50">
                  View demo
                </button>
              </div>
            </div>

            {/* Animated Graphic */}
            <div className="flex items-center justify-center lg:justify-end">
              <div className="relative h-64 w-64 md:h-96 md:w-96">
                <svg viewBox="0 0 200 200" className="h-full w-full drop-shadow-2xl overflow-visible">
                  {/* Outer Glow with Pulse */}
                  <circle cx="100" cy="100" r="95" fill="white" className="opacity-10">
                    <animate attributeName="r" values="90;100;90" dur="4s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.05;0.15;0.05" dur="4s" repeatCount="indefinite" />
                  </circle>

                  {/* Red Circle */}
                  <circle cx="100" cy="100" r="85" fill="#EF4444" className="shadow-inner" />

                  {/* 3 Rectangles with SVG Animations - Balanced for centering */}
                  <rect x="55" y="60" width="20" height="80" fill="white" rx="6">
                    <animate attributeName="y" values="60;50;70;60" dur="4s" repeatCount="indefinite" begin="0s" />
                  </rect>
                  <rect x="90" y="50" width="20" height="100" fill="white" rx="6">
                    <animate attributeName="y" values="50;40;60;50" dur="4s" repeatCount="indefinite" begin="0.4s" />
                  </rect>
                  <rect x="125" y="70" width="20" height="60" fill="white" rx="6">
                    <animate attributeName="y" values="70;60;80;70" dur="4s" repeatCount="indefinite" begin="0.8s" />
                  </rect>
                </svg>
                {/* Dynamic background blur */}
                <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] h-[130%] bg-red-500/20 blur-[120px] rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="bg-white py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 max-w-2xl text-center md:text-left">
            <h2 className="text-3xl font-bold tracking-tight md:text-5xl text-zinc-900 mb-4">Everything you need to scale.</h2>
            <p className="mt-4 text-lg text-zinc-500 silver-subtext">
              Built for performance, designed for human interaction. AgileFlow is the standard for modern teams.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <FeatureCard
              icon={<Zap className="text-amber-500" />}
              title="Lightning Fast"
              description="Built with speed in mind. Our interface reacts instantly to your every click, keeping you in flow."
            />
            <FeatureCard
              icon={<Shield className="text-blue-500" />}
              title="Enterprise Ready"
              description="Advanced permissions, SSO, and audit logs. Everything your security team needs."
            />
            <FeatureCard
              icon={<Users2 className="text-emerald-500" />}
              title="Built for Teams"
              description="Collaborate in real-time. Comments, notifications, and shared boards keep everyone in sync."
            />
            <FeatureCard
              icon={<Rocket className="text-rose-500" />}
              title="Automated Workflows"
              description="Connect with GitHub, Slack, and Discord to automate your repetitive tasks."
            />
            <FeatureCard
              icon={<ZapOffIcon className="text-cyan-500" />}
              title="Task Dependency Graph"
              description="Visualize task relationships and blockers with interactive dependency graphs."
            />
            <FeatureCard
              icon={<Zap className="text-green-500" />}
              title="Generous Free Plan"
              description="Unlimited tasks  and core sprint features — completely free first version."
            />
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-24 md:py-32 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-16 md:grid-cols-2 items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight md:text-5xl mb-8">
                Building the future of Engineering Collaboration.<br />
                <span className="text-zinc-400">from engineers to engineers</span>
              </h2>
              <p className="text-lg text-zinc-600 leading-relaxed mb-6">
                AgileFlow was born out of a simple frustration: project management tools were either too simple to be useful or too complex to be pleasant.
              </p>
              <p className="text-lg text-zinc-600 leading-relaxed">
                Our mission is to create a workspace that feels like your favorite code editor—fast, keyboard-driven, and designed for deep work. We believe that when the tools disappear, the best work happens.
              </p>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-zinc-100 overflow-hidden border border-zinc-200 flex items-center justify-center p-12">
                <div className="grid grid-cols-2 gap-4 w-full h-full opacity-40">
                  <div className="bg-zinc-900 rounded-lg"></div>
                  <div className="bg-zinc-300 rounded-lg translate-y-8"></div>
                  <div className="bg-zinc-400 rounded-lg -translate-y-8"></div>
                  <div className="bg-zinc-200 rounded-lg"></div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Slider Section */}
      <section className="py-24 border-y border-zinc-100 bg-zinc-50/50">
        <div className="mx-auto max-w-7xl px-6">
          <FeatureSlider />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-48 text-center bg-zinc-900 border-y border-silver/20 text-white overflow-hidden relative shadow-premium">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-silver/10 to-zinc-400/5 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="relative z-10 mx-auto max-w-3xl px-6">
          <h2 className="text-4xl font-bold tracking-tight md:text-6xl">Ready to ship faster?</h2>
          <p className="mt-6 text-lg text-zinc-400 md:text-xl">
            Join us with AgileFlow to build the future of collaboration.
            Start now,free plan no credit card required.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/"
              className="rounded-full bg-white px-8 py-4 text-base font-semibold text-zinc-900 transition hover:bg-zinc-100"
            >
              Get started for free
            </Link>
            <button className="rounded-full border border-zinc-700 bg-zinc-800/50 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition hover:bg-zinc-800">
              Contact us
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-silver/50 py-12 md:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-6">{/*
          <div className="grid gap-12 md:grid-cols-4">{/*
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <div className="flex h-6 w-6 items-center justify-center rounded bg-zinc-900 text-[10px] font-bold text-white">
                  A
                </div>
                <span className="text-lg font-bold tracking-tight">AgileFlow</span>
              </div>
              <p className="text-sm text-zinc-500 leading-relaxed">
                The modern standard for project management. Built by developers, for developers.
              </p>

            </div>
            <div>
              <h4 className="text-sm font-bold text-zinc-900 mb-6 uppercase tracking-wider">Product</h4>
              <ul className="space-y-4 text-sm text-zinc-500">
                <li className="hover:text-zinc-900 cursor-pointer transition">Changelog</li>
                <li className="hover:text-zinc-900 cursor-pointer transition">Documentation</li>
                <li className="hover:text-zinc-900 cursor-pointer transition">Pricing</li>
                <li className="hover:text-zinc-900 cursor-pointer transition">App</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold text-zinc-900 mb-6 uppercase tracking-wider">Company</h4>
              <ul className="space-y-4 text-sm text-zinc-500">
                <li className="hover:text-zinc-900 cursor-pointer transition">About Us</li>
                <li className="hover:text-zinc-900 cursor-pointer transition">Careers</li>
                <li className="hover:text-zinc-900 cursor-pointer transition">Contact</li>
                <li className="hover:text-zinc-900 cursor-pointer transition">Privacy</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold text-zinc-900 mb-6 uppercase tracking-wider">Resources</h4>
              <ul className="space-y-4 text-sm text-zinc-500">
                <li className="hover:text-zinc-900 cursor-pointer transition">Community</li>
                <li className="hover:text-zinc-900 cursor-pointer transition">Help Center</li>
                <li className="hover:text-zinc-900 cursor-pointer transition">Security</li>
                <li className="hover:text-zinc-900 cursor-pointer transition">Status</li>
              </ul>
            </div>
          </div>
          */}
          <div className="mt-20 border-t border-zinc-100 pt-12 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-zinc-500">
              © 2026 AgileFlow Inc. All rights reserved.
            </p>
            <div className="flex gap-8 text-sm text-zinc-400">
              <span className="hover:text-zinc-600 cursor-pointer transition">Status</span>
              <span className="hover:text-zinc-600 cursor-pointer transition">Privacy</span>
              <span className="hover:text-zinc-600 cursor-pointer transition">Terms</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureSlider() {
  const [activeSlide, setActiveSlide] = React.useState(0);
  const slides = [
    { title: "Project Strategy", desc: "Define your long-term goals and milestones." },
    { title: "Team Velocity", desc: "Track how fast your team is delivering features." },
    { title: "Resource Planning", desc: "Allocate your best talent where it matters most." },
    { title: "Risk Mitigation", desc: "Identify and resolve bottlenecks before they happen." },
  ];

  return (
    <div className="relative">
      <div className="flex flex-col lg:flex-row gap-12 items-center">
        <div className="w-full lg:w-1/3 space-y-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-4">Core Capabilities</h2>
            <p className="text-zinc-500">Explore how AgileFlow empowers your entire development lifecycle.</p>
          </div>
          <div className="space-y-4">
            {slides.map((slide, index) => (
              <button
                key={index}
                onClick={() => setActiveSlide(index)}
                className={`w-full text-left p-6 rounded-2xl border transition-all duration-300 ${activeSlide === index
                  ? "bg-white border-silver shadow-premium translate-x-2"
                  : "border-transparent hover:bg-white/50 text-zinc-400"
                  }`}
              >
                <h3 className={`font-bold transition-colors ${activeSlide === index ? "text-zinc-900" : ""}`}>
                  {slide.title}
                </h3>
                {activeSlide === index && (
                  <p className="mt-2 text-sm text-zinc-500 animate-in fade-in slide-in-from-left-2">
                    {slide.desc}
                  </p>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="w-full lg:w-2/3 aspect-video rounded-3xl bg-zinc-200 border border-zinc-200 overflow-hidden relative group">
          <div className="absolute inset-0 flex items-center justify-center text-zinc-400 font-medium italic">
            {/* Placeholder for User Image */}
            <div className="text-center">
              <p>Image Placeholder: {slides[activeSlide].title}</p>
              <p className="text-xs mt-2">Insert your 16:9 image here</p>
            </div>
          </div>
          {/* Overlays for premium feel */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/5 to-transparent pointer-events-none"></div>

          <div className="absolute bottom-6 right-6 flex gap-2">
            {slides.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 rounded-full transition-all duration-500 ${activeSlide === index ? "w-8 bg-zinc-900" : "w-1.5 bg-zinc-300"
                  }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="group rounded-3xl border border-silver bg-white p-8 transition-all duration-300 hover:shadow-premium ring-1 ring-black/5">
      <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-50 border border-zinc-100 transition group-hover:scale-110 group-hover:bg-white group-hover:shadow-md">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-zinc-900 group-hover:text-black transition-colors">{title}</h3>
      <p className="mt-4 leading-relaxed text-zinc-500 group-hover:text-zinc-600 transition-colors">
        {description}
      </p>
    </div>
  );
}

function StatCard({ label, value }: { label: string, value: string }) {
  return (
    <div className="text-center md:text-left">
      <p className="text-sm font-medium text-zinc-500 mb-1">{label}</p>
      <p className="text-4xl font-bold text-zinc-900 tracking-tight">{value}</p>
    </div>
  );
}
