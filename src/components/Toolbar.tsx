import { useDesign } from '../context/DesignContext';

export function Toolbar() {
  const { state, setView, setZoom } = useDesign();

  return (
    <div className="no-print bg-white/5 border border-white/10 rounded-2xl px-4 py-3 shadow-lg shadow-black/20 text-white">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* View Toggle */}
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-[0.2em] text-indigo-100">View</span>
          <div className="inline-flex rounded-full bg-white/10 border border-white/20 p-1">
            <button
              onClick={() => setView('elevation')}
              className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-all ${
                state.activeView === 'elevation'
                  ? 'bg-white text-slate-900 shadow-md shadow-white/30'
                  : 'text-slate-100 hover:bg-white/10'
              }`}
            >
              Elevation
            </button>
            <button
              onClick={() => setView('plan')}
              className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-all ${
                state.activeView === 'plan'
                  ? 'bg-white text-slate-900 shadow-md shadow-white/30'
                  : 'text-slate-100 hover:bg-white/10'
              }`}
            >
              Plan
            </button>
          </div>
        </div>

        {/* Title */}
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-indigo-100">Project name</p>
          <h1 className="text-lg font-semibold text-white">{state.canvas.name || 'Design'}</h1>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-[0.2em] text-indigo-100">Zoom</span>
          <button
            onClick={() => setZoom(state.zoom - 0.1)}
            className="btn-secondary w-10 h-10 rounded-full bg-white/10 text-white border-white/20 hover:bg-white/20"
            disabled={state.zoom <= 0.2}
            aria-label="Zoom out"
          >
            −
          </button>
          <span className="text-sm font-semibold w-12 text-center text-white">
            {Math.round(state.zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom(state.zoom + 0.1)}
            className="btn-secondary w-10 h-10 rounded-full bg-white/10 text-white border-white/20 hover:bg-white/20"
            disabled={state.zoom >= 3}
            aria-label="Zoom in"
          >
            +
          </button>
          <button
            onClick={() => setZoom(1)}
            className="ml-2 px-3 py-2 rounded-full bg-white/10 text-white text-sm font-semibold border border-white/20 hover:bg-white/20"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
