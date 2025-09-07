// Dynamic background with performance, theming & accessibility considerations
(function(){
  function waitForP5(cb){ if(window.p5){ cb(); return; } setTimeout(()=>waitForP5(cb),30); }

  waitForP5(()=>{
    const sketch = function(p5){
      function clamp(value,min,max){ return Math.max(min, Math.min(max,value)); }

      function findNearestElement(x,y){
        const elements = document.querySelectorAll('a');
        let nearest = {nearestElement:null,x,y,distance:Infinity,width:0,height:0,x1:x,y1:y,x2:x,y2:y};
        for(const el of elements){
          const r = el.getBoundingClientRect();
          const pts = [
            {x:r.left, y: clamp(y,r.top,r.bottom)},
            {x:r.right, y: clamp(y,r.top,r.bottom)},
            {x: clamp(x,r.left,r.right), y:r.top},
            {x: clamp(x,r.left,r.right), y:r.bottom}
          ];
          for(const pt of pts){
            const d = p5.dist(x,y,pt.x,pt.y);
            if(d < nearest.distance){
              nearest = {nearestElement:el,x:pt.x,y:pt.y,distance:d,width:r.width,height:r.height,x1:r.left,y1:r.top,x2:r.left+r.width,y2:r.top+r.height};
            }
          }
        }
        return nearest;
      }

      // Config
      let zoff = 10;
      const inc = 0.02; // noise increment
      const scl = 15;   // grid cell size
      const bg = '#000';
      let mx=0,my=0,mx1=0,my1=0; // mouse trail proxies
      const lag = 75;      // slow follower smoothing factor
      const lagMouse = 10; // fast follower
      let mouse_speed = 0;
      let initialized = false;
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      let accent = {r:120,g:100,b:200};

      function readAccent(){
        const val = getComputedStyle(document.documentElement).getPropertyValue('--color-accent').trim();
        if(/^#/.test(val)){
          const h = val.replace('#','');
            const full = h.length===3? h.split('').map(c=>c+c).join(''):h;
          accent = {r:parseInt(full.slice(0,2),16), g:parseInt(full.slice(2,4),16), b:parseInt(full.slice(4,6),16)};
        }
      }
      readAccent();
      document.addEventListener('themechange', readAccent);

      const HEAVY_INTERVAL = 2; // heavy draw every 2 frames
      let frameMod = 0;

      function reducedMotionFrame(){
        p5.background(bg);
        for(let y=0; y<p5.height; y+=scl){
          for(let x=0; x<p5.width; x+=scl){
            const n = p5.noise(x*inc,y*inc,5);
            if(n>0.58){
              const alpha = (n-0.58)/0.42 * 70;
              p5.stroke(accent.r,accent.g,accent.b, alpha);
              p5.line(x,y,x+scl,y+scl);
            }
          }
        }
        p5.noLoop();
      }

      p5.setup = function(){
        p5.noiseSeed(1);
        p5.createCanvas(p5.windowWidth, p5.windowHeight);
        p5.background(bg);
        mx = mx1 = p5.mouseX; my = my1 = p5.mouseY; initialized = true;
      };
      p5.windowResized = ()=> p5.resizeCanvas(p5.windowWidth, p5.windowHeight);

      p5.draw = function(){
        if(!initialized) return;
        if(prefersReduced){ reducedMotionFrame(); return; }
        frameMod = (frameMod+1)%HEAVY_INTERVAL;
        const doHeavy = frameMod===0;

        mouse_speed = p5.dist(p5.mouseX,p5.mouseY,mx1,my1);
        p5.noStroke(); p5.fill(0,0,0,40); p5.rect(0,0,p5.width,p5.height); // fade

        mx1 += (p5.mouseX - mx1)/lagMouse; my1 += (p5.mouseY - my1)/lagMouse;
        mx  += (p5.mouseX - mx)/lag;       my  += (p5.mouseY - my)/lag;

        const nearest = findNearestElement(mx1,my1);
        const t = p5.frameCount*0.1;
        let breath = Math.sin(2*t + 1.2*Math.sin(2*t));
        const distNearest = nearest.distance;
        const factor = 1 - p5.min(1, p5.map(distNearest,0,36,0,1));
        breath *= 0.0001 * factor;

        if(doHeavy){ heavyPass({mx,my,distNearest,breath,mouse_speed}); }
      };

      function heavyPass(ctx){
        const {mx,my,distNearest,breath,mouse_speed} = ctx;
        for(let y=0; y<p5.height; y+=scl){
          let xoff = 0;
          for(let x=0; x<p5.width; x+=scl){
            drawCell(x,y,xoff,distNearest,mx,my);
            xoff += inc;
          }
          zoff += breath + 0.0000002*mouse_speed;
        }
      }

      function drawCell(x,y,xoff,distNearest,mx,my){
        const dMouse = p5.dist(mx,my,x,y);
        const dContent = p5.dist(p5.width*0.3,p5.height*0.2,x,y);
        const dContent2 = p5.dist(p5.width*0.4,p5.height*0.6,x,y);
        const noiseTime = p5.frameCount*0.0005;
        const nt = p5.noise(xoff, y*inc, noiseTime);
        const perlin = p5.noise(xoff, y*inc, zoff) + 0.1*nt;
        const near3 = (dContent2 > 900*nt);
        const near2 = (dContent2 > 800*nt);
        const near  = (dContent > 700*nt) && near2;
        const mouseNear  = (dMouse > 700*nt) && near;
        const mouseKinda = (dMouse > 500*nt) && near;
        const mouseKinda2= (dMouse > 500*nt) && near;
        const highlight = (distNearest < 1000*nt) && perlin>0.5;

        let alpha = p5.map(dMouse*perlin,0,1500,0,255);
        alpha = p5.round(alpha/20)*20;
        if(highlight){
            const ff = p5.map(distNearest,0,200,90,0);
            p5.stroke(255,accent.g*0.25,accent.b*0.25,ff);
            p5.line(x,y,x+scl,y+scl); return;
        }
        p5.stroke(accent.r,accent.g,accent.b,alpha);
        if(perlin>0.5 && perlin<0.55 && mouseNear){ p5.line(x,y,x+scl,y+scl); return; }
        if(perlin>=0.55 && perlin<0.6 && mouseKinda){ p5.line(x,y+scl,x+scl,y); return; }
        if(perlin>=0.6 && perlin<0.85 && mouseNear){ if(near3) p5.line(x,y,x+scl,y+scl); p5.line(x,y+scl,x+scl,y); return; }
        if(perlin>=0.65 && mouseKinda2){ p5.line(x,y+scl,x+scl,y); }
      }
    };

    const old = document.getElementById('defaultCanvas0'); if(old) old.remove();
    window.__portfolioBgSketch = new window.p5(sketch);
  });
})();
