// src/actions/authActions.ts
"use server";
import { genSalt, hashPassword, generateSessionToken } from "../lib/auth";
import nodemailer from "nodemailer";

const GO_DB_URL = process.env.GO_DB_URL || "http://localhost:8080";
const SMTP_HOST = process.env.SMTP_HOST || "";
const SMTP_PORT = parseInt(process.env.SMTP_PORT || "587");
const SMTP_USER = process.env.SMTP_USER || "";
const SMTP_PASS = process.env.SMTP_PASS || "";

async function apiCreate(path: string, body: any) {
  const res = await fetch(`${GO_DB_URL}${path}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function registerUser(formData: FormData) {
  const username = String(formData.get("username") || "");
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  if (!username || !email || !password) throw new Error("Missing fields");

  const salt = genSalt();
  const hashed = hashPassword(password, salt);

  const created = await apiCreate("/users", {
    username,
    email,
    salt,
    hash: hashed,
    verified: false,
  });
  if (created.error) throw new Error(created.error || "failed creating user");

  // token
  const token = Math.floor(100000 + Math.random() * 900000).toString();
  await apiCreate("/tokens", {
    userId: created.id,
    token,
    kind: "verify",
    ttlSeconds: 600,
  });

  // send email
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  await transporter.sendMail({
    from: `"WKT3" <no-reply@${process.env.WKT3_DOMAIN}>`,
    to: email,
    subject: "Verify your WKT3 account",
    text: `Your verification code is ${token}`,
    html: `<p>Your verification code is <b>${token}</b></p>`,
  });

  return { ok: true, message: "Verification email sent" };
}

export async function loginUser(formData: FormData) {
  const identifier = String(formData.get("identifier") || "");
  const password = String(formData.get("password") || "");
  if (!identifier || !password) throw new Error("Missing fields");

  // lookup user
  const findRes = await fetch(`${GO_DB_URL}/users/find`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ identifier }),
  }).then((r) => r.json());

  if (findRes.error || !findRes.user) throw new Error("Invalid credentials");
  const user = findRes.user;

  // verify password
  const verify = require("../lib/auth").verifyPassword(
    password,
    user.salt,
    user.hash
  );
  if (!verify) throw new Error("Invalid credentials");

  // create session
  const session = await apiCreate("/sessions", {
    userId: user.id,
    ttlSeconds: 7 * 24 * 3600,
  });
  const token = generateSessionToken(
    user.id,
    process.env.NEXTAUTH_SECRET || "secret"
  );

  return { ok: true, token, user: { id: user.id, username: user.username } };
}
