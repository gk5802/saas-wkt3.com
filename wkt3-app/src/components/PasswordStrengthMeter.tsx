"use client";
import React from "react";

export default function PasswordStrengthMeter({
  password,
}: {
  password: string;
}) {
  const tests = [
    (p: string) => p.length >= 6,
    (p: string) => /[A-Z]/.test(p),
    (p: string) => /[a-z]/.test(p),
    (p: string) => /[0-9]/.test(p),
    (p: string) => /[^A-Za-z0-9]/.test(p),
  ];
  const passed = tests.reduce((s, fn) => s + (fn(password) ? 1 : 0), 0);
  const percent = Math.round((passed / tests.length) * 100);
  const colorClass =
    passed <= 1 ? "bg-red-500" : passed <= 3 ? "bg-yellow-500" : "bg-green-500";

  return (
    <div className="space-y-1">
      <div className="w-full bg-gray-200 rounded h-2">
        <div
          className={`h-2 rounded ${colorClass}`}
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="text-xs text-slate-600">
        Strength: {percent}% ({passed}/5)
      </div>
      <div className="text-xs text-slate-500">
        Rules: min 6 chars, 1 uppercase, 1 lowercase, 1 number, 1 special
      </div>
    </div>
  );
}
