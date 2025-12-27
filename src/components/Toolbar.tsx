import { useDesign } from '../context/DesignContext';

export function Toolbar() {
  const { state, setView, setZoom } = useDesign();

  return (
    <div className="no-print border-b border-slate-200/70 bg-white/75 px-6 py-5 backdrop-blur-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <p className="text-[11px] uppercase tracking-[0.28em] text-slate-500">Quiet minimal</p>
          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <span className="font-semibold text-slate-900">{state.canvas.name}</span>
            <span className="h-1 w-1 rounded-full bg-emerald-400" aria-hidden />
            <span className="capitalize text-slate-600">{state.activeView} view</span>
            <span className="text-slate-400">/</span>
            <span>Scale 1:{state.canvas.scale}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 text-xs rounded-full border border-emerald-100 bg-emerald-50 text-emerald-700">
            Autosave on
          </span>
          <span className="hidden sm:inline text-xs text-slate-500">
            Last updated just now
          </span>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        {/* Left: View Toggle */}
        <div className="flex items-center gap-2 bg-slate-100/70 border border-slate-200/80 rounded-full px-1 py-1">
          <button
            onClick={() => setView('elevation')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              state.activeView === 'elevation'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Elevation
          </button>
          <button
            onClick={() => setView('plan')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              state.activeView === 'plan'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Plan
          </button>
        </div>

        {/* Right: Zoom Controls */}
        <div className="flex items-center gap-2 bg-white/80 border border-slate-200/70 rounded-full px-3 py-1.5 shadow-sm">
          <span className="text-sm text-slate-500">Zoom</span>
          <button
            onClick={() => setZoom(state.zoom - 0.1)}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-medium hover:bg-slate-200"
            disabled={state.zoom <= 0.2}
          >
            −
          </button>
          <span className="text-sm text-slate-700 w-12 text-center font-semibold">
            {Math.round(state.zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom(state.zoom + 0.1)}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-medium hover:bg-slate-200"
            disabled={state.zoom >= 3}
          >
            +
          </button>
          <button
            onClick={() => setZoom(1)}
            className="ml-1 text-sm text-emerald-700 hover:text-emerald-900"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
