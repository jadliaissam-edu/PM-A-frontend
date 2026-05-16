"use client";
import { usePathname } from "next/navigation";
import React from "react";
import OpenSourceSection from "./OpenSourceSection";
import Footer from "./Footer";

export default function PublicLanding() {
  const pathname = usePathname();
  if (pathname !== "/") return null;
  return (
    <>
      <OpenSourceSection />
      <Footer />
    </>
  );
}
