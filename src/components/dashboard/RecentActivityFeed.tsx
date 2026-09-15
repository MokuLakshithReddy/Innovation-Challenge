"use client";

import React from "react";
import { GitCommit, Clock, Sparkles, Workflow, GitCompare } from "lucide-react";
import { CommitActivity } from "@/data/mockData";
import { cn } from "@/lib/utils";

interface RecentActivityFeedProps {
  commits: CommitActivity[];
  selectedCommit: CommitActivity | null;
  onSelectCommit: (commit: CommitActivity) => void;
  onViewPipeline: (commit: CommitActivity) => void;
  onViewDiff: (commit: CommitActivity) => void;
}

export const RecentActivityFeed: React.FC<RecentActivityFeedProps> = ({
  commits,
  selectedCommit,
  onSelectCommit,
  onViewPipeline,
  onViewDiff,
}) => {
  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{
        background: "var(--bg-card)",
        borderColor: "var(--border-primary)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      {/* Header */}
      <div
        className="px-5 py-4 border-b flex items-center justify-between"
        style={{ borderColor: "var(--border-primary)" }}
      >
        <div>
          <h2 className="text-[15px] font-semibold" style={{ color: "var(--text-primary)" }}>
            Recent Commits
          </h2>
          <p className="text-[12px] mt-0.5" style={{ color: "var(--text-muted)" }}>
            Webhook-triggered agent runs on your repository
          </p>
        </div>
      </div>

      {/* Commit List */}
      <div>
        {commits.map((commit) => {
          const isSelected = selectedCommit?.id === commit.id;
          return (
            <div
              key={commit.id}
              onClick={() => onSelectCommit(commit)}
              className="px-5 py-4 border-b transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-3 group"
              style={{
                borderColor: "var(--border-subtle)",
                background: isSelected ? "var(--accent-bg)" : "transparent",
                borderLeft: isSelected ? "3px solid var(--accent)" : "3px solid transparent",
              }}
              onMouseEnter={(e) => {
                if (!isSelected) e.currentTarget.style.background = "var(--bg-card-hover)";
              }}
              onMouseLeave={(e) => {
                if (!isSelected) e.currentTarget.style.background = "transparent";
              }}
            >
              {/* Left: Commit info */}
              <div className="flex items-start gap-3 min-w-0">
                <div
                  className="mt-0.5 w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    background: "var(--accent-bg)",
                    border: "1px solid var(--accent-border)",
                  }}
                >
                  <GitCommit className="w-4 h-4" style={{ color: "var(--accent)" }} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className="font-mono text-[12px] font-semibold px-2 py-0.5 rounded"
                      style={{
                        background: "var(--accent-bg)",
                        color: "var(--accent)",
                        border: "1px solid var(--accent-border)",
                      }}
                    >
                      {commit.hash}
                    </span>
                    <span className="text-[12px] font-mono" style={{ color: "var(--text-muted)" }}>
                      {commit.branch}
                    </span>
                    <span className="flex items-center gap-1 text-[12px]" style={{ color: "var(--text-muted)" }}>
                      <Clock className="w-3 h-3" />
                      {commit.timestamp}
                    </span>
                  </div>

                  <p
                    className="text-[14px] font-medium mt-1.5 truncate"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {commit.message}
                  </p>

                  <p className="text-[12px] mt-1 flex items-center gap-1.5 line-clamp-1" style={{ color: "var(--text-muted)" }}>
                    <Sparkles className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--accent)" }} />
                    <span>{commit.agentSummary}</span>
                  </p>
                </div>
              </div>

              {/* Right: Badges + Actions */}
              <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                <div className="flex items-center gap-1.5 text-[11px] font-mono">
                  {commit.changesCount.added > 0 && (
                    <span
                      className="px-2 py-0.5 rounded-md"
                      style={{
                        background: "var(--success-bg)",
                        color: "var(--success)",
                        border: "1px solid var(--success-border)",
                      }}
                    >
                      +{commit.changesCount.added}
                    </span>
                  )}
                  {commit.changesCount.modified > 0 && (
                    <span
                      className="px-2 py-0.5 rounded-md"
                      style={{
                        background: "var(--accent-bg)",
                        color: "var(--accent)",
                        border: "1px solid var(--accent-border)",
                      }}
                    >
                      ~{commit.changesCount.modified}
                    </span>
                  )}
                  {commit.changesCount.removed > 0 && (
                    <span
                      className="px-2 py-0.5 rounded-md"
                      style={{
                        background: "var(--danger-bg)",
                        color: "var(--danger)",
                        border: "1px solid var(--danger-border)",
                      }}
                    >
                      -{commit.changesCount.removed}
                    </span>
                  )}
                </div>

                <span className="text-[11px] font-mono px-2 py-0.5 rounded" style={{ color: "var(--text-muted)", background: "var(--bg-elevated)" }}>
                  {commit.duration}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={(e) => { e.stopPropagation(); onViewPipeline(commit); }}
                    className="p-1.5 rounded-lg border transition flex items-center gap-1 text-[12px] font-medium"
                    style={{
                      background: "var(--bg-elevated)",
                      borderColor: "var(--border-primary)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    <Workflow className="w-3.5 h-3.5" style={{ color: "var(--accent)" }} />
                    <span className="hidden sm:inline">Pipeline</span>
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); onViewDiff(commit); }}
                    className="p-1.5 rounded-lg border transition flex items-center gap-1 text-[12px] font-medium"
                    style={{
                      background: "var(--bg-elevated)",
                      borderColor: "var(--border-primary)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    <GitCompare className="w-3.5 h-3.5" style={{ color: "var(--info)" }} />
                    <span className="hidden sm:inline">Diff</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
