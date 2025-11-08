import React, { createContext, useState, useEffect } from "react";

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [columns, setColumns] = useState(() => {
    const stored = localStorage.getItem("columns");
    return (
      JSON.parse(stored) || [
        { id: 1, title: "To Do", tasks: [] },
        { id: 2, title: "In Progress", tasks: [] },
        { id: 3, title: "Done", tasks: [] },
      ]
    );
  });

  const [deadlines, setDeadlines] = useState(() => {
    const stored = localStorage.getItem("deadlines");
    return stored ? JSON.parse(stored) : [];
  });

  // Save everything in LocalStorage
  useEffect(() => {
    localStorage.setItem("columns", JSON.stringify(columns));
  }, [columns]);

  useEffect(() => {
    localStorage.setItem("deadlines", JSON.stringify(deadlines));
  }, [deadlines]);

  // ✅ Add new task (optionally with deadline)
  const addTask = (columnId, title, deadline = "") => {
    if (!title.trim()) return;
    const newTask = { id: Date.now(), title, deadline };

    setColumns((prev) =>
      prev.map((col) =>
        col.id === columnId ? { ...col, tasks: [...col.tasks, newTask] } : col
      )
    );

    if (deadline) {
      setDeadlines((prev) => [...prev, { title, deadline }]);
    }
  };

  // ✅ Delete a specific task
  const deleteTask = (columnId, taskId) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.id === columnId
          ? { ...col, tasks: col.tasks.filter((t) => t.id !== taskId) }
          : col
      )
    );
  };

  // ✅ Move task between columns (for drag and drop)
  const moveTask = (sourceColId, destColId, taskId) => {
    if (sourceColId === destColId) return;
    let taskToMove;
    setColumns((prev) => {
      const updated = prev.map((col) => {
        if (col.id === sourceColId) {
          taskToMove = col.tasks.find((t) => t.id === taskId);
          return { ...col, tasks: col.tasks.filter((t) => t.id !== taskId) };
        }
        return col;
      });

      return updated.map((col) =>
        col.id === destColId
          ? { ...col, tasks: [...col.tasks, taskToMove] }
          : col
      );
    });
  };

  // ✅ Clear all tasks from "Done" column
  const clearDoneTasks = () => {
    setColumns((prev) =>
      prev.map((col) =>
        col.title === "Done" ? { ...col, tasks: [] } : col
      )
    );
  };

  return (
    <TaskContext.Provider
      value={{
        columns,
        deadlines,
        addTask,
        deleteTask,
        moveTask,
        clearDoneTasks,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
