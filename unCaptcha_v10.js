/*
Portions of code relating to face tracking engine written from the
following tutorial and adapted to suit the needs of this sampler.
credit: Jeffrey Thompson, jeffreythompson.org, 2021. 'Face Tracker: Simple'

My code has been labelled accordingly to ensure that credit is given to Jeff Thompson for this tutorial!
*/

let video;  // webcam input
let model;  // BlazeFace face tracker
let face;   // detected face
let uncaptchaSmile // seb's font

let firstFace = true; // find first face

function preload(){
  uncaptchaSmile = loadFont("data/UnCaptcha.otf");
 //pic = loadImage("data/SmileyouareonCCTVredteswithalpha.png"); // seb's code
 //result = loadStrings('data/AttemptedRecognitionText.txt'); // seb's code
}

function setup() {
  createCanvas(windowWidth, windowHeight); // seb's code
// result = loadStrings('data/AttemptedRecognitionText.txt'); // seb's code for background text decorative element

  video = createCapture(VIDEO);
  video.hide();

  loadFaceModel(); //load BlazeFace
}

// create BlazeFace model callback for asynchronous loading
async function loadFaceModel() {
  model = await blazeface.load();
}

function draw() {
  background(355, windowWidth,windowHeight); // seb's code
  //fill(250,0,0); // seb's code for background text decorative element
  //textLeading(30); // seb's code for background text decorative element
  //text(result, 10, 10, windowWidth, windowHeight); // seb's code for background text decorative element
  
  // if video loads, track face
  if (video.loadedmetadata && model !== undefined) {
    getFace();
  }

  // display the face data
  if (face !== undefined) {
    push(); // seb's code
    imageMode(CENTER); // seb's code
    translate(width,0); // seb's code - setup for invert image left to right
scale(-1,1); // seb's code - invert image left to right
    image(video,windowWidth*.5,windowHeight*.5,windowWidth*.75,windowHeight*.85); // seb's code / draw video centred with white border
    pop(); // seb's code

   // print info from face found
    if (firstFace) {
      console.log(face);
      firstFace = false;
    }

    let rightEye = face.landmarks[0]; // create variable for right eye position tracker
    let leftEye =  face.landmarks[1]; // create variable for left eye position tracker

    rightEye = scalePoint(rightEye); // setup scalepoint to map video feed x+y location to displayed video dimensions
    leftEye =  scalePoint(leftEye);

    // seb's code (push until pop) - eye tracker boxes
    push();
    rectMode(CENTER);
    translate(width,0); //invert image left to right so tracker matches video displayed
scale(-1,1);
    noFill();
   stroke(250,0,0);
    rect(leftEye.x+225,leftEye.y+90,60,60); // create eye boxes attached to leftEye variable (position)
    rect(rightEye.x+180,rightEye.y+90,60,60); // create eye boxes attached to rightEye variable (position)
    noFill(0);
    pop();
    
    // seb's code (push until pop) - eye tracker text, attached to leftEye, as above.
    push();
    translate(width,0);
    scale(-1,1);
    textSize(12);
    fill(250,0,0);
    text("face recognition: matched",leftEye.x+225,leftEye.y+45);
    text("user#: 2761736A",leftEye.x+225,leftEye.y+60);
    text("location: 37.8136° s, 144.9631° e",leftEye.x+225,leftEye.y+75);
    text("data found: traffic infringement: speed violation",leftEye.x+225,leftEye.y+90);
pop();  

push(); // seb's code push to pop - smile u r on cctv text
  textSize(110);
  textAlign(CENTER);
  fill(255,0,0);
  textFont(uncaptchaSmile);
  text("SMILE", windowWidth/2,windowHeight*.35);
  text("YOU ARE", windowWidth/2,windowHeight*.54);
  text("ON CCTV", windowWidth/2,windowHeight*.75);
pop();
}
}

// use scalepoint to map x and y positions in the video feed to the 'drawn video' dimensions
function scalePoint(pt) {
  let x = map(pt[0], 0,video.width, 0,windowWidth*.75); // altered by seb to map to scaled video in draw section
  let y = map(pt[1], 0,video.height, 0,windowHeight*.85); // altered by seb to map to scaled video in draw section
  return createVector(x, y);
}

// get face data using async function for tensorFlow
async function getFace() {
  
  // use video feed to get 'predictions' 
  const predictions = await model.estimateFaces(
    document.querySelector('video'),
    false
  ); //'false' gives position instead of tensors

  // if no predictions set face to undefined
  if (predictions.length === 0) {
    face = undefined;
  }

  // otherwise use first face found
  else {
    face = predictions[0];
  }
}
