
import * as draw from './lib/draw'
import Dataset from './lib/dataset'
import Recognizer from './lib/recognizer'
import * as utils from './lib/utils'

let letsDraw = false;
let currentGesture = [];
let gestureID = 1;
let trainingMode = true;

const $drawing = document.querySelector('#drawCan');

let dataset = new Dataset();
let myRecognizer = new Recognizer();
if (typeof window.orientation !== 'undefined') {

  // start when mouse is down
  $drawing.addEventListener('touchstart', function(e) {
      e.preventDefault();
     	console.log("touchstart");
      mouseDown(e);
  });
  // start when mouse is down
  $drawing.addEventListener('touchmove', function(e) {
      e.preventDefault();
     	console.log("touchmove");
      mouseMove(e);
  });
  // start when mouse is down
  $drawing.addEventListener('touchend', function(e) {
      e.preventDefault();
     	console.log("touchend");
      mouseUp(e);
  });

} else {
  // start when mouse is down
  $drawing.addEventListener('mousedown', function(e) {
     	console.log("mousedown");
      mouseDown(e);
  });

  // start when mouse is down
  $drawing.addEventListener('mousemove', function(e) {
     	console.log("mousemove");
      mouseMove(e);
  });

  // stop when mouse is up
  $drawing.addEventListener('mouseup', function(e) {
     	console.log("mouseup");
      mouseUp(e);
  });

}

const mouseDown = function(e) {
   	draw.drawGesture($drawing, 'down', e);
   	const coordinates = draw.getMouseXYinCanvas($drawing, e);
   	currentGesture.push(coordinates);
    console.log(coordinates);
   	letsDraw = true;
};

const mouseMove = function(e) {
	if (letsDraw){
	   	draw.drawGesture($drawing, 'move', e);
	   	const coordinates = draw.getMouseXYinCanvas($drawing, e);
	   	currentGesture.push(coordinates);
   		//console.log(coordinates);
	   }
};

const mouseUp = function(e) {
   	letsDraw = false;

    currentGesture = utils.scale(currentGesture);
    currentGesture = utils.translateToOrigin(currentGesture);
    // scale

    if(trainingMode){
			dataset.addGestureWithLabel(currentGesture, gestureID);
   		dataset.plotDatasetInHML();
			gestureID++;
		} else{
			const predictedLabel = myRecognizer.predict(currentGesture);
			console.log(predictedLabel);
		}

	   	currentGesture = [];
};

const $trainingButton = document.querySelector('#trainingButton');
$trainingButton.addEventListener('click', function(e) {
	trainingMode = true;
});

const $testingButton = document.querySelector('#testingButton');
$testingButton.addEventListener('click', function(e) {
	myRecognizer.fit(dataset);
	trainingMode = false;

});
