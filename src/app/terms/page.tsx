"use client";

import TermosDeUso from "@/components/sections/TermosDeUso";
import { Header } from "@/components/Header";

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-7xl mx-auto px-5">
        <TermosDeUso />
      </main>
    </div>
  );
}
