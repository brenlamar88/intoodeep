"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const params = useSearchParams();
  const next = params.get("next") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "signing" | "error">("idle");
  const [message, setMessage] = useState("");

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    setStatus("signing");
    setMessage("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (error) {
      setStatus("error");
      setMessage(
        error.message === "Invalid login credentials"
          ? "That email and password don't match. Check for typos and try again."
          : error.message
      );
      return;
    }
    // Full navigation so the server (middleware + layout) picks up the new session cookies.
    window.location.assign(next);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-[420px]">
        <div className="flex items-center gap-[11px] justify-center mb-8">
          <div
            aria-hidden
            className="w-[34px] h-[34px] rounded-full"
            style={{
              background: "radial-gradient(circle at 34% 30%, var(--coral-soft), var(--coral) 72%)",
              boxShadow: "0 0 0 4px rgba(255,127,99,0.12)",
            }}
          />
          <div className="font-display font-medium text-[20px]">
            In<b className="font-semibold">Too</b>Deep
          </div>
        </div>

        <div className="bg-deep border border-[var(--line)] rounded-[16px] p-8">
          <h1 className="font-display font-medium text-[24px] m-0 mb-2">Writer sign in</h1>
          <p className="text-[14px] text-[var(--foam-soft)] m-0 mb-6">
            Enter your email and password to manage stories.
          </p>

          <form onSubmit={signIn}>
            <label className="block text-[13px] text-[var(--foam-soft)] mb-2">Email address</label>
            <input
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-[rgba(234,244,243,0.05)] border border-[var(--line-strong)] text-foam px-4 py-[13px] rounded-[10px] text-[15px] placeholder:text-[var(--foam-soft)] mb-4"
            />
            <label className="block text-[13px] text-[var(--foam-soft)] mb-2">Password</label>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[rgba(234,244,243,0.05)] border border-[var(--line-strong)] text-foam px-4 py-[13px] rounded-[10px] text-[15px] placeholder:text-[var(--foam-soft)] mb-5"
            />
            <button
              type="submit"
              disabled={status === "signing"}
              className="w-full bg-coral hover:bg-coral-soft disabled:opacity-60 text-abyss font-semibold text-[15px] px-[22px] py-[13px] rounded-[10px] cursor-pointer"
            >
              {status === "signing" ? "Signing in…" : "Sign in"}
            </button>
          </form>

          {status === "error" && (
            <p className="text-[13px] text-coral-soft mt-4 mb-0">{message}</p>
          )}
        </div>
        <p className="text-center text-[13px] text-[var(--foam-soft)] mt-6">
          Access is invite-only. Ask the site owner for an account.
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
