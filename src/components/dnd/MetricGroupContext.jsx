import React, { useMemo, useState, useContext } from "react";
import { DndContext } from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { SortableOverlay } from "./SortableOverlay.jsx";
import { DragHandle, MetricGroup } from "./MetricGroup.jsx";
import DashboardContext from "../../context/DashboardContext.jsx";

const MetricGroupContext = () => {
  const [active, setActive] = useState(null);
  const [items, setItems] = useContext(DashboardContext);

  const renderItem = (item) => (
    <DashboardContext.Provider value={[items, setItems]}>
      <MetricGroup id={item.id} key={item.id}>
        {item.component}
        <DragHandle />
      </MetricGroup>
    </DashboardContext.Provider>
  )

  const activeItem = useMemo(
    () => items.find((item) => item.id === active?.id),
    [active, items]
  );

    const onDragStart = ({ active }) => {
      setActive(active);
    }

  const onDragEnd = ({ active, over }) => {
    if (over && active.id !== over?.id) {
      const activeIndex = items.findIndex(({ id }) => id === active.id);
      const overIndex = items.findIndex(({ id }) => id === over.id);
      setItems(arrayMove(items, activeIndex, overIndex));
    }
    setActive(null);
  };

  const onDragCancel = () => {
    setActive(null);
  }

  const style = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: '10px',
    padding: '10px',
    listStyle: 'none'
  }

  return (
    <DndContext onDragStart={onDragStart} onDragEnd={onDragEnd} onDragCancel={onDragCancel}>
      <SortableContext items={items}>
        <ul className="SortableList" role="application" style={style}>
          {items.map((item) => (
            <React.Fragment key={item.id}>{renderItem(item)}</React.Fragment>
          ))}
        </ul>
      </SortableContext>
      <SortableOverlay>
        {activeItem ? renderItem(activeItem) : null}
      </SortableOverlay>
    </DndContext>
  );
}

export default MetricGroupContext;