"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ChevronDown, Search, X, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SearchableSelectProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  loadingMessage?: string;
  noOptionsMessage?: string;
  /** Optional: show a badge next to each option (e.g. UF code) */
  badges?: Record<string, string>;
}

function highlight(text: string, query: string) {
  if (!query) return <span>{text}</span>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <span>{text}</span>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-[#009B3A]/15 text-[#007A2F] rounded-[2px] not-italic font-semibold">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}

export function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = "Selecione ou digite...",
  disabled = false,
  loading = false,
  loadingMessage = "Carregando...",
  noOptionsMessage = "Nenhuma opção encontrada",
  badges,
}: SearchableSelectProps) {
  const [open, setOpen]           = useState(false);
  const [query, setQuery]         = useState("");
  const [activeIdx, setActiveIdx] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef     = useRef<HTMLInputElement>(null);
  const listRef      = useRef<HTMLUListElement>(null);

  /* ── Close on outside click ──────────────────────────── */
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  /* ── Scroll active item into view ───────────────────── */
  useEffect(() => {
    if (activeIdx >= 0 && listRef.current) {
      const el = listRef.current.children[activeIdx] as HTMLElement;
      el?.scrollIntoView({ block: "nearest" });
    }
  }, [activeIdx]);

  /* ── Filtered list ───────────────────────────────────── */
  const filtered = query.trim()
    ? options.filter((o) => o.toLowerCase().includes(query.toLowerCase()))
    : options;

  /* ── Handlers ────────────────────────────────────────── */
  const openDropdown = useCallback(() => {
    if (!disabled) {
      setOpen(true);
      setQuery("");
      setActiveIdx(-1);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [disabled]);

  function selectOption(opt: string) {
    onChange(opt);
    setOpen(false);
    setQuery("");
    setActiveIdx(-1);
  }

  function clearValue(e: React.MouseEvent) {
    e.stopPropagation();
    onChange("");
    setQuery("");
    setActiveIdx(-1);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        openDropdown();
      }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIdx >= 0 && filtered[activeIdx]) selectOption(filtered[activeIdx]);
    } else if (e.key === "Escape") {
      setOpen(false);
      setQuery("");
    }
  }

  /* ── Derived display ─────────────────────────────────── */
  const isOpen     = open && !disabled;
  const showClear  = !!value && !open;

  return (
    <div ref={containerRef} className="relative w-full">
      {/* ── Trigger ──────────────────────────────────────── */}
      <div
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        onClick={openDropdown}
        className={[
          "relative flex items-center rounded-[24px] border bg-slate-50 transition-all duration-150",
          isOpen
            ? "border-[#009B3A] ring-2 ring-[#009B3A]/10"
            : "border-slate-200 hover:border-slate-300",
          disabled ? "cursor-not-allowed opacity-50" : "cursor-text",
        ].join(" ")}
      >
        {/* Left icon */}
        <Search
          className={`absolute left-4 h-4 w-4 shrink-0 transition-colors ${
            isOpen ? "text-[#009B3A]" : "text-slate-400"
          }`}
        />

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          autoComplete="off"
          disabled={disabled}
          placeholder={value || placeholder}
          value={isOpen ? query : ""}
          onChange={(e) => {
            setQuery(e.target.value);
            setActiveIdx(-1);
            if (!open) setOpen(true);
          }}
          onFocus={() => { if (!disabled) setOpen(true); }}
          onKeyDown={handleKeyDown}
          className={[
            "w-full bg-transparent py-4 pl-10 pr-10 text-base outline-none",
            "placeholder:text-slate-700 placeholder:font-normal",
            isOpen ? "text-slate-900 placeholder:text-slate-400" : "text-transparent",
            disabled ? "cursor-not-allowed" : "",
          ].join(" ")}
        />

        {/* Selected label (shown when closed) */}
        {!isOpen && value && (
          <span className="pointer-events-none absolute left-10 right-10 truncate text-base text-slate-900">
            {value}
          </span>
        )}

        {/* Right controls */}
        <div className="absolute right-3 flex items-center gap-1">
          {showClear && (
            <button
              type="button"
              tabIndex={-1}
              onClick={clearValue}
              className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 transition hover:bg-slate-300"
              aria-label="Limpar seleção"
            >
              <X className="h-3 w-3 text-slate-600" />
            </button>
          )}
          <ChevronDown
            className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </div>
      </div>

      {/* ── Dropdown ─────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="dropdown"
            initial={{ opacity: 0, y: -8, scaleY: 0.95 }}
            animate={{ opacity: 1, y: 0,  scaleY: 1    }}
            exit={{   opacity: 0, y: -8, scaleY: 0.95  }}
            transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: "top" }}
            className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 overflow-hidden rounded-[20px] border border-slate-200 bg-white shadow-lg shadow-slate-100"
          >
            <ul
              ref={listRef}
              role="listbox"
              className="max-h-60 overflow-y-auto py-2"
              style={{ scrollbarWidth: "thin", scrollbarColor: "#cbd5e1 transparent" }}
            >
              {loading ? (
                <li className="px-4 py-3 text-sm text-slate-400">{loadingMessage}</li>
              ) : filtered.length === 0 ? (
                <li className="px-4 py-3 text-sm text-slate-400">{noOptionsMessage}</li>
              ) : (
                filtered.map((opt, i) => {
                  const isSelected = opt === value;
                  const isActive   = i === activeIdx;
                  return (
                    <li
                      key={opt}
                      role="option"
                      aria-selected={isSelected}
                      onMouseDown={(e) => { e.preventDefault(); selectOption(opt); }}
                      onMouseEnter={() => setActiveIdx(i)}
                      className={[
                        "flex cursor-pointer items-center justify-between px-4 py-2.5 text-sm transition-colors duration-75",
                        isActive   ? "bg-[#009B3A]/8 text-[#007A2F]" : "",
                        isSelected && !isActive ? "bg-slate-50 text-slate-900 font-medium" : "",
                        !isActive && !isSelected ? "text-slate-700" : "",
                      ].join(" ")}
                    >
                      <span className="flex items-center gap-2">
                        {highlight(opt, query)}
                        {badges?.[opt] && (
                          <span className="rounded-[4px] bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500">
                            {badges[opt]}
                          </span>
                        )}
                      </span>
                      {isSelected && (
                        <Check className="h-3.5 w-3.5 shrink-0 text-[#009B3A]" />
                      )}
                    </li>
                  );
                })
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
