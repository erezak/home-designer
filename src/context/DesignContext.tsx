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
  | { type: 'SET_ELEMENT_ZINDEX'; payload: { id: string; zIndex: number } }
  | { type: 'SWAP_ELEMENT_ZINDEX'; payload: { idA: string; idB: string } }
  | { type: 'TOGGLE_LEFT_SIDEBAR' }
  | { type: 'TOGGLE_RIGHT_SIDEBAR' }
  | { type: 'SET_SIDEBARS'; payload: { leftCollapsed: boolean; rightCollapsed: boolean } }
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
  sidebars: {
    leftCollapsed: false,
    rightCollapsed: false,
  },
};

// Load state from localStorage
function loadFromLocalStorage(): DesignState | null {
  try {
    const saved = localStorage.getItem(LOCALSTORAGE_KEY);
    if (saved) {
      const loadedState = JSON.parse(saved) as Partial<DesignState>;

      // Ensure sidebar defaults exist for older saved states
      const sidebars = {
        leftCollapsed: false,
        rightCollapsed: false,
        ...(loadedState.sidebars || {}),
      };

      // Recompute positions after loading (use canvas from loaded state or initial)
      const canvas = (loadedState.canvas as CanvasConfig) || initialCanvas;
      const elements = (loadedState.elements as DesignElement[]) || [];
      const recomputedElements = computeAllPositions(
        elements,
        canvas.dimensions.width
      );

      return {
        ...initialState,
        ...loadedState as DesignState,
        sidebars,
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

// Flatten elements (pre-order) - useful for global z-index calculations
function flattenElements(elements: DesignElement[]): DesignElement[] {
  const out: DesignElement[] = [];
  const walk = (els: DesignElement[]) => {
    for (const el of els) {
      out.push(el);
      if (el.children.length > 0) walk(el.children);
    }
  };
  walk(elements);
  return out;
}

// Get maximum zIndex (treat missing zIndex as -Infinity so any set will be larger)
function getMaxZIndex(elements: DesignElement[]): number {
  const flat = flattenElements(elements);
  if (flat.length === 0) return -1;
  return Math.max(...flat.map((e) => (typeof e.zIndex === 'number' ? e.zIndex : -1)));
}

// Normalize zIndex across all elements to sequential integers starting at 0
function normalizeZIndices(elements: DesignElement[]): DesignElement[] {
  const flat = flattenElements(elements).slice();
  // Sort by current zIndex (missing treated as -1), preserve stable order for ties
  flat.sort((a, b) => ( (typeof a.zIndex === 'number' ? a.zIndex : -1) - (typeof b.zIndex === 'number' ? b.zIndex : -1) ));

  // Assign new sequential z-indices
  const idToZ = new Map<string, number>();
  for (let i = 0; i < flat.length; i++) {
    idToZ.set(flat[i].id, i);
  }

  // Update tree with new zIndices
  const updateZ = (els: DesignElement[]): DesignElement[] => {
    return els.map((el) => ({
      ...el,
      zIndex: idToZ.get(el.id) ?? 0,
      children: el.children.length > 0 ? updateZ(el.children) : [],
    }));
  };

  return updateZ(elements);
}

// Compute positions for auto-positioned elements
function computeAutoPositions(
  elements: DesignElement[],
  canvasWidth: number,
  startX: number = 0,
  startY: number = 0,
  allElements?: DesignElement[], // Pass all elements for relative lookup
  _parentPosition?: Position // Parent position for context (unused but available)
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
            lookupElements,
            computedPosition // Pass parent position for context
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
        // Place newly added elements above existing ones by default
        zIndex: getMaxZIndex(state.elements) + 1,
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

    case 'TOGGLE_LEFT_SIDEBAR':
      return {
        ...state,
        sidebars: {
          ...state.sidebars,
          leftCollapsed: !state.sidebars.leftCollapsed,
        },
      };

    case 'TOGGLE_RIGHT_SIDEBAR':
      return {
        ...state,
        sidebars: {
          ...state.sidebars,
          rightCollapsed: !state.sidebars.rightCollapsed,
        },
      };

    case 'SET_SIDEBARS':
      return {
        ...state,
        sidebars: { ...action.payload },
      };

    case 'MOVE_ELEMENT': {
      let newElements = updateNestedElement(state.elements, action.payload.id, {
        positioning: {
          mode: 'absolute' as PositionMode,
          position: action.payload.position,
        },
      });

      // Recompute positions so computedPosition is set for absolute-mode elements
      newElements = computeAllPositions(newElements, state.canvas.dimensions.width);

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

    case 'SET_ELEMENT_ZINDEX': {
      let newElements = updateNestedElement(state.elements, action.payload.id, { zIndex: action.payload.zIndex });
      // Normalize to keep indices compact
      newElements = normalizeZIndices(newElements);
      return { ...state, elements: newElements };
    }

    case 'SWAP_ELEMENT_ZINDEX': {
      const a = findElement(state.elements, action.payload.idA);
      const b = findElement(state.elements, action.payload.idB);
      if (!a || !b) return state;
      let newElements = updateNestedElement(state.elements, action.payload.idA, { zIndex: b.zIndex });
      newElements = updateNestedElement(newElements, action.payload.idB, { zIndex: a.zIndex });
      newElements = normalizeZIndices(newElements);
      return { ...state, elements: newElements };
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
  // Z-index / layers helpers
  setElementZIndex: (id: string, zIndex: number) => void;
  swapElementZIndex: (idA: string, idB: string) => void;
  bringForward: (id: string) => void;
  sendBackward: (id: string) => void;
  bringToFront: (id: string) => void;
  sendToBack: (id: string) => void;
  // Sidebar helpers
  toggleLeftSidebar: () => void;
  toggleRightSidebar: () => void;
  setSidebars: (leftCollapsed: boolean, rightCollapsed: boolean) => void;
}

const DesignContext = createContext<DesignContextType | null>(null);

// Provider component
export function DesignProvider({ children }: { children: ReactNode }) {
  // Try to load from localStorage on initial render
  const [state, dispatch] = useReducer(
    designReducer,
    initialState,
    (initial) => {
      const saved = loadFromLocalStorage();
      if (saved) return saved;
      // No saved state: set reasonable defaults for small screens so the main canvas has space
      const width = typeof window !== 'undefined' ? window.innerWidth : 1200;
      const leftCollapsed = width < 900; // very small screens hide left by default
      const rightCollapsed = width < 1200; // smaller laptops hide right sidebar by default
      return { ...initial, sidebars: { leftCollapsed, rightCollapsed } };
    }
  );

  // Autosave to localStorage whenever state changes
  useEffect(() => {
    saveToLocalStorage(state);
  }, [state]);

  // macOS-like keyboard shortcuts (using dispatch directly to avoid TDZ)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Avoid when typing in inputs
      const target = e.target as HTMLElement | null;
      const isInput = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);
      if (isInput) return;

      const meta = e.metaKey || e.ctrlKey;
      if (!meta) return;

      // ⌘B -> toggle left sidebar
      if (e.key.toLowerCase() === 'b') {
        e.preventDefault();
        dispatch({ type: 'TOGGLE_LEFT_SIDEBAR' });
      }
      // ⌘E -> toggle right sidebar
      if (e.key.toLowerCase() === 'e') {
        e.preventDefault();
        dispatch({ type: 'TOGGLE_RIGHT_SIDEBAR' });
      }
      // ⌘K -> future: open command palette (placeholder)
      if (e.key.toLowerCase() === 'k') {
        e.preventDefault();
        // For now, log; could open a command palette component later
        // eslint-disable-next-line no-console
        console.log('Command palette (⌘K) pressed');
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [dispatch]);

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

  // Sidebar helpers
  const toggleLeftSidebar = useCallback(() => {
    dispatch({ type: 'TOGGLE_LEFT_SIDEBAR' });
  }, []);

  const toggleRightSidebar = useCallback(() => {
    dispatch({ type: 'TOGGLE_RIGHT_SIDEBAR' });
  }, []);

  const setSidebars = useCallback((leftCollapsed: boolean, rightCollapsed: boolean) => {
    dispatch({ type: 'SET_SIDEBARS', payload: { leftCollapsed, rightCollapsed } });
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

  // Z-index / layers helpers
  const setElementZIndex = useCallback((id: string, zIndex: number) => {
    dispatch({ type: 'SET_ELEMENT_ZINDEX', payload: { id, zIndex } });
  }, []);

  const swapElementZIndex = useCallback((idA: string, idB: string) => {
    dispatch({ type: 'SWAP_ELEMENT_ZINDEX', payload: { idA, idB } });
  }, []);

  const bringForward = useCallback((id: string) => {
    const flat = flattenElements(state.elements).slice().sort((a, b) => ( (typeof a.zIndex === 'number' ? a.zIndex : -1) - (typeof b.zIndex === 'number' ? b.zIndex : -1) ));
    const idx = flat.findIndex((e) => e.id === id);
    if (idx === -1 || idx === flat.length - 1) return;
    const next = flat[idx + 1];
    dispatch({ type: 'SWAP_ELEMENT_ZINDEX', payload: { idA: id, idB: next.id } });
  }, [state.elements]);

  const sendBackward = useCallback((id: string) => {
    const flat = flattenElements(state.elements).slice().sort((a, b) => ( (typeof a.zIndex === 'number' ? a.zIndex : -1) - (typeof b.zIndex === 'number' ? b.zIndex : -1) ));
    const idx = flat.findIndex((e) => e.id === id);
    if (idx <= 0) return;
    const prev = flat[idx - 1];
    dispatch({ type: 'SWAP_ELEMENT_ZINDEX', payload: { idA: id, idB: prev.id } });
  }, [state.elements]);

  const bringToFront = useCallback((id: string) => {
    const max = getMaxZIndex(state.elements);
    dispatch({ type: 'SET_ELEMENT_ZINDEX', payload: { id, zIndex: max + 1 } });
  }, [state.elements]);

  const sendToBack = useCallback((id: string) => {
    const flat = flattenElements(state.elements);
    if (flat.length === 0) return;
    const min = Math.min(...flat.map((e) => (typeof e.zIndex === 'number' ? e.zIndex : 0)));
    dispatch({ type: 'SET_ELEMENT_ZINDEX', payload: { id, zIndex: min - 1 } });
  }, [state.elements]);

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
        // Z-index / layers helpers
        setElementZIndex,
        swapElementZIndex,
        bringForward,
        sendBackward,
        bringToFront,
        sendToBack,
        // Sidebar helpers
        toggleLeftSidebar,
        toggleRightSidebar,
        setSidebars,
      }}
    >
      {children}
    </DesignContext.Provider>
  );
}

// Hook to use the design context
export function useDesign() {
  const context = useContext(DesignContext);
  if (!context) {
    throw new Error('useDesign must be used within a DesignProvider');
  }
  return context;
}
