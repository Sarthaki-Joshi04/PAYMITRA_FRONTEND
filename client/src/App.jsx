// src/App.jsx
import { useEffect,useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

import Future from "./pages/Future"
//Home
import Home from "./home/home";

// Importing pages
import Dashboard from "./pages/DashboardMain";
import Compare from "./pages/Compare";

import Analytics from "./pages/Analytics";
// import AIAdvisor from "./pages/AIAdvisor";
// import Admin from "./pages/Admin";
import Settings from "./pages/Settings";
import AIAdvisor from './pages/AIAdvisor'

//Animes
import BrandNameAnimation from "./loaders/BrandNameAnimation";
import DoorAnimation from "./loaders/DoorAnimation";
import LoaderPanels from "./loaders/LoaderPanels";


import MVP from "./LoanPlanner/Dashboard"

// import UPform from "./pages/GetInfo"
import UPform from "./pages/UPForm"


const App = () => {
    //page whiiteout to prevent flashing
  const [whiteOut, setWhiteOut] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setWhiteOut(false), 400);
    return () => clearTimeout(timer);
  }, []);
  //========================
  
  const [phase, setPhase] = useState(0);
  const isDesktop =
    typeof window !== "undefined" ? window.innerWidth >= 1024 : true;


  // Loading Animation phases (kept intact for future use)
  useEffect(() => {
    if (isDesktop) {
      setPhase(1);
    } else {
      setPhase(2);
    }
  }, [isDesktop]);


  return (
    <Router>
      {whiteOut && (
          <div className="fixed inset-0 bg-white z-[9999]"></div>
      )}

      
      <Routes>

          <Route path="/" element={<Home />} />

        <Route element={<Layout />}>
          <Route path="/app" element={<Dashboard />} />
          <Route path="/advisor" element={<MVP />} />
          <Route path="/future" element={<Future />} />
          <Route path="/mvp" element={<AIAdvisor />} />

          
          {/* <Route path="/recommendation" element={<AIAdvisor />} /> */}
          <Route path="/compare" element={<Compare />} />
      
          <Route path="/analytics" element={<Analytics />} />
          {/* <Route path="/admin" element={<Admin />} /> */}
   
          <Route path="/settings" element={<Settings />} />
          <Route path="/upload" element={<UPform />} />
          
        </Route>
      </Routes>


      {/* Panels visible for animation phases */}
      {phase !== 0 && <LoaderPanels visible={true} />}
      {phase === 1 && (<BrandNameAnimation onComplete={() => setPhase(2)} />)}
      {phase === 2 && (<DoorAnimation onComplete={() => setPhase(0)} />)}
    </Router>
  );
};

export default App;

