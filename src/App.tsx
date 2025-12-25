import { useRef } from 'react';
import { DesignProvider } from './context/DesignContext';
import {
  DesignCanvas,
  CanvasSettings,
  ElementPanel,
  Toolbar,
  ExportPanel,
} from './components';

function AppContent() {
  const canvasRef = useRef<HTMLDivElement>(null);

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Top Toolbar */}
      <Toolbar />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Canvas Settings */}
        <aside className="w-72 bg-gray-50 border-r border-gray-200 overflow-y-auto p-4 space-y-4 no-print">
          <CanvasSettings />
          <ExportPanel canvasRef={canvasRef} />
        </aside>

        {/* Main Canvas Area */}
        <main className="flex-1 overflow-auto">
          <DesignCanvas canvasRef={canvasRef} />
        </main>

        {/* Right Sidebar - Element Panel */}
        <aside className="w-80 bg-gray-50 border-l border-gray-200 overflow-y-auto p-4 no-print">
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
