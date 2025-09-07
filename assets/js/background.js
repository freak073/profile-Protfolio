// Enhanced Background - Noise-based diagonal grid with mouse interaction and nearest link detection
(function(){
  function waitForP5(cb){ if(window.p5){ cb(); return; } setTimeout(()=>waitForP5(cb),25); }

  waitForP5(()=>{
    const sketch = (p5)=>{
      // ----- Configuration -----
      let scl = 15;                    // grid scale
      let inc = 0.02;                  // noise increment  
      let zoff = 10;                   // z-offset for noise
      let bg = '#000000';              // background color
      let lagFast = 10;                // fast mouse lag
      let lagSlow = 75;                // slow mouse lag
      let mouseSpeed = 0;
      let breathingIntensity = 0.0001;
      
      // Mouse tracking variables
      let mx = 0, my = 0;              // slow mouse
      let mx1 = 0, my1 = 0;            // fast mouse
      let lastMouseX = 0, lastMouseY = 0;
      
      // Content anchors (where content is positioned)
      let contentAnchor1 = {x: 0, y: 0}; // 30%, 20%
      let contentAnchor2 = {x: 0, y: 0}; // 40%, 60%
      
      // Nearest element detection
      let nearestElement = null;
      let frameCounter = 0;
      
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      let isPaused = false;

      // Utility functions
      function clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
      }

      function findNearestElement(x, y) {
        let elements = document.querySelectorAll('a');
        let nearestDistance = Infinity;
        let bestPoint = null;
        let bestElement = null;

        for(const element of elements) {
          let rect = element.getBoundingClientRect();
          
          // Check 4 edge points
          const points = [
            {x: rect.left, y: clamp(y, rect.top, rect.bottom)},
            {x: rect.right, y: clamp(y, rect.top, rect.bottom)},
            {x: clamp(x, rect.left, rect.right), y: rect.top},
            {x: clamp(x, rect.left, rect.right), y: rect.bottom}
          ];
          
          for(const point of points) {
            let distance = p5.dist(x, y, point.x, point.y);
            if (distance < nearestDistance) {
              nearestDistance = distance;
              bestPoint = point;
              bestElement = element;
            }
          }
        }
        
        if(!bestElement) return {distance: Infinity, x: 0, y: 0};
        
        const rect = bestElement.getBoundingClientRect();
        return {
          nearestElement: bestElement, 
          x: bestPoint.x,
          y: bestPoint.y,
          distance: nearestDistance,
          width: rect.width,
          height: rect.height,
          x1: rect.left,
          y1: rect.top,
          x2: rect.left + rect.width,
          y2: rect.top + rect.height,
        };
      }

      p5.setup = function() {
        p5.noiseSeed(1);
        p5.createCanvas(p5.windowWidth, p5.windowHeight);
        p5.background(bg);
        
        // Initialize mouse positions
        mx = mx1 = p5.mouseX || p5.width/2;
        my = my1 = p5.mouseY || p5.height/2;
        lastMouseX = mx1;
        lastMouseY = my1;
        
        // Set content anchors
        contentAnchor1.x = p5.width * 0.3;
        contentAnchor1.y = p5.height * 0.2;
        contentAnchor2.x = p5.width * 0.4; 
        contentAnchor2.y = p5.height * 0.6;
      }

      p5.windowResized = function() {
        p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
        contentAnchor1.x = p5.width * 0.3;
        contentAnchor1.y = p5.height * 0.2;
        contentAnchor2.x = p5.width * 0.4;
        contentAnchor2.y = p5.height * 0.6;
      }

      function reducedMotionFrame() {
        p5.background(bg);
        p5.strokeWeight(1);
        p5.stroke(120, 100, 200, 100);
        
        // Draw simple static grid
        for(let y = 0; y < p5.height; y += scl*2) {
          for(let x = 0; x < p5.width; x += scl*2) {
            if(p5.noise(x*0.01, y*0.01) > 0.5) {
              p5.line(x, y, x+scl, y+scl);
            }
          }
        }
        p5.noLoop();
      }

      function updateMouseTracking() {
        mouseSpeed = p5.dist(p5.mouseX, p5.mouseY, lastMouseX, lastMouseY);
        mx1 += (p5.mouseX - mx1) / lagFast;
        my1 += (p5.mouseY - my1) / lagFast;
        mx += (p5.mouseX - mx) / lagSlow; 
        my += (p5.mouseY - my) / lagSlow;
        lastMouseX = p5.mouseX;
        lastMouseY = p5.mouseY;
      }

      function calculateBreathing() {
        let ttt = p5.frameCount * 0.1;
        let breath = Math.sin(2*ttt + 1.2*Math.sin(2*ttt));
        let distanceFromMouseNearest = nearestElement ? nearestElement.distance : Infinity;
        let breathFactor = 1 - Math.min(1, p5.map(distanceFromMouseNearest, 0, 36, 0, 1));
        return breath * breathingIntensity * breathFactor;
      }

      function calculateCellParams(x, y, xoff, yoff) {
        let distanceFromMousePos = p5.dist(mx, my, x, y);
        let distanceFromContent = p5.dist(contentAnchor1.x, contentAnchor1.y, x, y);
        let distanceFromContent2 = p5.dist(contentAnchor2.x, contentAnchor2.y, x, y);
        let noisyThreshold = p5.noise(xoff, yoff, p5.frameCount * 0.0005);
        let perlin = p5.noise(xoff, yoff, zoff) + 0.1 * noisyThreshold;
        let colorIntensity = Math.round(p5.map(distanceFromMousePos * perlin, 0, 1500, 0, 255) / 20) * 20;
        
        return {
          distanceFromMousePos,
          distanceFromContent,
          distanceFromContent2,
          noisyThreshold,
          perlin,
          colorIntensity
        };
      }

      function calculateProximityFlags(params) {
        const {distanceFromMousePos, distanceFromContent, distanceFromContent2, noisyThreshold} = params;
        let nearContent3 = (distanceFromContent2 > 900 * noisyThreshold);
        let nearContent2 = (distanceFromContent2 > 800 * noisyThreshold);
        let nearContent = (distanceFromContent > 700 * noisyThreshold) && nearContent2;
        let mouseNear = (distanceFromMousePos > 700 * noisyThreshold) && nearContent;
        let mouseKindaNear = (distanceFromMousePos > 500 * noisyThreshold) && nearContent;
        
        return { nearContent3, mouseNear, mouseKindaNear };
      }

      function drawGridCell(x, y, xoff, yoff, breath) {
        const params = calculateCellParams(x, y, xoff, yoff);
        const flags = calculateProximityFlags(params);
        const {perlin, colorIntensity, noisyThreshold} = params;
        const {nearContent3, mouseNear, mouseKindaNear} = flags;
        
        let distanceFromMouseNearest = nearestElement ? nearestElement.distance : Infinity;
        let nearestHighlight = (distanceFromMouseNearest < 1000 * noisyThreshold);
        
        // Draw nearest element highlight
        if(perlin > 0.5 && nearestHighlight) {
          let ff = p5.map(distanceFromMouseNearest, 0, 200, 80, 0);
          p5.stroke(255, 0, 0, ff);
          p5.line(x, y, x + scl, y + scl);
        }
        
        // Draw main grid lines
        p5.stroke(120, 100, 200, colorIntensity);
        if(perlin > 0.5 && perlin < 0.55 && mouseNear) {
          p5.line(x, y, x + scl, y + scl);
        } else if(perlin >= 0.55 && perlin < 0.6 && mouseKindaNear) {
          p5.line(x, y + scl, x + scl, y);
        }
        
        if(perlin >= 0.6 && perlin < 0.85 && mouseNear) {
          if(nearContent3) p5.line(x, y, x + scl, y + scl);
          p5.line(x, y + scl, x + scl, y);
        } else if(perlin >= 0.65 && mouseKindaNear) {
          p5.line(x, y + scl, x + scl, y);
        }
      }

      p5.draw = function() {
        if(isPaused) return;
        if(prefersReduced) { reducedMotionFrame(); return; }
        
        frameCounter++;
        updateMouseTracking();
        
        // Find nearest element (throttled)
        if(frameCounter % 3 === 0) {
          nearestElement = findNearestElement(mx1, my1);
        }
        
        // Clear background
        p5.fill(bg);
        p5.rect(0, 0, p5.width, p5.height);
        
        let breath = calculateBreathing();
        
        // Render grid
        let yoff = 0;
        for(let y = 0; y < p5.height; y += scl) {
          let xoff = 0;
          for(let x = 0; x < p5.width; x += scl) {
            drawGridCell(x, y, xoff, yoff, breath);
            xoff += inc;
          }
          yoff += inc;
        }
        
        // Update animation
        zoff += breath + 0.0000002 * mouseSpeed;
      }

      // Public API
      window.BackgroundFX = {
        set(opts = {}) {
          if(typeof opts.scale === 'number' && opts.scale > 5) { scl = opts.scale; }
          if(typeof opts.speed === 'number') { inc = opts.speed; }
          if(typeof opts.lagFast === 'number') { lagFast = opts.lagFast; }
          if(typeof opts.lagSlow === 'number') { lagSlow = opts.lagSlow; }
          if(typeof opts.pause === 'boolean') { 
            isPaused = opts.pause; 
            if(!isPaused) { p5.loop(); }
          }
        },
        pause() { isPaused = true; },
        resume() { if(!prefersReduced) { isPaused = false; p5.loop(); } },
        toggle() { isPaused ? this.resume() : this.pause(); },
        info() { return { scale: scl, speed: inc, lagFast, lagSlow, paused: isPaused }; }
      };

      // Keyboard control (Shift+P to pause)
      window.addEventListener('keydown', (e) => {
        if(e.key.toLowerCase() === 'p' && e.shiftKey) {
          window.BackgroundFX.toggle();
        }
      });

      // Add control button
      const ctrlBtn = document.createElement('button');
      ctrlBtn.textContent = 'FX';
      ctrlBtn.setAttribute('aria-label', 'Toggle background animation');
      ctrlBtn.style.cssText = 'position:fixed;bottom:10px;right:10px;z-index:50;background:rgba(0,0,0,0.55);color:#fff;border:1px solid #333;font:600 10px "IBM Plex Mono";letter-spacing:1px;padding:4px 6px;border-radius:4px;cursor:pointer;backdrop-filter:blur(4px);';
      ctrlBtn.addEventListener('click', () => window.BackgroundFX.toggle());
      document.body.appendChild(ctrlBtn);
    };

    // Clean up any existing canvas
    const existing = document.getElementById('defaultCanvas0');
    if(existing) existing.remove();
    
    // Create new p5 instance
    window.__portfolioBgSketch = new window.p5(sketch);
  });
})();