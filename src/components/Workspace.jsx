/* eslint-disable no-unused-vars */
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { useContext, useMemo } from "react";
import Column from "./Column";
import { DataContext } from "../DataContext";
import { produce } from "immer";

const Workspace = () => {
  const { dataState, setDataState, selectedBoardIndex } =
    useContext(DataContext);
  const columns = dataState[selectedBoardIndex]?.columns;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      // Require the mouse to move by 10 pixels before activating
      activationConstraint: {
        distance: 10,
      },
    }),
  );
  const addNewColumnHandler = () => {
    if (!dataState || dataState.length === 0) {
      return;
    }
    setDataState((prev) =>
      produce(prev, (draft) => {
        const newColumn = {
          id: Date.now(),
          title: "New Column",
          tasks: [],
        };
        draft[selectedBoardIndex].columns.push(newColumn);
      }),
    );
  };

  const tasksIds = useMemo(() => {
    let tasksIds = [];
    if (!columns || columns.length === 0) {
      return tasksIds;
    }
    columns?.forEach((column) => {
      tasksIds = [...tasksIds, ...column.tasks.map((task) => task.id)];
    });

    return tasksIds;
  }, [columns]);


  const onDragEndHandler = (event) => {
    const { active, over } = event;
    const activeId = active.id;
    const overId = over.id;
    const activeColumnId = active.data.current.columnId;
    const overColumnId = over.data.current.columnId;
    if (activeId === overId) return;
    if (activeColumnId === overColumnId) {
      const newColumns = columns.map((column) => {
        if (column.id === activeColumnId) {
          const activeIdIndex = column.tasks.findIndex(
            (task) => task.id === activeId,
          );
          const overIdIndex = column.tasks.findIndex(
            (task) => task.id === overId,
          );
          const tasks = arrayMove(column.tasks, activeIdIndex, overIdIndex);

          return {
            ...column,
            tasks,
          };
        }
        return column;
      });

      setDataState((prev) =>
        produce(prev, (draft) => {
          draft[selectedBoardIndex].columns = newColumns;
        }),
      );
    }
  };

  const onDragOverHandler = (event) => {
    const { active, over } = event;
    const activeId = active?.id;
    const activeColumnId = active?.data?.current?.columnId;
    const overColumnId = over?.data?.current?.columnId;

    
    if (overColumnId && activeColumnId !== overColumnId) {
      const newColumns = columns.map((column) => {
        let tasks;
        if (column.id === overColumnId) {
          const activeTask = columns
          .find((column) => column.id === activeColumnId)
          .tasks.find((task) => task.id === activeId);
          if(!column.tasks || column.tasks.length === 0) tasks = [activeTask];
          tasks = [...column.tasks, activeTask];

          return {
            ...column,
            tasks,
          };
        }

        if (column.id === activeColumnId) {
          const tasks = column.tasks.filter((task) => task.id !== activeId);

          return {
            ...column,
            tasks,
          };
        }
        return column;
      });
      setDataState((prev) =>
        produce(prev, (draft) => {
          draft[selectedBoardIndex].columns = newColumns;
        }),
      );
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEndHandler}
      onDragOver={onDragOverHandler}
    >
      <div className="flex h-[calc(100vh-97px)] flex-1 gap-6 overflow-auto bg-light-grey p-6">
        <SortableContext items={tasksIds}>
          {columns?.length &&
            columns.map((column, index) => (
              <Column
                key={column.id}
                id={column.id}
                title={column.title}
                tasks={column.tasks}
                columnIndex={index}
              />
            ))}
        </SortableContext>

        <button
          className="w-72 shrink-0 self-start rounded-md bg-lines-light p-3 text-heading-l text-medium-grey"
          onClick={addNewColumnHandler}
        >
          + New Column
        </button>
      </div>
    </DndContext>
  );
};

export default Workspace;
