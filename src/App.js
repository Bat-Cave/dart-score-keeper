import React from "react";
import Home from "./pages/home";
import History from "./pages/history";
// import Nav from "./components/nav";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./root.css";

function App() {
  return (
    <div className="root">
      <BrowserRouter>
        {/* <Nav /> */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="history" element={<History />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
