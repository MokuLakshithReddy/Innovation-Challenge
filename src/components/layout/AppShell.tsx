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
import { AstCodeAnalyzer } from "@/components/parser/AstCodeAnalyzer";
import { WebhookManager } from "@/components/webhooks/WebhookManager";
import { SettingsManager } from "@/components/settings/SettingsManager";
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

          {/* AST CODE ANALYZER */}
          {currentTab === "analyzer" && <AstCodeAnalyzer />}

          {/* DIFF */}
          {currentTab === "diff" && <ApiDiffViewer onOpenSpecs={() => setCurrentTab("specs")} />}

          {/* SPECS */}
          {currentTab === "specs" && <LiveSpecPreview />}

          {/* WEBHOOKS */}
          {currentTab === "webhooks" && <WebhookManager />}

          {/* SETTINGS */}
          {currentTab === "settings" && <SettingsManager />}
        </main>
      </div>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} onNavigate={setCurrentTab} />
    </div>
  );
};
