import { useDesign } from '../context/DesignContext';

export function Toolbar() {
  const BRAND_MARK = 'HD';
  const { state, setView, setZoom } = useDesign();

  return (
    <div className="glass no-print border border-white/10 px-5 py-3 rounded-2xl shadow-2xl flex items-center justify-between gap-4">
      {/* Left: Brand + View Toggle */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-lg font-semibold text-white shadow-inner shadow-black/40">
            {BRAND_MARK}
          </span>
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-300">Glass & Blur</p>
            <p className="text-sm font-semibold text-white">{state.canvas.name}</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-1 rounded-xl bg-white/5 border border-white/10 p-1 shadow-inner">
          {(['elevation', 'plan'] as const).map((view) => (
            <button
              key={view}
              onClick={() => setView(view)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                state.activeView === view
                  ? 'bg-white text-slate-900 shadow-lg shadow-cyan-500/30'
                  : 'text-slate-200 hover:bg-white/10'
              }`}
            >
              {view === 'elevation' ? 'Elevation' : 'Plan'}
            </button>
          ))}
        </div>
      </div>

      {/* Center: Info */}
      <div className="text-center">
        <p className="text-xs text-slate-300">Scale 1:{state.canvas.scale}</p>
        <p className="text-sm font-semibold text-white glass-underline inline-block">
          {state.activeView === 'elevation' ? 'Front Elevation View' : 'Top-Down Plan View'}
        </p>
      </div>

      {/* Right: Zoom Controls */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-300">Zoom</span>
        <div className="flex items-center gap-1 rounded-xl bg-white/5 border border-white/10 p-1 shadow-inner">
          <button
            onClick={() => setZoom(state.zoom - 0.1)}
            className="h-9 w-9 rounded-lg bg-white/5 text-white hover:bg-white/15 disabled:opacity-50 disabled:hover:bg-white/5"
            disabled={state.zoom <= 0.2}
          >
            −
          </button>
          <span className="text-sm font-semibold w-14 text-center text-white">
            {Math.round(state.zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom(state.zoom + 0.1)}
            className="h-9 w-9 rounded-lg bg-white/5 text-white hover:bg-white/15 disabled:opacity-50 disabled:hover:bg-white/5"
            disabled={state.zoom >= 3}
          >
            +
          </button>
        </div>
        <button
          onClick={() => setZoom(1)}
          className="btn-secondary px-3 py-2 text-xs font-semibold"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
