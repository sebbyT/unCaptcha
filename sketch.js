let video;
let poseNet;
let noseX = 0;
let noseY = 0;
let eyelX = 0;
let eyelY = 0;

let eyerX = 0;
let eyerY = 0;
 
function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.hide();
  poseNet = ml5.poseNet(video, modelReady);
  poseNet.on('pose', gotPoses);
}

function gotPoses(poses) {
  // console.log(poses);
  if (poses.length > 0) {
    let nX = poses[0].pose.keypoints[0].position.x;
    let nY = poses[0].pose.keypoints[0].position.y;
    let lX = poses[0].pose.keypoints[1].position.x;
    let lY = poses[0].pose.keypoints[1].position.y;
    let rX = poses[0].pose.keypoints[2].position.x;
    let rY = poses[0].pose.keypoints[2].position.y;
    noseX = lerp(noseX, nX, 0.5);
    noseY = lerp(noseY, nY, 0.5);
    eyelX = lerp(eyelX, lX, 0.5);
    eyelY = lerp(eyelY, lY, 0.5);
    eyerX = lerp(eyerX, rX, 0.5);
    eyerY = lerp(eyerY, rY, 0.5);
  }
}

function modelReady() {
  console.log('model ready');
}

function draw() {
  image(video, 0, 0, windowWidth,windowHeight);
  
  let d = dist(noseX, noseY, eyelX, eyelY);

  
  rect(eyelX-70, eyelY, 50,50);
  rect(eyerX-60, eyerY, 50,50);
  rect(noseX-55, noseY+10, 30,30);
  noFill();
  stroke(159,0,0);


}
