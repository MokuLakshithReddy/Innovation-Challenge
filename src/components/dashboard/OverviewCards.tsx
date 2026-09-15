"use client";

import React from "react";
import { FileCode, Activity, CheckCircle, Clock, TrendingUp } from "lucide-react";
import { Repository } from "@/data/mockData";

interface OverviewCardsProps {
  repo: Repository;
}

export const OverviewCards: React.FC<OverviewCardsProps> = ({ repo }) => {
  const cards = [
    {
      title: "Total Endpoints",
      value: String(repo.totalEndpoints),
      subtitle: "+3 this week",
      icon: FileCode,
      accentVar: "--accent",
      pills: [
        { label: "24 GET", color: "--info" },
        { label: "12 POST", color: "--success" },
        { label: "4 PUT", color: "--warning" },
        { label: "2 DEL", color: "--danger" },
      ],
    },
    {
      title: "Recent Changes (24h)",
      value: "6",
      subtitle: "across 4 commits",
      icon: Activity,
      accentVar: "--info",
      pills: [
        { label: "+3 added", color: "--success" },
        { label: "~2 modified", color: "--accent" },
        { label: "-1 removed", color: "--danger" },
      ],
    },
    {
      title: "Pipeline Status",
      value: "Healthy",
      subtitle: "0 errors in 28 runs",
      icon: CheckCircle,
      accentVar: "--success",
      pills: [],
    },
    {
      title: "Doc Drift",
      value: "0.00%",
      subtitle: "Sync with c4a89f2",
      icon: Clock,
      accentVar: "--accent",
      pills: [],
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div
            key={i}
            className="p-5 rounded-xl border transition-all hover:shadow-md cursor-default"
            style={{
              background: "var(--bg-card)",
              borderColor: "var(--border-primary)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[13px] font-medium" style={{ color: "var(--text-secondary)" }}>
                {card.title}
              </span>
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  background: `color-mix(in srgb, var(${card.accentVar}) 12%, transparent)`,
                  color: `var(${card.accentVar})`,
                }}
              >
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-baseline gap-2">
              <span
                className="text-2xl font-bold"
                style={{
                  color: card.title === "Pipeline Status" ? "var(--success)" : "var(--text-primary)",
                }}
              >
                {card.value}
              </span>
              <span className="text-[12px] font-mono" style={{ color: "var(--text-muted)" }}>
                {card.subtitle}
              </span>
            </div>

            {card.pills.length > 0 && (
              <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                {card.pills.map((pill, j) => (
                  <span
                    key={j}
                    className="text-[11px] font-mono px-2 py-0.5 rounded-md"
                    style={{
                      background: `color-mix(in srgb, var(${pill.color}) 10%, transparent)`,
                      color: `var(${pill.color})`,
                      border: `1px solid color-mix(in srgb, var(${pill.color}) 20%, transparent)`,
                    }}
                  >
                    {pill.label}
                  </span>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
