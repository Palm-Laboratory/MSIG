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
  // 기본 z-순서: 첫 탭이 가장 위(= parts.length), 오른쪽으로 갈수록 1씩 낮아짐
  const [zOrder, setZOrder] = useState<number[]>(() => parts.map((_, index) => parts.length - index));
  const selectedPart = parts[selectedIndex] ?? parts[0];

  const panelId = useMemo(() => `process-panel-${selectedIndex + 1}`, [selectedIndex]);

  const handleSelect = (index: number) => {
    setSelectedIndex(index);
    // 선택한 탭을 맨 앞으로: 그보다 위에 있던 탭은 1씩 내리고, 아래는 그대로 유지
    setZOrder((prev) => {
      const current = prev[index];
      return prev.map((z, idx) => {
        if (idx === index) return parts.length;
        if (z > current) return z - 1;
        return z;
      });
    });
  };

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
              onClick={() => handleSelect(index)}
              role="tab"
              style={{ zIndex: zOrder[index] }}
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
