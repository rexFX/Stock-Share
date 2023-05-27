import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {
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