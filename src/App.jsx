import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { BrowserRouter } from 'react-router-dom';
import Main_Page from "./pages/Main_Page";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Main_Page/>
      </BrowserRouter>
    </div>
  );
}

export default App;
