"use client";

import React, { useState, useEffect } from "react";
import { Search, X, GitCommit, FileCode, Workflow, ArrowRight } from "lucide-react";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (target: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onNavigate }) => {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
      }
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const quickItems = [
    { type: "endpoint", title: "POST /v2/refunds", desc: "Refund execution endpoint", tab: "specs" },
    { type: "endpoint", title: "POST /v1/auth/login", desc: "User token issuance", tab: "diff" },
    { type: "commit", title: "c4a89f2", desc: "feat(payments): add refund endpoint", tab: "pipeline" },
    { type: "action", title: "Trigger Manual Scan", desc: "Analyze AST routes", tab: "pipeline" },
  ];

  const filtered = quickItems.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.desc.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4"
      style={{ background: "var(--bg-overlay)" }}
    >
      <div
        className="w-full max-w-lg rounded-xl border overflow-hidden"
        style={{
          background: "var(--bg-card)",
          borderColor: "var(--border-primary)",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        {/* Input */}
        <div
          className="p-4 border-b flex items-center gap-3"
          style={{ borderColor: "var(--border-primary)" }}
        >
          <Search className="w-5 h-5 shrink-0" style={{ color: "var(--accent)" }} />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search endpoints, commits..."
            className="w-full bg-transparent text-[14px] focus:outline-none"
            style={{ color: "var(--text-primary)" }}
          />
          <button onClick={onClose} className="p-1 rounded transition" style={{ color: "var(--text-muted)" }}>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results */}
        <div className="p-2 max-h-72 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="p-6 text-center text-[13px]" style={{ color: "var(--text-muted)" }}>
              No results for &ldquo;{query}&rdquo;
            </div>
          ) : (
            filtered.map((item, idx) => (
              <button
                key={idx}
                onClick={() => { onNavigate(item.tab); onClose(); }}
                className="w-full text-left p-3 rounded-lg transition flex items-center justify-between group"
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-card-hover)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <div className="flex items-center gap-3 truncate">
                  {item.type === "endpoint" && <FileCode className="w-4 h-4" style={{ color: "var(--info)" }} />}
                  {item.type === "commit" && <GitCommit className="w-4 h-4" style={{ color: "var(--accent)" }} />}
                  {item.type === "action" && <Workflow className="w-4 h-4" style={{ color: "var(--success)" }} />}
                  <div className="truncate">
                    <p className="text-[13px] font-mono font-medium" style={{ color: "var(--text-primary)" }}>
                      {item.title}
                    </p>
                    <p className="text-[12px] truncate" style={{ color: "var(--text-muted)" }}>{item.desc}</p>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5" style={{ color: "var(--text-muted)" }} />
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div
          className="px-4 py-2.5 border-t flex items-center justify-between text-[11px] font-mono"
          style={{
            borderColor: "var(--border-primary)",
            background: "var(--bg-elevated)",
            color: "var(--text-muted)",
          }}
        >
          <span>↑↓ Navigate · ↵ Select</span>
          <span>Esc to close</span>
        </div>
      </div>
    </div>
  );
};
