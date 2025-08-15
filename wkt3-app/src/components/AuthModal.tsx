"use client";
import React, { useState } from "react";
import PasswordStrengthMeter from "./PasswordStrengthMeter";

export default function AuthModal() {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [showPass, setShowPass] = useState(false);
  const [password, setPassword] = useState("");

  return (
    <div className="max-w-xl mx-auto border rounded p-4 bg-white shadow">
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setTab("login")}
          className={`px-3 py-1 ${
            tab === "login"
              ? "bg-wkt3-500 text-white rounded"
              : "text-slate-600"
          }`}
        >
          Login
        </button>
        <button
          onClick={() => setTab("register")}
          className={`px-3 py-1 ${
            tab === "register"
              ? "bg-wkt3-500 text-white rounded"
              : "text-slate-600"
          }`}
        >
          Register
        </button>
      </div>

      {tab === "register" ? (
        <form action="/api/auth/register" method="post" className="space-y-3">
          <div>
            <label className="text-xs">Username</label>
            <input
              name="username"
              required
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="text-xs">Email</label>
            <input
              name="email"
              type="email"
              required
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="text-xs">Password</label>
            <div className="flex">
              <input
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPass ? "text" : "password"}
                required
                className="flex-1 border p-2 rounded"
              />
              <button
                type="button"
                onClick={() => setShowPass((s) => !s)}
                className="ml-2 px-3"
              >
                Show
              </button>
            </div>
            <div className="mt-2">
              <PasswordStrengthMeter password={password} />
            </div>
          </div>
          <div>
            <label className="text-xs">Confirm</label>
            <input
              name="confirmPassword"
              type={showPass ? "text" : "password"}
              required
              className="w-full border p-2 rounded"
            />
          </div>
          <div className="flex items-center">
            <input type="checkbox" id="terms" name="terms" required />
            <label htmlFor="terms" className="ml-2 text-xs">
              Agree to{" "}
              <a href="/terms" className="text-wkt3-600">
                terms
              </a>
            </label>
          </div>
          <div>
            <button
              type="submit"
              className="bg-wkt3-600 text-white px-4 py-2 rounded"
            >
              Register
            </button>
          </div>
        </form>
      ) : (
        <form action="/api/auth/login" method="post" className="space-y-3">
          <div>
            <label className="text-xs">Email or Username</label>
            <input
              name="identifier"
              required
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="text-xs">Password</label>
            <div className="flex">
              <input
                name="password"
                type={showPass ? "text" : "password"}
                required
                className="flex-1 border p-2 rounded"
              />
              <button
                type="button"
                onClick={() => setShowPass((s) => !s)}
                className="ml-2 px-3"
              >
                Show
              </button>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <a href="/auth/forgot" className="text-xs">
              Forgot password?
            </a>
            <button
              type="submit"
              className="bg-wkt3-600 text-white px-4 py-2 rounded"
            >
              Login
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
