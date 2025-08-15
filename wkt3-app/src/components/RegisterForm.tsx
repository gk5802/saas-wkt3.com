"use client";
import React, { useState } from "react";
import { useDebouncedValue } from "@/lib/debounce";
import PasswordStrength from "./PasswordStrength";

export default function RegisterForm({
  switchToLogin,
}: {
  switchToLogin: () => void;
}) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [errors, setErrors] = useState<string | null>(null);

  const debUsername = useDebouncedValue(username, 400);
  const debEmail = useDebouncedValue(email, 400);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors(null);
    if (password !== confirm) {
      setErrors("Passwords do not match");
      return;
    }
    if (!accepted) {
      setErrors("Please accept terms");
      return;
    }
    // server action call to /api/auth/register -> forwards to Go backend
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });
    if (res.ok) {
      alert("Registration created. Check email for verification code.");
      switchToLogin();
    } else {
      const txt = await res.text();
      setErrors(txt);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-semibold">Register</h3>
      {errors && <div className="text-sm text-red-600">{errors}</div>}
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        className="input"
      />
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="input"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="input"
      />
      <PasswordStrength password={password} />
      <input
        type="password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        placeholder="Confirm Password"
        className="input"
      />
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={accepted}
          onChange={(e) => setAccepted(e.target.checked)}
        />{" "}
        I accept{" "}
        <a href="/terms" className="underline">
          terms
        </a>
      </label>
      <button
        type="submit"
        className="btn"
        disabled={!username || !email || !password || !confirm || !accepted}
      >
        Create account
      </button>
      <p className="text-sm">
        Already have account?{" "}
        <button type="button" onClick={switchToLogin} className="underline">
          Login
        </button>
      </p>
    </form>
  );
}
