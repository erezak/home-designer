import { useDesign } from '../context/DesignContext';

export function Toolbar() {
  const { state, setView, setZoom, toggleLeftSidebar, toggleRightSidebar } = useDesign();

  return (
    <div className="top-toolbar px-4 py-2 flex items-center justify-between no-print">
          {/* Left: Traffic controls + View Toggle */}
      <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 mr-2">View:</span>
          <button
            onClick={() => setView('elevation')}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              state.activeView === 'elevation'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Elevation
          </button>
          <button
            onClick={() => setView('plan')}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              state.activeView === 'plan'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Plan
          </button>
        </div>

      {/* Center: Title */}
      <div className="text-center">
        <h1 className="text-lg font-semibold text-gray-800">{state.canvas.name}</h1>
      </div>

      {/* Right: Zoom Controls + Sidebar toggles */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Zoom:</span>
        <button
          onClick={() => setZoom(state.zoom - 0.1)}
          className="w-8 h-8 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium"
          disabled={state.zoom <= 0.2}
        >
          −
        </button>
        <span className="text-sm text-gray-700 w-12 text-center">
          {Math.round(state.zoom * 100)}%
        </span>
        <button
          onClick={() => setZoom(state.zoom + 0.1)}
          className="w-8 h-8 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium"
          disabled={state.zoom >= 3}
        >
          +
        </button>
        <button
          onClick={() => setZoom(1)}
          className="ml-2 px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm"
        >
          Reset
        </button>

        {/* Sidebar toggle buttons */}
        <button
          title={state.sidebars.leftCollapsed ? 'Show left sidebar' : 'Hide left sidebar'}
          onClick={() => toggleLeftSidebar()}
          className="ml-2 sidebar-toggle"
        >
          <span className="text-sm">{state.sidebars.leftCollapsed ? '☰' : '◀'}</span>
        </button>
        <button
          title={state.sidebars.rightCollapsed ? 'Show right sidebar' : 'Hide right sidebar'}
          onClick={() => toggleRightSidebar()}
          className="sidebar-toggle"
        >
          <span className="text-sm">{state.sidebars.rightCollapsed ? '☰' : '▶'}</span>
        </button>
      </div>
    </div>
  );
}
