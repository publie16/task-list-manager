import React, { useState, useEffect } from "react";

export default function Board() {
  const [tasks, setTasks] = useState({
    todo: [],
    inProgress: [],
    done: [],
  });

  const [newTask, setNewTask] = useState("");
  const [deadline, setDeadline] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  // Detect if user is on a mobile screen
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // ➕ Add task
  const handleAddTask = () => {
    if (newTask.trim() === "") return;
    const taskObj = { text: newTask, deadline: deadline || null };
    setTasks((prev) => ({ ...prev, todo: [...prev.todo, taskObj] }));
    setNewTask("");
    setDeadline("");
  };

  // 🖱️ Desktop drag & drop
  const handleDragStart = (e, task, source) => {
    e.dataTransfer.setData("task", JSON.stringify(task));
    e.dataTransfer.setData("source", source);
  };

  const handleDrop = (e, destination) => {
    const task = JSON.parse(e.dataTransfer.getData("task"));
    const source = e.dataTransfer.getData("source");
    if (source === destination) return;

    setTasks((prev) => {
      const newSource = prev[source].filter((t) => t.text !== task.text);
      const newDestination = [...prev[destination], task];
      return { ...prev, [source]: newSource, [destination]: newDestination };
    });
  };

  const handleDragOver = (e) => e.preventDefault();

  // 🧹 Delete single task
  const handleDeleteTask = (section, index) => {
    setTasks((prev) => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index),
    }));
  };

  // 🗑️ Delete all done
  const handleDeleteAllDone = () => {
    setTasks((prev) => ({ ...prev, done: [] }));
  };

  // 🔁 Mobile move buttons
  const handleMoveTask = (section, index, destination) => {
    const task = tasks[section][index];
    setTasks((prev) => {
      const newSource = prev[section].filter((_, i) => i !== index);
      const newDestination = [...prev[destination], task];
      return { ...prev, [section]: newSource, [destination]: newDestination };
    });
  };

  // 📊 Progress bar
  const totalTasks =
    tasks.todo.length + tasks.inProgress.length + tasks.done.length || 1;
  const todoPercent = (tasks.todo.length / totalTasks) * 100;
  const inProgressPercent = (tasks.inProgress.length / totalTasks) * 100;
  const donePercent = (tasks.done.length / totalTasks) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-8 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-6 tracking-wide">Task Board</h1>

      {/* 📊 Progress Bar */}
      <div className="w-full max-w-4xl mb-8">
        <div className="h-5 w-full bg-gray-700 rounded-full overflow-hidden shadow-md flex">
          <div
            className="bg-red-500 h-full"
            style={{ width: `${todoPercent}%` }}
          ></div>
          <div
            className="bg-yellow-400 h-full"
            style={{ width: `${inProgressPercent}%` }}
          ></div>
          <div
            className="bg-green-500 h-full"
            style={{ width: `${donePercent}%` }}
          ></div>
        </div>

        <div className="flex justify-between text-sm text-gray-400 mt-1 px-1">
          <span>To-Do</span>
          <span>In Progress</span>
          <span>Done</span>
        </div>
      </div>

      {/* 🧊 Main Container */}
      <div className="w-full max-w-6xl bg-gray-800/60 backdrop-blur-md p-8 rounded-3xl shadow-2xl">
        {/* 📝 Input */}
        <div className="flex flex-col md:flex-row justify-center mb-8 space-y-3 md:space-y-0 md:space-x-3">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Enter a new task..."
            className="p-3 w-full md:w-1/2 rounded-xl bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="datetime-local"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="p-3 w-full md:w-1/3 rounded-xl bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleAddTask}
            className="px-5 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-semibold shadow-md transition-all"
          >
            Add
          </button>
        </div>

        {/* 🧱 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {["todo", "inProgress", "done"].map((status) => (
            <div
              key={status}
              className="bg-black/80 rounded-2xl p-6 shadow-lg transition-transform hover:scale-[1.02]"
              onDrop={!isMobile ? (e) => handleDrop(e, status) : undefined}
              onDragOver={!isMobile ? handleDragOver : undefined}
            >
              <h2 className="text-2xl font-semibold mb-4 capitalize text-center border-b border-gray-600 pb-2">
                {status.replace(/([A-Z])/g, " $1")}
              </h2>

              <div className="space-y-3">
                {tasks[status].length === 0 ? (
                  <p className="text-gray-500 italic text-center">
                    No tasks yet
                  </p>
                ) : (
                  tasks[status].map((task, index) => (
                    <div
                      key={index}
                      draggable={!isMobile}
                      onDragStart={
                        !isMobile
                          ? (e) => handleDragStart(e, task, status)
                          : undefined
                      }
                      className="p-3 bg-gray-700/90 rounded-lg shadow-md transition-all"
                    >
                      <div className="flex justify-between items-start">
                        <p className="font-medium">{task.text}</p>
                        <button
                          onClick={() => handleDeleteTask(status, index)}
                          className="text-red-400 hover:text-red-500 text-sm font-semibold"
                        >
                          ✖
                        </button>
                      </div>

                      {task.deadline && (
                        <p className="text-xs text-gray-300 mt-1">
                          ⏰ {new Date(task.deadline).toLocaleString()}
                        </p>
                      )}

                      {/* 📱 Move Buttons for Mobile */}
                      {isMobile && (
                        <div className="flex gap-2 mt-3">
                          {status === "todo" && (
                            <button
                              onClick={() =>
                                handleMoveTask(status, index, "inProgress")
                              }
                              className="text-xs bg-yellow-500/80 px-3 py-1 rounded-lg hover:bg-yellow-400"
                            >
                              Move to In Progress
                            </button>
                          )}
                          {status === "inProgress" && (
                            <button
                              onClick={() =>
                                handleMoveTask(status, index, "done")
                              }
                              className="text-xs bg-green-500/80 px-3 py-1 rounded-lg hover:bg-green-400"
                            >
                              Move to Done
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* 🗑️ Delete All for Done */}
              {status === "done" && tasks.done.length > 0 && (
                <button
                  onClick={handleDeleteAllDone}
                  className="mt-5 w-full py-2 bg-red-700 hover:bg-red-800 rounded-xl font-semibold shadow-md transition-all"
                >
                  Delete All
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
