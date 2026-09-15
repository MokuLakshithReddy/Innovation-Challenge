"use client";

import React, { useState, useEffect } from "react";
import { GitCommit, Cpu, GitCompare, ShieldCheck, FileCode2, CheckCircle2, RotateCcw, Sparkles, Info, ChevronRight, Layers } from "lucide-react";
import { MOCK_PIPELINE_STAGES, MOCK_PIPELINE_LOGS, PipelineStage, PipelineLog } from "@/data/pipelineData";
import { CommitActivity } from "@/data/mockData";
import { TerminalConsole } from "@/components/pipeline/TerminalConsole";
import { cn } from "@/lib/utils";

interface PipelineViewProps {
  selectedCommit: CommitActivity;
  onNavigateToDiff: () => void;
  onNavigateToSpecs: () => void;
}

export const PipelineView: React.FC<PipelineViewProps> = ({ selectedCommit, onNavigateToDiff, onNavigateToSpecs }) => {
  const [stages, setStages] = useState<PipelineStage[]>(MOCK_PIPELINE_STAGES);
  const [selectedStage, setSelectedStage] = useState<PipelineStage>(MOCK_PIPELINE_STAGES[0]);
  const [logs, setLogs] = useState<PipelineLog[]>(MOCK_PIPELINE_LOGS);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const getStageIcon = (id: string) => {
    switch (id) {
      case "stage-1": return GitCommit;
      case "stage-2": return Cpu;
      case "stage-3": return GitCompare;
      case "stage-4": return ShieldCheck;
      case "stage-5": return FileCode2;
      default: return Layers;
    }
  };

  const handleReplaySimulation = () => {
    setIsSimulating(true);
    setStages((prev) => prev.map((s, idx) => ({ ...s, status: idx === 0 ? "running" : "pending" })));
    setLogs([]);
    MOCK_PIPELINE_LOGS.forEach((logItem, idx) => {
      setTimeout(() => {
        setLogs((prev) => [...prev, logItem]);
        if (idx === 2) setStages((p) => p.map((s) => (s.id === "stage-1" ? { ...s, status: "completed" } : s.id === "stage-2" ? { ...s, status: "running" } : s)));
        else if (idx === 6) setStages((p) => p.map((s) => (s.id === "stage-2" ? { ...s, status: "completed" } : s.id === "stage-3" ? { ...s, status: "running" } : s)));
        else if (idx === 9) setStages((p) => p.map((s) => (s.id === "stage-3" ? { ...s, status: "completed" } : s.id === "stage-4" ? { ...s, status: "running" } : s)));
        else if (idx === 12) setStages((p) => p.map((s) => (s.id === "stage-4" ? { ...s, status: "completed" } : s.id === "stage-5" ? { ...s, status: "running" } : s)));
        else if (idx === MOCK_PIPELINE_LOGS.length - 1) { setStages((p) => p.map((s) => ({ ...s, status: "completed" }))); setIsSimulating(false); }
      }, (idx + 1) * 350);
    });
  };

  return (
    <div className="space-y-6 select-none">
      {/* Header Banner */}
      <div className="rounded-xl p-6 border" style={{ background: "var(--bg-card)", borderColor: "var(--border-primary)", boxShadow: "var(--shadow-sm)" }}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="font-mono text-[12px] font-semibold px-2 py-0.5 rounded" style={{ background: "var(--accent-bg)", color: "var(--accent)", border: "1px solid var(--accent-border)" }}>
                {selectedCommit.hash}
              </span>
              <span className="text-[12px] font-mono" style={{ color: "var(--text-muted)" }}>on {selectedCommit.branch}</span>
              <div className="flex items-center gap-1 text-[12px] font-mono" style={{ color: "var(--success)" }}>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>All 5 Stages Passed</span>
              </div>
            </div>
            <h2 className="text-lg font-bold mt-1.5" style={{ color: "var(--text-primary)" }}>{selectedCommit.message}</h2>
            <p className="text-[13px] mt-1 font-mono" style={{ color: "var(--text-muted)" }}>
              by {selectedCommit.author.name} • {selectedCommit.duration}
            </p>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            <button onClick={handleReplaySimulation} disabled={isSimulating} className="flex items-center gap-2 px-3.5 py-2 rounded-lg border text-[13px] font-medium transition" style={{ background: "var(--bg-elevated)", borderColor: "var(--border-primary)", color: "var(--accent)" }}>
              <RotateCcw className={cn("w-3.5 h-3.5", isSimulating && "animate-spin")} />
              <span>{isSimulating ? "Replaying..." : "Replay Pipeline"}</span>
            </button>
            <button onClick={onNavigateToDiff} className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-[13px] font-medium text-white transition" style={{ background: "var(--accent)", boxShadow: "var(--shadow-glow)" }}>
              <GitCompare className="w-3.5 h-3.5" />
              <span>View Diff</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5-Stage Stepper */}
      <div className="rounded-xl p-6 border" style={{ background: "var(--bg-card)", borderColor: "var(--border-primary)", boxShadow: "var(--shadow-sm)" }}>
        <div className="flex items-center gap-2 mb-5">
          <Sparkles className="w-4 h-4" style={{ color: "var(--accent)" }} />
          <span className="text-[13px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>Workflow Stages</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {stages.map((stage, idx) => {
            const Icon = getStageIcon(stage.id);
            const isSelected = selectedStage.id === stage.id;
            const isCompleted = stage.status === "completed";
            const isRunning = stage.status === "running";
            return (
              <div key={stage.id} onClick={() => setSelectedStage(stage)} className="p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between"
                style={{
                  background: isSelected ? "var(--accent-bg)" : "var(--bg-elevated)",
                  borderColor: isSelected ? "var(--accent-border)" : "var(--border-primary)",
                  boxShadow: isSelected ? "var(--shadow-glow)" : "none",
                  opacity: stage.status === "pending" ? 0.5 : 1,
                }}>
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{
                        background: isCompleted ? "var(--success-bg)" : isRunning ? "var(--accent-bg)" : "var(--bg-card)",
                        color: isCompleted ? "var(--success)" : isRunning ? "var(--accent)" : "var(--text-muted)",
                        border: `1px solid ${isCompleted ? "var(--success-border)" : isRunning ? "var(--accent-border)" : "var(--border-primary)"}`,
                      }}>
                      <Icon className={cn("w-4 h-4", isRunning && "animate-spin")} />
                    </div>
                    <span className="text-[11px] font-mono" style={{ color: "var(--text-muted)" }}>{stage.duration}</span>
                  </div>
                  <div className="text-[11px] font-mono" style={{ color: "var(--text-muted)" }}>Stage {idx + 1}</div>
                  <h4 className="text-[13px] font-semibold mt-0.5" style={{ color: "var(--text-primary)" }}>{stage.name}</h4>
                  <p className="text-[12px] mt-1" style={{ color: "var(--text-muted)" }}>{stage.shortDesc}</p>
                </div>
                <div className="mt-4 pt-3 border-t flex items-center justify-between" style={{ borderColor: "var(--border-subtle)" }}>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full uppercase"
                    style={{
                      background: isCompleted ? "var(--success-bg)" : isRunning ? "var(--accent-bg)" : "var(--bg-card)",
                      color: isCompleted ? "var(--success)" : isRunning ? "var(--accent)" : "var(--text-muted)",
                      border: `1px solid ${isCompleted ? "var(--success-border)" : isRunning ? "var(--accent-border)" : "var(--border-primary)"}`,
                    }}>{stage.status}</span>
                  {isCompleted && <CheckCircle2 className="w-3.5 h-3.5" style={{ color: "var(--success)" }} />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stage Details */}
      <div className="rounded-xl p-6 border" style={{ background: "var(--bg-card)", borderColor: "var(--border-primary)", boxShadow: "var(--shadow-sm)" }}>
        <div className="flex items-center justify-between mb-4 pb-4 border-b" style={{ borderColor: "var(--border-primary)" }}>
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4" style={{ color: "var(--accent)" }} />
            <h3 className="text-[14px] font-semibold" style={{ color: "var(--text-primary)" }}>Stage: {selectedStage.name}</h3>
          </div>
          <span className="text-[12px] font-mono" style={{ color: "var(--text-muted)" }}>{selectedStage.duration}</span>
        </div>
        <p className="text-[13px] mb-4" style={{ color: "var(--text-secondary)" }}>{selectedStage.description}</p>
        {selectedStage.metrics && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            {selectedStage.metrics.map((m, i) => (
              <div key={i} className="p-3 rounded-lg border" style={{ background: "var(--bg-elevated)", borderColor: "var(--border-primary)" }}>
                <div className="text-[11px] font-mono uppercase" style={{ color: "var(--text-muted)" }}>{m.label}</div>
                <div className="text-base font-bold mt-0.5" style={{ color: "var(--text-primary)" }}>{m.value}</div>
              </div>
            ))}
          </div>
        )}
        <div className="p-4 rounded-xl border space-y-1.5 font-mono text-[12px]" style={{ background: "var(--bg-elevated)", borderColor: "var(--border-primary)" }}>
          <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>Execution Traces</div>
          {selectedStage.details.map((detail, idx) => (
            <div key={idx} className="flex items-center gap-2" style={{ color: "var(--text-secondary)" }}>
              <ChevronRight className="w-3 h-3 shrink-0" style={{ color: "var(--accent)" }} />
              <span>{detail}</span>
            </div>
          ))}
        </div>
      </div>

      <TerminalConsole logs={logs} isStreaming={isSimulating} onReplay={handleReplaySimulation} />
    </div>
  );
};
