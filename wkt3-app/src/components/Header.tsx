"use client";
import React from "react";
import QuotesTicker from "./QuotesTicker";
import AuthModal from "./AuthModal";
import Image from "next/image";

export default function Header() {
  return (
    <header className="w-full bg-gradient-to-r from-indigo-500 to-sky-400 text-white p-6 rounded-b-2xl">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Image src="/wkt3-logo.png" alt="wkt3" height={100} width={100} priority className="h-12 w-12 rounded" />
          <div>
            <h1 className="text-xl font-bold">Welcome to WKT3</h1>
            <p className="text-sm opacity-90">
              Play, Trade, Win — All in one platform
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <QuotesTicker />
          <AuthModal />
        </div>
      </div>
    </header>
  );
}
