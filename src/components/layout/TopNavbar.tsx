"use client";

import React, { useState } from "react";
import {
  GitBranch,
  ChevronDown,
  Zap,
  Check,
  RefreshCw,
  Home,
  Sun,
  Moon,
} from "lucide-react";
import { GithubIcon } from "@/components/icons/BrandIcons";
import { Repository } from "@/data/mockData";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

interface TopNavbarProps {
  selectedRepo: Repository;
  currentBranch: string;
  onSelectBranch: (branch: string) => void;
  onTriggerScan: () => void;
  isScanning: boolean;
  activeView: "dashboard" | "landing";
  onToggleView: (view: "dashboard" | "landing") => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  selectedRepo,
  currentBranch,
  onSelectBranch,
  onTriggerScan,
  isScanning,
  activeView,
  onToggleView,
}) => {
  const [branchDropdownOpen, setBranchDropdownOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <header
      className="h-14 border-b px-5 flex items-center justify-between sticky top-0 z-40 select-none backdrop-blur-md transition-colors"
      style={{
        background: theme === "dark" ? "rgba(12, 13, 20, 0.85)" : "rgba(255, 255, 255, 0.85)",
        borderColor: "var(--border-primary)",
      }}
    >
      {/* Left: Breadcrumb & Branch */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-[13px] font-mono">
          <span style={{ color: "var(--text-muted)" }}>{selectedRepo.org}</span>
          <span style={{ color: "var(--text-muted)" }}>/</span>
          <span className="font-semibold" style={{ color: "var(--text-primary)" }}>
            {selectedRepo.name}
          </span>
        </div>

        <div className="w-px h-5" style={{ background: "var(--border-primary)" }} />

        {/* Branch Selector */}
        <div className="relative">
          <button
            onClick={() => setBranchDropdownOpen(!branchDropdownOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition text-[13px] font-mono"
            style={{
              background: "var(--bg-elevated)",
              borderColor: "var(--border-primary)",
              color: "var(--text-secondary)",
            }}
          >
            <GitBranch className="w-3.5 h-3.5" style={{ color: "var(--accent)" }} />
            <span>{currentBranch}</span>
            <ChevronDown className="w-3 h-3" style={{ color: "var(--text-muted)" }} />
          </button>

          {branchDropdownOpen && (
            <div
              className="absolute top-full left-0 mt-1 w-48 rounded-lg py-1 z-50 border"
              style={{
                background: "var(--bg-card)",
                borderColor: "var(--border-primary)",
                boxShadow: "var(--shadow-lg)",
              }}
            >
              {selectedRepo.branches.map((b) => (
                <button
                  key={b}
                  onClick={() => {
                    onSelectBranch(b);
                    setBranchDropdownOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-[13px] font-mono transition flex items-center justify-between"
                  style={{
                    color: currentBranch === b ? "var(--accent)" : "var(--text-secondary)",
                    background: currentBranch === b ? "var(--accent-bg)" : "transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (currentBranch !== b) e.currentTarget.style.background = "var(--bg-card-hover)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = currentBranch === b ? "var(--accent-bg)" : "transparent";
                  }}
                >
                  <span className="truncate">{b}</span>
                  {currentBranch === b && <Check className="w-3.5 h-3.5" style={{ color: "var(--accent)" }} />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sync Badge */}
        <div
          className="hidden md:flex items-center gap-1.5 text-[12px] font-mono px-2.5 py-1 rounded-full"
          style={{
            background: "var(--success-bg)",
            border: "1px solid var(--success-border)",
            color: "var(--success)",
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "var(--success)" }} />
          <span>Synced {selectedRepo.lastSync}</span>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Landing Page Link */}
        <button
          onClick={() => onToggleView(activeView === "dashboard" ? "landing" : "dashboard")}
          className="px-3 py-1.5 rounded-lg border text-[12px] font-medium transition flex items-center gap-1.5"
          style={{
            background: "var(--bg-elevated)",
            borderColor: "var(--border-primary)",
            color: "var(--text-secondary)",
          }}
        >
          <Home className="w-3.5 h-3.5" />
          <span>{activeView === "dashboard" ? "Home" : "Dashboard"}</span>
        </button>

        {/* Trigger Scan */}
        <button
          onClick={onTriggerScan}
          disabled={isScanning}
          className={cn(
            "flex items-center gap-2 px-4 py-1.5 rounded-lg text-[13px] font-semibold text-white transition-all shadow-md",
            isScanning ? "opacity-70 cursor-not-allowed" : "hover:scale-[1.02] active:scale-[0.98]"
          )}
          style={{
            background: isScanning
              ? "var(--accent)"
              : "linear-gradient(135deg, var(--accent), #6d28d9)",
            boxShadow: isScanning ? "none" : "var(--shadow-glow)",
          }}
        >
          {isScanning ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Scanning...</span>
            </>
          ) : (
            <>
              <Zap className="w-3.5 h-3.5" />
              <span>Trigger Scan</span>
            </>
          )}
        </button>

        {/* Theme Toggle (compact) */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg border transition"
          style={{
            background: "var(--bg-elevated)",
            borderColor: "var(--border-primary)",
            color: "var(--text-secondary)",
          }}
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* GitHub */}
        <a
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
          className="p-2 rounded-lg border transition"
          style={{
            background: "var(--bg-elevated)",
            borderColor: "var(--border-primary)",
            color: "var(--text-secondary)",
          }}
          title="GitHub"
        >
          <GithubIcon className="w-4 h-4" />
        </a>
      </div>
    </header>
  );
};
