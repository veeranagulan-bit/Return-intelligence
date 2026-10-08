import React, { useState, useEffect } from 'react';
import { api } from './services/api';

export default function SimulationLab() {
  const [formData, setFormData] = useState({
    product: 'Sofa',
    value: 5000,
    transitDays: 5,
    returnReason: 'damaged',
    conditionHint: 'damaged',
    severity: 'medium',
    safety: 'low',
    slaHours: 48,
    resaleBefore: 3000
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const runSimulation = async () => {
      setLoading(true);
      try {
        const res = await api.predict(formData);
        setPrediction(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    const timeoutId = setTimeout(() => {
      runSimulation();
    }, 500); // 500ms debounce
    
    return () => clearTimeout(timeoutId);
  }, [formData]);

  const handleSlider = (e) => {
    setFormData({...formData, [e.target.name]: Number(e.target.value)});
  };
  const handleSelect = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  return (
    <div style={{display:'flex', flexDirection:'column', paddingRight: 10, paddingBottom: 60}}>
      <div style={{paddingBottom: 20}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20}}>
        <h3 style={{color:'#fff', letterSpacing:1}}><span style={{color: '#3ec8e4'}}>WHAT-IF</span> SIMULATION LAB</h3>
        <div style={{background:'rgba(62,200,228,0.1)', border:'1px solid #3ec8e4', color:'#3ec8e4', padding:'4px 10px', borderRadius:20, fontSize:12, fontWeight:600}}>
          Real-Time ML Sandbox
        </div>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap: 20}}>
        {/* Left: Sliders */}
        <div className="glass-card animate-result" style={{animationDelay:'0.1s'}}>
          <h4 style={{marginBottom: 20, color:'#a6f7ff', borderBottom:'1px solid rgba(255,255,255,0.1)', paddingBottom:10}}>Adjust Variables</h4>
          
          <div style={{display:'flex', flexDirection:'column', gap: 15}}>
            <div>
              <div style={{display:'flex', justifyContent:'space-between', marginBottom:5}}>
                <label style={{color:'#a9aeb5', fontSize:13}}>Original Product Value ($)</label>
                <span style={{color:'#fff', fontWeight:600}}>${formData.value}</span>
              </div>
              <input type="range" name="value" min="100" max="100000" step="100" value={formData.value} onChange={handleSlider} style={{width:'100%', accentColor:'#3ec8e4'}} />
            </div>

            <div>
              <div style={{display:'flex', justifyContent:'space-between', marginBottom:5}}>
                <label style={{color:'#a9aeb5', fontSize:13}}>Days in Transit</label>
                <span style={{color:'#fff', fontWeight:600}}>{formData.transitDays} Days</span>
              </div>
              <input type="range" name="transitDays" min="1" max="60" value={formData.transitDays} onChange={handleSlider} style={{width:'100%', accentColor:'#3ec8e4'}} />
            </div>

            <div>
              <div style={{display:'flex', justifyContent:'space-between', marginBottom:5}}>
                <label style={{color:'#a9aeb5', fontSize:13}}>Hours Since Return Request (SLA)</label>
                <span style={{color:'#fff', fontWeight:600}}>{formData.slaHours} Hours</span>
              </div>
              <input type="range" name="slaHours" min="1" max="168" value={formData.slaHours} onChange={handleSlider} style={{width:'100%', accentColor:'#3ec8e4'}} />
            </div>

            <div>
              <div style={{display:'flex', justifyContent:'space-between', marginBottom:5}}>
                <label style={{color:'#a9aeb5', fontSize:13}}>Damage Severity</label>
                <span style={{color:'#fff', fontWeight:600, textTransform:'capitalize'}}>{formData.severity}</span>
              </div>
              <select name="severity" value={formData.severity} onChange={handleSelect} style={{width:'100%', padding: '8px 12px', background: '#12161f', color:'#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius:8}}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            
            <div>
              <div style={{display:'flex', justifyContent:'space-between', marginBottom:5}}>
                <label style={{color:'#a9aeb5', fontSize:13}}>Safety Hazard</label>
                <span style={{color:'#fff', fontWeight:600, textTransform:'capitalize'}}>{formData.safety}</span>
              </div>
              <select name="safety" value={formData.safety} onChange={handleSelect} style={{width:'100%', padding: '8px 12px', background: '#12161f', color:'#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius:8}}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right: Live Prediction */}
        <div className="glass-card animate-result" style={{animationDelay:'0.2s', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
          <h4 style={{marginBottom: 20, color:'#a6f7ff', width:'100%', borderBottom:'1px solid rgba(255,255,255,0.1)', paddingBottom:10, textAlign:'left'}}>Live ML Response</h4>
          
          {loading && !prediction ? (
             <div className="loading-spinner" style={{width:40, height:40, border:'3px solid rgba(62,200,228,0.3)', borderTopColor:'#3ec8e4', borderRadius:'50%'}}></div>
          ) : prediction && !prediction.error ? (
             <div style={{width:'100%', textAlign:'center'}}>
               <h1 style={{fontSize:48, color:'#fff', marginBottom: 10, textTransform:'uppercase', letterSpacing:2}}>{prediction.outcome || prediction.prediction}</h1>
               <div style={{display:'flex', justifyContent:'center', gap: 20, marginBottom: 30}}>
                 <div style={{background:'rgba(255,255,255,0.05)', padding:'10px 20px', borderRadius:10}}>
                   <div style={{fontSize:12, color:'#a9aeb5', textTransform:'uppercase', marginBottom:4}}>Priority</div>
                   <div style={{fontSize:20, fontWeight:'bold', color: prediction.priority === 'High' ? '#ff4d4f' : prediction.priority === 'Medium' ? '#faad14' : '#52c41a'}}>{prediction.priority}</div>
                 </div>
                 <div style={{background:'rgba(255,255,255,0.05)', padding:'10px 20px', borderRadius:10}}>
                   <div style={{fontSize:12, color:'#a9aeb5', textTransform:'uppercase', marginBottom:4}}>Confidence</div>
                   <div style={{fontSize:20, fontWeight:'bold', color:'#3ec8e4'}}>{prediction.confidence.toFixed(1)}%</div>
                 </div>
               </div>

               <h4 style={{textAlign:'left', color:'#fff', marginBottom:10}}>Risk Matrix Shifts</h4>
               <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap: 10, fontSize:13, color:'#a9aeb5'}}>
                 <div style={{display:'flex', justifyContent:'space-between', padding:'8px 12px', background:'rgba(0,0,0,0.3)', borderRadius:6}}><span>Value Risk</span> <strong style={{color:'#fff'}}>{prediction.riskScores?.valueRiskScore || 0}</strong></div>
                 <div style={{display:'flex', justifyContent:'space-between', padding:'8px 12px', background:'rgba(0,0,0,0.3)', borderRadius:6}}><span>Severity</span> <strong style={{color:'#fff'}}>{prediction.riskScores?.severityScore || 0}</strong></div>
                 <div style={{display:'flex', justifyContent:'space-between', padding:'8px 12px', background:'rgba(0,0,0,0.3)', borderRadius:6}}><span>Safety</span> <strong style={{color:'#fff'}}>{prediction.riskScores?.safetyScore || 0}</strong></div>
                 <div style={{display:'flex', justifyContent:'space-between', padding:'8px 12px', background:'rgba(0,0,0,0.3)', borderRadius:6}}><span>SLA Urgency</span> <strong style={{color:'#fff'}}>{prediction.riskScores?.slaUrgencyScore || 0}</strong></div>
               </div>
               {loading && <div style={{marginTop: 20, fontSize: 12, color:'#3ec8e4'}}>Recalculating...</div>}
             </div>
          ) : (
             <div style={{color:'#ff4d4f'}}>Failed to load prediction model.</div>
          )}
        </div>
      </div>
    </div>
    </div>
  );
}


