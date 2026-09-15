"use client";

import React, { useState } from "react";
import {
  LayoutDashboard,
  Workflow,
  FileCode2,
  GitCompare,
  Radio,
  SlidersHorizontal,
  ChevronDown,
  GitBranch,
  Search,
  Bot,
  CheckCircle2,
  Sun,
  Moon,
} from "lucide-react";
import { GithubIcon } from "@/components/icons/BrandIcons";
import { MOCK_REPOSITORIES, Repository } from "@/data/mockData";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  selectedRepo: Repository;
  onSelectRepo: (repo: Repository) => void;
  onOpenSearch: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  selectedRepo,
  onSelectRepo,
  onOpenSearch,
}) => {
  const [repoDropdownOpen, setRepoDropdownOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "pipeline", label: "Pipeline Runs", icon: Workflow, badge: "Active" },
    { id: "diff", label: "API Diff Inspector", icon: GitCompare, badge: "3" },
    { id: "specs", label: "API Specifications", icon: FileCode2 },
    { id: "webhooks", label: "Webhooks", icon: Radio },
    { id: "settings", label: "Settings", icon: SlidersHorizontal },
  ];

  return (
    <aside
      className="w-60 shrink-0 flex flex-col h-screen select-none border-r transition-colors"
      style={{
        background: "var(--bg-secondary)",
        borderColor: "var(--border-primary)",
      }}
    >
      {/* Brand */}
      <div
        className="px-5 py-4 flex items-center gap-3 border-b"
        style={{ borderColor: "var(--border-primary)" }}
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-md">
          <Bot className="w-4 h-4 text-white" />
        </div>
        <div>
          <span className="font-semibold text-sm tracking-tight" style={{ color: "var(--text-primary)" }}>
            DocPulse
          </span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>
              Agent Online
            </span>
          </div>
        </div>
      </div>

      {/* Repository Selector */}
      <div className="px-4 py-3 border-b relative" style={{ borderColor: "var(--border-primary)" }}>
        <span className="text-[11px] uppercase tracking-wider font-semibold block mb-1.5" style={{ color: "var(--text-muted)" }}>
          Repository
        </span>
        <button
          onClick={() => setRepoDropdownOpen(!repoDropdownOpen)}
          className="w-full flex items-center justify-between p-2.5 rounded-lg border transition text-left"
          style={{
            background: "var(--bg-elevated)",
            borderColor: "var(--border-primary)",
          }}
        >
          <div className="flex items-center gap-2 overflow-hidden">
            <GitBranch className="w-4 h-4 shrink-0" style={{ color: "var(--accent)" }} />
            <div className="truncate">
              <p className="font-medium text-[13px] truncate" style={{ color: "var(--text-primary)" }}>
                {selectedRepo.name}
              </p>
              <p className="text-[11px] font-mono truncate" style={{ color: "var(--text-muted)" }}>
                {selectedRepo.framework}
              </p>
            </div>
          </div>
          <ChevronDown
            className={cn(
              "w-4 h-4 transition-transform shrink-0",
              repoDropdownOpen && "rotate-180"
            )}
            style={{ color: "var(--text-muted)" }}
          />
        </button>

        {repoDropdownOpen && (
          <div
            className="absolute top-full left-4 right-4 mt-1 rounded-lg shadow-lg py-1 z-50 border"
            style={{
              background: "var(--bg-card)",
              borderColor: "var(--border-primary)",
              boxShadow: "var(--shadow-lg)",
            }}
          >
            {MOCK_REPOSITORIES.map((repo) => (
              <button
                key={repo.id}
                onClick={() => {
                  onSelectRepo(repo);
                  setRepoDropdownOpen(false);
                }}
                className="w-full text-left px-3 py-2 transition flex items-center justify-between text-[13px]"
                style={{
                  color: selectedRepo.id === repo.id ? "var(--accent)" : "var(--text-secondary)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-card-hover)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <div className="truncate">
                  <div className="truncate font-medium">{repo.name}</div>
                  <div className="text-[11px] font-mono" style={{ color: "var(--text-muted)" }}>
                    {repo.framework}
                  </div>
                </div>
                {selectedRepo.id === repo.id && (
                  <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: "var(--accent)" }} />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Search */}
      <div className="px-4 pt-3 pb-1">
        <button
          onClick={onOpenSearch}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg border transition text-[13px]"
          style={{
            background: "var(--bg-elevated)",
            borderColor: "var(--border-primary)",
            color: "var(--text-muted)",
          }}
        >
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            <span>Search...</span>
          </div>
          <kbd
            className="text-[11px] font-mono px-1.5 py-0.5 rounded"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-primary)",
              color: "var(--text-muted)",
            }}
          >
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all"
              )}
              style={{
                background: isActive ? "var(--accent-bg)" : "transparent",
                color: isActive ? "var(--accent)" : "var(--text-secondary)",
                border: isActive ? "1px solid var(--accent-border)" : "1px solid transparent",
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.background = "var(--bg-card-hover)";
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.background = "transparent";
              }}
            >
              <div className="flex items-center gap-3">
                <Icon className="w-[18px] h-[18px]" />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className="text-[11px] font-mono px-2 py-0.5 rounded-full"
                  style={{
                    background: "var(--accent-bg)",
                    color: "var(--accent)",
                    border: "1px solid var(--accent-border)",
                  }}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer: Theme toggle + User */}
      <div className="px-4 py-3 border-t space-y-3" style={{ borderColor: "var(--border-primary)" }}>
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg border transition text-[13px]"
          style={{
            background: "var(--bg-elevated)",
            borderColor: "var(--border-primary)",
            color: "var(--text-secondary)",
          }}
        >
          <div className="flex items-center gap-2.5">
            {theme === "dark" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            <span>{theme === "dark" ? "Dark Mode" : "Light Mode"}</span>
          </div>
          <div
            className="w-8 h-[18px] rounded-full flex items-center transition-all px-0.5"
            style={{
              background: theme === "dark" ? "var(--accent)" : "var(--border-primary)",
              justifyContent: theme === "dark" ? "flex-end" : "flex-start",
            }}
          >
            <div className="w-3.5 h-3.5 rounded-full bg-white shadow-sm" />
          </div>
        </button>

        {/* User */}
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-cyan-500 flex items-center justify-center text-[11px] font-bold text-white shrink-0"
          >
            SR
          </div>
          <div className="truncate">
            <p className="text-[13px] font-medium truncate" style={{ color: "var(--text-primary)" }}>
              Spurthi Reddy
            </p>
            <p className="text-[11px] truncate" style={{ color: "var(--text-muted)" }}>
              Enterprise Plan
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
