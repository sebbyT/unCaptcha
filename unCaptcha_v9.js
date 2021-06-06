let video;  // webcam input
let model;  // BlazeFace machine-learning model
let face;   // detected face
let pic; // seb's code
let uncaptchaSmile
//let result; // seb's code

let firstFace = true;

function preload(){
  uncaptchaSmile = loadFont("data/UnCaptcha.otf");
 //pic = loadImage("data/SmileyouareonCCTVredteswithalpha.png"); // seb's code
 //result = loadStrings('data/AttemptedRecognitionText.txt'); // seb's code
}

function setup() {
  createCanvas(windowWidth, windowHeight); // seb's code

result = loadStrings('data/AttemptedRecognitionText.txt'); // seb's code

  video = createCapture(VIDEO);
  video.hide();

  loadFaceModel();
}

async function loadFaceModel() {
  model = await blazeface.load();
}


function draw() {
  background(355, windowWidth,windowHeight); // seb's code
  //fill(250,0,0); // seb's code
  //textLeading(30); // seb's code
  //text(result, 10, 10, windowWidth, windowHeight); // seb's code
  
  if (video.loadedmetadata && model !== undefined) {
    getFace();
  }

  if (face !== undefined) {
    push(); // seb's code
    imageMode(CENTER); // seb's code
    translate(width,0); // seb's code - invert image left to right
scale(-1,1); // seb's code
    image(video,windowWidth*.5,windowHeight*.5,windowWidth*.75,windowHeight*.85); // seb's code
    pop(); // seb's code

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

    // seb's code (push until pop) - eye tracker boxes
    push();
    rectMode(CENTER);
    translate(width,0); //invert image left to right
scale(-1,1);
    noFill();
   stroke(230,0,0);
    rect(leftEye.x+80,leftEye.y+60,60,60);
    rect(rightEye.x+100,rightEye.y+60,60,60);
    noFill(0);
    pop();
    
    // seb's code (push until pop) - eye tracker text
    push();
    translate(width,0);
    scale(-1,1);
    textSize(12);
    fill(230,0,0);
    text("face recognition: matched",leftEye.x+225,leftEye.y+45);
    text("user#: 2761736A",leftEye.x+225,leftEye.y+60);
    text("location: 37.8136° s, 144.9631° e",leftEye.x+225,leftEye.y+75);
    text("data found: traffic infringement: speed violation",leftEye.x+225,leftEye.y+90);
pop();  

push(); //seb's code push to pop - smile u r on cctv text
  textSize(90);
  textAlign(CENTER);
  fill(230,0,0);
  textFont(uncaptchaSmile);
  text("SMILE", windowWidth/2,windowHeight*.35);
  text("YOU ARE", windowWidth/2,windowHeight*.54);
  text("ON CCTV", windowWidth/2,windowHeight*.75);
pop();

}
}

// convert positions in the video to the canvas' dimensions
function scalePoint(pt) {
  let x = map(pt[0], 0,video.width, 0,windowWidth*.75); // altered by seb to map to scaled video in draw section
  let y = map(pt[1], 0,video.height, 0,windowHeight*.85); // altered by seb to map to scaled video in draw section
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
