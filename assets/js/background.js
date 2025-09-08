/**
 * Interactive Background - Exact Reference Implementation
 * Based on the original Snowflake.vue component
 */

// Wait for p5.js to load
function waitForP5() {
  if (typeof p5 !== 'undefined') {
    initializeBackground();
  } else {
    setTimeout(waitForP5, 50);
  }
}

// Clamp utility function
function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

// Find nearest element - exact reference implementation
function findNearestElement(p, x, y) {
  let elements = document.querySelectorAll('a');
  let nearestPointInfo = null;
  let nearestElement = null;
  let nearestDistance = Infinity;

  elements.forEach(element => {
    let rect = element.getBoundingClientRect();
    
    // Points on the top and bottom edges
    let horizontalPoints = [rect.left, rect.right].map(px => ({
      x: px, y: clamp(y, rect.top, rect.bottom)
    }));

    // Points on the left and right edges
    let verticalPoints = [rect.top, rect.bottom].map(py => ({
      x: clamp(x, rect.left, rect.right), y: py
    }));

    // Combine all points
    let points = [...horizontalPoints, ...verticalPoints];
    points.forEach(point => {
      let distance = p.dist(x, y, point.x, point.y);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestPointInfo = { element, distance, point };
        nearestElement = element;
      }
    });
  });
  
  if (!nearestElement) {
    return { distance: Infinity, x: 0, y: 0 };
  }
  
  return {
    nearestElement, 
    x: nearestPointInfo.point.x,
    y: nearestPointInfo.point.y,
    distance: nearestDistance,
    width: nearestElement.getBoundingClientRect().width,
    height: nearestElement.getBoundingClientRect().height,
    x1: nearestElement.getBoundingClientRect().left,
    y1: nearestElement.getBoundingClientRect().top,
    x2: nearestElement.getBoundingClientRect().left + nearestElement.getBoundingClientRect().width,
    y2: nearestElement.getBoundingClientRect().top + nearestElement.getBoundingClientRect().height,
  };
}

function initializeBackground() {
  const script = function(p) {
    let zoff = 10;
    let inc = 0.02;
    let scl = 15;
    let bg = '#000000';
    let lightBg = '#fdfdfd';
    let mx = p.mouseX;
    let my1 = p.mouseY;
    let mx1 = p.mouseX;
    let my = p.mouseY;
    let lag = 75;
    let lagMouse = 10;
    let mouse_speed = 0;
    let isLightMode = false;
    
    // Theme detection function
    function updateTheme() {
      isLightMode = document.documentElement.classList.contains('light');
      bg = isLightMode ? lightBg : '#000000';
    }
    
    p.setup = function () {
      p.noiseSeed(1);
      p.createCanvas(p.windowWidth, p.windowHeight);
      updateTheme();
      p.background(bg);
      
      // Listen for theme changes
      document.addEventListener('themechange', updateTheme);
    }
    
    p.windowResized = function () {
      p.resizeCanvas(p.windowWidth, p.windowHeight);
    }
    
    p.draw = function () {
      mouse_speed = p.dist(p.mouseX, p.mouseY, mx1, my1);

      updateTheme(); // Update theme on each frame
      p.fill(bg);
      p.rect(0, 0, p.width, p.height);
      let yoff = 0;

      mx1 += (p.mouseX-mx1)/lagMouse
      my1 += (p.mouseY-my1)/lagMouse
              
      mx += (p.mouseX-mx)/lag
      my += (p.mouseY-my)/lag
              
      let nearestElement = findNearestElement(p, mx1, my1);

      let ttt = p.frameCount * 0.1
      let breath = Math.sin(2*ttt +1.2*Math.sin(2*ttt) )

      let distance_from_mouse_nearest = nearestElement.distance
      let tt = 1- p.min(1, p.map(distance_from_mouse_nearest, 0, 36, 0, 1))
      breath = breath*0.0001 * tt
      
      for (let y = 0; y < p.height; y += scl){
        let xoff = 0;
        for (let x = 0; x < p.width; x += scl){

          let distance_from_mouse_pos = p.dist(mx, my, x, y);
          let distance_from_content = p.dist(p.width*.3, p.height*.2, x, y);
          let distance_from_content2 = p.dist(p.width*.4, p.height*.6, x, y);

          let noisy_threshold =  p.noise(xoff, yoff, p.frameCount*.0005); 
          let perlin = p.noise(xoff, yoff, zoff) + 0.1*noisy_threshold;
          
          let color_intensity = p.map(distance_from_mouse_pos * perlin, 0, 1500, 0, 255)
          color_intensity = p.round(color_intensity/20)*20
          
          // Adjust colors based on theme
          if (isLightMode) {
            p.stroke(50, 80, 150, color_intensity * 0.6); // Darker blue, more subtle
          } else {
            p.stroke(120, 100, 200, color_intensity);
          }

          let near_content3 = (distance_from_content2 > 900*noisy_threshold) 
          let near_content2 = (distance_from_content2 > 800*noisy_threshold) 
          let near_content = (distance_from_content > 700*noisy_threshold) && near_content2
          let mouse_near = (distance_from_mouse_pos > 700*noisy_threshold) && near_content
          let mouse_kinda_near = (distance_from_mouse_pos > 500*noisy_threshold) && near_content
          let mouse_kinda_near2 = (distance_from_mouse_pos > 500*noisy_threshold) && near_content
          
          let nnn = (distance_from_mouse_nearest < 1000*noisy_threshold)

          if(perlin > 0.5 && nnn){
            let ff = p.map(distance_from_mouse_nearest, 0, 200, 80, 0)
            if (isLightMode) {
              p.stroke(220, 50, 50, ff * 0.8); // Softer red for light mode
            } else {
              p.stroke(255, 0, 0, ff);
            }
            p.line(x, y, x+scl, y+scl);
          }
          
          // Reset to base color
          if (isLightMode) {
            p.stroke(50, 80, 150, color_intensity * 0.6);
          } else {
            p.stroke(120, 100, 200, color_intensity);
          }
          
          if (perlin > 0.5 && perlin < 0.55 && mouse_near) {
            p.line(x, y, x+scl, y+scl);
          }else if (perlin >= 0.55 && perlin < 0.6 && mouse_kinda_near) {
            p.line(x, y+scl, x+scl, y);
          } 
          
          if (perlin >= 0.6 && perlin < 0.85 && mouse_near) {
            if (near_content3) {
              p.line(x, y, x+scl, y+scl);
            }
            p.line(x, y+scl, x+scl, y);
          } else if (perlin >= 0.65 && mouse_kinda_near2) {
            p.line(x, y+scl, x+scl, y);
          }

          xoff += inc;
        }

        yoff += inc;
        zoff += breath + 0.0000002*mouse_speed;
      }
    }

    // Global API
    window.BackgroundFX = {
      pause: function() { p.noLoop(); },
      resume: function() { p.loop(); },
      getMouseState: function() { return { mx, my, mx1, my1, mouse_speed }; }
    };
  }

  // Remove existing canvas
  const existingCanvas = document.getElementById('defaultCanvas0');
  if (existingCanvas) {
    existingCanvas.remove();
  }
  
  // Create new p5 instance
  // eslint-disable-next-line new-cap, no-new
  const bgSketch = new p5(script);
  
  // Store reference for potential cleanup
  window.backgroundSketch = bgSketch;
}

// Initialize when ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', waitForP5);
} else {
  waitForP5();
}