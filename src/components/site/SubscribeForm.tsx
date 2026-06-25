"use client";

import { useState } from "react";

export function SubscribeForm({ buttonLabel = "Send me the letter" }: { buttonLabel?: string }) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <p className="text-[15px] text-surface-soft">
        You&apos;re on the list — watch for Sunday&apos;s letter. 🧡
      </p>
    );
  }

  return (
    <form
      className="flex gap-[10px] max-w-[450px] flex-wrap"
      onSubmit={(e) => {
        e.preventDefault();
        if (email.includes("@")) setDone(true);
      }}
    >
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email"
        aria-label="Your email"
        className="flex-1 min-w-[200px] bg-[rgba(234,244,243,0.05)] border border-[var(--line-strong)] text-foam px-4 py-[14px] rounded-[10px] text-[15px] placeholder:text-[var(--foam-soft)]"
      />
      <button
        type="submit"
        className="bg-coral hover:bg-coral-soft text-abyss font-semibold text-[15px] px-[22px] py-[14px] rounded-[10px] cursor-pointer"
      >
        {buttonLabel}
      </button>
    </form>
  );
}
