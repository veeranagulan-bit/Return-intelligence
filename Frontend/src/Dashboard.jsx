import React, { useEffect, useRef, useState } from 'react';

const SHOTS = [
  "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1604578762246-41134e37f9cc?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=800"
];

const ITEMS = [
  { p: "SOFA", r: "High Risk", s: "HIGH" },
  { p: "OFFICE CHAIR", r: "Medium Risk", s: "MEDIUM" },
  { p: "DINING TABLE", r: "Low Risk", s: "LOW" },
  { p: "WARDROBE", r: "High Risk", s: "HIGH" },
  { p: "BED FRAME", r: "Medium Risk", s: "MEDIUM" },
  { p: "CABINET", r: "Low Risk", s: "LOW" },
  { p: "BOOKSHELF", r: "High Risk", s: "HIGH" },
  { p: "RECLINER", r: "Low Risk", s: "LOW" },
  { p: "COFFEE TABLE", r: "Medium Risk", s: "MEDIUM" },
  { p: "TV UNIT", r: "High Risk", s: "HIGH" }
];

export default function Dashboard() {
  const [cards, setCards] = useState([]);
  const sphereRef = useRef(null);
  const isDragging = useRef(false);
  const startMouse = useRef({ x: 0, y: 0 });
  const rotation = useRef({ x: 0, y: 0 });
  const momentum = useRef({ x: 0, y: 0 });
  
  useEffect(() => {
    // Generate 42 cards for Fibonacci Sphere
    const arr = [];
    const N = 42;
    for(let i=0; i<N; i++) {
      const img = SHOTS[i % 10];
      const data = ITEMS[i % 10];
      arr.push({ id: i, img, ...data });
    }
    setCards(arr);
  }, []);

  useEffect(() => {
    if (!sphereRef.current) return;
    const R = 800; // Radius of sphere
    let frame;
    
    const tick = () => { if (!sphereRef.current) return;
      if (!isDragging.current) {
        // Constant slow cinematic auto-rotation
        rotation.current.y += 0.15;
        
        // Apply momentum from drag
        rotation.current.x += momentum.current.x;
        rotation.current.y += momentum.current.y;
        momentum.current.x *= 0.95; // friction
        momentum.current.y *= 0.95;
      }
      
      const children = sphereRef.current.children;
      const N = children.length;
      const rx = rotation.current.x * Math.PI / 180;
      const ry = rotation.current.y * Math.PI / 180;
      
      // Calculate sin/cos for rotation matrices
      const cx = Math.cos(rx), sx = Math.sin(rx);
      const cy = Math.cos(ry), sy = Math.sin(ry);
      
      for (let i = 0; i < N; i++) {
        // Fibonacci sphere base coordinates
        const phi = Math.acos(1 - 2 * (i + 0.5) / N);
        const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5);
        
        let x = Math.cos(theta) * Math.sin(phi);
        let y = Math.sin(theta) * Math.sin(phi);
        let z = Math.cos(phi);
        
        // Apply global rotation Y
        let x1 = x * cy + z * sy;
        let z1 = -x * sy + z * cy;
        
        // Apply global rotation X
        let y2 = y * cx - z1 * sx;
        let z2 = y * sx + z1 * cx;
        
        let el = children[i];
        
        // Core Protection Area: Push cards outward slightly if they overlap the very center (z close to 1, x and y close to 0)
        // But simply fading them out heavily if they are close to the camera prevents them from blocking the text!
        let opacityModifier = 1;
        if (z2 > 0.8 && Math.abs(x1) < 0.3 && Math.abs(y2) < 0.3) {
            opacityModifier = 0.1; // Make cards transparent if they pass right in front of the center text
        }
        
        // Z-sorting and visibility (culling elements too far back)
        if (z2 < -0.2) {
           el.style.opacity = '0';
           el.style.pointerEvents = 'none';
        } else {
           // Calculate scale and depth
           const scale = (z2 + 2) / 3; // Parallax scale
           const baseAlpha = Math.min(1, (z2 + 0.2) * 2);
           const finalAlpha = baseAlpha * opacityModifier;
           
           el.style.opacity = finalAlpha.toString();
           el.style.pointerEvents = finalAlpha > 0.2 ? 'auto' : 'none';
           el.style.transform = `translate3d(-50%, -50%, 0) translate3d(${x1 * R}px, ${y2 * R}px, ${z2 * R}px) scale(${scale})`;
           el.style.zIndex = Math.floor(z2 * 1000);
           el.style.filter = `brightness(${0.4 + 0.6 * scale})`;
        }
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    
    return () => cancelAnimationFrame(frame);
  }, [cards]);

  const handlePointerDown = (e) => {
    isDragging.current = true;
    startMouse.current = { x: e.clientX || e.touches[0].clientX, y: e.clientY || e.touches[0].clientY };
    momentum.current = { x: 0, y: 0 };
    document.body.style.cursor = 'grabbing';
  };

  const handlePointerMove = (e) => {
    if (!isDragging.current) return;
    const clientX = e.clientX || e.touches[0].clientX;
    const clientY = e.clientY || e.touches[0].clientY;
    
    const dx = clientX - startMouse.current.x;
    const dy = clientY - startMouse.current.y;
    
    rotation.current.y += dx * 0.2;
    rotation.current.x -= dy * 0.2;
    
    momentum.current.x = -dy * 0.02;
    momentum.current.y = dx * 0.02;
    
    startMouse.current = { x: clientX, y: clientY };
  };

  const handlePointerUp = () => {
    isDragging.current = false;
    document.body.style.cursor = 'default';
  };

  return (
    <div 
      style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        overflow: 'hidden', background: '#030407', zIndex: 1
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {/* Center Title fixed in space */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        textAlign: 'center', pointerEvents: 'none', zIndex: 500
      }}>
        <h1 style={{
          fontFamily: "'Playfair Display', serif", fontSize: '80px', fontWeight: 900,
          color: '#fff', margin: 0, lineHeight: 1.1, textTransform: 'uppercase',
          textShadow: '0 10px 40px rgba(0,0,0,0.8)'
        }}>
          Return<br/>Intelligence.
        </h1>
        <p style={{
          color: '#8D98A7', fontSize: '16px', marginTop: 20, letterSpacing: 2,
          textTransform: 'uppercase'
        }}>
          AI-powered inspection, prediction and prioritization
        </p>
        
        {/* Glowing AI Core Orb */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: 300, height: 300, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(53, 216, 255, 0.15) 0%, rgba(0,0,0,0) 70%)',
          pointerEvents: 'none', zIndex: -1
        }}></div>
      </div>

      {/* Fibonacci Sphere Container */}
      <div 
        ref={sphereRef} 
        style={{
          position: 'absolute', top: '50%', left: '50%',
          width: 0, height: 0, transformStyle: 'preserve-3d'
        }}
      >
        {cards.map(c => (
          <div key={c.id} style={{
            position: 'absolute',
            width: 220, height: 320,
            background: 'rgba(5, 7, 11, 0.7)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 20,
            overflow: 'hidden',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            backdropFilter: 'blur(10px)',
            transition: 'opacity 0.2s, filter 0.2s',
            cursor: 'pointer',
            display: 'flex', flexDirection: 'column'
          }}>
            <img src={c.img} style={{width: '100%', height: '60%', objectFit: 'cover'}} alt="" />
            <div style={{padding: '15px 20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
              <span style={{
                fontSize: 10, fontWeight: 700, padding: '4px 8px', borderRadius: 6,
                background: c.s === 'HIGH' ? 'rgba(255,77,93,0.1)' : c.s === 'MEDIUM' ? 'rgba(255,184,77,0.1)' : 'rgba(72,224,164,0.1)',
                color: c.s === 'HIGH' ? '#FF4D5D' : c.s === 'MEDIUM' ? '#FFB84D' : '#48E0A4',
                alignSelf: 'flex-start', letterSpacing: 1
              }}>{c.r}</span>
              <div style={{color: '#fff', fontSize: 16, fontWeight: 600, letterSpacing: 1}}>{c.p}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Indicators */}
      <div style={{
        position: 'absolute', bottom: 40, left: 40, color: '#fff', fontSize: 12,
        pointerEvents: 'none', display: 'flex', alignItems: 'center', gap: 10
      }}>
        <div style={{width: 8, height: 8, borderRadius: '50%', background: '#35D8FF', boxShadow: '0 0 10px #35D8FF'}}></div>
        AI ENGINE ONLINE
      </div>

      <div style={{
        position: 'absolute', bottom: 40, right: 40, color: '#8D98A7', fontSize: 12,
        pointerEvents: 'none', letterSpacing: 2
      }}>
        RETURN INTELLIGENCE 2026
      </div>

      <div style={{
        position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)',
        color: '#8D98A7', fontSize: 11, letterSpacing: 3, pointerEvents: 'none',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8
      }}>
        <div style={{width: 1, height: 30, background: 'linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0.5))'}}></div>
        DRAG TO ROTATE
      </div>
    </div>
  );
}


