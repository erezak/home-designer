import { useMemo, useState } from 'react';
import { useDesign } from '../context/DesignContext';
import { type DesignElement } from '../types';

interface ToolbarProps {
  dense?: boolean;
}

export function Toolbar({ dense = false }: ToolbarProps) {
  const { state, setView, setZoom, selectElement, setCanvas } = useDesign();
  const [query, setQuery] = useState('');
  const elements = state.elements;

  const flatElements = useMemo(() => {
    const items: { id: string; name: string }[] = [];
    const walk = (els: DesignElement[]) => {
      els.forEach((el) => {
        items.push({ id: el.id, name: el.name });
        if (el.children.length) walk(el.children);
      });
    };
    walk(elements);
    return items;
  }, [elements]);

  const handleJump = (value: string) => {
    const match = flatElements.find((el) => el.name.toLowerCase().includes(value.toLowerCase()));
    if (match) {
      selectElement(match.id);
    }
  };

  const viewButtons = (
    <div className="flex items-center gap-1">
      {(['elevation', 'plan'] as const).map((view) => (
        <button
          key={view}
          onClick={() => setView(view)}
          className={`chip ${state.activeView === view ? 'chip-active' : ''}`}
        >
          {view === 'elevation' ? 'Elevation' : 'Plan'}
        </button>
      ))}
    </div>
  );

  if (dense) {
    return (
      <div className="space-y-2">
        <div className="flex flex-wrap gap-1">{viewButtons}</div>
        <div className="flex flex-wrap gap-1 text-[11px] text-slate-400">
          <span className="badge subtle">Zoom {Math.round(state.zoom * 100)}%</span>
          <span className="badge subtle">Grid {state.canvas.showGrid ? 'on' : 'off'}</span>
          <span className="badge subtle">{state.elements.length} items</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <div className="flex items-center gap-2">
        <span className="text-xs uppercase tracking-wide text-slate-500">View</span>
        {viewButtons}
      </div>

      <div className="flex-1 min-w-[260px] flex items-center gap-2">
        <div className="relative flex-1">
          <input
            className="input-field pr-10"
            placeholder="Quick find (⌘K): jump to element by name"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              handleJump(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleJump(query);
            }}
          />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] text-slate-400">
            {state.elements.length} items
          </span>
        </div>
        <button
          className={`chip ${state.canvas.showAllDistances ? 'chip-active' : ''}`}
          onClick={() => setCanvas({ showAllDistances: !state.canvas.showAllDistances })}
        >
          Distances
        </button>
      </div>

      <div className="flex items-center gap-2 text-sm">
        <span className="text-xs text-slate-500">Zoom</span>
        <button
          onClick={() => setZoom(state.zoom - 0.1)}
          className="icon-btn"
          disabled={state.zoom <= 0.2}
        >
          −
        </button>
        <span className="text-xs font-semibold text-slate-700 w-12 text-center">
          {Math.round(state.zoom * 100)}%
        </span>
        <button
          onClick={() => setZoom(state.zoom + 0.1)}
          className="icon-btn"
          disabled={state.zoom >= 3}
        >
          +
        </button>
        <button
          onClick={() => setZoom(1)}
          className="chip"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
