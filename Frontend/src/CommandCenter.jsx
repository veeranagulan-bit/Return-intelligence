import React, { useState, useEffect } from 'react';
import { api } from './services/api';

export default function CommandCenter() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading for the dashboard
    setTimeout(() => setLoading(false), 800);
  }, []);

  return (
    <div style={{display:'flex', flexDirection:'column', padding: '20px', maxWidth: 1000, margin: '0 auto'}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20}}>
        <h3 style={{color:'#fff', letterSpacing:1}}>
          <span style={{color: '#3ec8e4'}}>RETURNIQ </span> ENTERPRISE COMMAND CENTER
        </h3>
        <div style={{background:'rgba(82,196,26,0.1)', border:'1px solid #52c41a', color:'#52c41a', padding:'4px 10px', borderRadius:20, fontSize:12, fontWeight:600}}>
          System Online
        </div>
      </div>

      {loading ? (
        <div style={{display:'flex', justifyContent:'center', alignItems:'center', flex:1, color:'#3ec8e4'}}>
           <div className="loading-spinner" style={{width:40, height:40, border:'3px solid rgba(62,200,228,0.3)', borderTopColor:'#3ec8e4', borderRadius:'50%'}}></div>
        </div>
      ) : (
        <div style={{display:'flex', flexDirection:'column', gap: 20, paddingBottom: 40}}>
          
          {/* Top Row: Product Health & Integrity */}
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap: 20}}>
            <div className="glass-card animate-result" style={{animationDelay: '0.1s'}}>
              <h4 style={{color:'#fff', borderBottom:'1px solid rgba(255,255,255,0.1)', paddingBottom:10, marginBottom:15}}>Product Health Intelligence</h4>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', background:'rgba(255,255,255,0.03)', padding: 15, borderRadius: 10, borderLeft:'4px solid #ff4d4f', marginBottom: 10}}>
                <div>
                  <div style={{color:'#fff', fontWeight:600}}>Premium Glass Cabinet V2</div>
                  <div style={{fontSize:12, color:'#a9aeb5', marginTop:4}}>Product Health: 42/100 (Critical)</div>
                </div>
                <div style={{textAlign:'right'}}>
                  <div style={{color:'#ff4d4f', fontWeight:600}}>14.2% Return Rate</div>
                  <div style={{fontSize:12, color:'#a9aeb5'}}>+3.4% this month</div>
                </div>
              </div>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', background:'rgba(255,255,255,0.03)', padding: 15, borderRadius: 10, borderLeft:'4px solid #52c41a'}}>
                <div>
                  <div style={{color:'#fff', fontWeight:600}}>Modern Oak Dining Table</div>
                  <div style={{fontSize:12, color:'#a9aeb5', marginTop:4}}>Product Health: 94/100 (Excellent)</div>
                </div>
                <div style={{textAlign:'right'}}>
                  <div style={{color:'#52c41a', fontWeight:600}}>1.8% Return Rate</div>
                  <div style={{fontSize:12, color:'#a9aeb5'}}>-0.2% this month</div>
                </div>
              </div>
            </div>

            <div className="glass-card animate-result" style={{animationDelay: '0.2s'}}>
              <h4 style={{color:'#fff', borderBottom:'1px solid rgba(255,255,255,0.1)', paddingBottom:10, marginBottom:15}}>Suspicious Return Indicator</h4>
              <div style={{background:'rgba(250,173,20,0.05)', border:'1px solid rgba(250,173,20,0.3)', borderRadius: 10, padding: 15}}>
                <div style={{display:'flex', alignItems:'center', marginBottom:10}}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#faad14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:10}}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                  <div>
                    <h4 style={{color:'#faad14', margin:0}}>Medium Risk Detected</h4>
                    <span style={{fontSize:12, color:'#a9aeb5'}}>Integrity Score: 42/100</span>
                  </div>
                </div>
                <p style={{fontSize:13, color:'#fff', lineHeight:1.5, marginBottom:10}}>
                  Pattern detected: Multiple high-value returns matching profile signature within 14 days. Identical "Damaged in Transit" reason reported across 3 separate geographic fulfillment centers.
                </p>
                <button className="btn" onClick={(e) => { e.target.innerText = "? Flagged Successfully"; e.target.style.background = "#52c41a"; e.target.style.color = "#fff"; e.target.style.borderColor = "#52c41a"; }} style={{width:"100%", height:32, fontSize:12, borderRadius:8}}>Flag for Manual Review</button>
              </div>
            </div>
          </div>

          {/* Bottom Row: Anomalies & Forecast */}
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap: 20}}>
            <div className="glass-card animate-result" style={{animationDelay: '0.3s'}}>
              <h4 style={{color:'#fff', borderBottom:'1px solid rgba(255,255,255,0.1)', paddingBottom:10, marginBottom:15}}>Return Anomaly Detection</h4>
              <div style={{background:'rgba(255,77,79,0.05)', border:'1px solid rgba(255,77,79,0.3)', padding: 15, borderRadius: 10}}>
                <h5 style={{color:'#ff4d4f', marginBottom:5}}>Spike Alert: Transit Damage</h5>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:10}}>
                  <span style={{color:'#a9aeb5', fontSize:13}}>Expected Baseline</span>
                  <strong style={{color:'#fff'}}>8.5%</strong>
                </div>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:15}}>
                  <span style={{color:'#a9aeb5', fontSize:13}}>Observed (Last 48h)</span>
                  <strong style={{color:'#ff4d4f'}}>24.2%</strong>
                </div>
                <div style={{height:4, background:'rgba(255,255,255,0.1)', borderRadius:2, overflow:'hidden', marginBottom:15}}>
                  <div style={{height:'100%', width:'75%', background:'#ff4d4f'}}></div>
                </div>
                <div style={{fontSize:12, color:'#a6f7ff'}}>
                  <strong>Recommendation:</strong> Escalate to logistics partner. Potential systemic packaging failure on Route A.
                </div>
              </div>
            </div>

            <div className="glass-card animate-result" style={{animationDelay: '0.4s'}}>
              <h4 style={{color:'#fff', borderBottom:'1px solid rgba(255,255,255,0.1)', paddingBottom:10, marginBottom:15}}>Historical Trend Estimate</h4>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap: 15, marginBottom: 15}}>
                <div className="stat-box" style={{padding: 15}}>
                  <h4>Expected Returns (7d)</h4>
                  <h2>~428</h2>
                  <span style={{fontSize:12, color:'#ff4d4f'}}>? 12% vs last week</span>
                </div>
                <div className="stat-box" style={{padding: 15}}>
                  <h4>High Priority Workload</h4>
                  <h2 style={{color: '#faad14'}}>~85</h2>
                  <span style={{fontSize:12, color:'#a9aeb5'}}>Estimated 4 SLA breaches</span>
                </div>
              </div>
              <div style={{background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.05)', padding: 12, borderRadius: 8, fontSize: 13, color: '#fff', display:'flex', justifyContent:'space-between'}}>
                <span>Available Inspectors: <strong>6</strong></span>
                <span style={{color:'#ff4d4f'}}>Capacity Warning (92%)</span>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}




