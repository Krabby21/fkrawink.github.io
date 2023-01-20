/*jshint esversion: 6 */

/* ############################################################################ 

Kurs «Generative Gestaltung» an der TH Köln
Christian Noss
christian.noss@th-koeln.de
https://twitter.com/cnoss
https://cnoss.github.io/generative-gestaltung/

############################################################################ */

const saveParams = {
  sketchName: "gg-sketch"
}

// Params for canvas
const canvasParams = {
  holder: document.getElementById('canvas'),
  state: false,
  mouseX: false,
  mouseY: false,
  mouseLock: false,
  background: 0,
  gui: true,
  mode: 'canvas', // canvas or svg … SVG mode is experimental 
};
getCanvasHolderSize();

// Params for the drawing
const drawingParams = 
{
  HUE: 215,
  HUEmin: 25,
  HUEmax: 325,
  ballStrokeWeight: 0,
  ballStrokeWeightMax: 10,
  balllStrokeWeightStep: 0.1,
  ballOpacity: 100,
  ballOpacityMax: 100,
  ballOpacityMin: 10,
  ballSpeed: 4,
  ballSpeedMax: 20,
  ballSpeedMin: 1,
  trails: 50,
  trailsMax: 100,
  trailsMin: 1,
  hunterSize : 50,
  hunterSizeMax: 100,
  hunterSizeMin: 20,
  hunterStrokeWeight: 1,
  hunterStrokeWeightMax: 10,
  hunterStrokeWeightStep: 0.1,
  hunterSpeed: 4,
  hunterSpeedMax: 20,
  hunterSpeedMin: 1,
  hunterBrightness: 0,
  hunterBrightnessMax: 100,
  hunterBrightnessMin:0,
  placeDot: true,
  placeHunter: false,

};

// Params for logging
const loggingParams = {
  targetDrawingParams: document.getElementById('drawingParams'),
  targetCanvasParams: document.getElementById('canvasParams'),
  state: false
};

let dots = [];

/* ###########################################################################
Classes
############################################################################ */

class Ball
{
  constructor(x,y,ellipseSize,color)
  {
    this.x = x;
    this.y = y;
    this.directionX = random(-5,5);
    this.directionY = random(-5,5);
    this.speed = drawingParams.ballSpeed;
    this.ellipseSize = ellipseSize;
    this.age = 0
    this.color = color;
    this.ballOpacity = drawingParams.ballOpacity
  }

  draw()
  {
    stroke(255)
    strokeWeight(drawingParams.ballStrokeWeight)
    fill(this.color, 100, 100, this.ballOpacity)
    ellipse(this.x,this.y, this.ellipseSize);
    this.x = this.x + this.speed*this.directionX;
    this.y =this.y + this.speed*this.directionY;

    if(this.x + this.ellipseSize/2 > width){
      this.directionX = -1
    }
    if (this.x - this.ellipseSize/2 < 0)
    {
      this.directionX = 1
    }
    if(this.y + this.ellipseSize/2 > height){
      this.directionY = -1;
    }
    if(this.y - this.ellipseSize/2 < 0)
    {
      this.directionY = 1;
    }
  }

  isColliding(dot)
  {
      if(dot !== this)
      {
        const distance = dist(this.x, this.y, dot.x ,dot.y)
        if(distance < dot.ellipseSize/2 + this.ellipseSize/2)
        {
          this.ellipseSize++;
          this.ellipseSize = this.ellipseSize > 50 ? 50 : this.ellipseSize
        }
        if(this.ellipseSize >= 50 && this.age > 150)
        {
          this.ellipseSize = 4;
          dots.push(new Ball(this.x +10, this.y +10, 4, this.color));
          
          this.age = 0;
        }
      }
  }
}

class Hunter
{
  constructor(xPos, yPos)
  {
    this.xPos = xPos;
    this.yPos = yPos;
    this.hunterDirectionX = random(-1, 1);
    this.hunterDirectionY = random(-1, 1);
    this.speed = drawingParams.hunterSpeed;
  }

  draw()
  {
    stroke(255)
    strokeWeight(drawingParams.hunterStrokeWeight)
    fill(0, 100, drawingParams.hunterBrightness, 100)
    ellipse(this.xPos,this.yPos, drawingParams.hunterSize);
    this.xPos = this.xPos + this.speed*this.hunterDirectionX;
    this.yPos =this.yPos + this.speed*this.hunterDirectionY;
    
    if(this.xPos + drawingParams.hunterSize/2 > width){
      this.hunterDirectionX = -1
    }
    if (this.xPos - drawingParams.hunterSize/2 < 0)
    {
      this.hunterDirectionX = 1
    }
    if(this.yPos + drawingParams.hunterSize/2 > height){
      this.hunterDirectionY = -1;
    }
    if(this.yPos - drawingParams.hunterSize/2 < 0)
    {
      this.hunterDirectionY = 1;
    }
  }

  isColliding(dot)
  {
    const hunterBallDistance = dist(this.xPos,this.yPos, dot.x , dot.y)
    return hunterBallDistance <= 30 + dot.ellipseSize / 2
  }
}


/* ###########################################################################
Custom Functions
############################################################################ */





/* ###########################################################################
P5 Functions
############################################################################ */
let sketchGUI;
function setup() 
{
  colorMode(HSB, 360, 100 ,100 ,100)
  hunterAlreadyActive = false;

  let canvas;
  if (canvasParams.mode === 'SVG') {
    canvas = createCanvas(canvasParams.w, canvasParams.h, SVG);
  } else { 
    canvas = createCanvas(canvasParams.w, canvasParams.h);
    canvas.parent("canvas");
  }

  // Display & Render Options
  frameRate(25);
  angleMode(DEGREES);
  smooth();

  // GUI Management
  if (canvasParams.gui) { 
    sketchGUI = createGui('Params');
    sketchGUI.addObject(drawingParams);
    //noLoop();
  }

  // Anything else
  fill(200);
  stroke(0);
}



function draw() {

  /* ----------------------------------------------------------------------- */
  // Log globals
  if (!canvasParams.mouseLock) {
    canvasParams.mouseX = mouseX;
    canvasParams.mouseY = mouseY;
    logInfo();
  }

  /* ----------------------------------------------------------------------- */
  // Provide your Code below
  background(0, 100 ,0, drawingParams.trails);
  let eaten = []
  for (let i = 0; i < dots.length; i++)
  {
    dots[i].draw();
    for (let j = 0; j < dots.length; j++)
    {
      const hunterColliding = dots[i].isColliding(dots[j]);
      if(hunterColliding)
      {
        eaten.push(j)
      }
    }
    dots[i].age++
  }
  dots = dots.filter((_,i) => !eaten.includes(i))
  canvasParams.gui = false;
}

function keyPressed() {

  if(keyCode === 72){
    sketchGUI.toggleVisibility()
  }
  if (keyCode === 81) { // Q-Key
  }

  if (keyCode === 87) { // W-Key
  }

  if (keyCode === 89) { // Y-Key
  }

  if (keyCode === 88) { // X-Key
  }

  if (keyCode === 83) { // S-Key
    const suffix = (canvasParams.mode === "canvas") ? '.jpg' : '.svg';
    const fragments = location.href.split(/\//).reverse();
    const suggestion = fragments[1] ? fragments[1] : 'gg-sketch';
    const fn = prompt(`Filename for ${suffix}`, suggestion);
    if (fn !== null) save(fn + suffix);
  }

  if (keyCode === 49) { // 1-Key
  }

  if (keyCode === 50) { // 2-Key
  }

  if (keyCode === 76) { // L-Key
    if (!canvasParams.mouseLock) {
      canvasParams.mouseLock = true;
    } else { 
      canvasParams.mouseLock = false;
    }
    document.getElementById("canvas").classList.toggle("mouseLockActive");
  }


}



function mousePressed() {}



function mouseReleased() 
{
  if(drawingParams.placeDot == true)
  {
    dots.push(new Ball(mouseX, mouseY, 20, drawingParams.HUE));
  }
  if(drawingParams.placeHunter == true)
  {
    dots.push(new Hunter (mouseX, mouseY))
  }
  
}


function mouseDragged() {}



function keyReleased() 
{
  if (keyCode== DELETE || keyCode == BACKSPACE) clear();

  
}





/* ###########################################################################
Service Functions
############################################################################ */



function getCanvasHolderSize() {
  canvasParams.w = canvasParams.holder.clientWidth;
  canvasParams.h = canvasParams.holder.clientHeight;
}



function resizeMyCanvas() {
  getCanvasHolderSize();
  resizeCanvas(canvasParams.w, canvasParams.h);
}



function windowResized() {
  resizeMyCanvas();
}



function logInfo(content) {

  if (loggingParams.targetDrawingParams) {
    loggingParams.targetDrawingParams.innerHTML = helperPrettifyLogs(drawingParams);
  }

  if (loggingParams.targetCanvasParams) {
    loggingParams.targetCanvasParams.innerHTML = helperPrettifyLogs(canvasParams);
  }

}