import React, { useMemo, useState } from "react";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { SortableOverlay } from "./SortableOverlay.jsx";
import { DragHandle, SortableItem } from "./SortableItem.jsx";
import Graph from "../../GraphComponents/Graph.jsx";

const SortableList = ({ items, onChange }) => {
  // prop drilled up
  const [active, setActive] = useState(null);

  const renderItem = (item) => (
    <SortableItem id={item.id} key={item.id}>
      <Graph id={item.graphId} />
      <DragHandle />
    </SortableItem>
  );

  const activeItem = useMemo(
    () => items.find((item) => item.id === active?.id),
    [active, items]
  );

  const onDragStart = ({ active }) => {
    setActive(active);
  };

  const onDragEnd = ({ active, over }) => {
    if (over && active.id !== over?.id) {
      const activeIndex = items.findIndex(({ id }) => id === active.id);
      const overIndex = items.findIndex(({ id }) => id === over.id);

      onChange(arrayMove(items, activeIndex, overIndex));
    }
    setActive(null);
  };

  const onDragCancel = () => {
    setActive(null);
  };

  const style = {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: "10px",
    padding: "10px",
    listStyle: "none",
  };

  return (
    <DndContext
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragCancel={onDragCancel}
    >
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
};

export default SortableList;
