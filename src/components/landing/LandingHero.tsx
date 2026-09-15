"use client";

import React, { useState } from "react";
import {
  ArrowRight,
  Bot,
  Terminal,
  FileCode2,
  CheckCircle,
  Sparkles,
  Layers,
  Cpu,
  ShieldCheck,
} from "lucide-react";
import { GithubIcon, GitlabIcon } from "@/components/icons/BrandIcons";
import { useTheme } from "@/context/ThemeContext";

interface LandingHeroProps {
  onEnterDashboard: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ onEnterDashboard }) => {
  const [connectingProvider, setConnectingProvider] = useState<string | null>(null);
  const { theme } = useTheme();

  const handleConnect = (provider: string) => {
    setConnectingProvider(provider);
    setTimeout(() => {
      setConnectingProvider(null);
      onEnterDashboard();
    }, 1000);
  };

  return (
    <div
      className="relative overflow-hidden min-h-screen flex flex-col justify-between select-none transition-colors"
      style={{ background: "var(--bg-primary)", color: "var(--text-primary)" }}
    >
      {/* Background decorations */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] blur-3xl pointer-events-none"
        style={{
          background: theme === "dark"
            ? "radial-gradient(ellipse, rgba(139,92,246,0.12) 0%, transparent 70%)"
            : "radial-gradient(ellipse, rgba(124,58,237,0.08) 0%, transparent 70%)",
        }}
      />

      {/* Top Bar */}
      <header className="relative z-10 max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold tracking-tight text-base" style={{ color: "var(--text-primary)" }}>
            DocPulse
          </span>
        </div>
        <button
          onClick={onEnterDashboard}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border text-[13px] font-medium transition"
          style={{
            background: "var(--bg-card)",
            borderColor: "var(--border-primary)",
            color: "var(--text-secondary)",
          }}
        >
          Open Dashboard
          <ArrowRight className="w-3.5 h-3.5" style={{ color: "var(--accent)" }} />
        </button>
      </header>

      {/* Hero */}
      <main className="relative z-10 max-w-5xl mx-auto px-6 pt-8 pb-16 text-center flex flex-col items-center">
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[12px] font-mono mb-8"
          style={{
            background: "var(--accent-bg)",
            border: "1px solid var(--accent-border)",
            color: "var(--accent)",
          }}
        >
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>Continuous OpenAPI 3.1 Generation</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] max-w-4xl">
          API Docs that{" "}
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage: theme === "dark"
                ? "linear-gradient(135deg, #a78bfa, #38bdf8)"
                : "linear-gradient(135deg, #7c3aed, #0284c7)",
            }}
          >
            write themselves.
          </span>
        </h1>

        <p className="mt-6 text-lg md:text-xl max-w-2xl leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          DocPulse connects to your backend repositories, extracts route declarations on every commit,
          validates schemas, and deploys updated Swagger & Redoc specs autonomously.
        </p>

        {/* Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => handleConnect("github")}
            disabled={connectingProvider !== null}
            className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-[14px] text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: "linear-gradient(135deg, var(--accent), #6d28d9)",
              boxShadow: "var(--shadow-glow)",
            }}
          >
            <GithubIcon className="w-5 h-5 text-white" />
            <span>{connectingProvider === "github" ? "Connecting..." : "Connect with GitHub"}</span>
            <ArrowRight className="w-4 h-4 opacity-70" />
          </button>

          <button
            onClick={() => handleConnect("gitlab")}
            disabled={connectingProvider !== null}
            className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-[14px] transition-all hover:scale-[1.02] active:scale-[0.98] border"
            style={{
              background: "var(--bg-card)",
              borderColor: "var(--border-primary)",
              color: "var(--text-primary)",
            }}
          >
            <GitlabIcon className="w-5 h-5" style={{ color: "var(--warning)" }} />
            <span>{connectingProvider === "gitlab" ? "Connecting..." : "Connect with GitLab"}</span>
          </button>
        </div>

        {/* Pipeline Diagram */}
        <div
          className="mt-14 w-full max-w-5xl rounded-2xl border p-6 relative overflow-hidden"
          style={{
            background: "var(--bg-card)",
            borderColor: "var(--border-primary)",
            boxShadow: "var(--shadow-lg)",
          }}
        >
          <div
            className="flex items-center justify-between pb-4 border-b mb-6"
            style={{ borderColor: "var(--border-primary)" }}
          >
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ background: "var(--danger)", opacity: 0.8 }} />
              <span className="w-3 h-3 rounded-full" style={{ background: "var(--warning)", opacity: 0.8 }} />
              <span className="w-3 h-3 rounded-full" style={{ background: "var(--success)", opacity: 0.8 }} />
              <span className="ml-2 text-[12px] font-mono" style={{ color: "var(--text-muted)" }}>
                pipeline-telemetry :: spec-daemon
              </span>
            </div>
            <div className="flex items-center gap-2 text-[12px] font-mono" style={{ color: "var(--success)" }}>
              <span className="w-2 h-2 rounded-full animate-ping" style={{ background: "var(--success)" }} />
              <span>ONLINE</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {[
              { icon: Terminal, title: "1. Git Push", desc: "Commit Diff", detail: "POST /v2/refunds", color: "--accent" },
              { icon: Cpu, title: "2. AST Parser", desc: "Express / Python", detail: "Parse JSDoc & DTOs", color: "--info" },
              { icon: Layers, title: "3. Diff Engine", desc: "Semantic Compare", detail: "+1 Add, ~2 Schema", color: "--info" },
              { icon: ShieldCheck, title: "4. Validator", desc: "OpenAPI 3.1", detail: "Zero Violations", color: "--success" },
              { icon: FileCode2, title: "5. Deploy", desc: "Swagger / Redoc", detail: "Live Preview", color: "--warning" },
            ].map((stage, i) => {
              const Icon = stage.icon;
              return (
                <div
                  key={i}
                  className="p-4 rounded-xl border flex flex-col items-center text-center"
                  style={{
                    background: "var(--bg-elevated)",
                    borderColor: "var(--border-primary)",
                  }}
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center mb-2"
                    style={{
                      background: `color-mix(in srgb, var(${stage.color}) 12%, transparent)`,
                      border: `1px solid color-mix(in srgb, var(${stage.color}) 25%, transparent)`,
                      color: `var(${stage.color})`,
                    }}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[13px] font-semibold" style={{ color: "var(--text-primary)" }}>
                    {stage.title}
                  </span>
                  <span className="text-[11px] font-mono mt-0.5" style={{ color: "var(--text-muted)" }}>
                    {stage.desc}
                  </span>
                  <span
                    className="mt-2 text-[10px] font-mono px-2 py-0.5 rounded"
                    style={{
                      background: `color-mix(in srgb, var(${stage.color}) 10%, transparent)`,
                      color: `var(${stage.color})`,
                      border: `1px solid color-mix(in srgb, var(${stage.color}) 20%, transparent)`,
                    }}
                  >
                    {stage.detail}
                  </span>
                </div>
              );
            })}
          </div>

          <div
            className="mt-6 pt-4 border-t flex flex-wrap items-center justify-between text-[13px]"
            style={{ borderColor: "var(--border-primary)" }}
          >
            <div className="flex items-center gap-2" style={{ color: "var(--text-secondary)" }}>
              <CheckCircle className="w-4 h-4" style={{ color: "var(--success)" }} />
              <span>Supports Express, NestJS, FastAPI, and Flask</span>
            </div>
            <button
              onClick={onEnterDashboard}
              className="font-medium flex items-center gap-1 transition"
              style={{ color: "var(--accent)" }}
            >
              Explore Dashboard
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </main>

      <footer
        className="relative z-10 border-t py-6 px-6 text-center text-[12px] font-mono"
        style={{ borderColor: "var(--border-primary)", color: "var(--text-muted)" }}
      >
        DocPulse API Documentation Agent • Autonomous Developer Experience
      </footer>
    </div>
  );
};
