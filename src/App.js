import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {
  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND}/`, {
      method: "GET",
    }).then((res) => console.log("backend started"));
  }, []);

  return (
    <div className="fixed h-[100vh] w-[100vw] bg-[#F8EDEB]">
      <div className="h-full w-full overflow-y-auto">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;