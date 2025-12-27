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
    <div className="min-h-screen text-gray-100">
      <div className="max-w-7xl mx-auto h-screen flex flex-col gap-4 px-6 py-5">
        {/* Top Toolbar */}
        <Toolbar />

        {/* Main Content */}
        <div className="flex-1 grid grid-cols-[320px_1fr_360px] gap-4 overflow-hidden">
          {/* Left Sidebar - Canvas Settings */}
          <aside className="space-y-4 overflow-y-auto pr-1 no-print">
            <CanvasSettings />
            <AreaSummary />
            <ExportPanel canvasRef={canvasRef} />
          </aside>

          {/* Main Canvas Area */}
          <main className="flex-1 overflow-hidden">
            <DesignCanvas canvasRef={canvasRef} />
          </main>

          {/* Right Sidebar - Element Panel */}
          <aside className="overflow-y-auto pl-1 no-print">
            <ElementPanel />
          </aside>
        </div>
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
