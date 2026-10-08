import React, { useState, useRef } from 'react';

export default function DamageAI() {
  const [image, setImage] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setResult(null);
        setScanning(true);
        setTimeout(() => {
          setScanning(false);
          setResult({detected: ["Shattered Screen (94%)", "Structural Damage (71%)"], severity: "HIGH", recommendation: "Flag for immediate replacement. Severe structural failure detected."});
        }, 3000);
      };
      reader.readAsDataURL(file);
    }
  };

  const startScan = () => {
    setScanning(true);
    setResult(null);
    
    // Simulate CNN processing time
    setTimeout(() => {
      setScanning(false);
      setResult({
        detected: ["Shattered Glass (92%)", "Structural Warp (68%)"],
        severity: "HIGH",
        recommendation: "Flag for immediate safety isolation. Do not assign to standard repair queue."
      });
    }, 3000);
  };

  return (
    <div style={{display:'flex', flexDirection:'column', paddingRight: 10, paddingBottom: 60}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20}}>
        <h3 style={{color:'#fff', letterSpacing:1}}><span style={{color: '#3ec8e4'}}>COMPUTER VISION</span> DAMAGE ANALYZER</h3>
        <div style={{background:'rgba(250,173,20,0.1)', border:'1px solid #faad14', color:'#faad14', padding:'4px 10px', borderRadius:20, fontSize:12, fontWeight:600}}>
          CNN Prototype Module
        </div>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap: 20}}>
        
        {/* Left: Image Upload & Scanner */}
        <div className="glass-card animate-result" style={{animationDelay:'0.1s', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
           {!image ? (
             <div 
               onClick={() => fileInputRef.current.click()}
               style={{border:'2px dashed rgba(62,200,228,0.3)', borderRadius: 15, padding: 50, textAlign:'center', cursor:'pointer', width:'100%', transition:'all 0.3s'}}
               onMouseOver={(e) => e.currentTarget.style.borderColor = '#3ec8e4'}
               onMouseOut={(e) => e.currentTarget.style.borderColor = 'rgba(62,200,228,0.3)'}
             >
               <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#3ec8e4" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{marginBottom:15}}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
               <h4 style={{color:'#fff', marginBottom:5}}>Upload Furniture Image</h4>
               <p style={{color:'#a9aeb5', fontSize:13}}>JPEG, PNG up to 5MB</p>
               <input type="file" ref={fileInputRef} onChange={handleImageUpload} style={{display:'none'}} accept="image/*" />
             </div>
           ) : (
             <div style={{position:'relative', width:'100%', borderRadius: 15, overflow:'hidden', border: '1px solid rgba(255,255,255,0.1)'}}>
               <img src={image} alt="Uploaded Furniture" style={{width:'100%', height:'280px', objectFit:'contain', display:'block', background:'rgba(0,0,0,0.5)'}} />
               
               {scanning && (
                 <>
                   <div style={{position:'absolute', top:0, left:0, right:0, bottom:0, background:'rgba(62,200,228,0.1)'}}></div>
                   <div style={{
                     position:'absolute', top:0, left:0, right:0, height:3, background:'#3ec8e4', boxShadow:'0 0 20px 5px #3ec8e4',
                     animation: 'scan 2s linear infinite alternate'
                   }}></div>
                   <style>{`@keyframes scan { from { top: 0; } to { top: 100%; } }`}</style>
                 </>
               )}
               
               {result && (
                 <div style={{position:'absolute', top: '15%', left: '20%', border:'2px dashed #ff4d4f', width: '60%', height: '70%', background:'rgba(255,77,79,0.2)'}}>
                    <span style={{position:'absolute', top:-25, left:-2, letterSpacing:1, background:'#ff4d4f', color:'#fff', fontSize:11, padding:'2px 6px', fontWeight:'bold'}}>DETECTED</span>
                 </div>
               )}
             </div>
           )}
           
           {image && !scanning && !result && (
             <button className="btn" onClick={startScan} style={{marginTop: 20, width: '100%', height: 44, borderRadius: 10}}>Start CNN Analysis</button>
           )}
           {image && result && (
             <button className="btn" onClick={() => {setImage(null); setResult(null);}} style={{marginTop: 20, width: '100%', height: 44, borderRadius: 10, background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.2)'}}>Upload New Image</button>
           )}
        </div>

        {/* Right: Analysis Results */}
        <div className="glass-card animate-result" style={{animationDelay:'0.2s'}}>
          <h4 style={{marginBottom: 20, color:'#a6f7ff', borderBottom:'1px solid rgba(255,255,255,0.1)', paddingBottom:10}}>AI Analysis Report</h4>
          
          {scanning ? (
            <div style={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'70%', color:'#3ec8e4'}}>
               <div className="loading-spinner" style={{width:40, height:40, border:'3px solid rgba(62,200,228,0.3)', borderTopColor:'#3ec8e4', borderRadius:'50%', marginBottom: 15}}></div>
               <p style={{fontFamily:'monospace'}}>Running feature extraction layers...</p>
            </div>
          ) : result ? (
            <div className="animate-result">
               <div style={{background:'rgba(255,77,79,0.05)', border:'1px solid rgba(255,77,79,0.3)', padding: 15, borderRadius: 10, marginBottom: 20}}>
                 <h5 style={{color:'#ff4d4f', marginBottom:10}}>Severity Assessed: {result.severity}</h5>
                 <p style={{color:'#fff', fontSize:13, lineHeight:1.5}}>{result.recommendation}</p>
               </div>
               
               <h5 style={{color:'#fff', marginBottom: 10}}>Detected Features</h5>
               <ul style={{color:'#a9aeb5', fontSize: 13, paddingLeft: 20}}>
                 {result.detected.map((d, i) => <li key={i} style={{marginBottom: 8}}>{d}</li>)}
               </ul>

               <button className="btn" style={{marginTop: 20, width: '100%', height: 36, borderRadius: 8}}>Export Damage to Predictor</button>
            </div>
          ) : (
            <div style={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'70%', color:'#a9aeb5', opacity: 0.5}}>
               <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{marginBottom:15}}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
               <p>Awaiting image upload.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}





