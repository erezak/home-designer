import { useDesign } from '../context/DesignContext';

export function Toolbar() {
  const { state, setView, setZoom } = useDesign();

  return (
    <div 
      className="px-6 py-4 flex items-center justify-between no-print"
      style={{
        backgroundColor: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      {/* Left: View Toggle */}
      <div className="flex items-center gap-3">
        <span 
          className="text-sm font-medium mr-1" 
          style={{ color: 'var(--color-text-subtle)', letterSpacing: '-0.011em' }}
        >
          View
        </span>
        <button
          onClick={() => setView('elevation')}
          className="px-4 py-1.5 rounded-md text-sm font-medium transition-all"
          style={{
            backgroundColor: state.activeView === 'elevation' ? 'var(--color-accent)' : 'transparent',
            color: state.activeView === 'elevation' ? 'white' : 'var(--color-text)',
            letterSpacing: '-0.011em',
          }}
        >
          Elevation
        </button>
        <button
          onClick={() => setView('plan')}
          className="px-4 py-1.5 rounded-md text-sm font-medium transition-all"
          style={{
            backgroundColor: state.activeView === 'plan' ? 'var(--color-accent)' : 'transparent',
            color: state.activeView === 'plan' ? 'white' : 'var(--color-text)',
            letterSpacing: '-0.011em',
          }}
        >
          Plan
        </button>
      </div>

      {/* Center: Title */}
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <h1 
          className="text-lg font-medium tracking-tight" 
          style={{ color: 'var(--color-text)', letterSpacing: '-0.022em' }}
        >
          {state.canvas.name}
        </h1>
      </div>

      {/* Right: Zoom Controls */}
      <div className="flex items-center gap-3">
        <span 
          className="text-sm font-medium" 
          style={{ color: 'var(--color-text-subtle)', letterSpacing: '-0.011em' }}
        >
          Zoom
        </span>
        <button
          onClick={() => setZoom(state.zoom - 0.1)}
          className="w-8 h-8 rounded-md text-sm font-medium transition-all"
          style={{
            backgroundColor: state.zoom <= 0.2 ? 'transparent' : 'var(--color-surface)',
            color: state.zoom <= 0.2 ? 'var(--color-text-muted)' : 'var(--color-text)',
            border: '1px solid var(--color-border)',
          }}
          disabled={state.zoom <= 0.2}
        >
          −
        </button>
        <span 
          className="text-sm w-12 text-center font-medium" 
          style={{ color: 'var(--color-text)', letterSpacing: '-0.011em' }}
        >
          {Math.round(state.zoom * 100)}%
        </span>
        <button
          onClick={() => setZoom(state.zoom + 0.1)}
          className="w-8 h-8 rounded-md text-sm font-medium transition-all"
          style={{
            backgroundColor: state.zoom >= 3 ? 'transparent' : 'var(--color-surface)',
            color: state.zoom >= 3 ? 'var(--color-text-muted)' : 'var(--color-text)',
            border: '1px solid var(--color-border)',
          }}
          disabled={state.zoom >= 3}
        >
          +
        </button>
        <button
          onClick={() => setZoom(1)}
          className="ml-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all"
          style={{
            backgroundColor: 'var(--color-surface)',
            color: 'var(--color-text)',
            border: '1px solid var(--color-border)',
            letterSpacing: '-0.011em',
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
