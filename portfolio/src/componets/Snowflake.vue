<template>
  <div class="hello">
  </div>
</template>

<script>
export default {
  name: 'Home',
  props: {
    msg: String
  },
  mounted() {   
    const script = function (p5) {    


      function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
} 


      function findNearestElement(x, y) {
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
                    let distance = p5.dist(x, y, point.x, point.y);
                    if (distance < nearestDistance) {
                      nearestDistance = distance;
                      nearestPointInfo = { element, distance, point };
                      nearestElement = element;
                    }
                  });
                });
                
          return {nearestElement, 
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



        function drawConvexCurveTo( x, y, targetY,t) {
          t = p5.map(t, 0, p5.height, 0, 1)
          let closestT = 0;
          let minDist = Number.MAX_VALUE;
                // p5.noFill();
                // p5.fill(255, 0, 0, 100)
                // p5.stroke(255, 0, 0);
                // p5.strokeWeight(2);

          // Define start and end points of the Bezier curve
          let startX = 0;
          let startY = 0;
          let endX = 0;
          let endY = p5.height;

          // Define two control points for the Bezier curve
          let ctrl1X = x;
          let ctrl1Y = y;
          let ctrl2X = x
          let ctrl2Y = y;

          // Draw the Bezier curve using bezierPoint
          // p5.beginShape();
          // for (let t = 0; t <= 1; t += 0.01) {
            let ptX = p5.bezierPoint(startX, ctrl1X, ctrl2X, endX, t);
            let ptY = p5.bezierPoint(startY, ctrl1Y, ctrl2Y, endY, t);
            // p5.vertex(ptX, ptY);

            let distance = Math.abs(ptY - targetY);
            if (distance < minDist) {
                minDist = distance;
                closestT = ptY;
            }
                  // for (var xx = 0; xx < ptX; xx += scl){
                  //   p5.rect(xx,ptY, 10, 10)
                  // }
          // }
          // console.log(closestT)
          
          // p5.endShape();
                  // console.log(ptY)
        
        }

        
          var zoff = 10;
          var inc = 0.02;
          var rows;
          var cols;
          var scl = 15;
          var bg = '#000000';
          var mx = p5.mouseX;
          var my1 = p5.mouseY;
          var mx1 = p5.mouseX;
          var my = p5.mouseY;
          var lag = 75;
          var lagMouse = 10;
          let mouse_speed = 0;
          p5.setup = function () {
            p5.noiseSeed(1);
            p5.createCanvas(p5.windowWidth, p5.windowHeight);
            p5.background (bg);
            // p5.frameRate(14);

            cols = p5.floor(p5.width/scl);
            rows = p5.floor(p5.height/scl);
          }
          p5.windowResized = function () {
            p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
          }
          p5.draw = function () {
            // mx = p5.mouseX;
            // my = p5.mouseY;
            mouse_speed = p5.dist(p5.mouseX, p5.mouseY, mx1, my1);
            


            p5.fill(bg);
            p5.rect(0, 0, p5.width, p5.height);
            var yoff = 0;

            mx1 += (p5.mouseX-mx1)/lagMouse
            my1 += (p5.mouseY-my1)/lagMouse
                    
            mx += (p5.mouseX-mx)/lag
            my += (p5.mouseY-my)/lag
                    
            let nearestElement = findNearestElement(mx1, my1);
            

            // console.log(nearestElement.distance)
            // p5.fill(255, 0, 0);
            // p5.stroke(255, 0, 0);
            // p5.circle(nearestElement.x1, nearestElement.y, 100);
            // p5.ellipse(nearestElement.x, nearestElement.y, 10, 10);

            
            let ttt = p5.frameCount * 0.1
            let breath = Math.sin(2*ttt +1.2*Math.sin(2*ttt) )

            let distance_from_mouse_nearest = nearestElement.distance
            let tt = 1- p5.min(1, p5.map(distance_from_mouse_nearest, 0, 36, 0, 1))
            breath = breath*0.0001 * tt
            
            // console.log(distance_from_mouse_nearest)
              for (var y = 0; y < p5.height; y += scl){
                  var xoff = 0;
                  for (var x = 0; x < p5.width; x += scl){


                    let distance_from_mouse_pos = p5.dist(mx, my, x, y);
                    let distance_from_content = p5.dist(p5.width*.3, p5.height*.2, x, y);
                    let distance_from_content2 = p5.dist(p5.width*.4, p5.height*.6, x, y);

                    // console.log(distance_from_mouse_pos)
                    let noisy_threshold =  p5.noise(xoff, yoff, p5.frameCount*.0005); 
                    var perlin = p5.noise(xoff, yoff, zoff) + 0.1*noisy_threshold;
                    // p5.noFill();
                    let color_intensity = p5.map(distance_from_mouse_pos * perlin, 0, 1500, 0, 255)
                    // color intensity in steps of 10
                    color_intensity = p5.round(color_intensity/20)*20
                    p5.stroke(120, 100, 200, color_intensity);

                    let near_content3 = (distance_from_content2 > 900*noisy_threshold) 
                    let near_content2 = (distance_from_content2 > 800*noisy_threshold) 
                    let near_content = (distance_from_content > 700*noisy_threshold) && near_content2
                    let mouse_near = (distance_from_mouse_pos > 700*noisy_threshold) && near_content
                    let mouse_kinda_near = (distance_from_mouse_pos > 500*noisy_threshold) && near_content
                    let mouse_kinda_near2 = (distance_from_mouse_pos > 500*noisy_threshold) && near_content
                    
                    let nnn = (distance_from_mouse_nearest < 1000*noisy_threshold)
                    // if (perlin < 0.5  && ) {
                    //   p5.line(x, y, x+scl, y+scl);
                    // } 

                    if(perlin > 0.5 && nnn){
                      let ff = p5.map(distance_from_mouse_nearest, 0, 200, 80, 0)
                      // ff = p5.round(ff/20)*20
                      // console.log(ff)

                      p5.stroke(255, 0, 0, ff);
                      // p5.rect (x, y, scl, scl);
                      p5.line(x, y, x+scl, y+scl);
                    }
                    
                    p5.stroke(120, 100, 200, color_intensity);
                    
                    if (perlin > 0.5 && perlin < 0.55 && mouse_near) {
                      p5.line(x, y, x+scl, y+scl);
                    }else if (perlin >= 0.55 && perlin < 0.6 && mouse_kinda_near) {
                      // p5.fill(100, 100, 100, color_intensity);
                      p5.line(x, y+scl, x+scl, y);
                      // p5.rect (x, y, scl, scl);
                    } 
                    // color_intensity = p5.map(distance_from_mouse_pos, 0, 2000, 15, 255);
                    // color_intensity = p5.round(color_intensity/50)*50
                    // p5.stroke(0, 0, 0, color_intensity);
                    
                    if (perlin >= 0.6 && perlin < 0.85 && mouse_near) {
                       
                      if (near_content3) {
                        p5.line(x, y, x+scl, y+scl);
                      }

                      p5.line(x, y+scl, x+scl, y);
                    // } else if (perlin >= 0.65 && mouse_kinda_near2) {
                    } else if (perlin >= 0.65 && mouse_kinda_near2) {
                      p5.line(x, y+scl, x+scl, y);
                    }

                    xoff += inc;
                  }

                  yoff += inc;
                  // console.log(p5.map(distance_from_mouse_nearest))
                  // console.log(p5.map(distance_from_mouse_nearest, 0, 100, 0, 1))
                   
                  
                  zoff += breath + 0.0000002*mouse_speed;
                  // zoff += 0.00001 + 0.0000002*mouse_speed + breath*0.00001;

                  // console.log(mouse_speed)
              }



            }










              //   var speed = 2;    
              //   var posX = 0;
                
              //   // NOTE: Set up is here   
              //   p5.setup = _ => {      
              //   p5.createCanvas(500, 500);      
              //   p5.ellipse(p5.width / 2, p5.height / 2, 500, 500);    
              //   }     
              //   // NOTE: Draw is here
              //   p5.draw = _ => {      
              //   p5.background(0);
              //   const degree = p5.frameCount * 3;      
              //   const y = p5.sin(p5.radians(degree)) * 50;
                  
              //   p5.push();
              //     p5.translate(0, p5.height / 2);
              //     p5.ellipse(posX, y, 50, 50);
              //   p5.pop();
              //   posX += speed;
                    
              //   if (posX > p5.width || posX < 0) {    
              //     speed *= -1;      
              //   }
              //   }  
              // }   
              // NOTE: Use p5 as an instance mode
            }
            document.getElementById('defaultCanvas0')?.remove();
            const P5 = require('p5');
            new P5(script)
    }
}
</script>

<style>
#defaultCanvas0{
  position:fixed;
  top:0;
  z-index: -10;
  
}
</style>
