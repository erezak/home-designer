import { useRef, useState } from 'react';
import { DesignProvider } from './context/DesignContext';
import {
  DesignCanvas,
  CanvasSettings,
  ElementPanel,
  Toolbar,
  ExportPanel,
  AreaSummary,
} from './components';

type NavigationSection = 'canvas' | 'elements' | 'export';

function AppContent() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState<NavigationSection>('canvas');

  return (
    <div className="h-screen flex flex-col" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
      {/* Bold Top Bar */}
      <Toolbar />

      {/* Main Content with Left Navigation Rail */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Navigation Rail */}
        <nav 
          className="w-20 flex flex-col items-center py-6 gap-4 border-r no-print"
          style={{ 
            backgroundColor: 'var(--color-bg-dark)',
            borderColor: 'var(--color-border)'
          }}
        >
          <button
            onClick={() => setActiveSection('canvas')}
            className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center gap-1 transition-all ${
              activeSection === 'canvas'
                ? 'bg-white/10 border-2'
                : 'hover:bg-white/5'
            }`}
            style={{
              borderColor: activeSection === 'canvas' ? 'var(--color-primary)' : 'transparent',
              color: activeSection === 'canvas' ? 'var(--color-primary-light)' : 'var(--color-text-tertiary)'
            }}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z" />
            </svg>
            <span className="text-xs font-semibold">Canvas</span>
          </button>

          <button
            onClick={() => setActiveSection('elements')}
            className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center gap-1 transition-all ${
              activeSection === 'elements'
                ? 'bg-white/10 border-2'
                : 'hover:bg-white/5'
            }`}
            style={{
              borderColor: activeSection === 'elements' ? 'var(--color-primary)' : 'transparent',
              color: activeSection === 'elements' ? 'var(--color-primary-light)' : 'var(--color-text-tertiary)'
            }}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
            <span className="text-xs font-semibold">Elements</span>
          </button>

          <button
            onClick={() => setActiveSection('export')}
            className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center gap-1 transition-all ${
              activeSection === 'export'
                ? 'bg-white/10 border-2'
                : 'hover:bg-white/5'
            }`}
            style={{
              borderColor: activeSection === 'export' ? 'var(--color-primary)' : 'transparent',
              color: activeSection === 'export' ? 'var(--color-primary-light)' : 'var(--color-text-tertiary)'
            }}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            <span className="text-xs font-semibold">Export</span>
          </button>
        </nav>

        {/* Sidebar Panel (conditionally shown based on active section) */}
        <aside 
          className="w-80 overflow-y-auto border-r no-print"
          style={{ 
            backgroundColor: 'var(--color-bg-primary)',
            borderColor: 'var(--color-border)'
          }}
        >
          <div className="p-6 space-y-6">
            {activeSection === 'canvas' && (
              <>
                <CanvasSettings />
                <AreaSummary />
              </>
            )}
            {activeSection === 'elements' && <ElementPanel />}
            {activeSection === 'export' && <ExportPanel canvasRef={canvasRef} />}
          </div>
        </aside>

        {/* Main Canvas Area - Hero Treatment */}
        <main className="flex-1 overflow-auto" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
          <DesignCanvas canvasRef={canvasRef} />
        </main>
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
