import { useDesign } from '../context/DesignContext';
import { useTranslation } from '../context/TranslationContext';

export function Toolbar() {
  const { state, setView, setZoom } = useDesign();
  const { language, setLanguage, t } = useTranslation();

  return (
    <div 
      className="px-6 py-4 flex items-center justify-between no-print border-b"
      style={{
        backgroundColor: 'var(--color-bg-dark)',
        borderColor: 'var(--color-border)',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}
    >
      {/* Left: Brand & Title */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <div>
            <h1 
              className="text-2xl font-bold leading-none"
              style={{ color: 'var(--color-text-inverse)' }}
            >
              {state.canvas.name}
            </h1>
            <p 
              className="text-xs font-medium mt-0.5"
              style={{ color: 'var(--color-text-tertiary)' }}
            >
              {t.toolbar.appSubtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Center: View Toggle - Hero CTA */}
      <div className="flex items-center gap-3">
        <span 
          className="text-sm font-semibold uppercase tracking-wide mr-1"
          style={{ color: 'var(--color-text-tertiary)' }}
        >
          {t.toolbar.view}
        </span>
        <button
          onClick={() => setView('elevation')}
          className={`px-6 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wide transition-all ${
            state.activeView === 'elevation'
              ? 'shadow-lg'
              : ''
          }`}
          style={{
            backgroundColor: state.activeView === 'elevation' ? 'var(--color-primary)' : 'transparent',
            color: state.activeView === 'elevation' ? 'var(--color-text-inverse)' : 'var(--color-text-tertiary)',
            border: `2px solid ${state.activeView === 'elevation' ? 'var(--color-primary)' : 'var(--color-border)'}`,
            transform: state.activeView === 'elevation' ? 'translateY(-2px)' : 'none'
          }}
        >
          {t.toolbar.elevation}
        </button>
        <button
          onClick={() => setView('plan')}
          className={`px-6 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wide transition-all ${
            state.activeView === 'plan'
              ? 'shadow-lg'
              : ''
          }`}
          style={{
            backgroundColor: state.activeView === 'plan' ? 'var(--color-primary)' : 'transparent',
            color: state.activeView === 'plan' ? 'var(--color-text-inverse)' : 'var(--color-text-tertiary)',
            border: `2px solid ${state.activeView === 'plan' ? 'var(--color-primary)' : 'var(--color-border)'}`,
            transform: state.activeView === 'plan' ? 'translateY(-2px)' : 'none'
          }}
        >
          {t.toolbar.plan}
        </button>
      </div>

      {/* Right: Zoom Controls & Language Toggle - Snappy Interactions */}
      <div className="flex items-center gap-3">
        <span 
          className="text-sm font-semibold uppercase tracking-wide"
          style={{ color: 'var(--color-text-tertiary)' }}
        >
          {t.toolbar.zoom}
        </span>
        <button
          onClick={() => setZoom(state.zoom - 0.1)}
          disabled={state.zoom <= 0.2}
          className="btn-icon w-10 h-10 flex items-center justify-center text-lg font-bold"
        >
          −
        </button>
        <span 
          className="text-sm font-bold w-16 text-center px-3 py-1.5 rounded-lg"
          style={{ 
            backgroundColor: 'var(--color-bg-tertiary)',
            color: 'var(--color-text-primary)',
            border: '2px solid var(--color-border)'
          }}
        >
          {Math.round(state.zoom * 100)}%
        </span>
        <button
          onClick={() => setZoom(state.zoom + 0.1)}
          disabled={state.zoom >= 3}
          className="btn-icon w-10 h-10 flex items-center justify-center text-lg font-bold"
        >
          +
        </button>
        <button
          onClick={() => setZoom(1)}
          className="btn-secondary btn-sm ml-2"
        >
          {t.toolbar.reset}
        </button>

        {/* Language Toggle */}
        <div 
          className="h-8 w-px ml-2"
          style={{ backgroundColor: 'var(--color-border)' }}
        />
        <button
          onClick={() => setLanguage(language === 'en' ? 'he' : 'en')}
          className="btn-secondary px-4 py-2 text-sm font-bold flex items-center gap-2"
          title={language === 'en' ? 'Switch to Hebrew' : 'עבור לאנגלית'}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
          </svg>
          <span>{language === 'en' ? 'עב' : 'EN'}</span>
        </button>
      </div>
    </div>
  );
}
