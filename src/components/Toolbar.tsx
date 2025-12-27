import { useDesign } from '../context/DesignContext';

export function Toolbar() {
  const { state, setView, setZoom } = useDesign();

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white/80 shadow-sm px-4 py-3 flex items-center justify-between gap-4 no-print">
      {/* Left: View Toggle */}
      <div className="flex items-center gap-2">
        <span className="text-xs uppercase tracking-[0.24em] text-indigo-500 font-semibold">
          View
        </span>
        <div className="flex items-center gap-2 bg-slate-100/80 px-1.5 py-1 rounded-full border border-slate-200">
          <button
            onClick={() => setView('elevation')}
            className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-all ${
              state.activeView === 'elevation'
                ? 'bg-indigo-600 text-white shadow-[0_10px_30px_-16px_rgba(79,70,229,0.9)]'
                : 'text-slate-700 hover:bg-white'
            }`}
          >
            Elevation
          </button>
          <button
            onClick={() => setView('plan')}
            className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-all ${
              state.activeView === 'plan'
                ? 'bg-indigo-600 text-white shadow-[0_10px_30px_-16px_rgba(79,70,229,0.9)]'
                : 'text-slate-700 hover:bg-white'
            }`}
          >
            Plan
          </button>
        </div>
      </div>

      {/* Center: Title */}
      <div className="text-center">
        <p className="text-[11px] uppercase tracking-[0.26em] text-slate-500 font-semibold">Design</p>
        <h1 className="text-lg font-semibold text-slate-900">{state.canvas.name}</h1>
      </div>

      {/* Right: Zoom Controls */}
      <div className="flex items-center gap-2">
        <span className="text-xs uppercase tracking-[0.18em] text-indigo-500 font-semibold">
          Zoom
        </span>
        <button
          onClick={() => setZoom(state.zoom - 0.1)}
          className="w-9 h-9 rounded-full bg-slate-100 hover:bg-white text-slate-700 font-semibold border border-slate-200 shadow-inner"
          disabled={state.zoom <= 0.2}
        >
          −
        </button>
        <span className="text-sm text-slate-800 w-12 text-center font-semibold">
          {Math.round(state.zoom * 100)}%
        </span>
        <button
          onClick={() => setZoom(state.zoom + 0.1)}
          className="w-9 h-9 rounded-full bg-slate-100 hover:bg-white text-slate-700 font-semibold border border-slate-200 shadow-inner"
          disabled={state.zoom >= 3}
        >
          +
        </button>
        <button
          onClick={() => setZoom(1)}
          className="ml-2 px-3 py-1.5 rounded-full bg-white hover:bg-slate-50 text-slate-700 text-sm border border-slate-200"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
