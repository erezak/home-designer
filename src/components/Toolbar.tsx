import { useDesign } from '../context/DesignContext';

export function Toolbar() {
  const { state, setView, setZoom } = useDesign();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-[11px] uppercase tracking-[0.2em] text-stone-500">View</span>
          <button
            onClick={() => setView('elevation')}
            className={`px-3 py-1.5 rounded-full text-sm font-semibold border transition ${
              state.activeView === 'elevation'
                ? 'bg-stone-900 text-stone-50 border-stone-900 shadow-sm'
                : 'bg-white text-stone-800 border-stone-300 hover:border-stone-500'
            }`}
          >
            Elevation
          </button>
          <button
            onClick={() => setView('plan')}
            className={`px-3 py-1.5 rounded-full text-sm font-semibold border transition ${
              state.activeView === 'plan'
                ? 'bg-stone-900 text-stone-50 border-stone-900 shadow-sm'
                : 'bg-white text-stone-800 border-stone-300 hover:border-stone-500'
            }`}
          >
            Plan
          </button>
        </div>
        <div className="text-right">
          <p className="text-[11px] uppercase tracking-[0.2em] text-stone-500">Title</p>
          <h1 className="text-lg font-semibold text-stone-900">{state.canvas.name}</h1>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 rounded-2xl border border-stone-200 bg-white/80 px-4 py-3 shadow-sm">
        <div className="flex items-center gap-2 text-sm text-stone-600">
          <span className="rounded-full bg-stone-100 px-3 py-1">Zoom</span>
          <button
            onClick={() => setZoom(state.zoom - 0.1)}
            className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 font-medium border border-stone-200"
            disabled={state.zoom <= 0.2}
          >
            −
          </button>
          <span className="text-sm font-semibold text-stone-800 w-12 text-center">
            {Math.round(state.zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom(state.zoom + 0.1)}
            className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 font-medium border border-stone-200"
            disabled={state.zoom >= 3}
          >
            +
          </button>
          <button
            onClick={() => setZoom(1)}
            className="ml-2 px-3 py-1 rounded-full bg-stone-900 text-stone-50 text-sm border border-stone-900 hover:bg-black"
          >
            Reset
          </button>
        </div>
        <div className="text-xs uppercase tracking-[0.2em] text-stone-500">
          Scale 1:{state.canvas.scale}
        </div>
      </div>
    </div>
  );
}
