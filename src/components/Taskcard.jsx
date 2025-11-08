import React, { useContext } from "react";
import { TaskContext } from "../context/Taskcontext";
import { Draggable } from "react-beautiful-dnd";

const TaskCard = ({ task, columnId, index }) => {
  const { deleteTask } = useContext(TaskContext);

  return (
    <Draggable draggableId={String(task.id)} index={index}>
      {(provided) => (
        <div
          className="bg-gray-50 border border-gray-300 rounded-md p-2 flex justify-between items-center hover:shadow-sm"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div className="flex flex-col text-left">
            <span className="font-medium">{task.title}</span>
            {task.deadline && (
              <span className="text-xs text-gray-500">
                ⏰ {new Date(task.deadline).toLocaleString()}
              </span>
            )}
          </div>
          <button
            onClick={() => deleteTask(columnId, task.id)}
            className="text-red-500 hover:text-red-700 font-bold"
          >
            ✕
          </button>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;
