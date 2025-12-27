import { createContext, useContext, useReducer, useCallback, useEffect, type ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  type DesignState,
  type DesignElement,
  type CanvasConfig,
  type ViewType,
  type ElementType,
  type PositionMode,
  type Position,
  DEFAULT_DIMENSIONS,
  MATERIAL_COLORS,
} from '../types';

const LOCALSTORAGE_KEY = 'home_designer_autosave';

// Action types
type DesignAction =
  | { type: 'SET_CANVAS'; payload: Partial<CanvasConfig> }
  | { type: 'ADD_ELEMENT'; payload: { element: Omit<DesignElement, 'id' | 'computedPosition'>; parentId?: string } }
  | { type: 'UPDATE_ELEMENT'; payload: { id: string; updates: Partial<DesignElement> } }
  | { type: 'DELETE_ELEMENT'; payload: string }
  | { type: 'SELECT_ELEMENT'; payload: string | null }
  | { type: 'SET_VIEW'; payload: ViewType }
  | { type: 'SET_ZOOM'; payload: number }
  | { type: 'MOVE_ELEMENT'; payload: { id: string; position: Position } }
  | { type: 'REORDER_ELEMENTS'; payload: DesignElement[] }
  | { type: 'LOAD_STATE'; payload: DesignState };

// Initial canvas configuration
const initialCanvas: CanvasConfig = {
  id: uuidv4(),
  name: 'New Design',
  dimensions: {
    width: 300,
    height: 250,
    depth: 30,
  },
  material: {
    type: 'drywall',
    color: MATERIAL_COLORS.drywall,
  },
  scale: 20,
  showGrid: true,
  gridSize: 10,
  snapToGrid: true,
  snapToElements: true,
  autoPosition: true,
  showAllDistances: false,
};

// Initial state
const initialState: DesignState = {
  canvas: initialCanvas,
  elements: [],
  selectedElementId: null,
  activeView: 'elevation',
  zoom: 1,
};

// Load state from localStorage
function loadFromLocalStorage(): DesignState | null {
  try {
    const saved = localStorage.getItem(LOCALSTORAGE_KEY);
    if (saved) {
      const loadedState = JSON.parse(saved) as DesignState;
      // Recompute positions after loading
      const recomputedElements = computeAllPositions(
        loadedState.elements,
        loadedState.canvas.dimensions.width
      );
      return {
        ...loadedState,
        elements: recomputedElements,
      };
    }
  } catch (e) {
    console.error('Failed to load from localStorage:', e);
  }
  return null;
}

// Save state to localStorage
function saveToLocalStorage(state: DesignState): void {
  try {
    localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

// Helper to find and update nested elements
function updateNestedElement(
  elements: DesignElement[],
  id: string,
  updates: Partial<DesignElement>
): DesignElement[] {
  return elements.map((el) => {
    if (el.id === id) {
      return { ...el, ...updates };
    }
    if (el.children.length > 0) {
      return {
        ...el,
        children: updateNestedElement(el.children, id, updates),
      };
    }
    return el;
  });
}

// Helper to delete nested elements
function deleteNestedElement(elements: DesignElement[], id: string): DesignElement[] {
  return elements
    .filter((el) => el.id !== id)
    .map((el) => ({
      ...el,
      children: deleteNestedElement(el.children, id),
    }));
}

// Helper to add element to parent
function addElementToParent(
  elements: DesignElement[],
  parentId: string,
  newElement: DesignElement
): DesignElement[] {
  return elements.map((el) => {
    if (el.id === parentId) {
      return {
        ...el,
        children: [...el.children, { ...newElement, parentId }],
      };
    }
    if (el.children.length > 0) {
      return {
        ...el,
        children: addElementToParent(el.children, parentId, newElement),
      };
    }
    return el;
  });
}

// Helper to find element by ID
function findElement(elements: DesignElement[], id: string): DesignElement | null {
  for (const el of elements) {
    if (el.id === id) return el;
    if (el.children.length > 0) {
      const found = findElement(el.children, id);
      if (found) return found;
    }
  }
  return null;
}

// Compute positions for auto-positioned elements
function computeAutoPositions(
  elements: DesignElement[],
  canvasWidth: number,
  startX: number = 0,
  startY: number = 0,
  allElements?: DesignElement[], // Pass all elements for relative lookup
): DesignElement[] {
  let currentX = startX;
  let currentY = startY;
  let rowHeight = 0;
  
  // Use allElements for lookup, or the current elements array if not provided
  const lookupElements = allElements || elements;

  return elements.map((el) => {
    let computedPosition: Position;

    if (el.positioning.mode === 'absolute' && el.positioning.position) {
      // Absolute positioning is always relative to canvas origin (0,0)
      computedPosition = el.positioning.position;
    } else if (el.positioning.mode === 'relative' && el.positioning.relativeTo) {
      // Find the reference element
      const refElement = findElement(lookupElements, el.positioning.relativeTo);
      const offset = el.positioning.offset || { x: 0, y: 0 };
      
      if (refElement && refElement.computedPosition) {
        const refPos = refElement.computedPosition;
        const anchor = el.positioning.anchor || 'next-to';
        
        switch (anchor) {
          case 'next-to': // Place to the right of reference
            computedPosition = {
              x: refPos.x + refElement.dimensions.width + offset.x,
              y: refPos.y + offset.y,
            };
            break;
          case 'below': // Place below reference
            computedPosition = {
              x: refPos.x + offset.x,
              y: refPos.y + refElement.dimensions.height + offset.y,
            };
            break;
          case 'above': // Place above reference
            computedPosition = {
              x: refPos.x + offset.x,
              y: refPos.y - el.dimensions.height + offset.y,
            };
            break;
          case 'inside': // Place at reference origin (inside)
            computedPosition = {
              x: refPos.x + offset.x,
              y: refPos.y + offset.y,
            };
            break;
          default:
            computedPosition = { x: offset.x, y: offset.y };
        }
      } else {
        // Reference not found or not yet computed, use offset as position
        computedPosition = { x: offset.x, y: offset.y };
      }
    } else {
      // Auto positioning
      if (currentX + el.dimensions.width > canvasWidth && currentX > startX) {
        // Move to next row
        currentX = startX;
        currentY += rowHeight;
        rowHeight = 0;
      }

      computedPosition = { x: currentX, y: currentY };
      currentX += el.dimensions.width;
      rowHeight = Math.max(rowHeight, el.dimensions.height);
    }

    // Recursively compute positions for children
    // Children with 'auto' mode are positioned relative to parent
    // Children with 'absolute' mode use canvas-absolute coordinates
    const computedChildren =
      el.children.length > 0
        ? computeAutoPositions(
            el.children,
            canvasWidth, // Use canvas width for all elements
            computedPosition.x, // Pass parent position for auto-positioning children
            computedPosition.y,
            lookupElements
          )
        : [];

    return {
      ...el,
      computedPosition,
      children: computedChildren,
    };
  });
}

// Two-pass computation to handle relative references to elements that come later
function computeAllPositions(elements: DesignElement[], canvasWidth: number): DesignElement[] {
  // First pass: compute positions for non-relative elements
  let result = computeAutoPositions(elements, canvasWidth, 0, 0, elements);
  // Second pass: recompute to resolve any forward references
  result = computeAutoPositions(result, canvasWidth, 0, 0, result);
  return result;
}

// Reducer
function designReducer(state: DesignState, action: DesignAction): DesignState {
  switch (action.type) {
    case 'SET_CANVAS':
      return {
        ...state,
        canvas: { ...state.canvas, ...action.payload },
      };

    case 'ADD_ELEMENT': {
      const newElement: DesignElement = {
        ...action.payload.element,
        id: uuidv4(),
        children: action.payload.element.children || [],
      };

      let newElements: DesignElement[];
      if (action.payload.parentId) {
        newElements = addElementToParent(state.elements, action.payload.parentId, newElement);
      } else {
        newElements = [...state.elements, newElement];
      }

      // Recompute positions
      newElements = computeAllPositions(newElements, state.canvas.dimensions.width);

      return {
        ...state,
        elements: newElements,
        selectedElementId: newElement.id,
      };
    }

    case 'UPDATE_ELEMENT': {
      let newElements = updateNestedElement(state.elements, action.payload.id, action.payload.updates);
      
      // Recompute positions
      newElements = computeAllPositions(newElements, state.canvas.dimensions.width);

      return {
        ...state,
        elements: newElements,
      };
    }

    case 'DELETE_ELEMENT': {
      let newElements = deleteNestedElement(state.elements, action.payload);
      
      // Recompute positions
      newElements = computeAllPositions(newElements, state.canvas.dimensions.width);

      return {
        ...state,
        elements: newElements,
        selectedElementId:
          state.selectedElementId === action.payload ? null : state.selectedElementId,
      };
    }

    case 'SELECT_ELEMENT':
      return {
        ...state,
        selectedElementId: action.payload,
      };

    case 'SET_VIEW':
      return {
        ...state,
        activeView: action.payload,
      };

    case 'SET_ZOOM':
      return {
        ...state,
        zoom: Math.max(0.1, Math.min(3, action.payload)),
      };

    case 'MOVE_ELEMENT': {
      const newElements = updateNestedElement(state.elements, action.payload.id, {
        positioning: {
          mode: 'absolute' as PositionMode,
          position: action.payload.position,
        },
      });

      return {
        ...state,
        elements: newElements,
      };
    }

    case 'REORDER_ELEMENTS': {
      let newElements = action.payload;
      newElements = computeAllPositions(newElements, state.canvas.dimensions.width);
      return {
        ...state,
        elements: newElements,
      };
    }

    case 'LOAD_STATE': {
      // Recompute positions after loading state
      const loadedState = action.payload;
      const recomputedElements = computeAllPositions(
        loadedState.elements,
        loadedState.canvas.dimensions.width
      );
      return {
        ...loadedState,
        elements: recomputedElements,
      };
    }

    default:
      return state;
  }
}

// Context type
interface DesignContextType {
  state: DesignState;
  dispatch: React.Dispatch<DesignAction>;
  // Helper functions
  setCanvas: (config: Partial<CanvasConfig>) => void;
  addElement: (type: ElementType, parentId?: string) => void;
  updateElement: (id: string, updates: Partial<DesignElement>) => void;
  deleteElement: (id: string) => void;
  selectElement: (id: string | null) => void;
  setView: (view: ViewType) => void;
  setZoom: (zoom: number) => void;
  moveElement: (id: string, position: Position) => void;
  getSelectedElement: () => DesignElement | null;
  findElementById: (id: string) => DesignElement | null;
  exportState: () => string;
  importState: (json: string) => void;
}

const DesignContext = createContext<DesignContextType | null>(null);

// Provider component
export function DesignProvider({ children }: { children: ReactNode }) {
  // Try to load from localStorage on initial render
  const [state, dispatch] = useReducer(
    designReducer,
    initialState,
    (initial) => loadFromLocalStorage() || initial
  );

  // Autosave to localStorage whenever state changes
  useEffect(() => {
    saveToLocalStorage(state);
  }, [state]);

  const setCanvas = useCallback((config: Partial<CanvasConfig>) => {
    dispatch({ type: 'SET_CANVAS', payload: config });
  }, []);

  const addElement = useCallback((type: ElementType, parentId?: string) => {
    const defaults = DEFAULT_DIMENSIONS[type];
    const element: Omit<DesignElement, 'id' | 'computedPosition'> = {
      type,
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} ${Date.now().toString().slice(-4)}`,
      dimensions: { ...defaults },
      depth: type === 'niche' ? 15 : undefined,
      positioning: {
        mode: 'auto',
      },
      material: {
        type: type === 'shelf' ? 'wood' : 'drywall',
        color: type === 'shelf' ? MATERIAL_COLORS.wood : MATERIAL_COLORS.drywall,
      },
      children: [],
    };

    dispatch({ type: 'ADD_ELEMENT', payload: { element, parentId } });
  }, []);

  const updateElement = useCallback((id: string, updates: Partial<DesignElement>) => {
    dispatch({ type: 'UPDATE_ELEMENT', payload: { id, updates } });
  }, []);

  const deleteElement = useCallback((id: string) => {
    dispatch({ type: 'DELETE_ELEMENT', payload: id });
  }, []);

  const selectElement = useCallback((id: string | null) => {
    dispatch({ type: 'SELECT_ELEMENT', payload: id });
  }, []);

  const setView = useCallback((view: ViewType) => {
    dispatch({ type: 'SET_VIEW', payload: view });
  }, []);

  const setZoom = useCallback((zoom: number) => {
    dispatch({ type: 'SET_ZOOM', payload: zoom });
  }, []);

  const moveElement = useCallback((id: string, position: Position) => {
    dispatch({ type: 'MOVE_ELEMENT', payload: { id, position } });
  }, []);

  const getSelectedElement = useCallback((): DesignElement | null => {
    if (!state.selectedElementId) return null;
    return findElement(state.elements, state.selectedElementId);
  }, [state.selectedElementId, state.elements]);

  const findElementById = useCallback((id: string): DesignElement | null => {
    return findElement(state.elements, id);
  }, [state.elements]);

  const exportState = useCallback((): string => {
    return JSON.stringify(state, null, 2);
  }, [state]);

  const importState = useCallback((json: string) => {
    try {
      const parsed = JSON.parse(json) as DesignState;
      dispatch({ type: 'LOAD_STATE', payload: parsed });
    } catch (e) {
      console.error('Failed to import state:', e);
    }
  }, []);

  return (
    <DesignContext.Provider
      value={{
        state,
        dispatch,
        setCanvas,
        addElement,
        updateElement,
        deleteElement,
        selectElement,
        setView,
        setZoom,
        moveElement,
        getSelectedElement,
        findElementById,
        exportState,
        importState,
      }}
    >
      {children}
    </DesignContext.Provider>
  );
}

// Hook to use the design context
// eslint-disable-next-line react-refresh/only-export-components -- exported hook for consumers outside this provider file
export function useDesign() {
  const context = useContext(DesignContext);
  if (!context) {
    throw new Error('useDesign must be used within a DesignProvider');
  }
  return context;
}
