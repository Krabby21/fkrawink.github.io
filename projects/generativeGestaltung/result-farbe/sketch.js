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
const drawingParams = {
  circles: 24,
  radius: 100,
  radiusMin: 100,
  radiusMax: 300,
  radiusStep: 10,
  alphaBackground: 50,
  alphaBackgroundMax: 100,
  alphaBackgroundMin: 0,
  Hue: 180,
  HueMax: 360,
  HueMin: 1
};

// Params for logging
const loggingParams = {
  targetDrawingParams: document.getElementById('drawingParams'),
  targetCanvasParams: document.getElementById('canvasParams'),
  state: false
};





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
    this.color = color;
    this.ballOpacity = drawingParams.ballOpacity
  }

  draw()
  {
    strokeWeight(drawingParams.ballStrokeWeight)
    fill(this.color, 100, 100, this.ballOpacity)
    ellipse(this.x,this.y, this.ellipseSize);
    this.x = this.x + this.speed*this.directionX;
    this.y =this.y + this.speed*this.directionY;
  }
}



/* ###########################################################################
Custom Functions
############################################################################ */





/* ###########################################################################
P5 Functions
############################################################################ */

function setup() {

  colorMode(HSB, 360, 100, 100, 100);
  let canvas;
  if (canvasParams.mode === 'SVG') {
    canvas = createCanvas(canvasParams.w, canvasParams.h, SVG);
  } else { 
    canvas = createCanvas(canvasParams.w, canvasParams.h);
    canvas.parent("canvas");
  }

  // Display & Render Options
  frameRate(25);
  // angleMode(DEGREES);
  smooth();

  // GUI Management
  if (canvasParams.gui) { 
    const sketchGUI = createGui('Params');
    sketchGUI.addObject(drawingParams);
    //noLoop();
  }

  // Anything else
  fill(200);
  stroke(0);
}



function draw() 
{

  /* ----------------------------------------------------------------------- */
  // Log globals
  if (!canvasParams.mouseLock) {
    canvasParams.mouseX = mouseX;
    canvasParams.mouseY = mouseY;
    logInfo();
  }

  /* ----------------------------------------------------------------------- */
  // Provide your Code below
  background(0, 0, 0, drawingParams.alphaBackground);
  fill(drawingParams.Hue, 100, 100, 100);

  drawCircleOfDots(drawingParams.circles,mouseX/2,width/2,height/2)
}

const drawCircleOfDots = (dots,cR,cX,cY) => 
{
  const circles = dots;
  const radius = cR;
  const steps = (PI*2) / circles;

  for(let angle = 0; angle < PI*2; angle+=steps)
  {
    const x = cos(angle) * radius;
    const y = sin(angle) * radius;

    const startingPointX = x+cX;
    const startingPointY = y+cY;

    ellipse(startingPointX, startingPointY, 10)
  }
}

function keyPressed() {

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



function mouseReleased() {}



function mouseDragged() {}



function keyReleased() {
  if (keyCode == DELETE || keyCode == BACKSPACE) clear();
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