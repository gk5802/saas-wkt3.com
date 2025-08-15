"use client";
import React, { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

export default function AuthModal() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"login" | "register">("login");
  return (
    <div>
      <button
        onClick={() => {
          setOpen(true);
          setMode("login");
        }}
        className="btn"
      >
        Login
      </button>
      <button
        onClick={() => {
          setOpen(true);
          setMode("register");
        }}
        className="btn ml-2"
      >
        Register
      </button>
      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <button className="float-right" onClick={() => setOpen(false)}>
              ✕
            </button>
            {mode === "login" ? (
              <LoginForm switchToRegister={() => setMode("register")} />
            ) : (
              <RegisterForm switchToLogin={() => setMode("login")} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
