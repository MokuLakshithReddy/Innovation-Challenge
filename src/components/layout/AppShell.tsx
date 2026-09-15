"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopNavbar } from "@/components/layout/TopNavbar";
import { OverviewCards } from "@/components/dashboard/OverviewCards";
import { RecentActivityFeed } from "@/components/dashboard/RecentActivityFeed";
import { SearchModal } from "@/components/dashboard/SearchModal";
import { LandingHero } from "@/components/landing/LandingHero";
import { PipelineView } from "@/components/pipeline/PipelineView";
import { ApiDiffViewer } from "@/components/diff/ApiDiffViewer";
import { LiveSpecPreview } from "@/components/specs/LiveSpecPreview";
import { MOCK_REPOSITORIES, MOCK_COMMITS, Repository, CommitActivity } from "@/data/mockData";
import { Sparkles, Workflow, GitCompare, FileCode2, Radio, SlidersHorizontal } from "lucide-react";

export const AppShell: React.FC = () => {
  const [activeView, setActiveView] = useState<"dashboard" | "landing">("dashboard");
  const [currentTab, setCurrentTab] = useState<string>("overview");
  const [selectedRepo, setSelectedRepo] = useState<Repository>(MOCK_REPOSITORIES[0]);
  const [currentBranch, setCurrentBranch] = useState<string>(selectedRepo.branch);
  const [commits] = useState<CommitActivity[]>(MOCK_COMMITS);
  const [selectedCommit, setSelectedCommit] = useState<CommitActivity>(MOCK_COMMITS[0]);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [scanNotification, setScanNotification] = useState<string | null>(null);

  const handleSelectRepo = (repo: Repository) => {
    setSelectedRepo(repo);
    setCurrentBranch(repo.branch);
  };

  const handleTriggerScan = () => {
    setIsScanning(true);
    setScanNotification("Agent scanning routes on '" + currentBranch + "'...");
    setTimeout(() => {
      setIsScanning(false);
      setScanNotification("Scan complete — 1 new route, 0 violations.");
      setTimeout(() => setScanNotification(null), 5000);
    }, 2200);
  };

  // Handle ⌘K globally
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  if (activeView === "landing") {
    return <LandingHero onEnterDashboard={() => setActiveView("dashboard")} />;
  }

  return (
    <div className="flex h-screen w-full overflow-hidden font-sans" style={{ background: "var(--bg-primary)", color: "var(--text-primary)" }}>
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        selectedRepo={selectedRepo}
        onSelectRepo={handleSelectRepo}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <TopNavbar
          selectedRepo={selectedRepo}
          currentBranch={currentBranch}
          onSelectBranch={setCurrentBranch}
          onTriggerScan={handleTriggerScan}
          isScanning={isScanning}
          activeView={activeView}
          onToggleView={setActiveView}
        />

        {/* Scan notification */}
        {scanNotification && (
          <div
            className="px-5 py-2 flex items-center justify-between text-[13px] border-b"
            style={{
              background: "var(--accent-bg)",
              borderColor: "var(--accent-border)",
              color: "var(--accent)",
            }}
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              <span>{scanNotification}</span>
            </div>
            <button onClick={() => setScanNotification(null)} className="text-[12px] font-mono" style={{ color: "var(--text-muted)" }}>
              Dismiss
            </button>
          </div>
        )}

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* OVERVIEW */}
          {currentTab === "overview" && (
            <>
              {/* Repo Header */}
              <div className="rounded-xl p-6 border relative overflow-hidden" style={{ background: "var(--bg-card)", borderColor: "var(--border-primary)", boxShadow: "var(--shadow-sm)" }}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h1 className="text-xl md:text-2xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
                        {selectedRepo.name}
                      </h1>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded-full" style={{ background: "var(--accent-bg)", color: "var(--accent)", border: "1px solid var(--accent-border)" }}>
                        {selectedRepo.framework}
                      </span>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded-full" style={{ background: "var(--success-bg)", color: "var(--success)", border: "1px solid var(--success-border)" }}>
                        OpenAPI {selectedRepo.openApiVersion}
                      </span>
                    </div>
                    <p className="text-[13px] mt-1.5 max-w-2xl" style={{ color: "var(--text-muted)" }}>
                      Automated pipeline monitoring AST route declarations. 0 documentation drift detected.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setCurrentTab("pipeline")} className="px-3 py-1.5 rounded-lg border text-[13px] font-medium transition flex items-center gap-1.5"
                      style={{ background: "var(--bg-elevated)", borderColor: "var(--border-primary)", color: "var(--text-secondary)" }}>
                      <Workflow className="w-3.5 h-3.5" style={{ color: "var(--accent)" }} /> Pipeline
                    </button>
                    <button onClick={() => setCurrentTab("diff")} className="px-3 py-1.5 rounded-lg border text-[13px] font-medium transition flex items-center gap-1.5"
                      style={{ background: "var(--bg-elevated)", borderColor: "var(--border-primary)", color: "var(--text-secondary)" }}>
                      <GitCompare className="w-3.5 h-3.5" style={{ color: "var(--info)" }} /> Diff
                    </button>
                  </div>
                </div>
              </div>

              <OverviewCards repo={selectedRepo} />
              <RecentActivityFeed commits={commits} selectedCommit={selectedCommit} onSelectCommit={setSelectedCommit}
                onViewPipeline={(c) => { setSelectedCommit(c); setCurrentTab("pipeline"); }}
                onViewDiff={(c) => { setSelectedCommit(c); setCurrentTab("diff"); }} />
            </>
          )}

          {/* PIPELINE */}
          {currentTab === "pipeline" && (
            <PipelineView selectedCommit={selectedCommit} onNavigateToDiff={() => setCurrentTab("diff")} onNavigateToSpecs={() => setCurrentTab("specs")} />
          )}

          {/* DIFF */}
          {currentTab === "diff" && <ApiDiffViewer onOpenSpecs={() => setCurrentTab("specs")} />}

          {/* SPECS */}
          {currentTab === "specs" && <LiveSpecPreview />}

          {/* WEBHOOKS */}
          {currentTab === "webhooks" && (
            <div className="space-y-6">
              <div className="rounded-xl p-6 border" style={{ background: "var(--bg-card)", borderColor: "var(--border-primary)" }}>
                <div className="flex items-center gap-2 mb-2">
                  <Radio className="w-5 h-5" style={{ color: "var(--accent)" }} />
                  <h2 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>Webhook Monitors</h2>
                </div>
                <p className="text-[13px]" style={{ color: "var(--text-muted)" }}>Incoming Git push webhooks configured for AST extraction.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: "GitHub Enterprise", target: "https://api.docpulse.agent/v1/webhooks/github/push", status: "ACTIVE (200 OK)", last: "4 minutes ago • 38ms" },
                  { name: "Stripe Ingestion", target: "POST /webhooks/stripe (HMAC-SHA256)", status: "LISTENING", last: "Controller: webhook.route.ts" },
                ].map((wh, i) => (
                  <div key={i} className="p-5 rounded-xl border space-y-3" style={{ background: "var(--bg-card)", borderColor: "var(--border-primary)" }}>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[14px]" style={{ color: "var(--text-primary)" }}>{wh.name}</span>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded" style={{ background: "var(--success-bg)", color: "var(--success)", border: "1px solid var(--success-border)" }}>{wh.status}</span>
                    </div>
                    <p className="text-[12px] font-mono" style={{ color: "var(--text-muted)" }}>{wh.target}</p>
                    <p className="text-[11px] font-mono" style={{ color: "var(--text-muted)" }}>{wh.last}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SETTINGS */}
          {currentTab === "settings" && (
            <div className="space-y-6 max-w-3xl">
              <div className="rounded-xl p-6 border" style={{ background: "var(--bg-card)", borderColor: "var(--border-primary)" }}>
                <div className="flex items-center gap-2 mb-2">
                  <SlidersHorizontal className="w-5 h-5" style={{ color: "var(--accent)" }} />
                  <h2 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>Agent Settings</h2>
                </div>
                <p className="text-[13px]" style={{ color: "var(--text-muted)" }}>CI/CD triggers, AST rulesets, and OpenAPI distribution config.</p>
              </div>
              <div className="p-6 rounded-xl border space-y-5" style={{ background: "var(--bg-card)", borderColor: "var(--border-primary)" }}>
                {[
                  { title: "Auto-Deploy to Swagger Hub", desc: "Publish validated specs on branch merge.", value: "ENABLED" },
                  { title: "Spectral Lint Rules", desc: "Fail on missing operationId or invalid schemas.", value: "STRICT (v6.11)" },
                  { title: "Slack Notifications", desc: "Post diffs to #eng-api-updates on breaking changes.", value: "#ENG-ALERTS" },
                ].map((setting, i) => (
                  <div key={i} className="flex items-center justify-between pb-4 border-b last:border-b-0 last:pb-0" style={{ borderColor: "var(--border-primary)" }}>
                    <div>
                      <span className="text-[14px] font-semibold block" style={{ color: "var(--text-primary)" }}>{setting.title}</span>
                      <span className="text-[12px]" style={{ color: "var(--text-muted)" }}>{setting.desc}</span>
                    </div>
                    <span className="text-[11px] font-mono px-2.5 py-1 rounded-full" style={{ background: "var(--success-bg)", color: "var(--success)", border: "1px solid var(--success-border)" }}>
                      {setting.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} onNavigate={setCurrentTab} />
    </div>
  );
};
