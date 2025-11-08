import React, { useState, useContext } from "react";
import { TaskContext } from "../context/Taskcontext";

const ColumnInput = ({ column }) => {
  const { addTask } = useContext(TaskContext);
  const [taskTitle, setTaskTitle] = useState("");

  const handleAdd = () => {
    addTask(column.id, taskTitle);
    setTaskTitle("");
  };

  return (
    <div className="flex gap-2 mb-3">
      <input
        type="text"
        value={taskTitle}
        onChange={(e) => setTaskTitle(e.target.value)}
        placeholder="Add new task..."
        className="border rounded-md flex-grow px-2 py-1 text-sm"
      />
      <button
        onClick={handleAdd}
        className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
      >
        +
      </button>
    </div>
  );
};

export default ColumnInput;
