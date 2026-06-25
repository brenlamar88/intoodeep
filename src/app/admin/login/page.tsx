"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const params = useSearchParams();
  const next = params.get("next") || "/admin";
  const linkError = params.get("error");

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

  async function sendLink(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    const supabase = createClient();
    const redirectTo = `${window.location.origin}/auth/confirm?next=${encodeURIComponent(next)}`;
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo, shouldCreateUser: true },
    });
    if (error) {
      setStatus("error");
      setMessage(error.message);
    } else {
      setStatus("sent");
    }
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
            Enter your email and we&apos;ll send you a secure sign-in link. No password needed.
          </p>

          {status === "sent" ? (
            <div className="text-[15px] text-surface-soft bg-[rgba(95,201,201,0.1)] border border-[rgba(95,201,201,0.25)] rounded-[10px] p-4">
              Check <b>{email}</b> for your sign-in link. You can close this tab —
              opening the link will bring you straight to the dashboard.
            </div>
          ) : (
            <form onSubmit={sendLink}>
              <label className="block text-[13px] text-[var(--foam-soft)] mb-2">Email address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-[rgba(234,244,243,0.05)] border border-[var(--line-strong)] text-foam px-4 py-[13px] rounded-[10px] text-[15px] placeholder:text-[var(--foam-soft)] mb-4"
              />
              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full bg-coral hover:bg-coral-soft disabled:opacity-60 text-abyss font-semibold text-[15px] px-[22px] py-[13px] rounded-[10px] cursor-pointer"
              >
                {status === "sending" ? "Sending…" : "Send me a sign-in link"}
              </button>
            </form>
          )}

          {(status === "error" || linkError) && (
            <p className="text-[13px] text-coral-soft mt-4 mb-0">
              {message || "That sign-in link was invalid or expired. Please request a new one."}
            </p>
          )}
        </div>
        <p className="text-center text-[13px] text-[var(--foam-soft)] mt-6">
          Access is invite-only. Ask the site owner to add your email.
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
