"use client";

import React, { useState, useEffect } from "react";
import {
  SlidersHorizontal,
  Save,
  Check,
  ShieldCheck,
  Bell,
  CloudUpload,
  GitBranch,
  FileCheck,
} from "lucide-react";

export const SettingsManager: React.FC = () => {
  const [autoDeploy, setAutoDeploy] = useState(true);
  const [swaggerHubKey, setSwaggerHubKey] = useState("shub_live_94810298a");
  const [linterRule, setLinterRule] = useState("strict");
  const [slackAlerts, setSlackAlerts] = useState(true);
  const [slackWebhook, setSlackWebhook] = useState("https://hooks.slack.com/services/T00/B00/XXXX");
  const [branches, setBranches] = useState("main, develop, staging");
  const [savedToast, setSavedToast] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("docpulse-settings");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.autoDeploy !== undefined) setAutoDeploy(parsed.autoDeploy);
        if (parsed.linterRule) setLinterRule(parsed.linterRule);
        if (parsed.slackAlerts !== undefined) setSlackAlerts(parsed.slackAlerts);
        if (parsed.branches) setBranches(parsed.branches);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleSave = () => {
    const config = { autoDeploy, swaggerHubKey, linterRule, slackAlerts, slackWebhook, branches };
    localStorage.setItem("docpulse-settings", JSON.stringify(config));
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div
        className="rounded-xl p-6 border relative overflow-hidden"
        style={{
          background: "var(--bg-card)",
          borderColor: "var(--border-primary)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <SlidersHorizontal className="w-5 h-5" style={{ color: "var(--accent)" }} />
              <h2 className="text-xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
                Agent CI/CD Configuration
              </h2>
            </div>
            <p className="text-[13px]" style={{ color: "var(--text-muted)" }}>
              Customize automated AST extraction rules, OpenAPI publishing credentials, and breaking-change alert destinations.
            </p>
          </div>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg font-medium text-[13px] text-white flex items-center gap-2 shadow-sm transition"
            style={{
              background: "linear-gradient(135deg, var(--accent), #6366f1)",
            }}
          >
            {savedToast ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {savedToast ? "Saved!" : "Save Configuration"}
          </button>
        </div>
      </div>

      {savedToast && (
        <div
          className="p-3 rounded-lg border text-[13px] font-medium flex items-center justify-between"
          style={{
            background: "var(--success-bg)",
            borderColor: "var(--success-border)",
            color: "var(--success)",
          }}
        >
          <span>✓ Settings successfully persisted to agent configuration store.</span>
        </div>
      )}

      {/* Settings Sections */}
      <div className="space-y-4">
        {/* Section 1: Auto Deployment */}
        <div
          className="p-5 rounded-xl border space-y-4"
          style={{ background: "var(--bg-card)", borderColor: "var(--border-primary)" }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ background: "var(--accent-bg)", color: "var(--accent)" }}
              >
                <CloudUpload className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-[14px]" style={{ color: "var(--text-primary)" }}>
                  Continuous OpenAPI Deployment
                </h4>
                <p className="text-[12px]" style={{ color: "var(--text-muted)" }}>
                  Automatically sync verified OpenAPI 3.1.0 specifications to SwaggerHub & Redocly.
                </p>
              </div>
            </div>
            <button
              onClick={() => setAutoDeploy(!autoDeploy)}
              className="w-11 h-6 rounded-full transition-colors flex items-center px-1"
              style={{
                background: autoDeploy ? "var(--accent)" : "var(--border-primary)",
                justifyContent: autoDeploy ? "flex-end" : "flex-start",
              }}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
            </button>
          </div>

          {autoDeploy && (
            <div className="pt-3 border-t" style={{ borderColor: "var(--border-subtle)" }}>
              <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1" style={{ color: "var(--text-muted)" }}>
                SwaggerHub API Token
              </label>
              <input
                type="password"
                value={swaggerHubKey}
                onChange={(e) => setSwaggerHubKey(e.target.value)}
                className="w-full p-2 rounded-lg border text-[13px] font-mono outline-none"
                style={{
                  background: "var(--bg-input)",
                  borderColor: "var(--border-primary)",
                  color: "var(--text-primary)",
                }}
              />
            </div>
          )}
        </div>

        {/* Section 2: Spectral Linter */}
        <div
          className="p-5 rounded-xl border space-y-4"
          style={{ background: "var(--bg-card)", borderColor: "var(--border-primary)" }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ background: "var(--success-bg)", color: "var(--success)" }}
              >
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-[14px]" style={{ color: "var(--text-primary)" }}>
                  Spectral Linter Rule Level
                </h4>
                <p className="text-[12px]" style={{ color: "var(--text-muted)" }}>
                  Enforce strict OpenAPI 3.1.0 standards, required response status codes, and operationId presence.
                </p>
              </div>
            </div>

            <select
              value={linterRule}
              onChange={(e) => setLinterRule(e.target.value)}
              className="p-2 rounded-lg border text-[13px] outline-none font-medium"
              style={{
                background: "var(--bg-input)",
                borderColor: "var(--border-primary)",
                color: "var(--text-primary)",
              }}
            >
              <option value="strict">Strict (Fail on Warnings)</option>
              <option value="recommended">Recommended (OAS3 Default)</option>
              <option value="lenient">Lenient (Errors Only)</option>
            </select>
          </div>
        </div>

        {/* Section 3: Branch Monitoring */}
        <div
          className="p-5 rounded-xl border space-y-4"
          style={{ background: "var(--bg-card)", borderColor: "var(--border-primary)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ background: "var(--info-bg)", color: "var(--info)" }}
            >
              <GitBranch className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-[14px]" style={{ color: "var(--text-primary)" }}>
                Monitored Repository Branches
              </h4>
              <p className="text-[12px]" style={{ color: "var(--text-muted)" }}>
                Comma-separated list of branches to trigger automated AST generation.
              </p>
            </div>
          </div>

          <input
            type="text"
            value={branches}
            onChange={(e) => setBranches(e.target.value)}
            className="w-full p-2.5 rounded-lg border text-[13px] font-mono outline-none"
            style={{
              background: "var(--bg-input)",
              borderColor: "var(--border-primary)",
              color: "var(--text-primary)",
            }}
          />
        </div>

        {/* Section 4: Notifications */}
        <div
          className="p-5 rounded-xl border space-y-4"
          style={{ background: "var(--bg-card)", borderColor: "var(--border-primary)" }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ background: "var(--warning-bg)", color: "var(--warning)" }}
              >
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-[14px]" style={{ color: "var(--text-primary)" }}>
                  Breaking Change Notifications
                </h4>
                <p className="text-[12px]" style={{ color: "var(--text-muted)" }}>
                  Send instant Slack/Teams webhook alerts whenever an endpoint deletion or schema drift occurs.
                </p>
              </div>
            </div>
            <button
              onClick={() => setSlackAlerts(!slackAlerts)}
              className="w-11 h-6 rounded-full transition-colors flex items-center px-1"
              style={{
                background: slackAlerts ? "var(--accent)" : "var(--border-primary)",
                justifyContent: slackAlerts ? "flex-end" : "flex-start",
              }}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
            </button>
          </div>

          {slackAlerts && (
            <div className="pt-3 border-t" style={{ borderColor: "var(--border-subtle)" }}>
              <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1" style={{ color: "var(--text-muted)" }}>
                Incoming Webhook URL
              </label>
              <input
                type="text"
                value={slackWebhook}
                onChange={(e) => setSlackWebhook(e.target.value)}
                className="w-full p-2 rounded-lg border text-[13px] font-mono outline-none"
                style={{
                  background: "var(--bg-input)",
                  borderColor: "var(--border-primary)",
                  color: "var(--text-primary)",
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
