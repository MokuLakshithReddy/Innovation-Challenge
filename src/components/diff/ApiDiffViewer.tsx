"use client";

import React, { useState } from "react";
import { GitCompare, Plus, Minus, AlertTriangle, CheckCircle2, Columns, Square, Copy, Check, Sparkles, ShieldAlert } from "lucide-react";
import { MOCK_DIFFS, EndpointDiff } from "@/data/pipelineData";
import { cn } from "@/lib/utils";

interface ApiDiffViewerProps {
  onOpenSpecs?: () => void;
}

export const ApiDiffViewer: React.FC<ApiDiffViewerProps> = ({ onOpenSpecs }) => {
  const [diffs] = useState<EndpointDiff[]>(MOCK_DIFFS);
  const [selectedDiffId, setSelectedDiffId] = useState<string>(MOCK_DIFFS[0].id);
  const [viewMode, setViewMode] = useState<"split" | "unified">("split");
  const [copied, setCopied] = useState<boolean>(false);
  const activeDiff = diffs.find((d) => d.id === selectedDiffId) || diffs[0];

  const handleCopy = () => { navigator.clipboard.writeText(activeDiff.afterSnippet); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  const getMethodColor = (method: string) => {
    switch (method) { case "GET": return "--info"; case "POST": return "--success"; case "PUT": return "--warning"; case "DELETE": return "--danger"; default: return "--accent"; }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "added": return { text: "ADDED", icon: <Plus className="w-3 h-3" />, color: "--success" };
      case "modified": return { text: "MODIFIED", icon: null, color: "--accent" };
      case "deprecated": return { text: "DEPRECATED", icon: null, color: "--warning" };
      case "removed": return { text: "REMOVED", icon: <Minus className="w-3 h-3" />, color: "--danger" };
      default: return { text: status, icon: null, color: "--text-muted" };
    }
  };

  return (
    <div className="space-y-6 select-none">
      {/* Header */}
      <div className="rounded-xl p-6 border flex flex-col md:flex-row md:items-center justify-between gap-4" style={{ background: "var(--bg-card)", borderColor: "var(--border-primary)", boxShadow: "var(--shadow-sm)" }}>
        <div>
          <div className="flex items-center gap-2">
            <GitCompare className="w-5 h-5" style={{ color: "var(--info)" }} />
            <h2 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>API Diff Inspector</h2>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded" style={{ background: "var(--info-bg)", color: "var(--info)", border: "1px solid var(--info-border)" }}>
              OAS 3.0.3 → 3.1.0
            </span>
          </div>
          <p className="text-[13px] mt-1" style={{ color: "var(--text-muted)" }}>Route and schema comparison between baseline and generated spec.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="p-0.5 rounded-lg border flex items-center text-[12px]" style={{ background: "var(--bg-elevated)", borderColor: "var(--border-primary)" }}>
            <button onClick={() => setViewMode("split")} className="px-2.5 py-1 rounded-md transition font-medium flex items-center gap-1.5"
              style={{ background: viewMode === "split" ? "var(--accent)" : "transparent", color: viewMode === "split" ? "white" : "var(--text-muted)" }}>
              <Columns className="w-3 h-3" /> Split
            </button>
            <button onClick={() => setViewMode("unified")} className="px-2.5 py-1 rounded-md transition font-medium flex items-center gap-1.5"
              style={{ background: viewMode === "unified" ? "var(--accent)" : "transparent", color: viewMode === "unified" ? "white" : "var(--text-muted)" }}>
              <Square className="w-3 h-3" /> Unified
            </button>
          </div>
          <button onClick={handleCopy} className="p-1.5 rounded-lg border text-[12px] flex items-center gap-1.5 font-mono transition"
            style={{ background: "var(--bg-elevated)", borderColor: "var(--border-primary)", color: "var(--text-secondary)" }}>
            {copied ? <Check className="w-3.5 h-3.5" style={{ color: "var(--success)" }} /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copy</span>
          </button>
        </div>
      </div>

      {/* Endpoint Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {diffs.map((diff) => {
          const isSelected = diff.id === selectedDiffId;
          const sl = getStatusLabel(diff.status);
          const mc = getMethodColor(diff.method);
          return (
            <button key={diff.id} onClick={() => setSelectedDiffId(diff.id)} className="p-4 rounded-xl border text-left transition-all"
              style={{
                background: isSelected ? "var(--accent-bg)" : "var(--bg-card)",
                borderColor: isSelected ? "var(--accent-border)" : "var(--border-primary)",
                boxShadow: isSelected ? "var(--shadow-glow)" : "var(--shadow-sm)",
              }}>
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-mono font-bold px-1.5 py-0.5 rounded uppercase"
                    style={{ background: `color-mix(in srgb, var(${mc}) 12%, transparent)`, color: `var(${mc})`, border: `1px solid color-mix(in srgb, var(${mc}) 25%, transparent)` }}>
                    {diff.method}
                  </span>
                  <span className="text-[13px] font-mono font-semibold" style={{ color: "var(--text-primary)" }}>{diff.path}</span>
                </div>
                <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded"
                  style={{ background: `color-mix(in srgb, var(${sl.color}) 12%, transparent)`, color: `var(${sl.color})`, border: `1px solid color-mix(in srgb, var(${sl.color}) 25%, transparent)` }}>
                  {sl.icon} {sl.text}
                </span>
              </div>
              <p className="text-[12px] truncate" style={{ color: "var(--text-muted)" }}>{diff.summary}</p>
              <div className="mt-2.5 flex items-center justify-between text-[11px] font-mono" style={{ color: "var(--text-muted)" }}>
                <span>{diff.tag}</span>
                {diff.breaking ? (
                  <span className="flex items-center gap-1" style={{ color: "var(--warning)" }}><AlertTriangle className="w-3 h-3" /> Breaking</span>
                ) : (
                  <span className="flex items-center gap-1" style={{ color: "var(--success)" }}><CheckCircle2 className="w-3 h-3" /> Compatible</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Breaking Change Alert */}
      {activeDiff.breaking && (
        <div className="p-4 rounded-xl flex items-start gap-3 text-[13px]"
          style={{ background: "var(--warning-bg)", border: "1px solid var(--warning-border)", color: "var(--text-primary)" }}>
          <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" style={{ color: "var(--warning)" }} />
          <div>
            <span className="font-semibold" style={{ color: "var(--warning)" }}>Breaking Schema Change: </span>
            Property <code className="font-mono px-1 py-0.5 rounded" style={{ background: "var(--bg-elevated)" }}>username</code> removed and replaced by{" "}
            <code className="font-mono px-1 py-0.5 rounded" style={{ background: "var(--bg-elevated)" }}>email</code> in LoginRequest.
          </div>
        </div>
      )}

      {/* Code Comparison */}
      <div className="rounded-xl border overflow-hidden font-mono text-[12px]" style={{ background: "var(--bg-secondary)", borderColor: "var(--border-primary)", boxShadow: "var(--shadow-md)" }}>
        <div className="grid grid-cols-1 md:grid-cols-2 border-b" style={{ background: "var(--bg-elevated)", borderColor: "var(--border-primary)" }}>
          <div className="p-3 border-r flex items-center gap-2" style={{ borderColor: "var(--border-primary)" }}>
            <span className="w-2 h-2 rounded-full" style={{ background: "var(--danger)" }} />
            <span className="font-semibold" style={{ color: "var(--text-secondary)" }}>Before (HEAD~1)</span>
          </div>
          <div className="p-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "var(--success)" }} />
            <span className="font-semibold" style={{ color: "var(--text-primary)" }}>After (HEAD)</span>
            <span className="text-[10px] ml-auto" style={{ color: "var(--success)" }}>Verified</span>
          </div>
        </div>

        {viewMode === "split" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x" style={{ borderColor: "var(--border-subtle)" }}>
            <div className="p-4 overflow-x-auto min-h-[300px]" style={{ background: "var(--bg-primary)" }}>
              <pre style={{ color: "var(--text-muted)" }}>
                {activeDiff.beforeSnippet ? activeDiff.beforeSnippet.split("\n").map((line, idx) => {
                  const isRemoved = line.includes("username") || line.includes("legacy");
                  return (
                    <div key={idx} className={cn("flex items-center gap-3 px-1 rounded", isRemoved && "font-semibold")}
                      style={isRemoved ? { background: "var(--danger-bg)", color: "var(--danger)", borderLeft: "2px solid var(--danger)" } : {}}>
                      <span className="text-[10px] w-6 select-none shrink-0" style={{ color: "var(--text-muted)" }}>{idx + 1}</span>
                      <span>{isRemoved ? `- ${line}` : `  ${line}`}</span>
                    </div>
                  );
                }) : <div className="italic text-center py-12" style={{ color: "var(--text-muted)" }}>[New endpoint - no previous spec]</div>}
              </pre>
            </div>
            <div className="p-4 overflow-x-auto min-h-[300px]" style={{ background: "var(--bg-primary)" }}>
              <pre style={{ color: "var(--text-secondary)" }}>
                {activeDiff.afterSnippet.split("\n").map((line, idx) => {
                  const isAdded = line.includes("email") || line.includes("X-Idempotency-Key") || line.includes("/v2/refunds") || line.includes("deprecated: true");
                  return (
                    <div key={idx} className={cn("flex items-center gap-3 px-1 rounded", isAdded && "font-semibold")}
                      style={isAdded ? { background: "var(--success-bg)", color: "var(--success)", borderLeft: "2px solid var(--success)" } : {}}>
                      <span className="text-[10px] w-6 select-none shrink-0" style={{ color: "var(--text-muted)" }}>{idx + 1}</span>
                      <span>{isAdded ? `+ ${line}` : `  ${line}`}</span>
                    </div>
                  );
                })}
              </pre>
            </div>
          </div>
        ) : (
          <div className="p-4 overflow-x-auto min-h-[300px]" style={{ background: "var(--bg-primary)" }}>
            <div className="text-[11px] pb-2 border-b mb-3" style={{ color: "var(--text-muted)", borderColor: "var(--border-primary)" }}>
              --- a/openapi.yaml<br />+++ b/openapi.yaml
            </div>
            <pre style={{ color: "var(--text-secondary)" }}>
              {activeDiff.afterSnippet.split("\n").map((line, idx) => {
                const isAdded = line.includes("email") || line.includes("X-Idempotency-Key") || line.includes("/v2/refunds");
                return (
                  <div key={idx} className="flex items-center gap-3 px-2 py-0.5 rounded"
                    style={isAdded ? { background: "var(--success-bg)", color: "var(--success)", fontWeight: 600 } : {}}>
                    <span className="text-[10px] w-6 select-none" style={{ color: "var(--text-muted)" }}>{idx + 1}</span>
                    <span>{isAdded ? `+ ${line}` : `  ${line}`}</span>
                  </div>
                );
              })}
            </pre>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="rounded-xl p-5 border" style={{ background: "var(--bg-card)", borderColor: "var(--border-primary)" }}>
        <h4 className="text-[12px] font-semibold uppercase tracking-wider mb-3 font-mono" style={{ color: "var(--text-muted)" }}>Detected Changes</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {activeDiff.changesSummary.map((change, i) => (
            <div key={i} className="p-3 rounded-lg border text-[13px] flex items-start gap-2" style={{ background: "var(--bg-elevated)", borderColor: "var(--border-primary)", color: "var(--text-secondary)" }}>
              <Sparkles className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: "var(--accent)" }} />
              <span>{change}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
