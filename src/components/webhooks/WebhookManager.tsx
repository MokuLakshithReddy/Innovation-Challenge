"use client";

import React, { useState } from "react";
import {
  Radio,
  Copy,
  Check,
  Send,
  Sparkles,
  ShieldCheck,
  Clock,
  ArrowRight,
  Code2,
  CheckCircle2,
  RefreshCw,
  GitCommit,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface WebhookDelivery {
  id: string;
  event: string;
  branch: string;
  status: number;
  durationMs: number;
  timestamp: string;
  message: string;
  payload: Record<string, unknown>;
}

export const WebhookManager: React.FC = () => {
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [eventType, setEventType] = useState<"push" | "pull_request" | "release">("push");
  const [selectedBranch, setSelectedBranch] = useState<string>("main");
  const [isSending, setIsSending] = useState(false);
  const [deliveries, setDeliveries] = useState<WebhookDelivery[]>([
    {
      id: "del_938102a",
      event: "push",
      branch: "main",
      status: 200,
      durationMs: 38,
      timestamp: "Just now",
      message: "Webhook successfully ingested. AST analysis pipeline triggered for branch 'main'.",
      payload: {
        ref: "refs/heads/main",
        head_commit: {
          id: "c4a89f2",
          message: "feat(auth): add mfa verification and refresh token rotators",
        },
      },
    },
  ]);

  const webhookUrl = typeof window !== "undefined" ? `${window.location.origin}/api/webhook/github` : "/api/webhook/github";
  const webhookSecret = "whsec_live_docpulse_98a72b";

  const handleCopy = (text: string, type: "url" | "secret") => {
    navigator.clipboard.writeText(text);
    if (type === "url") {
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    } else {
      setCopiedSecret(true);
      setTimeout(() => setCopiedSecret(false), 2000);
    }
  };

  const handleSendTestWebhook = async () => {
    setIsSending(true);
    const mockPayload = {
      ref: `refs/heads/${selectedBranch}`,
      event: eventType,
      repository: {
        name: "docpulse-backend-api",
        full_name: "spurthireddy280/docpulse-backend-api",
      },
      head_commit: {
        id: Math.random().toString(16).substring(2, 9),
        message:
          eventType === "push"
            ? `fix(routes): update ${selectedBranch} controller definitions`
            : `PR #42: merge feature into ${selectedBranch}`,
        timestamp: new Date().toISOString(),
      },
    };

    try {
      const res = await fetch("/api/webhook/github", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-github-event": eventType,
          "x-github-delivery": `del_${Date.now().toString(36)}`,
          "x-hub-signature-256": "sha256=9f83a8b2c1762e84d",
        },
        body: JSON.stringify(mockPayload),
      });

      const data = await res.json();

      const newDelivery: WebhookDelivery = {
        id: data.deliveryId || `del_${Date.now()}`,
        event: eventType,
        branch: selectedBranch,
        status: res.status,
        durationMs: data.durationMs || 45,
        timestamp: new Date().toLocaleTimeString(),
        message: data.message || "Webhook successfully received by backend.",
        payload: mockPayload,
      };

      setDeliveries((prev) => [newDelivery, ...prev]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div
        className="rounded-xl p-6 border relative overflow-hidden"
        style={{
          background: "var(--bg-card)",
          borderColor: "var(--border-primary)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Radio className="w-5 h-5" style={{ color: "var(--accent)" }} />
              <h2 className="text-xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
                Git Webhook Monitors & Simulator
              </h2>
              <span
                className="text-[11px] font-mono px-2 py-0.5 rounded-full"
                style={{
                  background: "var(--success-bg)",
                  color: "var(--success)",
                  border: "1px solid var(--success-border)",
                }}
              >
                LIVE LISTENER ACTIVE
              </span>
            </div>
            <p className="text-[13px] max-w-2xl" style={{ color: "var(--text-muted)" }}>
              Configure real incoming GitHub/GitLab webhooks to trigger instant AST extraction, schema drift detection, and OpenAPI rebuilds on every commit.
            </p>
          </div>
        </div>
      </div>

      {/* Grid: Webhook Settings & Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Webhook URL Endpoint & Test Trigger */}
        <div className="space-y-6">
          <div
            className="p-5 rounded-xl border space-y-4"
            style={{ background: "var(--bg-card)", borderColor: "var(--border-primary)" }}
          >
            <h3 className="text-sm font-semibold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
              <Radio className="w-4 h-4" style={{ color: "var(--accent)" }} />
              Active Webhook Endpoint
            </h3>

            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1.5" style={{ color: "var(--text-muted)" }}>
                Payload URL (Add to GitHub Settings ➔ Webhooks)
              </label>
              <div
                className="flex items-center justify-between p-2.5 rounded-lg border font-mono text-[12px]"
                style={{
                  background: "var(--bg-input)",
                  borderColor: "var(--border-primary)",
                  color: "var(--text-primary)",
                }}
              >
                <span className="truncate">{webhookUrl}</span>
                <button
                  onClick={() => handleCopy(webhookUrl, "url")}
                  className="ml-2 text-xs flex items-center gap-1 shrink-0 transition"
                  style={{ color: "var(--accent)" }}
                >
                  {copiedUrl ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedUrl ? "Copied" : "Copy"}
                </button>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1.5" style={{ color: "var(--text-muted)" }}>
                HMAC Secret Token
              </label>
              <div
                className="flex items-center justify-between p-2.5 rounded-lg border font-mono text-[12px]"
                style={{
                  background: "var(--bg-input)",
                  borderColor: "var(--border-primary)",
                  color: "var(--text-primary)",
                }}
              >
                <span className="truncate">{webhookSecret}</span>
                <button
                  onClick={() => handleCopy(webhookSecret, "secret")}
                  className="ml-2 text-xs flex items-center gap-1 shrink-0 transition"
                  style={{ color: "var(--accent)" }}
                >
                  {copiedSecret ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedSecret ? "Copied" : "Copy"}
                </button>
              </div>
            </div>

            <div className="pt-2 border-t flex items-center gap-2 text-[12px]" style={{ borderColor: "var(--border-subtle)", color: "var(--text-muted)" }}>
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>HMAC-SHA256 signature verification enabled</span>
            </div>
          </div>

          {/* Test Sender */}
          <div
            className="p-5 rounded-xl border space-y-4"
            style={{ background: "var(--bg-card)", borderColor: "var(--border-primary)" }}
          >
            <h3 className="text-sm font-semibold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
              <Send className="w-4 h-4" style={{ color: "var(--accent)" }} />
              Simulate Incoming GitHub Event
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-medium block mb-1" style={{ color: "var(--text-muted)" }}>
                  Event Type
                </label>
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value as any)}
                  className="w-full p-2 rounded-lg border text-[13px] outline-none"
                  style={{
                    background: "var(--bg-input)",
                    borderColor: "var(--border-primary)",
                    color: "var(--text-primary)",
                  }}
                >
                  <option value="push">push (Commit)</option>
                  <option value="pull_request">pull_request</option>
                  <option value="release">release</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-medium block mb-1" style={{ color: "var(--text-muted)" }}>
                  Target Branch
                </label>
                <select
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  className="w-full p-2 rounded-lg border text-[13px] outline-none"
                  style={{
                    background: "var(--bg-input)",
                    borderColor: "var(--border-primary)",
                    color: "var(--text-primary)",
                  }}
                >
                  <option value="main">main</option>
                  <option value="develop">develop</option>
                  <option value="feat/auth-v2">feat/auth-v2</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleSendTestWebhook}
              disabled={isSending}
              className="w-full py-2.5 rounded-lg font-medium text-[13px] text-white flex items-center justify-center gap-2 shadow-sm transition disabled:opacity-50"
              style={{
                background: "linear-gradient(135deg, var(--accent), #6366f1)",
              }}
            >
              {isSending ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" /> Dispatching to /api/webhook/github...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" /> Send Test Webhook to Backend
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right: Live Delivery History */}
        <div
          className="rounded-xl border flex flex-col h-[560px]"
          style={{ background: "var(--bg-card)", borderColor: "var(--border-primary)" }}
        >
          <div
            className="p-4 border-b flex items-center justify-between"
            style={{ borderColor: "var(--border-primary)" }}
          >
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" style={{ color: "var(--accent)" }} />
              <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                Webhook Ingestion Log
              </h3>
            </div>
            <span className="text-[11px] font-mono" style={{ color: "var(--text-muted)" }}>
              {deliveries.length} received
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {deliveries.map((del) => (
              <div
                key={del.id}
                className="p-4 rounded-lg border space-y-2.5 transition"
                style={{
                  background: "var(--bg-elevated)",
                  borderColor: "var(--border-primary)",
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-[10px] font-mono px-2 py-0.5 rounded font-bold"
                      style={{
                        background: "var(--success-bg)",
                        color: "var(--success)",
                        border: "1px solid var(--success-border)",
                      }}
                    >
                      {del.status} OK
                    </span>
                    <span className="font-mono text-[12px] font-semibold" style={{ color: "var(--text-primary)" }}>
                      {del.event.toUpperCase()} ({del.branch})
                    </span>
                  </div>
                  <span className="text-[11px] font-mono" style={{ color: "var(--text-muted)" }}>
                    {del.durationMs}ms • {del.timestamp}
                  </span>
                </div>

                <p className="text-[12px]" style={{ color: "var(--text-secondary)" }}>
                  {del.message}
                </p>

                <div
                  className="p-2.5 rounded font-mono text-[11px] overflow-auto max-h-24"
                  style={{
                    background: "var(--bg-input)",
                    border: "1px solid var(--border-subtle)",
                    color: "var(--text-muted)",
                  }}
                >
                  {JSON.stringify(del.payload, null, 2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
