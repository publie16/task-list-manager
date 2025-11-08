import React, { useState, useContext } from "react";
import { TaskContext } from "../context/Taskcontext";
import TaskCard from "./Taskcard";
import { Droppable } from "react-beautiful-dnd";

const Column = ({ column }) => {
  const { addTask, clearDoneTasks } = useContext(TaskContext);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDeadline, setTaskDeadline] = useState("");

  const handleAdd = () => {
    addTask(column.id, taskTitle, taskDeadline);
    setTaskTitle("");
    setTaskDeadline("");
  };

  return (
    <Droppable droppableId={String(column.id)}>
      {(provided) => (
        <div
          className="bg-white rounded-xl shadow-md w-80 p-4 flex flex-col"
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          <h2 className="text-xl font-semibold mb-3 text-center">{column.title}</h2>

          {/* Add Task */}
          <div className="flex flex-col gap-2 mb-3">
            <input
              type="text"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder="Task title..."
              className="border rounded-md px-2 py-1 text-sm"
            />
            <input
              type="datetime-local"
              value={taskDeadline}
              onChange={(e) => setTaskDeadline(e.target.value)}
              className="border rounded-md px-2 py-1 text-sm"
            />
            <button
              onClick={handleAdd}
              className="bg-blue-500 text-white py-1 rounded-md hover:bg-blue-600"
            >
              + Add
            </button>
          </div>

          {/* Tasks */}
          <div className="flex flex-col gap-2 min-h-[60px]">
            {column.tasks.length === 0 ? (
              <p className="text-gray-400 text-sm text-center">No tasks yet</p>
            ) : (
              column.tasks.map((task, index) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  columnId={column.id}
                  index={index}
                />
              ))
            )}
            {provided.placeholder}
          </div>

          {/* Clear Done */}
          {column.title === "Done" && (
            <button
              onClick={clearDoneTasks}
              className="mt-4 bg-red-500 text-white py-1 rounded hover:bg-red-600"
            >
              Clear All Tasks
            </button>
          )}
        </div>
      )}
    </Droppable>
  );
};

export default Column;
