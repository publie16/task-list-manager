import React from "react";
import { TaskProvider } from "./context/Taskcontext";
import Board from "./components/Board";
import "./App.css";

const App = () => {
  return (
    <TaskProvider>
      <div className="App min-h-screen bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 flex flex-col items-center">
  <h1 className="text-4xl font-bold text-white text-center my-6 drop-shadow-lg">
    🗂️ Task List Management System
  </h1>
  <Board />
</div>

    </TaskProvider>
  );
};

export default App;
