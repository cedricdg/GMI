import { addBoxToBody, drawGesture, addGestureThumbnail, getMouseXYinCanvas} from './draw';
import Dataset from './dataset';


const $drawing = document.querySelector('#drawCan');

const dataset = new Dataset();


// start when mouse is down
$drawing.addEventListener('mousedown', function(e) {
  const coordinates = getMouseXYinCanvas($drawing, e);
  drawGesture($drawing, 'down', e);
});

// start when mouse is down
$drawing.addEventListener('mousemove', function(e) {
  drawGesture($drawing, 'move', e);
  const coordinates = getMouseXYinCanvas($drawing, e);
  dataset.fillGesture(coordinates);
});

// stop when mouse is up
$drawing.addEventListener('mouseup', function(e) {
  drawGesture($drawing, 'up', e);
  dataset.addGestureWithLabel(1);
});


// const $show = document.querySelector('#show');
// $show.addEventListener('click', function(e) {
//   console.log('there are ' + String(dataset.getNumGestures()));
// })



