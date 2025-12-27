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

  return (
    <div className="space-y-4">
      {/* Add Element Section */}
      <div className="panel">
        <h3 className="font-semibold text-white border-b border-white/10 pb-2 mb-3">Add Element</h3>
        <div className="grid grid-cols-2 gap-2">
          {elementTypes.map((type) => (
            <button
              key={type}
              onClick={() => addElement(type, selectedElement?.id)}
              className="btn-secondary text-sm py-2"
            >
              + {ELEMENT_TYPE_NAMES[type]}
            </button>
          ))}
        </div>
        {selectedElement && (
          <p className="text-xs text-slate-400 mt-2">
            Will be added inside: {selectedElement.name}
          </p>
        )}
      </div>
      
      {/* Element List */}
      <div className="panel">
        <h3 className="font-semibold text-white border-b border-white/10 pb-2 mb-3">Elements</h3>
        {state.elements.length === 0 ? (
          <p className="text-sm text-slate-400">No elements added yet</p>
        ) : (
          <div className="space-y-1 max-h-48 overflow-y-auto">
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
        <div className="panel">
          <div className="flex justify-between items-center border-b border-white/10 pb-2 mb-3">
            <h3 className="font-semibold text-white">Edit Element</h3>
            <button
              onClick={() => deleteElement(selectedElement.id)}
              className="text-red-300 hover:text-red-200 text-sm"
            >
              Delete
            </button>
          </div>
          
          {/* Name */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-slate-200 mb-1">
              Name
            </label>
            <input
              type="text"
              className="input-field"
              value={selectedElement.name}
              onChange={(e) => updateElement(selectedElement.id, { name: e.target.value })}
            />
          </div>
          
          {/* Type */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-slate-200 mb-1">
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
          
          {/* Dimensions */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-1">
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
              <label className="block text-sm font-medium text-slate-200 mb-1">
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
                <label className="block text-sm font-medium text-slate-200 mb-1">
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
          
          {/* Material */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-slate-200 mb-1">
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
          
          {/* Positioning */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-slate-200 mb-1">
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
            <div className="space-y-2 mb-3">
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-1">
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
                <label className="block text-sm font-medium text-slate-200 mb-1">
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
                  <label className="block text-sm font-medium text-slate-200 mb-1">
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
                  <label className="block text-sm font-medium text-slate-200 mb-1">
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
              <p className="text-xs text-slate-400">
                Offset is applied after anchor positioning
              </p>
            </div>
          )}
          
          {/* Absolute positioning */}
          {selectedElement.positioning.mode === 'absolute' && (
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-1">
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
                <label className="block text-sm font-medium text-slate-200 mb-1">
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
        className={`w-full text-left px-2 py-1.5 rounded text-sm transition-colors border border-transparent ${
          isSelected 
            ? 'bg-white/15 text-cyan-100 border-white/30 shadow-inner' 
            : 'hover:bg-white/10 text-slate-200'
        }`}
        style={{ paddingLeft: `${8 + depth * 16}px` }}
      >
        <span className="font-medium">{element.name}</span>
        <span className="text-slate-400 ml-2 text-xs">
          {formatCm(element.dimensions.width)} × {formatCm(element.dimensions.height)}
        </span>
      </button>
      {element.children.map((child) => (
        <ElementListItem
          key={child.id}
          element={child}
          depth={depth + 1}
          selectedId={selectedId}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
