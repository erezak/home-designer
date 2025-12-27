import { useRef } from 'react';
import { DesignProvider } from './context/DesignContext';
import {
  DesignCanvas,
  CanvasSettings,
  ElementPanel,
  Toolbar,
  ExportPanel,
  AreaSummary,
} from './components';

function AppContent() {
  const canvasRef = useRef<HTMLDivElement>(null);

  return (
    <div className="h-screen flex flex-col" style={{ backgroundColor: 'var(--color-bg)' }}>
      {/* Top Toolbar */}
      <Toolbar />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Canvas Settings */}
        <aside 
          className="w-80 overflow-y-auto no-print" 
          style={{ 
            backgroundColor: 'var(--color-surface)',
            borderRight: '1px solid var(--color-border)',
            padding: '2rem'
          }}
        >
          <div className="space-y-6">
            <CanvasSettings />
            <AreaSummary />
            <ExportPanel canvasRef={canvasRef} />
          </div>
        </aside>

        {/* Main Canvas Area */}
        <main className="flex-1 overflow-auto" style={{ padding: '2rem' }}>
          <DesignCanvas canvasRef={canvasRef} />
        </main>

        {/* Right Sidebar - Element Panel */}
        <aside 
          className="w-80 overflow-y-auto no-print" 
          style={{ 
            backgroundColor: 'var(--color-surface)',
            borderLeft: '1px solid var(--color-border)',
            padding: '2rem'
          }}
        >
          <ElementPanel />
        </aside>
      </div>
    </div>
  );
}

function App() {
  return (
    <DesignProvider>
      <AppContent />
    </DesignProvider>
  );
}

export default App;
