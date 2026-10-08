import React, { useState } from 'react';
import { api } from './services/api';

export default function Predictor() {
  const [formData, setFormData] = useState({
    product: '', value: '', transitDays: '',
    returnReason: '', conditionHint: '',
    severity: 'Medium', safety: '',
    slaHours: '', resaleBefore: ''
  });
  
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPrediction(null);
    try {
      const payload = {
        ...formData,
        value: Number(formData.value) || 0,
        transitDays: Number(formData.transitDays) || 0,
        slaHours: Number(formData.slaHours) || 0,
        resaleBefore: Number(formData.resaleBefore) || 0,
      };
      const res = await api.predict(payload);
      setPrediction(res);
    } catch (err) {
      setPrediction({ error: true, message: err.message });
    } finally {
      setLoading(false);
    }
  };

  const InputLabel = ({ children }) => (
    <label style={{
      display: 'block', color: '#8D98A7', fontSize: 11, 
      fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', 
      marginBottom: 10, paddingLeft: 5
    }}>
      {children}
    </label>
  );

  

  const selectWrapperStyle = { position: 'relative' };

  const SelectArrow = () => (
    <svg style={{position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none'}} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#8D98A7" strokeWidth="2">
      <path d="M6 9l6 6 6-6"/>
    </svg>
  );

  return (
    <div style={{ padding: '20px', maxWidth: 1000, margin: '0 auto' }}>
      
      {/* Header Area */}
      <div style={{marginBottom: 40}}>
        <div style={{ color: '#8D98A7', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 15, fontWeight: 600 }}>
          RANDOM FOREST · INSPECTION MODEL
        </div>
        
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 46, color: '#fff', margin: '0 0 15px 0', fontWeight: 500, letterSpacing: '-0.02em' }}>
          Predict the <span style={{
            fontStyle: 'italic',
            background: 'linear-gradient(90deg, #35D8FF 0%, #8B5CF6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>outcome</span>
        </h1>
        
        <p style={{color: '#8D98A7', fontSize: 16, margin: 0, fontWeight: 400}}>
          Enter return details. Photos and videos are attached for the inspector's reference.
        </p>
      </div>

      {/* Main Form Card */}
      <div style={{
        background: 'rgba(10,12,16,0.6)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 24,
        padding: 40,
        }} className="glass-card">
        <form onSubmit={handleSubmit}>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 350px), 1fr))', gap: '30px 40px'}}>
            
            <div className="stagger-field" style={{animationDelay: '0.1s'}}><InputLabel>Product</InputLabel>
              <div style={selectWrapperStyle}>
                <input type="text" name="product" list="product-options" value={formData.product} onChange={handleChange} className="modern-input" placeholder="Type or select..." />
                  <datalist id="product-options">
                  <option value="Sofa" />
                  <option value="Office Chair" />
                  <option value="Dining Table" />
                  <option value="Wardrobe" />
                  <option value="Bed Frame" />
                  <option value="Cabinet" />
                </datalist>
                <SelectArrow />
              </div>
            </div>

            <div className="stagger-field" style={{animationDelay: '0.15s'}}><InputLabel>Return Reason</InputLabel>
              <div style={selectWrapperStyle}>
                <input type="text" name="returnReason" list="reason-options" value={formData.returnReason} onChange={handleChange} className="modern-input" placeholder="Type or select..." />
                  <datalist id="reason-options">
                  <option value="Damaged in Transit" />
                  <option value="Manufacturing Defect" />
                  <option value="Wrong Item" />
                  <option value="No Longer Needed" />
                </datalist>
                <SelectArrow />
              </div>
            </div>

            <div className="stagger-field" style={{animationDelay: '0.2s'}}><InputLabel>Condition</InputLabel>
              <div style={selectWrapperStyle}>
                <input type="text" name="conditionHint" list="condition-options" value={formData.conditionHint} onChange={handleChange} className="modern-input" placeholder="Type or select..." />
                  <datalist id="condition-options">
                  <option value="Broken Frame" />
                  <option value="Scratched" />
                  <option value="Damaged" />
                  <option value="Perfect" />
                </datalist>
                <SelectArrow />
              </div>
            </div>

            

            <div className="stagger-field" style={{animationDelay: '0.3s'}}><InputLabel>Safety Risk</InputLabel>
              <div style={selectWrapperStyle}>
                <input type="text" name="safety" list="safety-options" value={formData.safety} onChange={handleChange} className="modern-input" placeholder="Type or select..." />
                  <datalist id="safety-options">
                  <option value="High" />
                  <option value="Medium" />
                  <option value="Low" />
                </datalist>
                <SelectArrow />
              </div>
            </div>

            <div>
              <InputLabel>Value ?</InputLabel>
              <input type="number" name="value" value={formData.value} onChange={handleChange} className="modern-input" required />
            </div>

            <div>
              <InputLabel>Resale Before ?</InputLabel>
              <input type="number" name="resaleBefore" value={formData.resaleBefore} onChange={handleChange} className="modern-input" required />
            </div>

            <div className="stagger-field" style={{animationDelay: '0.45s'}}><InputLabel>Transit Days</InputLabel>
              <input type="number" name="transitDays" value={formData.transitDays} onChange={handleChange} className="modern-input" required />
            </div>

            <div className="stagger-field" style={{animationDelay: '0.5s'}}><InputLabel>SLA Hours</InputLabel>
              <input type="number" name="slaHours" value={formData.slaHours} onChange={handleChange} className="modern-input" required />
            </div>
            
            

          </div>

          <div style={{marginTop: 30}}>
            <button type="submit" disabled={loading} style={{
              width: '100%', background: 'linear-gradient(90deg, #35D8FF, #8B5CF6)',
              color: '#fff', padding: '18px', borderRadius: 30,
              fontFamily: 'inherit', fontWeight: 600, fontSize: 16, border: 'none',
              cursor: loading ? 'default' : 'pointer', transition: 'opacity 0.2s',
              boxShadow: '0 10px 20px rgba(139, 92, 246, 0.2)'
            }}>
              {loading ? 'Analyzing...' : 'Run prediction'}
            </button>
          </div>
          
          <div style={{ textAlign: 'center', marginTop: 25, color: '#8D98A7', fontSize: 14 }}>
            {!prediction && !loading && 'Results appear here.'}
          </div>
        </form>

        {prediction && !prediction.error && !loading && (
          <div style={{
            marginTop: 30, background: 'linear-gradient(90deg, rgba(53, 216, 255, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
            border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24, padding: 30, animation: 'fadeIn 0.5s ease-out'
          }}>
            <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <div>
                <div style={{color: '#8D98A7', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 10}}>AI PREDICTED OUTCOME</div>
                <div style={{fontFamily: "'Playfair Display', serif", fontSize: 40, color: '#fff', margin: 0, textTransform: 'capitalize'}}>
                  {prediction.outcome || prediction.prediction}
                </div>
              </div>
              <div style={{textAlign: 'right'}}>
                <div style={{color: '#8D98A7', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 10}}>CONFIDENCE</div>
                <div style={{fontSize: 32, color: '#35D8FF', fontWeight: 300}}>{prediction.confidence.toFixed(1)}%</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}






