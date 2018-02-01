import * as draw from './lib/draw'
import Dataset from './lib/dataset'
import Recognizer from './lib/recognizer'
import * as utils from './lib/utils'

let letsDraw = false;
let currentGesture = [];
let gestureID = 1;
let trainingMode = true;

const $drawing = document.querySelector('#drawCan');
const $copyDialog = document.querySelector('#copyDialog');
const $boxHeader = document.querySelector('#boxHeader');
const $copyModal = document.querySelector('#copyModal');
const $copyModalText = document.querySelector('#copyModalText');
const $leftSideBar = document.querySelector('#leftSideBar');
const $rightSideBar = document.querySelector('#rightSideBar');
const $input1 = document.querySelector('#inputAgree');
const $input2 = document.querySelector('#inputDisagree');
const $pasteModalPreview = document.querySelector('#pasteModalPreview');
const $selectableText = document.querySelector('#selectableText');

let dataset = new Dataset();
let myRecognizer = new Recognizer();

const MODE_DEFINE_COPY = "define_copy";
const MODE_DEFINE_PASTE = "define_paste";
const MODE_DEFINE_OTHERS = "define_others";

const MODE_DEFINE_GESTURES = "define_gestures";
const MODE_DEFAULT = "default";
const MODE_COPY = "copy";
const MODE_COPIED = "copied";
const MODE_PASTE = "paste";

let currentMode = MODE_DEFINE_GESTURES;

var clipboard = "";
var selection = "";

var changeMode = function(newMode)
{
  console.log("Change mode to: " + newMode);

  switch (newMode) {
    case MODE_DEFAULT:
      hideModal();
      break;
    case MODE_COPY:
      selection = "";
      showModal("Mark text to copy", "#fefefe");
      break;
    case MODE_COPIED:
      showModal("Text copied successfully", "#fefefe");
      break;
    case MODE_PASTE:
      showModal("Select field to paste text", "#fefefe");
      break;
    default:

  }
  currentMode = newMode;
}

function showModal(text, color){
  console.log($copyModalText);
  $copyModalText.innerText = text;
  $copyModal.style.display = "none";
  $copyModal.style.display = "block";
}

function hideModal(){
  $copyModal.style.display = "none";
}


function mouseDownOnSide(e) {
  e = e || window.event;
  switch (e.which) {
    case 1: alert('left'); break;
    case 2: alert('middle'); break;
    case 3: alert('right'); break;
  }
}

if (typeof window.orientation !== 'undefined') {

  $input1.addEventListener('touchstart', function(e){
    e.preventDefault();
    clickOnInput($input1);
  });
  $input2.addEventListener('touchstart', function(e){
    e.preventDefault();
    clickOnInput($input2);
  });

  $rightSideBar.addEventListener('touchstart', function(e){
    e.preventDefault();
    mouseDownSideBar(e);
  });

  $leftSideBar.addEventListener('touchstart', function(e){
    e.preventDefault();
    mouseDownSideBar(e);
  });

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

  document.addEventListener('touchend', function(e) {
    console.log("Touched text");
    if(currentMode == MODE_COPY && selection != ""){
      console.log("Write to clipboard: ");
      console.log(selection);
      clipboard = selection;
      changeMode(MODE_COPIED);
    }
  })

} else {
  $input1.addEventListener('mousedown', function(e){
    e.preventDefault();
    clickOnInput($input1);
  });
  $input2.addEventListener('mousedown', function(e){
    e.preventDefault();
    clickOnInput($input2);
  });

  $rightSideBar.addEventListener('mousedown', function(e){
    mouseDownSideBar(e);
  });

  $leftSideBar.addEventListener('mousedown', function(e){
    mouseDownSideBar(e);
  });

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

  document.addEventListener('mouseup', function(e) {
    console.log("Touched text");
    if(currentMode == MODE_COPY && selection != ""){
      console.log("Write to clipboard: ");
      console.log(selection);
      clipboard = selection;
      changeMode(MODE_COPIED);
    }
  })
}

const mouseDownSideBar = function(e){
  $drawing.style.display = "initial";
  mouseDown(e);
};

const clickOnInput = function(inputField){
  inputField.innerText = clipboard;
  clipboard = "";
  changeMode(MODE_DEFAULT);
}

const mouseDown = function(e) {
  const coordinates = draw.getMouseXYinCanvas($drawing, e);
  draw.drawGesture($drawing, 'down', coordinates);
  currentGesture.push(coordinates);
  console.log(coordinates);
  letsDraw = true;
};

const mouseMove = function(e) {
  if (letsDraw) {
    const coordinates = draw.getMouseXYinCanvas($drawing, e);
    draw.drawGesture($drawing, 'move', coordinates);
    currentGesture.push(coordinates);
    //console.log(coordinates);
  }
};

const mouseUp = function(e) {
  letsDraw = false;

  currentGesture = utils.scale(currentGesture);
  currentGesture = utils.translateToOrigin(currentGesture);
  currentGesture = utils.resample(currentGesture, 30);

  // scale

  if (trainingMode) {
    dataset.addGestureWithLabel(currentGesture, gestureID);
    dataset.plotDatasetInHML();
    gestureID++;
  } else {
    const predictedLabel = myRecognizer.predict(currentGesture);
    console.log(predictedLabel);

    if (predictedLabel === 1) {
      changeMode(MODE_COPY);
    } else if (predictedLabel === 2) {
      if(clipboard !== ""){
        changeMode(MODE_PASTE);
      } else {
        window.alert("Copy text before you paste it");
      }
    } else {

    }
  }
  $drawing.style.display = "none";
  currentGesture = [];
};

document.addEventListener("selectionchange", function() {
  if(currentMode == MODE_COPY){
    let selectedText = window.getSelection();
    console.log("Selected Text: " + selectedText.toString());
    selection = selectedText.toString();
  }
});

const $trainingButton = document.querySelector('#trainingButton');
$trainingButton.addEventListener('click', function(e) {
  trainingMode = !trainingMode;
  if (trainingMode) {
    $trainingButton.innerHTML = "Activate Testing";
    $boxHeader.innerHTML = "TRAINING MODE";
  } else {
    myRecognizer.fit(dataset);
    $trainingButton.innerHTML = "Activate Training";
    $boxHeader.innerHTML = "TESTING MODE";
  }
});
