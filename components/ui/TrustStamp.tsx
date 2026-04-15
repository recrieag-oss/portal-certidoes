"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck } from "lucide-react";

export function TrustStamp() {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.0, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed bottom-5 left-4 z-40 select-none"
    >
      <button
        onClick={() => setExpanded((v) => !v)}
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
        className="flex items-center gap-0 focus:outline-none"
        aria-label="Informações sobre a plataforma"
      >
        {/* Shield badge */}
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 bg-white shadow-sm transition-all duration-300"
          style={{
            borderColor: "rgba(0,155,58,0.50)",
            boxShadow: "0 1px 8px rgba(0,155,58,0.15)",
          }}
        >
          <ShieldCheck
            className="h-4 w-4"
            strokeWidth={2}
            style={{ color: "#009B3A" }}
          />
        </div>

        {/* Expandable text */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, width: 0, x: -4 }}
              animate={{ opacity: 1, width: "auto", x: 0 }}
              exit={{ opacity: 0, width: 0, x: -4 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div
                className="ml-2 rounded-full border bg-white px-3 py-1.5 shadow-sm"
                style={{ borderColor: "rgba(0,155,58,0.25)" }}
              >
                <p
                  className="whitespace-nowrap font-bold uppercase leading-tight"
                  style={{
                    fontSize: "7px",
                    letterSpacing: "0.18em",
                    color: "rgba(0,155,58,0.80)",
                  }}
                >
                  PLATAFORMA PARTICULAR PRIVADA
                </p>
                <p
                  className="mt-[2px] whitespace-nowrap font-medium uppercase leading-tight"
                  style={{
                    fontSize: "6px",
                    letterSpacing: "0.12em",
                    color: "rgba(0,100,40,0.60)",
                  }}
                >
                  BUSCAMOS E ENTREGAMOS EM TODO O BRASIL
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </motion.div>
  );
}
