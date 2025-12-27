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
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-black uppercase tracking-tight">Element Forge</h3>
          <span className="px-2 py-0.5 text-xs font-black bg-[#ffde34] border-2 border-black rounded-md">
            Build
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {elementTypes.map((type) => (
            <button
              key={type}
              onClick={() => addElement(type, selectedElement?.id)}
              className="btn-secondary text-sm py-3"
            >
              + {ELEMENT_TYPE_NAMES[type]}
            </button>
          ))}
        </div>
        {selectedElement && (
          <p className="text-xs text-[#475569] mt-2 uppercase tracking-[0.12em]">
            Target: {selectedElement.name}
          </p>
        )}
      </div>
      
      {/* Element List */}
      <div className="panel">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-black uppercase tracking-tight">Hierarchy</h3>
          <span className="px-2 py-0.5 text-xs font-black bg-[#7cf0ff] border-2 border-black rounded-md">
            Stack
          </span>
        </div>
        {state.elements.length === 0 ? (
          <p className="text-sm font-semibold text-[#475569] uppercase tracking-[0.08em]">
            No elements added yet
          </p>
        ) : (
          <div className="space-y-1 max-h-56 overflow-y-auto scrollbar-thin pr-1">
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
          <div className="flex justify-between items-center border-b pb-2 mb-3">
            <h3 className="text-xl font-black uppercase tracking-tight">Edit Element</h3>
            <button
              onClick={() => deleteElement(selectedElement.id)}
              className="btn-danger text-xs py-1 px-2"
            >
              Delete
            </button>
          </div>
          
          {/* Name */}
          <div className="mb-3">
            <label className="block text-xs uppercase font-black text-[#0f172a] mb-1 tracking-[0.12em]">
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
            <label className="block text-xs uppercase font-black text-[#0f172a] mb-1 tracking-[0.12em]">
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
              <label className="block text-xs uppercase font-black text-[#0f172a] mb-1 tracking-[0.12em]">
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
              <label className="block text-xs uppercase font-black text-[#0f172a] mb-1 tracking-[0.12em]">
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
                <label className="block text-xs uppercase font-black text-[#0f172a] mb-1 tracking-[0.12em]">
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
            <label className="block text-xs uppercase font-black text-[#0f172a] mb-1 tracking-[0.12em]">
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
            <label className="block text-xs uppercase font-black text-[#0f172a] mb-1 tracking-[0.12em]">
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
                <label className="block text-xs uppercase font-black text-[#0f172a] mb-1 tracking-[0.12em]">
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
                <label className="block text-xs uppercase font-black text-[#0f172a] mb-1 tracking-[0.12em]">
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
                  <label className="block text-xs uppercase font-black text-[#0f172a] mb-1 tracking-[0.12em]">
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
                  <label className="block text-xs uppercase font-black text-[#0f172a] mb-1 tracking-[0.12em]">
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
              <p className="text-xs text-[#475569] uppercase tracking-[0.1em]">
                Offset is applied after anchor positioning
              </p>
            </div>
          )}
          
          {/* Absolute positioning */}
          {selectedElement.positioning.mode === 'absolute' && (
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div>
                <label className="block text-xs uppercase font-black text-[#0f172a] mb-1 tracking-[0.12em]">
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
                <label className="block text-xs uppercase font-black text-[#0f172a] mb-1 tracking-[0.12em]">
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
        className={`w-full text-left px-2 py-2 rounded-md text-sm font-semibold transition-colors border-2 border-black ${
          isSelected 
            ? 'bg-[#ffde34] text-black shadow-[6px_6px_0_#0f172a]' 
            : 'bg-white hover:bg-[#fef3c7] text-[#0f172a]'
        }`}
        style={{ paddingLeft: `${8 + depth * 16}px` }}
      >
        <span className="font-medium">{element.name}</span>
        <span className="text-[#475569] ml-2 text-xs uppercase tracking-[0.08em]">
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
