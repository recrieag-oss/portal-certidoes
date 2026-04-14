"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Easing curves (Apple-derived) ─────────────────────────── */
const EASE_OUT_EXPO  = [0.16, 1, 0.3, 1]   as const;
const EASE_IN_EXPO   = [0.7,  0, 0.84, 1]  as const;

/* ─── Timing (ms) ───────────────────────────────────────────── */
const HOLD_MS   = 1800;   // how long logo stays visible at full opacity
const FADEIN_S  = 0.85;   // logo fade-in duration
const FADEOUT_S = 0.70;   // whole-screen fade-out duration

export function SplashScreen() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof sessionStorage === "undefined") return;
    if (sessionStorage.getItem("portal-splash-v1")) return;
    sessionStorage.setItem("portal-splash-v1", "1");
    setShow(true);
    const t = setTimeout(() => setShow(false), FADEIN_S * 1000 + HOLD_MS);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: FADEOUT_S, ease: EASE_IN_EXPO }}
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-white"
          aria-hidden="true"
        >
          {/* ── Atmospheric gradients ─────────────────────────── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: "easeOut" }}
            className="pointer-events-none absolute inset-0"
          >
            {/* Green — top-right bloom */}
            <div
              className="absolute -right-40 -top-40 h-[700px] w-[700px] rounded-full"
              style={{
                background:
                  "radial-gradient(circle at 60% 40%, rgba(0,155,58,0.13) 0%, transparent 68%)",
              }}
            />
            {/* Green — bottom-left echo */}
            <div
              className="absolute -bottom-64 -left-20 h-[500px] w-[500px] rounded-full"
              style={{
                background:
                  "radial-gradient(circle at 40% 60%, rgba(0,155,58,0.07) 0%, transparent 65%)",
              }}
            />
            {/* Gold — bottom-right warmth */}
            <div
              className="absolute -bottom-32 -right-16 h-[560px] w-[560px] rounded-full"
              style={{
                background:
                  "radial-gradient(circle at 50% 55%, rgba(254,223,0,0.11) 0%, transparent 62%)",
              }}
            />
            {/* Gold — top-left whisper */}
            <div
              className="absolute -left-40 -top-20 h-[420px] w-[420px] rounded-full"
              style={{
                background:
                  "radial-gradient(circle at 40% 40%, rgba(254,223,0,0.07) 0%, transparent 60%)",
              }}
            />
          </motion.div>

          {/* ── Logo ─────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, scale: 1.055, y: 10 }}
            animate={{ opacity: 1,  scale: 1,     y: 0  }}
            exit={{   opacity: 0,  scale: 0.97,  y: -6  }}
            transition={{
              duration: FADEIN_S,
              ease: EASE_OUT_EXPO,
            }}
            className="relative z-10"
          >
            <Image
              src="/logo-splash.svg"
              alt="Portal Certidões"
              width={420}
              height={250}
              priority
              className="w-52 sm:w-64 md:w-72"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
