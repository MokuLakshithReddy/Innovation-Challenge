"use client";

import React, { useState, useEffect, useRef } from "react";
import { Terminal, Copy, Check, RotateCcw } from "lucide-react";
import { PipelineLog } from "@/data/pipelineData";
import { cn } from "@/lib/utils";

interface TerminalConsoleProps {
  logs: PipelineLog[];
  isStreaming?: boolean;
  onReplay?: () => void;
}

export const TerminalConsole: React.FC<TerminalConsoleProps> = ({ logs, isStreaming = false, onReplay }) => {
  const [filter, setFilter] = useState<string>("ALL");
  const [autoScroll, setAutoScroll] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, autoScroll]);

  const handleCopy = () => {
    const text = logs.map((l) => `[${l.timestamp}] [${l.level}] ${l.message}`).join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredLogs = logs.filter((log) => filter === "ALL" || log.level === filter);

  const getLevelColor = (level: string) => {
    switch (level) {
      case "AST": return "--accent";
      case "DIFF": return "--info";
      case "CHECK": return "--warning";
      case "SUCCESS": return "--success";
      case "WARN": return "--danger";
      default: return "--text-muted";
    }
  };

  return (
    <div
      className="rounded-xl border overflow-hidden font-mono flex flex-col h-80 select-none"
      style={{
        background: "var(--bg-secondary)",
        borderColor: "var(--border-primary)",
        boxShadow: "var(--shadow-md)",
      }}
    >
      {/* Titlebar */}
      <div
        className="px-4 py-2.5 border-b flex items-center justify-between shrink-0"
        style={{ background: "var(--bg-elevated)", borderColor: "var(--border-primary)" }}
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full" style={{ background: "var(--danger)", opacity: 0.8 }} />
            <span className="w-3 h-3 rounded-full" style={{ background: "var(--warning)", opacity: 0.8 }} />
            <span className="w-3 h-3 rounded-full" style={{ background: "var(--success)", opacity: 0.8 }} />
          </div>
          <div className="flex items-center gap-2 text-[12px]" style={{ color: "var(--text-muted)" }}>
            <Terminal className="w-3.5 h-3.5" style={{ color: "var(--accent)" }} />
            <span style={{ color: "var(--text-secondary)" }}>agent@docpulse:~#</span>
          </div>
          {isStreaming && (
            <span
              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px]"
              style={{ background: "var(--accent-bg)", color: "var(--accent)", border: "1px solid var(--accent-border)" }}
            >
              <span className="w-1.5 h-1.5 rounded-full animate-ping" style={{ background: "var(--accent)" }} />
              STREAMING
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Filter */}
          <div
            className="hidden sm:flex items-center rounded p-0.5 text-[10px]"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border-primary)" }}
          >
            {["ALL", "AST", "DIFF", "CHECK", "SUCCESS"].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setFilter(lvl)}
                className="px-2 py-0.5 rounded transition"
                style={{
                  background: filter === lvl ? "var(--accent)" : "transparent",
                  color: filter === lvl ? "white" : "var(--text-muted)",
                }}
              >
                {lvl}
              </button>
            ))}
          </div>

          <button onClick={handleCopy} className="p-1 rounded border transition" style={{ background: "var(--bg-card)", borderColor: "var(--border-primary)", color: "var(--text-muted)" }}>
            {copied ? <Check className="w-3.5 h-3.5" style={{ color: "var(--success)" }} /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          {onReplay && (
            <button onClick={onReplay} className="p-1 rounded border transition" style={{ background: "var(--bg-card)", borderColor: "var(--border-primary)", color: "var(--text-muted)" }}>
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Logs */}
      <div ref={scrollRef} className="p-3.5 flex-1 overflow-y-auto space-y-1 text-[12px] select-text">
        {filteredLogs.map((log) => (
          <div key={log.id} className="flex items-start gap-2.5 leading-relaxed px-1.5 py-0.5 rounded">
            <span className="text-[11px] shrink-0" style={{ color: "var(--text-muted)" }}>{log.timestamp}</span>
            <span
              className="text-[10px] font-bold px-1.5 py-0.5 rounded uppercase shrink-0"
              style={{
                background: `color-mix(in srgb, var(${getLevelColor(log.level)}) 12%, transparent)`,
                color: `var(${getLevelColor(log.level)})`,
                border: `1px solid color-mix(in srgb, var(${getLevelColor(log.level)}) 25%, transparent)`,
              }}
            >
              {log.level}
            </span>
            <span style={{ color: "var(--text-primary)" }}>{log.message}</span>
          </div>
        ))}

        {isStreaming && (
          <div className="flex items-center gap-2 pt-1 text-[12px]" style={{ color: "var(--accent)" }}>
            <span className="animate-pulse">agent@docpulse:~#</span>
            <span className="w-2 h-4 inline-block animate-pulse" style={{ background: "var(--accent)" }} />
          </div>
        )}
      </div>
    </div>
  );
};
