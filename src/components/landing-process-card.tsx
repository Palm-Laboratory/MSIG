"use client";

import { useMemo, useState } from "react";

type ProcessPart = {
  label: string;
  title: string;
  bullets: string[];
};

type LandingProcessCardProps = {
  parts: ProcessPart[];
};

export function LandingProcessCard({ parts }: LandingProcessCardProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedPart = parts[selectedIndex] ?? parts[0];

  const panelId = useMemo(() => `process-panel-${selectedIndex + 1}`, [selectedIndex]);

  return (
    <div className="process-desktop-card">
      <div className="process-tabs" role="tablist" aria-label="진단 파트 선택">
        {parts.map((part, index) => {
          const isSelected = index === selectedIndex;

          return (
            <button
              aria-controls={isSelected ? panelId : undefined}
              aria-selected={isSelected}
              className={isSelected ? "selected" : undefined}
              key={part.label}
              onClick={() => setSelectedIndex(index)}
              role="tab"
              type="button"
            >
              <svg aria-hidden="true" className="process-tab-shape" preserveAspectRatio="none" viewBox="0 0 232 68">
                <path d="M10 0H178C191 0 199 4 204 16L232 68H0V10C0 4 4 0 10 0Z" />
              </svg>
              <span>{part.label}</span>
            </button>
          );
        })}
      </div>

      <div className={`process-panel process-panel-${selectedIndex + 1}`}>
        <article className="process-panel-card" id={panelId} key={selectedPart.label} role="tabpanel">
          <h3>{selectedPart.title}</h3>
          <ul>
            {selectedPart.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        </article>
      </div>
    </div>
  );
}
