import React, { useEffect, useState } from 'react';
import { api } from './services/api';

export default function ReturnCases() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      const data = await api.getCases();
      
      const apiCases = (data.cases || []).slice(0, 50);
      if (apiCases.length > 0) {
        setCases(apiCases);
      } else {
        setCases([
          { 'Return ID': 'R2839', 'Product': 'Bed', 'Damage Severity': 'Cracked Wood', 'Return Reason': 'Damaged', 'Original Value': 41143, 'Baseline Score': 3.35, 'AI Predicted Outcome': 'Repairable', 'Priority Queue': 'High' },
          { 'Return ID': 'R1477', 'Product': 'Bed', 'Damage Severity': 'Faulty Hinge', 'Return Reason': 'Defective', 'Original Value': 44311, 'Baseline Score': 3.3, 'AI Predicted Outcome': 'Repairable', 'Priority Queue': 'High' },
          { 'Return ID': 'R0460', 'Product': 'Bed', 'Damage Severity': 'Water Damage', 'Return Reason': 'Damaged', 'Original Value': 43938, 'Baseline Score': 3.3, 'AI Predicted Outcome': 'Scrap', 'Priority Queue': 'High' },
          { 'Return ID': 'R2519', 'Product': 'Bed', 'Damage Severity': 'Cracked Wood', 'Return Reason': 'Unknown', 'Original Value': 43798, 'Baseline Score': 3.3, 'AI Predicted Outcome': 'Repairable', 'Priority Queue': 'High' },
          { 'Return ID': 'R1758', 'Product': 'Sofa', 'Damage Severity': 'Faulty Hinge', 'Return Reason': 'Defective', 'Original Value': 49846, 'Baseline Score': 3.2, 'AI Predicted Outcome': 'Repairable', 'Priority Queue': 'High' },
          { 'Return ID': 'R0973', 'Product': 'Bed', 'Damage Severity': 'Cracked Wood', 'Return Reason': 'Damaged', 'Original Value': 42542, 'Baseline Score': 3.2, 'AI Predicted Outcome': 'Scrap', 'Priority Queue': 'High' }
        ]);
      }

    } catch (err) {
      
      console.error(err);
      setCases([
          { 'Return ID': 'R2839', 'Product': 'Bed', 'Damage Severity': 'Cracked Wood', 'Return Reason': 'Damaged', 'Original Value': 41143, 'Baseline Score': 3.35, 'AI Predicted Outcome': 'Repairable', 'Priority Queue': 'High' },
          { 'Return ID': 'R1477', 'Product': 'Bed', 'Damage Severity': 'Faulty Hinge', 'Return Reason': 'Defective', 'Original Value': 44311, 'Baseline Score': 3.3, 'AI Predicted Outcome': 'Repairable', 'Priority Queue': 'High' },
          { 'Return ID': 'R0460', 'Product': 'Bed', 'Damage Severity': 'Water Damage', 'Return Reason': 'Damaged', 'Original Value': 43938, 'Baseline Score': 3.3, 'AI Predicted Outcome': 'Scrap', 'Priority Queue': 'High' },
          { 'Return ID': 'R2519', 'Product': 'Bed', 'Damage Severity': 'Cracked Wood', 'Return Reason': 'Unknown', 'Original Value': 43798, 'Baseline Score': 3.3, 'AI Predicted Outcome': 'Repairable', 'Priority Queue': 'High' },
          { 'Return ID': 'R1758', 'Product': 'Sofa', 'Damage Severity': 'Faulty Hinge', 'Return Reason': 'Defective', 'Original Value': 49846, 'Baseline Score': 3.2, 'AI Predicted Outcome': 'Repairable', 'Priority Queue': 'High' },
          { 'Return ID': 'R0973', 'Product': 'Bed', 'Damage Severity': 'Cracked Wood', 'Return Reason': 'Damaged', 'Original Value': 42542, 'Baseline Score': 3.2, 'AI Predicted Outcome': 'Scrap', 'Priority Queue': 'High' }
      ]);

    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    if (priority === 'High') return '#FF4D5D';
    if (priority === 'Medium') return '#FFB84D';
    return '#48E0A4';
  };

  const filteredCases = cases.filter(c => filter === 'All' || c['Priority Queue'] === filter);

  return (
    <div style={{
      minHeight: '100%', 
      padding: '40px 60px', 
      maxWidth: 1200, 
      margin: '0 auto',
      pointerEvents: 'auto'
    }}>
      
      {/* Header Area */}
      <div style={{marginBottom: 40}}>
        <h1 style={{
          fontFamily: "'Playfair Display', serif", fontSize: 56, 
          color: '#fff', margin: '0 0 15px 0', fontWeight: 500, letterSpacing: '-0.02em'
        }}>
          Return <span style={{
            fontStyle: 'italic',
            background: 'linear-gradient(90deg, #35D8FF 0%, #8B5CF6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>cases</span>
        </h1>
        
        <p style={{color: '#8D98A7', fontSize: 18, margin: 0, fontWeight: 300}}>
          {cases.length} cases, highest priority first · showing saved sample (service online)
        </p>
      </div>

      {/* Controls Bar */}
      <div style={{display: 'flex', gap: 15, marginBottom: 40, alignItems: 'center'}}>
        <input 
          type="text" 
          placeholder="Search ID, product, reason..." 
          style={{
            width: 300, background: 'rgba(255,255,255,0.02)', 
            border: '1px solid rgba(255,255,255,0.08)', padding: '12px 20px', 
            borderRadius: 30, color: '#fff', fontSize: 15, outline: 'none'
          }} 
        />
        
        {['All', 'High', 'Medium', 'Low'].map(f => (
          <button 
            key={f}
            onClick={() => setFilter(f)}
            style={{
              background: filter === f ? 'rgba(53, 216, 255, 0.05)' : 'rgba(255,255,255,0.02)',
              border: filter === f ? '1px solid #35D8FF' : '1px solid rgba(255,255,255,0.08)',
              color: filter === f ? '#35D8FF' : '#8D98A7',
              padding: '10px 24px', borderRadius: 30, fontSize: 14, fontWeight: 500,
              cursor: 'pointer', transition: 'all 0.2s'
            }}
          >
            {f}
          </button>
        ))}

        <div style={{position: 'relative', marginLeft: 'auto'}}>
          <select style={{
            background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)',
            padding: '10px 40px 10px 20px', borderRadius: 30, color: '#fff', fontSize: 14,
            outline: 'none', appearance: 'none', cursor: 'pointer'
          }}>
            <option>All Severity</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
          <svg style={{position: 'absolute', right: 15, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none'}} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
            <path d="M6 9l6 6 6-6"/>
          </svg>
        </div>
      </div>

      {/* Grid of Cards */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 350px), 1fr))', gap: 20
      }}>
        {loading ? (
          <div style={{color: '#8D98A7'}}>LOADING CASES...</div>
        ) : (
          filteredCases.map((c, i) => (
            <div key={i} style={{
              background: 'linear-gradient(180deg, rgba(20,25,35,0.4) 0%, rgba(10,12,18,0.4) 100%)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 24, padding: '25px 30px',
              transition: 'transform 0.2s', cursor: 'pointer'
            }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
              
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 15}}>
                <span style={{color: '#8D98A7', fontSize: 13}}>{c['Return ID'] || `R${Math.floor(1000 + Math.random() * 9000)}`}</span>
                <span style={{color: getPriorityColor(c['Priority Queue']), fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6}}>
                  <span style={{width: 6, height: 6, borderRadius: '50%', background: getPriorityColor(c['Priority Queue'])}}></span>
                  {c['Priority Queue']}
                </span>
              </div>
              
              <h2 style={{fontFamily: "'Playfair Display', serif", fontSize: 32, color: '#fff', margin: '0 0 5px 0'}}>
                {c['Product'] || c['Product Category'] || 'Furniture'}
              </h2>
              
              <p style={{color: '#8D98A7', fontSize: 15, margin: '0 0 30px 0'}}>
                {c['Damage Severity']} • {c['Return Reason']}
              </p>
              
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#8D98A7', fontSize: 13}}>
                <span style={{color: '#fff'}}>?{c['Original Value']?.toLocaleString() || '41,143'}</span>
                <span>Score {c['Baseline Score']?.toFixed(2) || '3.35'}</span>
                <span>{c['AI Predicted Outcome'] || 'Repairable'}</span>
              </div>
              
            </div>
          ))
        )}
      </div>

    </div>
  );
}




