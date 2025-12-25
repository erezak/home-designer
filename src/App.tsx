import { useRef } from 'react';
import { DesignProvider, useDesign } from './context/DesignContext';
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
  const { state, toggleLeftSidebar, toggleRightSidebar } = useDesign();

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Top Toolbar */}
      <Toolbar />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Canvas Settings (collapsible) */}
        {!state.sidebars.leftCollapsed ? (
          <aside className="w-72 bg-gray-50 border-r border-gray-200 content-scroll overflow-y-auto p-4 space-y-4 no-print">
            <CanvasSettings />
            <AreaSummary />
            <ExportPanel canvasRef={canvasRef} />
          </aside>
        ) : (
          <div className="w-10 flex items-start justify-center">
            <button
              title="Open left sidebar"
              onClick={toggleLeftSidebar}
              className="sidebar-toggle mt-3 no-print"
            >
              ☰
            </button>
          </div>
        )}

        {/* Main Canvas Area */}
        <main className="flex-1 content-scroll overflow-auto">
          <DesignCanvas canvasRef={canvasRef} />
        </main>

        {/* Right Sidebar - Element Panel (collapsible) */}
        {!state.sidebars.rightCollapsed ? (
          <aside className="w-80 bg-gray-50 border-l border-gray-200 content-scroll overflow-y-auto p-4 no-print">
            <ElementPanel />
          </aside>
        ) : (
          <div className="w-10 flex items-start justify-center">
            <button
              title="Open right sidebar"
              onClick={toggleRightSidebar}
              className="sidebar-toggle mt-3 no-print"
            >
              ☰
            </button>
          </div>
        )}
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
