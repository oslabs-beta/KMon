import React, { createContext, useContext, useMemo } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import DashboardContext from "../../context/DashboardContext.jsx";

const DraggableBoxContext = createContext({
  attributes: {},
  listeners: undefined,
  ref() {},
});

export function DraggableBox({ children, id }) {
  const [selectedGraphs, setSelectedGraphs] = useContext(DashboardContext);
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const context = useMemo(
    () => ({
      attributes,
      listeners,
      ref: setActivatorNodeRef,
    }),
    [attributes, listeners, setActivatorNodeRef]
  );

  const DraggableBoxStyle = {
    display: 'flex',
    resize: 'both',
    overflow: 'auto',
    justifyContent: 'space-between',
    width: '550px',
    height: '250px',
    padding: '18px 20px',
    backgroundColor: '#fff',
    boxShadow: '0 0 0 calc(1px / var(--scale-x, 1)) rgba(63, 63, 68, 0.05), 0 1px calc(3px / var(--scale-x, 1)) 0 rgba(34, 33, 81, 0.15)',
    borderRadius: 'calc(4px / var(--scale-x, 1))',
    boxSizing: 'border-box',
    listStyle: 'none',
    color: '#333',
    fontWeight: '400',
    fontSize: '1rem',
    fontFamily: 'sans-serif',
    opacity: isDragging ? 0.4 : undefined,
    transform: CSS.Translate.toString(transform),
    transition,
  };

  const onMouseUp = (mouseUpEvent) => {
    const div = mouseUpEvent.target
    const rect = div.getBoundingClientRect();

      const updateItems = [...selectedGraphs];
      let activeItem;
      for (let i = 0; i < updateItems.length; i++) {
        if (updateItems[i]['id'] === id) {
          activeItem = updateItems[i];
        };
      }

      activeItem.width = rect.width;
      activeItem.height = rect.height;
      setSelectedGraphs(updateItems);

    document.removeEventListener("mouseup", onMouseUp)
  }

  const onMouseDown = (mouseDownEvent) => {
    const div = mouseDownEvent.target
    const rect = div.getBoundingClientRect();
    if (20 > Math.abs(rect.bottom - mouseDownEvent.pageY) && 
        20 > Math.abs(rect.right - mouseDownEvent.pageX)) {
      document.addEventListener("mouseup", onMouseUp);
    }
  }

  return (
    <DraggableBoxContext.Provider value={context}>
      <div className="SortableItem" ref={setNodeRef} style={DraggableBoxStyle} onMouseDown={onMouseDown}>
          {children}
      </div>
    </DraggableBoxContext.Provider>
  );
}

export function DragHandle() {
  const { attributes, listeners, ref } = useContext(DraggableBoxContext);

  const dragHandleStyle = {
    display: 'flex',
    width: '12px',
    padding: '15px',
    alignItems: 'center',
    justifyContent: 'center',
    flex: '0 0 auto',
    touchAction: 'none',
    cursor: 'var(--cursor, pointer)',
    borderRadius: '5px',
    border: 'none',
    outline: 'none',
    appearance: 'none',
    backgroundColor: 'transparent',
    WebkitTapHighlightColor: 'transparent',
  }

  return (
    <button className="DragHandle" {...attributes} {...listeners} ref={ref} style={dragHandleStyle}>
      <svg viewBox="0 0 20 20" width="12">
        <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z"></path>
      </svg>
    </button>
  );
}

