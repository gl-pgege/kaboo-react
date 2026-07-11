import { useActivity } from "../hooks/useActivity";
import { useDrill } from "../hooks/useDrill";

/**
 * Breadcrumb navigation for the drill-down path: a "Chat" root followed by one
 * crumb per drilled-in group. Clicking a crumb jumps to that level; the current
 * (last) crumb is disabled. Renders nothing at the root. Pair with
 * {@link DrillDetailView}.
 *
 * @example
 * ```tsx
 * import { GlassTabs, DrillDetailView } from "kaboo-react";
 *
 * function DrillArea() {
 *   return (
 *     <>
 *       <GlassTabs />
 *       <DrillDetailView />
 *     </>
 *   );
 * }
 * ```
 */
export function GlassTabs() {
  const { drillPath, drillToRoot, drillToLevel } = useDrill();
  const { groups } = useActivity();

  if (drillPath.length === 0) return null;

  const tabs: { id: string; label: string; level: number }[] = [
    { id: "root", label: "Chat", level: -1 },
    ...drillPath.map((id, i) => ({
      id,
      label: groups[id]?.title || id,
      level: i,
    })),
  ];

  return (
    <nav className="kaboo-breadcrumb-bar">
      {tabs.map((tab, i) => {
        const isLast = i === tabs.length - 1;
        return (
          <span key={tab.id} className="kaboo-breadcrumb-item">
            {i > 0 && (
              <svg width={12} height={12} viewBox="0 0 16 16" className="kaboo-breadcrumb-sep">
                <path d="M6 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            )}
            <button
              className={`kaboo-breadcrumb-link ${isLast ? "kaboo-breadcrumb-current" : ""}`}
              onClick={() => {
                if (isLast) return;
                if (tab.level === -1) drillToRoot();
                else drillToLevel(tab.level);
              }}
              disabled={isLast}
            >
              {i === 0 && (
                <svg width={14} height={14} viewBox="0 0 16 16" className="kaboo-breadcrumb-icon">
                  <path d="M3 8.5L8 4l5 4.5M4.5 7.5V12h2.5V9.5h2V12h2.5V7.5" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
              {tab.label}
            </button>
          </span>
        );
      })}
    </nav>
  );
}
