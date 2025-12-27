import { useDesign } from '../context/DesignContext';

export function Toolbar() {
  const { state, setView, setZoom } = useDesign();
  const initials = state.canvas.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() || '')
    .filter(Boolean)
    .join('') || 'HD';

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur px-4 py-3 flex items-center justify-between shadow-lg shadow-black/30 no-print">
      {/* Left: Title */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-[var(--accent)]/25 border border-[var(--accent)]/40 flex items-center justify-center font-semibold text-white">
          {initials}
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-gray-400">Monochrome Plus One</p>
          <h1 className="text-lg font-semibold text-white">{state.canvas.name}</h1>
        </div>
      </div>

      {/* Center: View Toggle */}
      <div className="flex items-center gap-2">
        <span className="text-xs uppercase tracking-wide text-gray-400 mr-1">View</span>
        <button
          onClick={() => setView('elevation')}
          className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition-all ${
            state.activeView === 'elevation'
              ? 'bg-[var(--accent)] text-white border-[var(--accent)] shadow-[0_10px_30px_rgba(124,109,246,0.45)]'
              : 'bg-white/5 border-white/10 text-gray-200 hover:border-white/20'
          }`}
        >
          Elevation
        </button>
        <button
          onClick={() => setView('plan')}
          className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition-all ${
            state.activeView === 'plan'
              ? 'bg-[var(--accent)] text-white border-[var(--accent)] shadow-[0_10px_30px_rgba(124,109,246,0.45)]'
              : 'bg-white/5 border-white/10 text-gray-200 hover:border-white/20'
          }`}
        >
          Plan
        </button>
      </div>

      {/* Right: Zoom Controls */}
      <div className="flex items-center gap-2">
        <span className="text-xs uppercase tracking-wide text-gray-400">Zoom</span>
        <button
          onClick={() => setZoom(state.zoom - 0.1)}
          className="w-9 h-9 rounded-lg border border-white/10 bg-white/5 hover:border-white/20 text-gray-100 font-semibold"
          disabled={state.zoom <= 0.2}
        >
          −
        </button>
        <span className="text-sm text-gray-100 w-12 text-center font-semibold tracking-wide">
          {Math.round(state.zoom * 100)}%
        </span>
        <button
          onClick={() => setZoom(state.zoom + 0.1)}
          className="w-9 h-9 rounded-lg border border-white/10 bg-white/5 hover:border-white/20 text-gray-100 font-semibold"
          disabled={state.zoom >= 3}
        >
          +
        </button>
        <button
          onClick={() => setZoom(1)}
          className="ml-1 px-3 py-1.5 rounded-lg border border-white/10 text-gray-200 hover:border-white/20 text-sm"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
