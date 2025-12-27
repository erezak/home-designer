import { useDesign } from '../context/DesignContext';
import { 
  type ElementType, 
  ELEMENT_TYPE_NAMES, 
  MATERIAL_COLORS, 
  type MaterialType,
  type PositionMode,
  type DesignElement,
  parseCm,
  formatCm,
} from '../types';

export function ElementPanel() {
  const { 
    state, 
    addElement, 
    updateElement, 
    deleteElement, 
    getSelectedElement,
    selectElement,
  } = useDesign();
  
  const selectedElement = getSelectedElement();
  const elementTypes: ElementType[] = ['niche', 'shelf', 'tv-recess', 'fireplace', 'custom'];
  const materialOptions: MaterialType[] = ['drywall', 'wood', 'glass', 'metal', 'stone', 'mdf'];
  const positionModes: PositionMode[] = ['auto', 'relative', 'absolute'];

  // Get all elements for relative positioning dropdown
  const getAllElements = () => {
    const flatList: { id: string; name: string }[] = [];
    const flatten = (elements: typeof state.elements) => {
      elements.forEach((el) => {
        flatList.push({ id: el.id, name: el.name });
        if (el.children.length > 0) {
          flatten(el.children);
        }
      });
    };
    flatten(state.elements);
    return flatList;
  };

  // Icon component for element types
  const getElementIcon = (type: ElementType) => {
    const icons = {
      'niche': (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5z" />
        </svg>
      ),
      'shelf': (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18" />
        </svg>
      ),
      'tv-recess': (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      'fireplace': (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
        </svg>
      ),
      'fireplace': (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
        </svg>
      ),
      'custom': (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
        </svg>
      ),
      'wall': (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12h18M3 6h18M3 18h18" />
        </svg>
      ),
    };
    return icons[type] || icons['custom'];
  };

  return (
    <div className="space-y-6">
      {/* Add Element Section - Hero CTA */}
      <div>
        <h3 className="panel-header">Add Element</h3>
        <div className="grid grid-cols-2 gap-3">
          {elementTypes.map((type) => (
            <button
              key={type}
              onClick={() => addElement(type, selectedElement?.id)}
              className="btn-primary flex items-center justify-center gap-2 py-4"
              style={{
                background: `linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-hover) 100%)`
              }}
            >
              {getElementIcon(type)}
              <span className="text-xs">{ELEMENT_TYPE_NAMES[type]}</span>
            </button>
          ))}
        </div>
        {selectedElement && (
          <div 
            className="mt-3 p-3 rounded-lg border-2"
            style={{
              backgroundColor: 'var(--color-bg-tertiary)',
              borderColor: 'var(--color-primary)',
              color: 'var(--color-primary)'
            }}
          >
            <p className="text-xs font-bold">
              ✓ Will be added inside: <span className="font-extrabold">{selectedElement.name}</span>
            </p>
          </div>
        )}
      </div>
      
      {/* Element List */}
      <div>
        <h3 className="panel-header">Elements ({state.elements.length})</h3>
        {state.elements.length === 0 ? (
          <div 
            className="panel text-center py-8"
            style={{ backgroundColor: 'var(--color-bg-tertiary)' }}
          >
            <svg 
              className="w-12 h-12 mx-auto mb-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              style={{ color: 'var(--color-text-tertiary)' }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <p 
              className="text-sm font-semibold"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              No elements yet
            </p>
            <p 
              className="text-xs mt-1"
              style={{ color: 'var(--color-text-tertiary)' }}
            >
              Click the buttons above to add elements
            </p>
          </div>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {state.elements.map((el) => (
              <ElementListItem
                key={el.id}
                element={el}
                depth={0}
                selectedId={state.selectedElementId}
                onSelect={selectElement}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Selected Element Editor */}
      {selectedElement && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="panel-header mb-0 pb-0 border-0">Edit Element</h3>
            <button
              onClick={() => deleteElement(selectedElement.id)}
              className="btn-danger btn-sm"
            >
              Delete
            </button>
          </div>
          
          {/* Name */}
          <div className="panel">
            <label 
              className="block text-xs font-bold uppercase tracking-wide mb-2"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Name
            </label>
            <input
              type="text"
              className="input-field"
              value={selectedElement.name}
              onChange={(e) => updateElement(selectedElement.id, { name: e.target.value })}
              placeholder="Element name"
            />
          </div>
          
          {/* Type & Material */}
          <div className="panel space-y-4">
            <div>
              <label 
                className="block text-xs font-bold uppercase tracking-wide mb-2"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Type
              </label>
              <select
                className="input-field"
                value={selectedElement.type}
                onChange={(e) => updateElement(selectedElement.id, { 
                  type: e.target.value as ElementType 
                })}
              >
                {elementTypes.map((type) => (
                  <option key={type} value={type}>
                    {ELEMENT_TYPE_NAMES[type]}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label 
                className="block text-xs font-bold uppercase tracking-wide mb-2"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Material
              </label>
              <select
                className="input-field"
                value={selectedElement.material.type}
                onChange={(e) => {
                  const type = e.target.value as MaterialType;
                  updateElement(selectedElement.id, {
                    material: { type, color: MATERIAL_COLORS[type] }
                  });
                }}
              >
                {materialOptions.map((mat) => (
                  <option key={mat} value={mat}>
                    {mat.charAt(0).toUpperCase() + mat.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Dimensions */}
          <div className="panel">
            <label 
              className="block text-xs font-bold uppercase tracking-wide mb-3"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Dimensions
            </label>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label 
                  className="block text-xs font-semibold mb-1"
                  style={{ color: 'var(--color-text-tertiary)' }}
                >
                  Width (cm)
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  className="input-field"
                  key={`width-${selectedElement.id}`}
                  defaultValue={selectedElement.dimensions.width}
                  onBlur={(e) => updateElement(selectedElement.id, {
                    dimensions: { 
                      ...selectedElement.dimensions, 
                      width: parseCm(e.target.value) 
                    }
                  })}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') e.currentTarget.blur();
                  }}
                />
              </div>
              <div>
                <label 
                  className="block text-xs font-semibold mb-1"
                  style={{ color: 'var(--color-text-tertiary)' }}
                >
                  Height (cm)
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  className="input-field"
                  key={`height-${selectedElement.id}`}
                  defaultValue={selectedElement.dimensions.height}
                  onBlur={(e) => updateElement(selectedElement.id, {
                    dimensions: { 
                      ...selectedElement.dimensions, 
                      height: parseCm(e.target.value) 
                    }
                  })}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') e.currentTarget.blur();
                  }}
                />
              </div>
              {(selectedElement.type === 'niche' || selectedElement.depth !== undefined) && (
                <div>
                  <label 
                    className="block text-xs font-semibold mb-1"
                    style={{ color: 'var(--color-text-tertiary)' }}
                  >
                    Depth (cm)
                  </label>
                  <input
                    type="text"
                    inputMode="decimal"
                    className="input-field"
                    key={`depth-${selectedElement.id}`}
                    defaultValue={selectedElement.depth || 0}
                    onBlur={(e) => updateElement(selectedElement.id, {
                      depth: parseCm(e.target.value)
                    })}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') e.currentTarget.blur();
                    }}
                  />
                </div>
              )}
            </div>
          </div>
          
          {/* Positioning */}
          <div className="panel space-y-4">
            <div>
              <label 
                className="block text-xs font-bold uppercase tracking-wide mb-2"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Position Mode
              </label>
              <select
                className="input-field"
                value={selectedElement.positioning.mode}
                onChange={(e) => updateElement(selectedElement.id, {
                  positioning: { 
                    ...selectedElement.positioning, 
                    mode: e.target.value as PositionMode 
                  }
                })}
              >
                {positionModes.map((mode) => (
                  <option key={mode} value={mode}>
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Relative positioning options */}
            {selectedElement.positioning.mode === 'relative' && (
              <div className="space-y-3">
                <div>
                  <label 
                    className="block text-xs font-semibold mb-1"
                    style={{ color: 'var(--color-text-tertiary)' }}
                  >
                    Relative To
                  </label>
                  <select
                    className="input-field"
                    value={selectedElement.positioning.relativeTo || ''}
                    onChange={(e) => updateElement(selectedElement.id, {
                      positioning: { 
                        ...selectedElement.positioning, 
                        relativeTo: e.target.value 
                      }
                    })}
                  >
                    <option value="">Select element...</option>
                    {getAllElements()
                      .filter((el) => el.id !== selectedElement.id)
                      .map((el) => (
                        <option key={el.id} value={el.id}>
                          {el.name}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label 
                    className="block text-xs font-semibold mb-1"
                    style={{ color: 'var(--color-text-tertiary)' }}
                  >
                    Anchor
                  </label>
                  <select
                    className="input-field"
                    value={selectedElement.positioning.anchor || 'next-to'}
                    onChange={(e) => updateElement(selectedElement.id, {
                      positioning: { 
                        ...selectedElement.positioning, 
                        anchor: e.target.value as 'next-to' | 'below' | 'above' | 'inside'
                      }
                    })}
                  >
                    <option value="next-to">Next To (Right)</option>
                    <option value="below">Below</option>
                    <option value="above">Above</option>
                    <option value="inside">Inside</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label 
                      className="block text-xs font-semibold mb-1"
                      style={{ color: 'var(--color-text-tertiary)' }}
                    >
                      Offset X (cm)
                    </label>
                    <input
                      type="text"
                      inputMode="decimal"
                      className="input-field"
                      key={`offset-x-${selectedElement.id}`}
                      defaultValue={selectedElement.positioning.offset?.x || 0}
                      onBlur={(e) => updateElement(selectedElement.id, {
                        positioning: { 
                          ...selectedElement.positioning,
                          offset: {
                            x: parseCm(e.target.value),
                            y: selectedElement.positioning.offset?.y || 0,
                          }
                        }
                      })}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') e.currentTarget.blur();
                      }}
                    />
                  </div>
                  <div>
                    <label 
                      className="block text-xs font-semibold mb-1"
                      style={{ color: 'var(--color-text-tertiary)' }}
                    >
                      Offset Y (cm)
                    </label>
                    <input
                      type="text"
                      inputMode="decimal"
                      className="input-field"
                      key={`offset-y-${selectedElement.id}`}
                      defaultValue={selectedElement.positioning.offset?.y || 0}
                      onBlur={(e) => updateElement(selectedElement.id, {
                        positioning: { 
                          ...selectedElement.positioning,
                          offset: {
                            x: selectedElement.positioning.offset?.x || 0,
                            y: parseCm(e.target.value),
                          }
                        }
                      })}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') e.currentTarget.blur();
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
            
            {/* Absolute positioning */}
            {selectedElement.positioning.mode === 'absolute' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label 
                    className="block text-xs font-semibold mb-1"
                    style={{ color: 'var(--color-text-tertiary)' }}
                  >
                    X (cm)
                  </label>
                  <input
                    type="text"
                    inputMode="decimal"
                    className="input-field"
                    key={`x-${selectedElement.id}`}
                    defaultValue={selectedElement.positioning.position?.x || 0}
                    onBlur={(e) => updateElement(selectedElement.id, {
                      positioning: { 
                        ...selectedElement.positioning,
                        position: {
                          x: parseCm(e.target.value),
                          y: selectedElement.positioning.position?.y || 0,
                        }
                      }
                    })}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') e.currentTarget.blur();
                    }}
                  />
                </div>
                <div>
                  <label 
                    className="block text-xs font-semibold mb-1"
                    style={{ color: 'var(--color-text-tertiary)' }}
                  >
                    Y (cm)
                  </label>
                  <input
                    type="text"
                    inputMode="decimal"
                    className="input-field"
                    key={`y-${selectedElement.id}`}
                    defaultValue={selectedElement.positioning.position?.y || 0}
                    onBlur={(e) => updateElement(selectedElement.id, {
                      positioning: { 
                        ...selectedElement.positioning,
                        position: {
                          x: selectedElement.positioning.position?.x || 0,
                          y: parseCm(e.target.value),
                        }
                      }
                    })}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') e.currentTarget.blur();
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Recursive element list item component
function ElementListItem({
  element,
  depth,
  selectedId,
  onSelect,
}: {
  element: DesignElement;
  depth: number;
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const isSelected = element.id === selectedId;
  
  return (
    <div>
      <button
        onClick={() => onSelect(element.id)}
        className="card w-full text-left transition-all"
        style={{ 
          paddingLeft: `${12 + depth * 20}px`,
          backgroundColor: isSelected ? 'var(--color-primary)' : 'var(--color-bg-primary)',
          color: isSelected ? 'var(--color-text-inverse)' : 'var(--color-text-primary)',
          borderColor: isSelected ? 'var(--color-primary)' : 'var(--color-border)',
          transform: isSelected ? 'translateY(-2px)' : 'none',
          boxShadow: isSelected 
            ? '0 10px 15px -3px rgba(37, 99, 235, 0.3)' 
            : '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
        }}
      >
        <div className="flex items-center justify-between">
          <span className="font-bold text-sm">{element.name}</span>
          <span 
            className="text-xs font-semibold"
            style={{ 
              opacity: isSelected ? 0.9 : 0.6
            }}
          >
            {formatCm(element.dimensions.width)} × {formatCm(element.dimensions.height)}
          </span>
        </div>
      </button>
      {element.children.map((child) => (
        <div key={child.id} className="mt-2">
          <ElementListItem
            element={child}
            depth={depth + 1}
            selectedId={selectedId}
            onSelect={onSelect}
          />
        </div>
      ))}
    </div>
  );
}
