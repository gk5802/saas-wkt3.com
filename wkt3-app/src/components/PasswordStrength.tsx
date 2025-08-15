"use client";
import React from "react";

function scorePassword(pw: string) {
  let score = 0;
  if (pw.length >= 6) score++;
  if (/[a-z]/.test(pw)) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score; // 0..5
}

export default function PasswordStrength({ password }: { password: string }) {
  const s = scorePassword(password);
  const pct = (s / 5) * 100;
  const color =
    s <= 2 ? "bg-red-500" : s === 3 ? "bg-yellow-400" : "bg-green-500";
  return (
    <div>
      <div className="w-full bg-gray-200 h-2 rounded">
        <div
          style={{ width: `${pct}%` }}
          className={`h-2 rounded ${color}`}
        ></div>
      </div>
      <div className="text-xs mt-1">
        Strength:{" "}
        {["Very weak", "Weak", "Okay", "Good", "Strong", "Excellent"][s]}
      </div>
    </div>
  );
}
