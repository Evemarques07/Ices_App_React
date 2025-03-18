// src/App.jsx
import "./css/index.css";
import { Outlet } from "react-router-dom";

import Navbar from "./components/Navbar";

function App() {
  return (
    <div className="app">
      <Navbar />
      <Outlet />
      {/* <p>Footer</p>  inserir as informações de footer */}
    </div>
  );
}

export default App;
