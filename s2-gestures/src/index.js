import * as loaders from 'waves-loaders';
import * as lfo from 'waves-lfo/client';
import * as lfoMotion from 'lfo-motion';
import Dataset from './dataset';
import Recognizer from './Algo';


// Flags
let training = true
let recognizing = false
let donothing = false


const dataset = new Dataset();
const algo = new Recognizer();


const $capture = document.querySelector('body');
const $start = document.querySelector('#start');
const $stop = document.querySelector('#stop');

// catch event within the window, namely the mouse movements
const eventIn = new lfo.source.EventIn({
  frameSize: 2,
  frameRate: 0,
  frameType: 'vector',
});

// re-sample data at fixed rate (50Hz)
const sampler = new lfoMotion.operator.Sampler({
  frameRate: 50,
});

// gesture pre-processing: normalize data wrt window size
const normalize = new lfo.operator.Multiplier({
  factor: [1 / window.innerWidth, 1 / window.innerHeight],
});

// gesture pre-processing: low-pass filtering
// const movingAverage = new lfo.operator.MovingAverage({
//   order: 9,
// });

// display gesture data
const bpfDisplay = new lfo.sink.BpfDisplay({
  min: 0,
  max: 1,
  width: 300,
  height: 150,
  container: '#bpf-container',
});

// data recorder
const recorder = new lfo.sink.DataRecorder({
  separateArrays: true,
  callback: record => {
    if (training) {
      const numGestures = dataset.get_num_gestures() + 1;
      dataset.add_gesture(record.data, numGestures);
      const trained = algo.fit(dataset);
    } 
    else {
      const pred_label = algo.predict(record.data);
      console.log(pred_label); 
    }
  },
});

// connect all
// eventIn.connect(normalize);
eventIn.connect(sampler);
sampler.connect(normalize);
// normalize.connect(movingAverage);
// movingAverage.connect(bpfDisplay);
// movingAverage.connect(recorder);
normalize.connect(bpfDisplay);
normalize.connect(recorder);

eventIn.start();

function onMouseMove(e) {
  const clientX = e.clientX;
  const clientY = e.clientY;
  eventIn.processFrame({time: null, data: [clientX, clientY]});
}

// start when mouse is down
$capture.addEventListener('mousedown', function(e) {
  eventIn.resetStream();
  eventIn.start();
  $capture.addEventListener('mousemove', onMouseMove);
  recorder.start();
});

// stop when mouse is up
$capture.addEventListener('mouseup', function(e) {
  eventIn.stop();
  $capture.removeEventListener('mousemove', onMouseMove);this.onmousemove = null ;
  recorder.stop();
});

$start.addEventListener('click', e => {
  training = true;
  recognizing = false;
});

$stop.addEventListener('click', e => {
  training = false;
  recognizing = true;
});

// $start.addEventListener('click', e => recorder.start());
// $stop.addEventListener('click', e => recorder.stop());





