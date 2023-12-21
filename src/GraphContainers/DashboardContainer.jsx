import React, {useContext, useState, useMemo} from "react";
import Graph from "../GraphComponents/Graph.jsx";
import Box from "@mui/material/Box";
import { useAppContext } from '../AppContext.js';

import { DndContext } from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { SortableOverlay } from "../components/dnd/SortableOverlay.jsx";
import DashboardContext from "../context/DashboardContext.jsx";
// import { MetricGroup, DragHandle } from "../components/dnd/MetricGroup.jsx";
import { DraggableBox, DragHandle } from "../components/dnd/DraggableBox.jsx";

function DashboardContainer() {
  const { selectedGraphs, setSelectedGraphs } = useAppContext();
  const [active, setActive] = useState(null);

  const renderItem = (item) => (
    <DashboardContext.Provider value={[selectedGraphs, setSelectedGraphs]}>
      <DraggableBox id={item.id} key={item.id}>
        <Graph key={item.id} id={item.graphId} />
        <DragHandle />
      </DraggableBox>
    </DashboardContext.Provider>
  )

  const activeItem = useMemo(
    () => selectedGraphs.find((selectedGraphs) => selectedGraphs.id === active?.id),
    [active, selectedGraphs]
  );

    const onDragStart = ({ active }) => {
      setActive(active);
    }

  const onDragEnd = ({ active, over }) => {
    if (over && active.id !== over?.id) {
      const activeIndex = selectedGraphs.findIndex(({ id }) => id === active.id);
      const overIndex = selectedGraphs.findIndex(({ id }) => id === over.id);
      setSelectedGraphs(arrayMove(selectedGraphs, activeIndex, overIndex));
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

  // handle the case where there are no selected graphs
  if (!Array.isArray(selectedGraphs) || selectedGraphs.length === 0) {
    return null; 
  }

  return (
    // <Box>
    //   {/* Maps over selected graphs to render Graph components */}
    //   {selectedGraphs.map((metric, id) => (
    //     // Renders Graph components with specific IDs based on what is selected
    //     <Graph key={id} id={metric} />
    //   ))}
    // </Box>
    
    <DndContext onDragStart={onDragStart} onDragEnd={onDragEnd} onDragCancel={onDragCancel}>
      <SortableContext items={selectedGraphs}>
        <ul className="SortableList" role="application" style={style}>
          {selectedGraphs.map((item) => (
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
export default DashboardContainer;
