import React, { useMemo, useState, useContext } from "react";
import { DndContext, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { SortableOverlay } from "./SortableOverlay.jsx";
import { DragHandle, MetricGroup } from "./MetricGroup.jsx";
import { DashboardContext, ItemSizeContext} from "../../context/DashboardContext.jsx";
// import { DragHandle, SortableItem } from './SortableItem.jsx';

const MetricGroupContext = () => {
  // prop drilled up
  const [active, setActive] = useState(null);
  const [items, setItems] = useContext(DashboardContext);
  const [itemSizes, setItemSizes] = useContext(ItemSizeContext);

  const renderItem = (item) => (
    <DashboardContext.Provider value={[items, setItems]}>
    <ItemSizeContext.Provider value={[itemSizes, setItemSizes]}>
    <MetricGroup id={item.id} key={item.id}>
      {item.component}
      <DragHandle />
    </MetricGroup>
    </ItemSizeContext.Provider>
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