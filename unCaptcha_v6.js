let video;  // webcam input
let model;  // BlazeFace machine-learning model
let face;   // detected face
let pic;

let firstFace = true;

function preload(){
 pic = loadImage("data/SmileyouareonCCTVredteswithalpha.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  video = createCapture(VIDEO);
  video.hide();

  loadFaceModel();
}

async function loadFaceModel() {
  model = await blazeface.load();
}


function draw() {
  if (video.loadedmetadata && model !== undefined) {
    getFace();
  }

  if (face !== undefined) {
    push();
    translate(width,0); //invert image left to right
scale(-1,1);
    image(video, 0,0, width,height);
    pop();

    if (firstFace) {
      console.log(face);
      firstFace = false;
    }

    let rightEye = face.landmarks[0];
    let leftEye =  face.landmarks[1];
    let nose =     face.landmarks[2];
    let rightEar = face.landmarks[4];
    let leftEar =  face.landmarks[5];

    rightEye = scalePoint(rightEye);
    leftEye =  scalePoint(leftEye);
    nose =     scalePoint(nose);

    // eye tracker boxes
    push();
    translate(width,0); //invert image left to right
scale(-1,1);
    noFill();
   stroke(250,0,0);
    rect(leftEye.x-60,  leftEye.y-40,  80,80);
    rect(rightEye.x-40, rightEye.y-40, 80,80);
    noFill(0);
    pop();
    
    // eye tracker text
    push();
    translate(width,0);
    scale(-1,1);
    textSize(12);
    fill(250,0,0);
    text("face recognition: matched",leftEye.x+50,  leftEye.y-20);
    text("user#: 2761736A",leftEye.x+50,  leftEye.y);
    text("location: 37.8136° s, 144.9631° e",leftEye.x+50,  leftEye.y+20);
    text("data found: traffic infringement: speed violation",leftEye.x+50,  leftEye.y+40);
pop();  


// text placeholder demo "cctv"
push();imageMode(CENTER);
image(pic, windowWidth*.25,windowHeight*.25);
pop();
}
}

// convert positions in the video to the canvas' dimensions
function scalePoint(pt) {
  let x = map(pt[0], 0,video.width, 0,width);
  let y = map(pt[1], 0,video.height, 0,height);
  return createVector(x, y);
}

async function getFace() {
  
  const predictions = await model.estimateFaces(
    document.querySelector('video'),
    false
  );

  if (predictions.length === 0) {
    face = undefined;
  }

  else {
    face = predictions[0];
  }
}
