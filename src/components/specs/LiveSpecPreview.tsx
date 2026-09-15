"use client";

import React, { useState } from "react";
import { Download, Copy, Check, ChevronDown, Play, Server, ShieldCheck } from "lucide-react";
import { MOCK_OPENAPI_SPEC } from "@/data/pipelineData";
import { cn } from "@/lib/utils";

export const LiveSpecPreview: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"swagger" | "json">("swagger");
  const [selectedServer, setSelectedServer] = useState<string>(MOCK_OPENAPI_SPEC.servers[0].url);
  const [expandedEndpoints, setExpandedEndpoints] = useState<Record<string, boolean>>({ "/v2/refunds": true });
  const [testPayloads, setTestPayloads] = useState({ paymentId: "pay_9f82c401", amount: "4500", currency: "USD" });
  const [testResponse, setTestResponse] = useState<any | null>(null);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const toggleEndpoint = (path: string) => setExpandedEndpoints((prev) => ({ ...prev, [path]: !prev[path] }));

  const handleExecuteTest = () => {
    setIsExecuting(true);
    setTimeout(() => {
      setTestResponse({
        status: 201, statusText: "Created", duration: "42ms",
        data: { refundId: "ref_" + Math.random().toString(36).substring(2, 10), status: "succeeded", amountRefunded: parseInt(testPayloads.amount, 10) || 4500, currency: testPayloads.currency, createdAt: new Date().toISOString() },
      });
      setIsExecuting(false);
    }, 600);
  };

  const handleCopyJson = () => { navigator.clipboard.writeText(JSON.stringify(MOCK_OPENAPI_SPEC, null, 2)); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const handleDownload = () => { const a = document.createElement("a"); a.href = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(MOCK_OPENAPI_SPEC, null, 2)); a.download = "openapi-spec-v3.1.json"; a.click(); };

  return (
    <div className="space-y-6 select-none">
      {/* Header */}
      <div className="rounded-xl p-6 border flex flex-col lg:flex-row lg:items-center justify-between gap-4" style={{ background: "var(--bg-card)", borderColor: "var(--border-primary)", boxShadow: "var(--shadow-sm)" }}>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-mono px-2 py-0.5 rounded" style={{ background: "var(--success-bg)", color: "var(--success)", border: "1px solid var(--success-border)" }}>OAS 3.1.0</span>
            <span className="text-[12px] font-mono" style={{ color: "var(--text-muted)" }}>•</span>
            <span className="text-[12px] font-mono" style={{ color: "var(--accent)" }}>Auto-Deploy Active</span>
          </div>
          <h2 className="text-lg font-bold mt-1.5" style={{ color: "var(--text-primary)" }}>{MOCK_OPENAPI_SPEC.info.title}</h2>
          <p className="text-[13px] mt-1 max-w-2xl" style={{ color: "var(--text-muted)" }}>{MOCK_OPENAPI_SPEC.info.description}</p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <div className="p-0.5 rounded-lg border flex items-center text-[12px]" style={{ background: "var(--bg-elevated)", borderColor: "var(--border-primary)" }}>
            <button onClick={() => setActiveTab("swagger")} className="px-2.5 py-1 rounded-md transition font-medium"
              style={{ background: activeTab === "swagger" ? "var(--accent)" : "transparent", color: activeTab === "swagger" ? "white" : "var(--text-muted)" }}>
              Swagger UI
            </button>
            <button onClick={() => setActiveTab("json")} className="px-2.5 py-1 rounded-md transition font-medium"
              style={{ background: activeTab === "json" ? "var(--accent)" : "transparent", color: activeTab === "json" ? "white" : "var(--text-muted)" }}>
              Raw JSON
            </button>
          </div>
          <button onClick={handleDownload} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[12px] font-mono transition"
            style={{ background: "var(--bg-elevated)", borderColor: "var(--border-primary)", color: "var(--text-secondary)" }}>
            <Download className="w-3.5 h-3.5" style={{ color: "var(--info)" }} /> Download
          </button>
        </div>
      </div>

      {activeTab === "swagger" && (
        <div className="space-y-4">
          {/* Server Selector */}
          <div className="p-3.5 rounded-xl border flex items-center justify-between text-[12px] font-mono"
            style={{ background: "var(--bg-card)", borderColor: "var(--border-primary)" }}>
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4" style={{ color: "var(--accent)" }} />
              <span style={{ color: "var(--text-muted)" }}>Server:</span>
              <select value={selectedServer} onChange={(e) => setSelectedServer(e.target.value)}
                className="px-2.5 py-1 rounded border focus:outline-none"
                style={{ background: "var(--bg-elevated)", borderColor: "var(--border-primary)", color: "var(--text-primary)" }}>
                {MOCK_OPENAPI_SPEC.servers.map((s, i) => <option key={i} value={s.url}>{s.url} ({s.description})</option>)}
              </select>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-[11px]" style={{ color: "var(--success)" }}>
              <ShieldCheck className="w-4 h-4" /> TLS 1.3 Verified
            </div>
          </div>

          {/* POST /v2/refunds */}
          <div className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--success-border)", boxShadow: "var(--shadow-sm)" }}>
            <button onClick={() => toggleEndpoint("/v2/refunds")} className="w-full p-4 transition flex items-center justify-between text-left"
              style={{ background: "var(--success-bg)" }}>
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded text-white font-mono font-bold text-[12px]" style={{ background: "var(--success)" }}>POST</span>
                <span className="font-mono font-bold text-[14px]" style={{ color: "var(--text-primary)" }}>/v2/refunds</span>
                <span className="text-[13px]" style={{ color: "var(--text-muted)" }}>Process Multi-Currency Refund</span>
              </div>
              <ChevronDown className={cn("w-4 h-4 transition-transform", expandedEndpoints["/v2/refunds"] && "rotate-180")} style={{ color: "var(--text-muted)" }} />
            </button>

            {expandedEndpoints["/v2/refunds"] && (
              <div className="p-5 border-t space-y-5" style={{ background: "var(--bg-card)", borderColor: "var(--border-primary)" }}>
                <p className="text-[13px]" style={{ color: "var(--text-secondary)" }}>
                  Initiates a refund with idempotency protection via <code className="font-mono px-1 py-0.5 rounded" style={{ background: "var(--accent-bg)", color: "var(--accent)" }}>X-Idempotency-Key</code> header.
                </p>

                {/* Params */}
                <div className="rounded-lg border divide-y" style={{ background: "var(--bg-elevated)", borderColor: "var(--border-primary)" }}>
                  <div className="p-3 flex items-center justify-between text-[12px] font-mono" style={{ borderColor: "var(--border-primary)" }}>
                    <div>
                      <span className="font-bold" style={{ color: "var(--accent)" }}>X-Idempotency-Key</span>
                      <span className="ml-1.5" style={{ color: "var(--danger)" }}>* required</span>
                      <p className="text-[11px] mt-0.5 font-sans" style={{ color: "var(--text-muted)" }}>Unique UUID for deduplication</p>
                    </div>
                    <span style={{ color: "var(--text-muted)" }}>header (uuid)</span>
                  </div>
                </div>

                {/* Try It Out */}
                <div>
                  <h4 className="text-[12px] font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>
                    Request Body — Try It Out
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3 text-[12px] font-mono">
                    {[
                      { label: "paymentId", key: "paymentId" as const },
                      { label: "amount (cents)", key: "amount" as const },
                      { label: "currency", key: "currency" as const },
                    ].map((field) => (
                      <div key={field.key}>
                        <label className="text-[11px] block mb-1" style={{ color: "var(--text-muted)" }}>{field.label}</label>
                        <input type="text" value={testPayloads[field.key]}
                          onChange={(e) => setTestPayloads({ ...testPayloads, [field.key]: e.target.value })}
                          className="w-full p-2 rounded border focus:outline-none"
                          style={{ background: "var(--bg-input)", borderColor: "var(--border-primary)", color: "var(--text-primary)" }} />
                      </div>
                    ))}
                  </div>
                  <button onClick={handleExecuteTest} disabled={isExecuting}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-[13px] font-semibold transition"
                    style={{ background: "var(--success)", boxShadow: "var(--shadow-sm)" }}>
                    <Play className="w-3.5 h-3.5" /> {isExecuting ? "Executing..." : "Execute Request (Mock)"}
                  </button>
                </div>

                {/* Response */}
                {testResponse && (
                  <div className="rounded-xl border p-4 space-y-2 font-mono text-[12px]" style={{ background: "var(--bg-elevated)", borderColor: "var(--success-border)" }}>
                    <div className="flex items-center justify-between pb-2 border-b" style={{ borderColor: "var(--border-primary)" }}>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded font-bold text-white" style={{ background: "var(--success)" }}>
                          {testResponse.status} {testResponse.statusText}
                        </span>
                        <span style={{ color: "var(--text-muted)" }}>{testResponse.duration}</span>
                      </div>
                    </div>
                    <pre className="text-[12px] overflow-x-auto p-2 rounded" style={{ background: "var(--bg-primary)", color: "var(--success)" }}>
                      {JSON.stringify(testResponse.data, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* POST /v1/auth/login */}
          <div className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--border-primary)" }}>
            <button onClick={() => toggleEndpoint("/v1/auth/login")} className="w-full p-4 transition flex items-center justify-between text-left"
              style={{ background: "var(--bg-card)" }}>
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded text-white font-mono font-bold text-[12px]" style={{ background: "var(--accent)" }}>POST</span>
                <span className="font-mono font-bold text-[14px]" style={{ color: "var(--text-primary)" }}>/v1/auth/login</span>
                <span className="text-[13px]" style={{ color: "var(--text-muted)" }}>Authenticate & Issue JWT</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded" style={{ background: "var(--warning-bg)", color: "var(--warning)", border: "1px solid var(--warning-border)" }}>Modified</span>
              </div>
              <ChevronDown className={cn("w-4 h-4 transition-transform", expandedEndpoints["/v1/auth/login"] && "rotate-180")} style={{ color: "var(--text-muted)" }} />
            </button>
            {expandedEndpoints["/v1/auth/login"] && (
              <div className="p-4 border-t space-y-3 font-mono text-[12px]" style={{ background: "var(--bg-card)", borderColor: "var(--border-primary)" }}>
                <p className="font-sans text-[13px]" style={{ color: "var(--text-secondary)" }}>Accepts credentials and generates a signed bearer JWT.</p>
                <div className="p-3 rounded border" style={{ background: "var(--bg-elevated)", borderColor: "var(--border-primary)" }}>
                  <span style={{ color: "var(--text-muted)" }}>Schema:</span>
                  <pre style={{ color: "var(--accent)" }}>{JSON.stringify(MOCK_OPENAPI_SPEC.components.schemas.LoginRequest, null, 2)}</pre>
                </div>
              </div>
            )}
          </div>

          {/* GET /v1/users/search (deprecated) */}
          <div className="rounded-xl border p-4 flex items-center justify-between" style={{ borderColor: "var(--warning-border)", background: "var(--bg-card)" }}>
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded text-white font-mono font-bold text-[12px]" style={{ background: "var(--info)" }}>GET</span>
              <span className="font-mono font-bold text-[14px] line-through" style={{ color: "var(--text-muted)" }}>/v1/users/search</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded" style={{ background: "var(--warning-bg)", color: "var(--warning)", border: "1px solid var(--warning-border)" }}>DEPRECATED</span>
            </div>
            <span className="text-[12px] font-mono" style={{ color: "var(--text-muted)" }}>Sunset: 2026-12-31</span>
          </div>
        </div>
      )}

      {activeTab === "json" && (
        <div className="rounded-xl border overflow-hidden" style={{ background: "var(--bg-secondary)", borderColor: "var(--border-primary)", boxShadow: "var(--shadow-md)" }}>
          <div className="p-3.5 border-b flex items-center justify-between" style={{ background: "var(--bg-elevated)", borderColor: "var(--border-primary)" }}>
            <span className="text-[12px] font-mono" style={{ color: "var(--text-muted)" }}>openapi-v3.1.json</span>
            <button onClick={handleCopyJson} className="flex items-center gap-1 text-[12px] font-mono transition" style={{ color: "var(--accent)" }}>
              {copied ? <Check className="w-3.5 h-3.5" style={{ color: "var(--success)" }} /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied!" : "Copy"}</span>
            </button>
          </div>
          <pre className="p-5 text-[12px] font-mono max-h-[500px] overflow-y-auto leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            {JSON.stringify(MOCK_OPENAPI_SPEC, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};
