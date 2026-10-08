import React, { useState, useEffect, useRef, useMemo } from 'react';
import { api } from './services/api';
import Predictor from './Predictor';
import ReturnCases from './ReturnCases';
import Dashboard from './Dashboard';
import CommandCenter from './CommandCenter';
import SimulationLab from './SimulationLab';
import DamageAI from './DamageAI';
import './App.css';

export default function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const [status, setStatus] = useState("checking");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayedPage, setDisplayedPage] = useState("dashboard");

  // Health check
  useEffect(() => {
    api.health()
      .then(() => setStatus("online"))
      .catch(() => setStatus("offline"));
  }, []);

  const handleNav = (page) => {
    if (page === activePage) return;
    setActivePage(page);
    setIsTransitioning(true);
    setTimeout(() => {
      setDisplayedPage(page);
      setIsTransitioning(false);
    }, 150); // fast transition
  };

  // Generate starfield/snow background (performant box-shadow)
  const starFieldA = useMemo(() => {
    return Array.from({length: 150}).map(() => {
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const a = 0.05 + Math.random() * 0.25;
      return `${x}vw ${y}vh 0 rgba(255,255,255,${a})`;
    }).join(',');
  }, []);
  
  const starFieldB = useMemo(() => {
    return Array.from({length: 18}).map(() => {
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const a = 0.35 + Math.random() * 0.35;
      return `${x}vw ${y}vh 1.2px 0 rgba(255,255,255,${a})`;
    }).join(',');
  }, []);

  return (
    <div className="app-container">
      {/* Background Animation Layer */}
      <div className="bg"></div>
      
      {/* Snowfall Layer - strictly pointer-events: none */}
      {activePage !== 'dashboard' && (
        <div className="snow-layer" style={{ pointerEvents: 'none' }}>
          <div className="stars" style={{boxShadow: starFieldA}}></div>
          <div className="stars slow" style={{boxShadow: starFieldB}}></div>
        </div>
      )}

      {/* Modern Navigation */}
      <nav className="top-navbar">
        <div className="nav-brand" onClick={() => handleNav("dashboard")}>
          <span className="brand-return">Return</span>
          <span className="brand-iq">IQ</span>
        </div>
        
        <div className="nav-links">
          {[
            { id: 'dashboard', label: 'Dashboard' },
            { id: 'predictor', label: 'Predictor' },
            { id: 'cases', label: 'Return Cases' },
            { id: 'command', label: 'Command Center' },
            { id: 'simulation', label: 'Simulation Lab' },
            { id: 'damage', label: 'Damage AI' }
          ].map(link => (
            <button 
              key={link.id}
              className={`nav-link ${activePage === link.id ? 'active' : ''}`}
              onClick={() => handleNav(link.id)}
            >
              {link.label}
              {activePage === link.id && <div className="nav-active-glow"></div>}
            </button>
          ))}
        </div>
        
        {/* System Status */}
        <div className="nav-status" style={{marginLeft: 'auto'}}>
          <div className={`status-dot ${status}`}></div>
          <span style={{fontSize: 12, color: '#8D98A7', letterSpacing: 1, textTransform: 'uppercase'}}>{status === 'online' ? 'System Online' : 'Connecting...'}</span>
        </div>
      </nav>
      
      {/* Thin Divider */}
      <div className="nav-divider"></div>

      {/* Main Content Area */}
      <main className="main-content">
        <div className={`page-wrapper ${isTransitioning ? 'fade-out' : 'fade-in'}`}>
          {displayedPage === "dashboard" && <Dashboard />}
          {displayedPage === "predictor" && <Predictor />}
          {displayedPage === "cases" && <ReturnCases />}
          {displayedPage === "command" && <CommandCenter />}
          {displayedPage === "simulation" && <SimulationLab />}
          {displayedPage === "damage" && <DamageAI />}
        </div>
      </main>
    </div>
  );
}
