(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _draw = require('./lib/draw');

var draw = _interopRequireWildcard(_draw);

var _dataset = require('./lib/dataset');

var _dataset2 = _interopRequireDefault(_dataset);

var _recognizer = require('./lib/recognizer');

var _recognizer2 = _interopRequireDefault(_recognizer);

var _utils = require('./lib/utils');

var utils = _interopRequireWildcard(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var letsDraw = false;
var currentGesture = [];
var gestureID = 1;
var trainingMode = true;

var $drawing = document.querySelector('#drawCan');
var $copyDialog = document.querySelector('#copyDialog');
var $boxHeader = document.querySelector('#boxHeader');
var $copyModal = document.querySelector('#copyModal');
var $copyModalText = document.querySelector('#copyModalText');
var $leftSideBar = document.querySelector('#leftSideBar');
var $rightSideBar = document.querySelector('#rightSideBar');
var $input1 = document.querySelector('#inputAgree');
var $input2 = document.querySelector('#inputDisagree');
var $pasteModalPreview = document.querySelector('#pasteModalPreview');
var $selectableText = document.querySelector('#selectableText');

var dataset = new _dataset2.default();
var myRecognizer = new _recognizer2.default();

var MODE_DEFINE_COPY = "define_copy";
var MODE_DEFINE_PASTE = "define_paste";
var MODE_DEFINE_OTHERS = "define_others";

var MODE_DEFINE_GESTURES = "define_gestures";
var MODE_DEFAULT = "default";
var MODE_COPY = "copy";
var MODE_COPIED = "copied";
var MODE_PASTE = "paste";

var currentMode = MODE_DEFINE_GESTURES;

var clipboard = "";
var selection = "";

var changeMode = function changeMode(newMode) {
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
};

function showModal(text, color) {
  console.log($copyModalText);
  $copyModalText.innerText = text;
  $copyModal.style.display = "none";
  $copyModal.style.display = "block";
}

function hideModal() {
  $copyModal.style.display = "none";
}

function mouseDownOnSide(e) {
  e = e || window.event;
  switch (e.which) {
    case 1:
      alert('left');break;
    case 2:
      alert('middle');break;
    case 3:
      alert('right');break;
  }
}

if (typeof window.orientation !== 'undefined') {

  $input1.addEventListener('touchstart', function (e) {
    e.preventDefault();
    clickOnInput($input1);
  });
  $input2.addEventListener('touchstart', function (e) {
    e.preventDefault();
    clickOnInput($input2);
  });

  $rightSideBar.addEventListener('touchstart', function (e) {
    e.preventDefault();
    mouseDownSideBar(e);
  });

  $leftSideBar.addEventListener('touchstart', function (e) {
    e.preventDefault();
    mouseDownSideBar(e);
  });

  // start when mouse is down
  $drawing.addEventListener('touchstart', function (e) {
    e.preventDefault();
    console.log("touchstart");
    mouseDown(e);
  });

  // start when mouse is down
  $drawing.addEventListener('touchmove', function (e) {
    e.preventDefault();
    console.log("touchmove");
    mouseMove(e);
  });

  // start when mouse is down
  $drawing.addEventListener('touchend', function (e) {
    e.preventDefault();
    console.log("touchend");
    mouseUp(e);
  });

  document.addEventListener('touchend', function (e) {
    console.log("Touched text");
    if (currentMode == MODE_COPY && selection != "") {
      console.log("Write to clipboard: ");
      console.log(selection);
      clipboard = selection;
      changeMode(MODE_COPIED);
    }
  });
} else {
  $input1.addEventListener('mousedown', function (e) {
    e.preventDefault();
    clickOnInput($input1);
  });
  $input2.addEventListener('mousedown', function (e) {
    e.preventDefault();
    clickOnInput($input2);
  });

  $rightSideBar.addEventListener('mousedown', function (e) {
    mouseDownSideBar(e);
  });

  $leftSideBar.addEventListener('mousedown', function (e) {
    mouseDownSideBar(e);
  });

  // start when mouse is down
  $drawing.addEventListener('mousedown', function (e) {
    console.log("mousedown");
    mouseDown(e);
  });

  // start when mouse is down
  $drawing.addEventListener('mousemove', function (e) {
    console.log("mousemove");
    mouseMove(e);
  });

  // stop when mouse is up
  $drawing.addEventListener('mouseup', function (e) {
    console.log("mouseup");
    mouseUp(e);
  });

  document.addEventListener('mouseup', function (e) {
    console.log("Touched text");
    if (currentMode == MODE_COPY && selection != "") {
      console.log("Write to clipboard: ");
      console.log(selection);
      clipboard = selection;
      changeMode(MODE_COPIED);
    }
  });
}

var mouseDownSideBar = function mouseDownSideBar(e) {
  $drawing.style.display = "initial";
  mouseDown(e);
};

var clickOnInput = function clickOnInput(inputField) {
  if (currentMode == MODE_PASTE) {
    inputField.innerText = clipboard;
    clipboard = "";
    changeMode(MODE_DEFAULT);
  }
};

var mouseDown = function mouseDown(e) {
  var coordinates = draw.getMouseXYinCanvas($drawing, e);
  draw.drawGesture($drawing, 'down', coordinates);
  currentGesture.push(coordinates);
  console.log(coordinates);
  letsDraw = true;
};

var mouseMove = function mouseMove(e) {
  if (letsDraw) {
    var coordinates = draw.getMouseXYinCanvas($drawing, e);
    draw.drawGesture($drawing, 'move', coordinates);
    currentGesture.push(coordinates);
    //console.log(coordinates);
  }
};

var mouseUp = function mouseUp(e) {
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
    var predictedLabel = myRecognizer.predict(currentGesture);
    console.log(predictedLabel);

    if (predictedLabel === 1 || predictedLabel === 3) {
      changeMode(MODE_COPY);
    } else if (predictedLabel === 2 || predictedLabel === 4) {
      if (clipboard !== "") {
        changeMode(MODE_PASTE);
      } else {
        window.alert("Copy text before you paste it");
      }
    } else {}
  }
  $drawing.style.display = "none";
  currentGesture = [];
};

document.addEventListener("selectionchange", function () {
  if (currentMode == MODE_COPY) {
    var selectedText = window.getSelection();
    console.log("Selected Text: " + selectedText.toString());
    selection = selectedText.toString();
  }
});

var $trainingButton = document.querySelector('#trainingButton');
$trainingButton.addEventListener('click', function (e) {
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

},{"./lib/dataset":2,"./lib/draw":3,"./lib/recognizer":4,"./lib/utils":5}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Dataset Class
 */

var Dataset = function () {
  function Dataset() {
    (0, _classCallCheck3.default)(this, Dataset);

    this.gesture = [];
    this.allGestures = [];
    this.allLabels = [];
  }

  (0, _createClass3.default)(Dataset, [{
    key: "addGestureWithLabel",
    value: function addGestureWithLabel(gesture, label) {
      this.allGestures.push(gesture);
      this.allLabels.push(label);
    }
  }, {
    key: "getNumGestures",
    value: function getNumGestures() {
      return this.allGestures.length;
    }
  }, {
    key: "getCurrentGesture",
    value: function getCurrentGesture() {
      return this.gesture;
    }
  }, {
    key: "getGestures",
    value: function getGestures() {
      return this.allGestures;
    }
  }, {
    key: "getLabels",
    value: function getLabels() {
      return this.allLabels;
    }
  }, {
    key: "clear",
    value: function clear() {
      this.allGestures = [];
      this.allLabels = [];
      // clear plots if there is any
      document.getElementById("dataset-div").remove();
      var datasetDiv = document.createElement('div');
      datasetDiv.id = "dataset-div";
      var body = document.getElementsByTagName("body")[0];
      body.appendChild(datasetDiv);
    }
  }, {
    key: "plotDatasetInHML",
    value: function plotDatasetInHML() {
      document.getElementById("dataset-div").remove();
      var datasetDiv = document.createElement('div');
      datasetDiv.id = "dataset-div";
      datasetDiv.className = "thumbnail";

      var body = document.getElementsByTagName("body")[0];
      body.appendChild(datasetDiv);

      var classes = this.allLabels.filter(function (v, i, a) {
        return a.indexOf(v) === i;
      });

      for (var g = 0; g < this.allGestures.length; g++) {
        // for (let c = 0; c < classes.length; c++) {
        // let index = this.allLabels.indexOf(classes[c]);
        // const gesture_ = this.allGestures[index]
        var gesture_ = this.allGestures[g];
        // declare the canva where to draw a thumbnail
        var thumbCnvs = document.createElement('canvas');
        thumbCnvs.width = 70;
        thumbCnvs.height = 70;
        thumbCnvs.style.border = "1px solid";
        // get context to fill with bkg color and image
        var ctx = thumbCnvs.getContext('2d');
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, thumbCnvs.width, thumbCnvs.height);
        for (var n = 0; n < gesture_.length; n++) {
          if (n == 0) {
            ctx.beginPath();
            ctx.fillStyle = "orange";
            var x = gesture_[n][0] * 70;
            var y = gesture_[n][1] * 70;
            ctx.arc(x, y, 5, 0, Math.PI * 2, true);
            ctx.fill();
            ctx.closePath();
          } else {
            var curX = gesture_[n][0] * 70;
            var curY = gesture_[n][1] * 70;
            var prevX = gesture_[n - 1][0] * 70;
            var prevY = gesture_[n - 1][1] * 70;
            ctx.beginPath();
            ctx.moveTo(prevX, prevY);
            ctx.lineTo(curX, curY);
            ctx.strokeStyle = "orange";
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.closePath();
          }
        }
        datasetDiv.appendChild(thumbCnvs);
        var textSpan = document.createElement('span');
        textSpan.innerHTML += String(this.allLabels[g]);
        textSpan.className = "thumbLabel";
        datasetDiv.appendChild(textSpan);
      }
    }
  }]);
  return Dataset;
}();

exports.default = Dataset;

},{"babel-runtime/helpers/classCallCheck":7,"babel-runtime/helpers/createClass":8}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
// Drawing functions in canvas
var initDrawingPt = false;
var prevMouseX = 0;
var currMouseX = 0;
var prevMouseY = 0;
var currMouseY = 0;
var lineWidth = 3;
var color = "orange";

function drawGesture(canvas, res, coordinates) {
  var ctx = canvas.getContext("2d");
  if (res == 'down') {
    // clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    prevMouseX = currMouseX;
    prevMouseY = currMouseY;
    currMouseX = coordinates[0] * canvas.width;
    currMouseY = coordinates[1] * canvas.height;
    initDrawingPt = true;
    if (initDrawingPt) {
      ctx.beginPath();
      ctx.fillStyle = color;
      ctx.arc(currMouseX, currMouseY, 5, 0, Math.PI * 2, true);
      ctx.fill();
      ctx.closePath();
      initDrawingPt = false;
    }
  }
  if (res == 'move') {
    prevMouseX = currMouseX;
    prevMouseY = currMouseY;
    currMouseX = coordinates[0] * canvas.width;
    currMouseY = coordinates[1] * canvas.height;
    ctx.beginPath();
    ctx.moveTo(prevMouseX, prevMouseY);
    ctx.lineTo(currMouseX, currMouseY);
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
    ctx.closePath();
  }
}

function addGestureThumbnail(canvas, gesture_id) {
  // declare the canva where to draw a thumbnail
  var thumbCnvs = document.createElement('canvas');
  thumbCnvs.width = 70;
  thumbCnvs.height = 70;
  thumbCnvs.style.border = "1px solid";
  // get context to fill with bkg color and image
  var ctx = thumbCnvs.getContext('2d');
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, thumbCnvs.width, thumbCnvs.height);
  ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, thumbCnvs.width, thumbCnvs.height);
  // add to the body document
  var body = document.getElementsByTagName("body")[0];
  body.appendChild(thumbCnvs);
}

function getMouseXYinCanvas(canvas, e) {
  var _canvas$getBoundingCl = canvas.getBoundingClientRect(),
      top = _canvas$getBoundingCl.top,
      left = _canvas$getBoundingCl.left,
      width = _canvas$getBoundingCl.width,
      height = _canvas$getBoundingCl.height;

  var clientX = (e.pageX - left) / width;
  var clientY = (e.pageY - top) / height;
  return [clientX, clientY];
}

function addBoxToBody(width, height, name, boxtitle) {
  // create outer DIV
  var iDiv = document.createElement('div');
  iDiv.id = 'block-' + String(Math.random() * 10000);
  iDiv.className = 'box';
  document.getElementsByTagName('body')[0].appendChild(iDiv);
  // create canvas
  var canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  canvas.style.border = "0px";
  canvas.id = name;
  var ctx = canvas.getContext('2d');
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  var div = document.getElementById(iDiv.id);
  div.appendChild(canvas);
  // create div for title
  var titleDiv = document.createElement('div');
  titleDiv.className = 'boxtitle';
  titleDiv.innerHTML += boxtitle;
  div.appendChild(titleDiv);
}

exports.addBoxToBody = addBoxToBody;
exports.drawGesture = drawGesture;
exports.addGestureThumbnail = addGestureThumbnail;
exports.getMouseXYinCanvas = getMouseXYinCanvas;

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _utils = require('./utils');

var utils = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Recognizer = function () {
  function Recognizer() {
    (0, _classCallCheck3.default)(this, Recognizer);

    this.trainingData = [];
    this.trainingLabels = [];
  }

  (0, _createClass3.default)(Recognizer, [{
    key: 'fit',
    value: function fit(dataset) {
      this.trainingData = dataset.getGestures();
      this.trainingLabels = dataset.getLabels();
    }
  }, {
    key: 'predict',
    value: function predict(gesture) {
      var minDistance = Infinity;
      var minIndex = -1;

      // TODO Translate Starting point of gestures

      for (var i = 0; i < this.trainingData.length; i++) {

        var template = this.trainingData[i];
        var dist = 0.0;
        for (var k = 0; k < Math.min(template.length, gesture.length); k++) {
          dist = dist + utils.distance(template[k], gesture[k]);
        }

        if (dist < minDistance) {
          minDistance = dist;
          minIndex = i;
        }
      }
      return this.trainingLabels[minIndex];
    }
  }]);
  return Recognizer;
}(); /**
      * Recongizer class
      * Simple template-based recognizer
      */

exports.default = Recognizer;

},{"./utils":5,"babel-runtime/helpers/classCallCheck":7,"babel-runtime/helpers/createClass":8}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

/// "PRIVATE" FUNCTIONS

function pathLength(points) {
    var d = 0.0;
    for (var i = 1; i < points.length; i++) {
        d += distance(points[i - 1], points[i]);
    }return d;
}

function boundingBox(points) {
    var minX = +Infinity,
        maxX = -Infinity,
        minY = +Infinity,
        maxY = -Infinity;
    for (var i = 0; i < points.length; i++) {
        minX = Math.min(minX, points[i][0]);
        minY = Math.min(minY, points[i][1]);
        maxX = Math.max(maxX, points[i][0]);
        maxY = Math.max(maxY, points[i][1]);
    }
    return [maxX - minX, maxY - minY];
}

function centroid(points) {
    var x = 0.0,
        y = 0.0;
    for (var i = 0; i < points.length; i++) {
        x += points[i][0];
        y += points[i][1];
    }
    x /= points.length;
    y /= points.length;
    return [x, y];
}
function indicativeAngle(points) {
    var c = centroid(points);
    return Math.atan2(c[1] - points[0][1], c[0] - points[0][0]);
}

/// "PUBLIC" FUNCTIONS

function distance(vector1, vector2) {
    var dist = 0.0;
    for (var d = 0; d < vector1.length; d++) {
        dist += Math.pow(vector1[d] - vector2[d], 2);
    }
    return Math.sqrt(dist);
}

function resample(data_, n) {
    var data = data_;
    var I = pathLength(data) / (n - 1); // interval length
    var D = 0.0;
    var newpoints = [];
    newpoints.push(data[0]);
    for (var i = 1; i < data.length; i++) {
        var d = distance(data[i - 1], data[i]);
        if (D + d >= I) {
            var qx = data[i - 1][0] + (I - D) / d * (data[i][0] - data[i - 1][0]);
            var qy = data[i - 1][1] + (I - D) / d * (data[i][1] - data[i - 1][1]);
            var q = [qx, qy];
            newpoints.push([qx, qy]);
            data.splice(i, 0, q); // insert 'q' at position i in points s.t. 'q' will be the next i
            D = 0.0;
        } else D += d;
    }
    if (newpoints.length == n - 1) {
        newpoints.push([data[data.length - 1][0], data[data.length - 1][1]]);
    }
    return newpoints;
}

function rotate(points) // rotates points around centroid
{
    var radians = -indicativeAngle(points);
    var c = centroid(points);
    var cos = Math.cos(radians);
    var sin = Math.sin(radians);
    var newpoints = [];
    for (var i = 0; i < points.length; i++) {
        var qx = (points[i][0] - c[0]) * cos - (points[i][1] - c[1]) * sin + c[0];
        var qy = (points[i][0] - c[0]) * sin + (points[i][1] - c[1]) * cos + c[1];
        newpoints.push([qx, qy]);
    }
    return newpoints;
}

function scale(points) // non-uniform scale; assumes 2D gestures (i.e., no lines)
{
    var size = 0.5;
    var bBox = boundingBox(points);
    var newpoints = [];
    for (var i = 0; i < points.length; i++) {
        var qx = points[i][0] * (size / bBox[0]);
        var qy = points[i][1] * (size / bBox[1]);
        newpoints.push([qx, qy]);
    }
    return newpoints;
}

function translateToOrigin(points) // translates points' centroid
{
    var orig = [0.5, 0.5];
    var c = centroid(points);
    var newpoints = [];
    for (var i = 0; i < points.length; i++) {
        var qx = points[i][0] + orig[0] - c[0];
        var qy = points[i][1] + orig[1] - c[1];
        newpoints.push([qx, qy]);
    }
    return newpoints;
}

exports.distance = distance;
exports.resample = resample;
exports.rotate = rotate;
exports.scale = scale;
exports.translateToOrigin = translateToOrigin;

},{}],6:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/define-property"), __esModule: true };
},{"core-js/library/fn/object/define-property":9}],7:[function(require,module,exports){
"use strict";

exports.__esModule = true;

exports.default = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};
},{}],8:[function(require,module,exports){
"use strict";

exports.__esModule = true;

var _defineProperty = require("../core-js/object/define-property");

var _defineProperty2 = _interopRequireDefault(_defineProperty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      (0, _defineProperty2.default)(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();
},{"../core-js/object/define-property":6}],9:[function(require,module,exports){
require('../../modules/es6.object.define-property');
var $Object = require('../../modules/_core').Object;
module.exports = function defineProperty(it, key, desc) {
  return $Object.defineProperty(it, key, desc);
};

},{"../../modules/_core":12,"../../modules/es6.object.define-property":25}],10:[function(require,module,exports){
module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};

},{}],11:[function(require,module,exports){
var isObject = require('./_is-object');
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};

},{"./_is-object":21}],12:[function(require,module,exports){
var core = module.exports = { version: '2.5.3' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef

},{}],13:[function(require,module,exports){
// optional / simple context binding
var aFunction = require('./_a-function');
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};

},{"./_a-function":10}],14:[function(require,module,exports){
// Thank's IE8 for his funny defineProperty
module.exports = !require('./_fails')(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});

},{"./_fails":17}],15:[function(require,module,exports){
var isObject = require('./_is-object');
var document = require('./_global').document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};

},{"./_global":18,"./_is-object":21}],16:[function(require,module,exports){
var global = require('./_global');
var core = require('./_core');
var ctx = require('./_ctx');
var hide = require('./_hide');
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var IS_WRAP = type & $export.W;
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE];
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE];
  var key, own, out;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if (own && key in exports) continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function (C) {
      var F = function (a, b, c) {
        if (this instanceof C) {
          switch (arguments.length) {
            case 0: return new C();
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if (IS_PROTO) {
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if (type & $export.R && expProto && !expProto[key]) hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;

},{"./_core":12,"./_ctx":13,"./_global":18,"./_hide":19}],17:[function(require,module,exports){
module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};

},{}],18:[function(require,module,exports){
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef

},{}],19:[function(require,module,exports){
var dP = require('./_object-dp');
var createDesc = require('./_property-desc');
module.exports = require('./_descriptors') ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

},{"./_descriptors":14,"./_object-dp":22,"./_property-desc":23}],20:[function(require,module,exports){
module.exports = !require('./_descriptors') && !require('./_fails')(function () {
  return Object.defineProperty(require('./_dom-create')('div'), 'a', { get: function () { return 7; } }).a != 7;
});

},{"./_descriptors":14,"./_dom-create":15,"./_fails":17}],21:[function(require,module,exports){
module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

},{}],22:[function(require,module,exports){
var anObject = require('./_an-object');
var IE8_DOM_DEFINE = require('./_ie8-dom-define');
var toPrimitive = require('./_to-primitive');
var dP = Object.defineProperty;

exports.f = require('./_descriptors') ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

},{"./_an-object":11,"./_descriptors":14,"./_ie8-dom-define":20,"./_to-primitive":24}],23:[function(require,module,exports){
module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

},{}],24:[function(require,module,exports){
// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = require('./_is-object');
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};

},{"./_is-object":21}],25:[function(require,module,exports){
var $export = require('./_export');
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export($export.S + $export.F * !require('./_descriptors'), 'Object', { defineProperty: require('./_object-dp').f });

},{"./_descriptors":14,"./_export":16,"./_object-dp":22}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkaXN0L2luZGV4LmpzIiwiZGlzdC9saWIvZGF0YXNldC5qcyIsImRpc3QvbGliL2RyYXcuanMiLCJkaXN0L2xpYi9yZWNvZ25pemVyLmpzIiwiZGlzdC9saWIvdXRpbHMuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9jb3JlLWpzL29iamVjdC9kZWZpbmUtcHJvcGVydHkuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9oZWxwZXJzL2NsYXNzQ2FsbENoZWNrLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvaGVscGVycy9jcmVhdGVDbGFzcy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvZm4vb2JqZWN0L2RlZmluZS1wcm9wZXJ0eS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fYS1mdW5jdGlvbi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fYW4tb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19jb3JlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19jdHguanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2Rlc2NyaXB0b3JzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19kb20tY3JlYXRlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19leHBvcnQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2ZhaWxzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19nbG9iYWwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2hpZGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2llOC1kb20tZGVmaW5lLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19pcy1vYmplY3QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1kcC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fcHJvcGVydHktZGVzYy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fdG8tcHJpbWl0aXZlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5vYmplY3QuZGVmaW5lLXByb3BlcnR5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7SUFBWSxJOztBQUNaOzs7O0FBQ0E7Ozs7QUFDQTs7SUFBWSxLOzs7Ozs7QUFFWixJQUFJLFdBQVcsS0FBZjtBQUNBLElBQUksaUJBQWlCLEVBQXJCO0FBQ0EsSUFBSSxZQUFZLENBQWhCO0FBQ0EsSUFBSSxlQUFlLElBQW5COztBQUVBLElBQU0sV0FBVyxTQUFTLGFBQVQsQ0FBdUIsVUFBdkIsQ0FBakI7QUFDQSxJQUFNLGNBQWMsU0FBUyxhQUFULENBQXVCLGFBQXZCLENBQXBCO0FBQ0EsSUFBTSxhQUFhLFNBQVMsYUFBVCxDQUF1QixZQUF2QixDQUFuQjtBQUNBLElBQU0sYUFBYSxTQUFTLGFBQVQsQ0FBdUIsWUFBdkIsQ0FBbkI7QUFDQSxJQUFNLGlCQUFpQixTQUFTLGFBQVQsQ0FBdUIsZ0JBQXZCLENBQXZCO0FBQ0EsSUFBTSxlQUFlLFNBQVMsYUFBVCxDQUF1QixjQUF2QixDQUFyQjtBQUNBLElBQU0sZ0JBQWdCLFNBQVMsYUFBVCxDQUF1QixlQUF2QixDQUF0QjtBQUNBLElBQU0sVUFBVSxTQUFTLGFBQVQsQ0FBdUIsYUFBdkIsQ0FBaEI7QUFDQSxJQUFNLFVBQVUsU0FBUyxhQUFULENBQXVCLGdCQUF2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O0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCAqIGFzIGRyYXcgZnJvbSAnLi9saWIvZHJhdydcbmltcG9ydCBEYXRhc2V0IGZyb20gJy4vbGliL2RhdGFzZXQnXG5pbXBvcnQgUmVjb2duaXplciBmcm9tICcuL2xpYi9yZWNvZ25pemVyJ1xuaW1wb3J0ICogYXMgdXRpbHMgZnJvbSAnLi9saWIvdXRpbHMnXG5cbmxldCBsZXRzRHJhdyA9IGZhbHNlO1xubGV0IGN1cnJlbnRHZXN0dXJlID0gW107XG5sZXQgZ2VzdHVyZUlEID0gMTtcbmxldCB0cmFpbmluZ01vZGUgPSB0cnVlO1xuXG5jb25zdCAkZHJhd2luZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNkcmF3Q2FuJyk7XG5jb25zdCAkY29weURpYWxvZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjb3B5RGlhbG9nJyk7XG5jb25zdCAkYm94SGVhZGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2JveEhlYWRlcicpO1xuY29uc3QgJGNvcHlNb2RhbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjb3B5TW9kYWwnKTtcbmNvbnN0ICRjb3B5TW9kYWxUZXh0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2NvcHlNb2RhbFRleHQnKTtcbmNvbnN0ICRsZWZ0U2lkZUJhciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNsZWZ0U2lkZUJhcicpO1xuY29uc3QgJHJpZ2h0U2lkZUJhciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNyaWdodFNpZGVCYXInKTtcbmNvbnN0ICRpbnB1dDEgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjaW5wdXRBZ3JlZScpO1xuY29uc3QgJGlucHV0MiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNpbnB1dERpc2FncmVlJyk7XG5jb25zdCAkcGFzdGVNb2RhbFByZXZpZXcgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcGFzdGVNb2RhbFByZXZpZXcnKTtcbmNvbnN0ICRzZWxlY3RhYmxlVGV4dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzZWxlY3RhYmxlVGV4dCcpO1xuXG5sZXQgZGF0YXNldCA9IG5ldyBEYXRhc2V0KCk7XG5sZXQgbXlSZWNvZ25pemVyID0gbmV3IFJlY29nbml6ZXIoKTtcblxuY29uc3QgTU9ERV9ERUZJTkVfQ09QWSA9IFwiZGVmaW5lX2NvcHlcIjtcbmNvbnN0IE1PREVfREVGSU5FX1BBU1RFID0gXCJkZWZpbmVfcGFzdGVcIjtcbmNvbnN0IE1PREVfREVGSU5FX09USEVSUyA9IFwiZGVmaW5lX290aGVyc1wiO1xuXG5jb25zdCBNT0RFX0RFRklORV9HRVNUVVJFUyA9IFwiZGVmaW5lX2dlc3R1cmVzXCI7XG5jb25zdCBNT0RFX0RFRkFVTFQgPSBcImRlZmF1bHRcIjtcbmNvbnN0IE1PREVfQ09QWSA9IFwiY29weVwiO1xuY29uc3QgTU9ERV9DT1BJRUQgPSBcImNvcGllZFwiO1xuY29uc3QgTU9ERV9QQVNURSA9IFwicGFzdGVcIjtcblxubGV0IGN1cnJlbnRNb2RlID0gTU9ERV9ERUZJTkVfR0VTVFVSRVM7XG5cbnZhciBjbGlwYm9hcmQgPSBcIlwiO1xudmFyIHNlbGVjdGlvbiA9IFwiXCI7XG5cbnZhciBjaGFuZ2VNb2RlID0gZnVuY3Rpb24obmV3TW9kZSlcbntcbiAgY29uc29sZS5sb2coXCJDaGFuZ2UgbW9kZSB0bzogXCIgKyBuZXdNb2RlKTtcblxuICBzd2l0Y2ggKG5ld01vZGUpIHtcbiAgICBjYXNlIE1PREVfREVGQVVMVDpcbiAgICAgIGhpZGVNb2RhbCgpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBNT0RFX0NPUFk6XG4gICAgICBzZWxlY3Rpb24gPSBcIlwiO1xuICAgICAgc2hvd01vZGFsKFwiTWFyayB0ZXh0IHRvIGNvcHlcIiwgXCIjZmVmZWZlXCIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBNT0RFX0NPUElFRDpcbiAgICAgIHNob3dNb2RhbChcIlRleHQgY29waWVkIHN1Y2Nlc3NmdWxseVwiLCBcIiNmZWZlZmVcIik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIE1PREVfUEFTVEU6XG4gICAgICBzaG93TW9kYWwoXCJTZWxlY3QgZmllbGQgdG8gcGFzdGUgdGV4dFwiLCBcIiNmZWZlZmVcIik7XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuXG4gIH1cbiAgY3VycmVudE1vZGUgPSBuZXdNb2RlO1xufVxuXG5mdW5jdGlvbiBzaG93TW9kYWwodGV4dCwgY29sb3Ipe1xuICBjb25zb2xlLmxvZygkY29weU1vZGFsVGV4dCk7XG4gICRjb3B5TW9kYWxUZXh0LmlubmVyVGV4dCA9IHRleHQ7XG4gICRjb3B5TW9kYWwuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAkY29weU1vZGFsLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG59XG5cbmZ1bmN0aW9uIGhpZGVNb2RhbCgpe1xuICAkY29weU1vZGFsLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbn1cblxuXG5mdW5jdGlvbiBtb3VzZURvd25PblNpZGUoZSkge1xuICBlID0gZSB8fCB3aW5kb3cuZXZlbnQ7XG4gIHN3aXRjaCAoZS53aGljaCkge1xuICAgIGNhc2UgMTogYWxlcnQoJ2xlZnQnKTsgYnJlYWs7XG4gICAgY2FzZSAyOiBhbGVydCgnbWlkZGxlJyk7IGJyZWFrO1xuICAgIGNhc2UgMzogYWxlcnQoJ3JpZ2h0Jyk7IGJyZWFrO1xuICB9XG59XG5cbmlmICh0eXBlb2Ygd2luZG93Lm9yaWVudGF0aW9uICE9PSAndW5kZWZpbmVkJykge1xuXG4gICRpbnB1dDEuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIGZ1bmN0aW9uKGUpe1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBjbGlja09uSW5wdXQoJGlucHV0MSk7XG4gIH0pO1xuICAkaW5wdXQyLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCBmdW5jdGlvbihlKXtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgY2xpY2tPbklucHV0KCRpbnB1dDIpO1xuICB9KTtcblxuICAkcmlnaHRTaWRlQmFyLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCBmdW5jdGlvbihlKXtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgbW91c2VEb3duU2lkZUJhcihlKTtcbiAgfSk7XG5cbiAgJGxlZnRTaWRlQmFyLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCBmdW5jdGlvbihlKXtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgbW91c2VEb3duU2lkZUJhcihlKTtcbiAgfSk7XG5cbiAgLy8gc3RhcnQgd2hlbiBtb3VzZSBpcyBkb3duXG4gICRkcmF3aW5nLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCBmdW5jdGlvbihlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGNvbnNvbGUubG9nKFwidG91Y2hzdGFydFwiKTtcbiAgICBtb3VzZURvd24oZSk7XG4gIH0pO1xuXG4gIC8vIHN0YXJ0IHdoZW4gbW91c2UgaXMgZG93blxuICAkZHJhd2luZy5hZGRFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCBmdW5jdGlvbihlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGNvbnNvbGUubG9nKFwidG91Y2htb3ZlXCIpO1xuICAgIG1vdXNlTW92ZShlKTtcbiAgfSk7XG5cbiAgLy8gc3RhcnQgd2hlbiBtb3VzZSBpcyBkb3duXG4gICRkcmF3aW5nLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgZnVuY3Rpb24oZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBjb25zb2xlLmxvZyhcInRvdWNoZW5kXCIpO1xuICAgIG1vdXNlVXAoZSk7XG4gIH0pO1xuXG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgZnVuY3Rpb24oZSkge1xuICAgIGNvbnNvbGUubG9nKFwiVG91Y2hlZCB0ZXh0XCIpO1xuICAgIGlmKGN1cnJlbnRNb2RlID09IE1PREVfQ09QWSAmJiBzZWxlY3Rpb24gIT0gXCJcIil7XG4gICAgICBjb25zb2xlLmxvZyhcIldyaXRlIHRvIGNsaXBib2FyZDogXCIpO1xuICAgICAgY29uc29sZS5sb2coc2VsZWN0aW9uKTtcbiAgICAgIGNsaXBib2FyZCA9IHNlbGVjdGlvbjtcbiAgICAgIGNoYW5nZU1vZGUoTU9ERV9DT1BJRUQpO1xuICAgIH1cbiAgfSlcblxufSBlbHNlIHtcbiAgJGlucHV0MS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBmdW5jdGlvbihlKXtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgY2xpY2tPbklucHV0KCRpbnB1dDEpO1xuICB9KTtcbiAgJGlucHV0Mi5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBmdW5jdGlvbihlKXtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgY2xpY2tPbklucHV0KCRpbnB1dDIpO1xuICB9KTtcblxuICAkcmlnaHRTaWRlQmFyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGZ1bmN0aW9uKGUpe1xuICAgIG1vdXNlRG93blNpZGVCYXIoZSk7XG4gIH0pO1xuXG4gICRsZWZ0U2lkZUJhci5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBmdW5jdGlvbihlKXtcbiAgICBtb3VzZURvd25TaWRlQmFyKGUpO1xuICB9KTtcblxuICAvLyBzdGFydCB3aGVuIG1vdXNlIGlzIGRvd25cbiAgJGRyYXdpbmcuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgZnVuY3Rpb24oZSkge1xuICAgIGNvbnNvbGUubG9nKFwibW91c2Vkb3duXCIpO1xuICAgIG1vdXNlRG93bihlKTtcbiAgfSk7XG5cbiAgLy8gc3RhcnQgd2hlbiBtb3VzZSBpcyBkb3duXG4gICRkcmF3aW5nLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIGZ1bmN0aW9uKGUpIHtcbiAgICBjb25zb2xlLmxvZyhcIm1vdXNlbW92ZVwiKTtcbiAgICBtb3VzZU1vdmUoZSk7XG4gIH0pO1xuXG4gIC8vIHN0b3Agd2hlbiBtb3VzZSBpcyB1cFxuICAkZHJhd2luZy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgZnVuY3Rpb24oZSkge1xuICAgIGNvbnNvbGUubG9nKFwibW91c2V1cFwiKTtcbiAgICBtb3VzZVVwKGUpO1xuICB9KTtcblxuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgZnVuY3Rpb24oZSkge1xuICAgIGNvbnNvbGUubG9nKFwiVG91Y2hlZCB0ZXh0XCIpO1xuICAgIGlmKGN1cnJlbnRNb2RlID09IE1PREVfQ09QWSAmJiBzZWxlY3Rpb24gIT0gXCJcIil7XG4gICAgICBjb25zb2xlLmxvZyhcIldyaXRlIHRvIGNsaXBib2FyZDogXCIpO1xuICAgICAgY29uc29sZS5sb2coc2VsZWN0aW9uKTtcbiAgICAgIGNsaXBib2FyZCA9IHNlbGVjdGlvbjtcbiAgICAgIGNoYW5nZU1vZGUoTU9ERV9DT1BJRUQpO1xuICAgIH1cbiAgfSlcbn1cblxuY29uc3QgbW91c2VEb3duU2lkZUJhciA9IGZ1bmN0aW9uKGUpe1xuICAkZHJhd2luZy5zdHlsZS5kaXNwbGF5ID0gXCJpbml0aWFsXCI7XG4gIG1vdXNlRG93bihlKTtcbn07XG5cbmNvbnN0IGNsaWNrT25JbnB1dCA9IGZ1bmN0aW9uKGlucHV0RmllbGQpe1xuICBpZihjdXJyZW50TW9kZSA9PSBNT0RFX1BBU1RFKXtcbiAgICBpbnB1dEZpZWxkLmlubmVyVGV4dCA9IGNsaXBib2FyZDtcbiAgICBjbGlwYm9hcmQgPSBcIlwiO1xuICAgIGNoYW5nZU1vZGUoTU9ERV9ERUZBVUxUKTtcbiAgfVxufVxuXG5jb25zdCBtb3VzZURvd24gPSBmdW5jdGlvbihlKSB7XG4gIGNvbnN0IGNvb3JkaW5hdGVzID0gZHJhdy5nZXRNb3VzZVhZaW5DYW52YXMoJGRyYXdpbmcsIGUpO1xuICBkcmF3LmRyYXdHZXN0dXJlKCRkcmF3aW5nLCAnZG93bicsIGNvb3JkaW5hdGVzKTtcbiAgY3VycmVudEdlc3R1cmUucHVzaChjb29yZGluYXRlcyk7XG4gIGNvbnNvbGUubG9nKGNvb3JkaW5hdGVzKTtcbiAgbGV0c0RyYXcgPSB0cnVlO1xufTtcblxuY29uc3QgbW91c2VNb3ZlID0gZnVuY3Rpb24oZSkge1xuICBpZiAobGV0c0RyYXcpIHtcbiAgICBjb25zdCBjb29yZGluYXRlcyA9IGRyYXcuZ2V0TW91c2VYWWluQ2FudmFzKCRkcmF3aW5nLCBlKTtcbiAgICBkcmF3LmRyYXdHZXN0dXJlKCRkcmF3aW5nLCAnbW92ZScsIGNvb3JkaW5hdGVzKTtcbiAgICBjdXJyZW50R2VzdHVyZS5wdXNoKGNvb3JkaW5hdGVzKTtcbiAgICAvL2NvbnNvbGUubG9nKGNvb3JkaW5hdGVzKTtcbiAgfVxufTtcblxuY29uc3QgbW91c2VVcCA9IGZ1bmN0aW9uKGUpIHtcbiAgbGV0c0RyYXcgPSBmYWxzZTtcblxuICBjdXJyZW50R2VzdHVyZSA9IHV0aWxzLnNjYWxlKGN1cnJlbnRHZXN0dXJlKTtcbiAgY3VycmVudEdlc3R1cmUgPSB1dGlscy50cmFuc2xhdGVUb09yaWdpbihjdXJyZW50R2VzdHVyZSk7XG4gIGN1cnJlbnRHZXN0dXJlID0gdXRpbHMucmVzYW1wbGUoY3VycmVudEdlc3R1cmUsIDMwKTtcblxuICAvLyBzY2FsZVxuXG4gIGlmICh0cmFpbmluZ01vZGUpIHtcbiAgICBkYXRhc2V0LmFkZEdlc3R1cmVXaXRoTGFiZWwoY3VycmVudEdlc3R1cmUsIGdlc3R1cmVJRCk7XG4gICAgZGF0YXNldC5wbG90RGF0YXNldEluSE1MKCk7XG4gICAgZ2VzdHVyZUlEKys7XG4gIH0gZWxzZSB7XG4gICAgY29uc3QgcHJlZGljdGVkTGFiZWwgPSBteVJlY29nbml6ZXIucHJlZGljdChjdXJyZW50R2VzdHVyZSk7XG4gICAgY29uc29sZS5sb2cocHJlZGljdGVkTGFiZWwpO1xuXG4gICAgaWYgKHByZWRpY3RlZExhYmVsID09PSAxIHx8IHByZWRpY3RlZExhYmVsID09PSAzKSB7XG4gICAgICBjaGFuZ2VNb2RlKE1PREVfQ09QWSk7XG4gICAgfSBlbHNlIGlmIChwcmVkaWN0ZWRMYWJlbCA9PT0gMiB8fCBwcmVkaWN0ZWRMYWJlbCA9PT0gNCkge1xuICAgICAgaWYoY2xpcGJvYXJkICE9PSBcIlwiKXtcbiAgICAgICAgY2hhbmdlTW9kZShNT0RFX1BBU1RFKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHdpbmRvdy5hbGVydChcIkNvcHkgdGV4dCBiZWZvcmUgeW91IHBhc3RlIGl0XCIpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG5cbiAgICB9XG4gIH1cbiAgJGRyYXdpbmcuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICBjdXJyZW50R2VzdHVyZSA9IFtdO1xufTtcblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInNlbGVjdGlvbmNoYW5nZVwiLCBmdW5jdGlvbigpIHtcbiAgaWYoY3VycmVudE1vZGUgPT0gTU9ERV9DT1BZKXtcbiAgICBsZXQgc2VsZWN0ZWRUZXh0ID0gd2luZG93LmdldFNlbGVjdGlvbigpO1xuICAgIGNvbnNvbGUubG9nKFwiU2VsZWN0ZWQgVGV4dDogXCIgKyBzZWxlY3RlZFRleHQudG9TdHJpbmcoKSk7XG4gICAgc2VsZWN0aW9uID0gc2VsZWN0ZWRUZXh0LnRvU3RyaW5nKCk7XG4gIH1cbn0pO1xuXG5jb25zdCAkdHJhaW5pbmdCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjdHJhaW5pbmdCdXR0b24nKTtcbiR0cmFpbmluZ0J1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgdHJhaW5pbmdNb2RlID0gIXRyYWluaW5nTW9kZTtcbiAgaWYgKHRyYWluaW5nTW9kZSkge1xuICAgICR0cmFpbmluZ0J1dHRvbi5pbm5lckhUTUwgPSBcIkFjdGl2YXRlIFRlc3RpbmdcIjtcbiAgICAkYm94SGVhZGVyLmlubmVySFRNTCA9IFwiVFJBSU5JTkcgTU9ERVwiO1xuICB9IGVsc2Uge1xuICAgIG15UmVjb2duaXplci5maXQoZGF0YXNldCk7XG4gICAgJHRyYWluaW5nQnV0dG9uLmlubmVySFRNTCA9IFwiQWN0aXZhdGUgVHJhaW5pbmdcIjtcbiAgICAkYm94SGVhZGVyLmlubmVySFRNTCA9IFwiVEVTVElORyBNT0RFXCI7XG4gIH1cbn0pO1xuIiwiLyoqXG4gKiBEYXRhc2V0IENsYXNzXG4gKi8gXG5cbmNsYXNzIERhdGFzZXQge1xuXG4gIGNvbnN0cnVjdG9yICgpIHtcbiAgICB0aGlzLmdlc3R1cmUgPSBbXVxuICAgIHRoaXMuYWxsR2VzdHVyZXMgPSBbXTtcbiAgICB0aGlzLmFsbExhYmVscyA9IFtdO1xuICB9XG5cbiAgYWRkR2VzdHVyZVdpdGhMYWJlbChnZXN0dXJlLCBsYWJlbCkge1xuICAgIHRoaXMuYWxsR2VzdHVyZXMucHVzaChnZXN0dXJlKTtcbiAgICB0aGlzLmFsbExhYmVscy5wdXNoKGxhYmVsKTtcbiAgfVxuXG4gIGdldE51bUdlc3R1cmVzKCkge1xuICAgIHJldHVybiB0aGlzLmFsbEdlc3R1cmVzLmxlbmd0aDtcbiAgfVxuXG4gIGdldEN1cnJlbnRHZXN0dXJlKCkge1xuICAgIHJldHVybiB0aGlzLmdlc3R1cmU7XG4gIH1cblxuICBnZXRHZXN0dXJlcygpIHtcbiAgICByZXR1cm4gdGhpcy5hbGxHZXN0dXJlcztcbiAgfVxuXG4gIGdldExhYmVscygpIHtcbiAgICByZXR1cm4gdGhpcy5hbGxMYWJlbHM7XG4gIH1cblxuICBjbGVhcigpIHtcbiAgICB0aGlzLmFsbEdlc3R1cmVzID0gW107XG4gICAgdGhpcy5hbGxMYWJlbHMgPSBbXTtcbiAgICAvLyBjbGVhciBwbG90cyBpZiB0aGVyZSBpcyBhbnlcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRhdGFzZXQtZGl2XCIpLnJlbW92ZSgpO1xuICAgIGxldCBkYXRhc2V0RGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZGF0YXNldERpdi5pZCA9IFwiZGF0YXNldC1kaXZcIjtcbiAgICBsZXQgYm9keSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiYm9keVwiKVswXTtcbiAgICBib2R5LmFwcGVuZENoaWxkKGRhdGFzZXREaXYpO1xuICB9XG5cbiAgcGxvdERhdGFzZXRJbkhNTCgpIHtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRhdGFzZXQtZGl2XCIpLnJlbW92ZSgpO1xuICAgIGxldCBkYXRhc2V0RGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZGF0YXNldERpdi5pZCA9IFwiZGF0YXNldC1kaXZcIjtcbiAgICBkYXRhc2V0RGl2LmNsYXNzTmFtZSA9IFwidGh1bWJuYWlsXCI7XG5cbiAgICBsZXQgYm9keSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiYm9keVwiKVswXTtcbiAgICBib2R5LmFwcGVuZENoaWxkKGRhdGFzZXREaXYpO1xuXG4gICAgbGV0IGNsYXNzZXMgPSB0aGlzLmFsbExhYmVscy5maWx0ZXIoKHYsIGksIGEpID0+IGEuaW5kZXhPZih2KSA9PT0gaSk7XG5cbiAgICBmb3IgKGxldCBnID0gMDsgZyA8IHRoaXMuYWxsR2VzdHVyZXMubGVuZ3RoOyBnKyspIHtcbiAgICAvLyBmb3IgKGxldCBjID0gMDsgYyA8IGNsYXNzZXMubGVuZ3RoOyBjKyspIHtcbiAgICAgIC8vIGxldCBpbmRleCA9IHRoaXMuYWxsTGFiZWxzLmluZGV4T2YoY2xhc3Nlc1tjXSk7XG4gICAgICAvLyBjb25zdCBnZXN0dXJlXyA9IHRoaXMuYWxsR2VzdHVyZXNbaW5kZXhdXG4gICAgICBjb25zdCBnZXN0dXJlXyA9IHRoaXMuYWxsR2VzdHVyZXNbZ11cbiAgICAgIC8vIGRlY2xhcmUgdGhlIGNhbnZhIHdoZXJlIHRvIGRyYXcgYSB0aHVtYm5haWxcbiAgICAgIGxldCB0aHVtYkNudnMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgICAgIHRodW1iQ252cy53aWR0aCA9IDcwO1xuICAgICAgdGh1bWJDbnZzLmhlaWdodCA9IDcwO1xuICAgICAgdGh1bWJDbnZzLnN0eWxlLmJvcmRlciA9IFwiMXB4IHNvbGlkXCI7XG4gICAgICAvLyBnZXQgY29udGV4dCB0byBmaWxsIHdpdGggYmtnIGNvbG9yIGFuZCBpbWFnZVxuICAgICAgbGV0IGN0eCA9IHRodW1iQ252cy5nZXRDb250ZXh0KCcyZCcpO1xuICAgICAgY3R4LmZpbGxTdHlsZSA9IFwid2hpdGVcIjtcbiAgICAgIGN0eC5maWxsUmVjdCgwLCAwLCB0aHVtYkNudnMud2lkdGgsIHRodW1iQ252cy5oZWlnaHQpO1xuICAgICAgZm9yIChsZXQgbiA9IDA7IG4gPCBnZXN0dXJlXy5sZW5ndGg7IG4rKykge1xuICAgICAgICBpZiAobiA9PSAwKSAge1xuICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgICBjdHguZmlsbFN0eWxlID0gXCJvcmFuZ2VcIjtcbiAgICAgICAgICBjb25zdCB4ID0gZ2VzdHVyZV9bbl1bMF0gKiA3MDtcbiAgICAgICAgICBjb25zdCB5ID0gZ2VzdHVyZV9bbl1bMV0gKiA3MDtcbiAgICAgICAgICBjdHguYXJjKHgsIHksIDUsIDAsIE1hdGguUEkgKiAyLCB0cnVlKTtcbiAgICAgICAgICBjdHguZmlsbCgpO1xuICAgICAgICAgIGN0eC5jbG9zZVBhdGgoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zdCBjdXJYID0gZ2VzdHVyZV9bbl1bMF0gKiA3MDtcbiAgICAgICAgICBjb25zdCBjdXJZID0gZ2VzdHVyZV9bbl1bMV0gKiA3MDtcbiAgICAgICAgICBjb25zdCBwcmV2WCA9IGdlc3R1cmVfW24tMV1bMF0gKiA3MDtcbiAgICAgICAgICBjb25zdCBwcmV2WSA9IGdlc3R1cmVfW24tMV1bMV0gKiA3MDtcbiAgICAgICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICAgICAgY3R4Lm1vdmVUbyhwcmV2WCwgcHJldlkpO1xuICAgICAgICAgIGN0eC5saW5lVG8oY3VyWCwgY3VyWSk7XG4gICAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gXCJvcmFuZ2VcIjtcbiAgICAgICAgICBjdHgubGluZVdpZHRoID0gMjtcbiAgICAgICAgICBjdHguc3Ryb2tlKCk7XG4gICAgICAgICAgY3R4LmNsb3NlUGF0aCgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBkYXRhc2V0RGl2LmFwcGVuZENoaWxkKHRodW1iQ252cyk7XG4gICAgICBsZXQgdGV4dFNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICB0ZXh0U3Bhbi5pbm5lckhUTUwgKz0gU3RyaW5nKHRoaXMuYWxsTGFiZWxzW2ddKTtcbiAgICAgIHRleHRTcGFuLmNsYXNzTmFtZSA9IFwidGh1bWJMYWJlbFwiXG4gICAgICBkYXRhc2V0RGl2LmFwcGVuZENoaWxkKHRleHRTcGFuKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgRGF0YXNldDtcbiIsIi8vIERyYXdpbmcgZnVuY3Rpb25zIGluIGNhbnZhc1xubGV0IGluaXREcmF3aW5nUHQgPSBmYWxzZTtcbmxldCBwcmV2TW91c2VYID0gMDtcbmxldCBjdXJyTW91c2VYID0gMDtcbmxldCBwcmV2TW91c2VZID0gMDtcbmxldCBjdXJyTW91c2VZID0gMDtcbmxldCBsaW5lV2lkdGggPSAzO1xubGV0IGNvbG9yID0gXCJvcmFuZ2VcIjtcblxuXG5mdW5jdGlvbiBkcmF3R2VzdHVyZShjYW52YXMsIHJlcywgY29vcmRpbmF0ZXMpIHtcbiAgbGV0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XG4gIGlmIChyZXMgPT0gJ2Rvd24nKSB7XG4gICAgLy8gY2xlYXIgY2FudmFzXG4gICAgY3R4LmNsZWFyUmVjdCgwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpO1xuICAgIHByZXZNb3VzZVggPSBjdXJyTW91c2VYO1xuICAgIHByZXZNb3VzZVkgPSBjdXJyTW91c2VZO1xuICAgIGN1cnJNb3VzZVggPSBjb29yZGluYXRlc1swXSAqIGNhbnZhcy53aWR0aDtcbiAgICBjdXJyTW91c2VZID0gY29vcmRpbmF0ZXNbMV0gKiBjYW52YXMuaGVpZ2h0O1xuICAgIGluaXREcmF3aW5nUHQgPSB0cnVlO1xuICAgIGlmIChpbml0RHJhd2luZ1B0KSB7XG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9IGNvbG9yO1xuICAgICAgICBjdHguYXJjKGN1cnJNb3VzZVgsIGN1cnJNb3VzZVksIDUsIDAsIE1hdGguUEkgKiAyLCB0cnVlKTtcbiAgICAgICAgY3R4LmZpbGwoKTtcbiAgICAgICAgY3R4LmNsb3NlUGF0aCgpO1xuICAgICAgICBpbml0RHJhd2luZ1B0ID0gZmFsc2U7XG4gICAgfVxuICB9XG4gIGlmIChyZXMgPT0gJ21vdmUnKSB7XG4gICAgcHJldk1vdXNlWCA9IGN1cnJNb3VzZVg7XG4gICAgcHJldk1vdXNlWSA9IGN1cnJNb3VzZVk7XG4gICAgY3Vyck1vdXNlWCA9IGNvb3JkaW5hdGVzWzBdICogY2FudmFzLndpZHRoO1xuICAgIGN1cnJNb3VzZVkgPSBjb29yZGluYXRlc1sxXSAqIGNhbnZhcy5oZWlnaHQ7XG4gICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgIGN0eC5tb3ZlVG8ocHJldk1vdXNlWCwgcHJldk1vdXNlWSk7XG4gICAgY3R4LmxpbmVUbyhjdXJyTW91c2VYLCBjdXJyTW91c2VZKTtcbiAgICBjdHguc3Ryb2tlU3R5bGUgPSBjb2xvcjtcbiAgICBjdHgubGluZVdpZHRoID0gbGluZVdpZHRoO1xuICAgIGN0eC5zdHJva2UoKTtcbiAgICBjdHguY2xvc2VQYXRoKCk7XG4gIH1cbn1cblxuXG5mdW5jdGlvbiBhZGRHZXN0dXJlVGh1bWJuYWlsKGNhbnZhcywgZ2VzdHVyZV9pZCkge1xuICAgIC8vIGRlY2xhcmUgdGhlIGNhbnZhIHdoZXJlIHRvIGRyYXcgYSB0aHVtYm5haWxcbiAgICBsZXQgdGh1bWJDbnZzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgdGh1bWJDbnZzLndpZHRoID0gNzA7XG4gICAgdGh1bWJDbnZzLmhlaWdodCA9IDcwO1xuICAgIHRodW1iQ252cy5zdHlsZS5ib3JkZXIgPSBcIjFweCBzb2xpZFwiO1xuICAgIC8vIGdldCBjb250ZXh0IHRvIGZpbGwgd2l0aCBia2cgY29sb3IgYW5kIGltYWdlXG4gICAgbGV0IGN0eCA9IHRodW1iQ252cy5nZXRDb250ZXh0KCcyZCcpO1xuICAgIGN0eC5maWxsU3R5bGUgPSBcIndoaXRlXCI7XG4gICAgY3R4LmZpbGxSZWN0KDAsIDAsIHRodW1iQ252cy53aWR0aCwgdGh1bWJDbnZzLmhlaWdodCk7XG4gICAgY3R4LmRyYXdJbWFnZShjYW52YXMsIDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCwgMCwgMCwgdGh1bWJDbnZzLndpZHRoLCB0aHVtYkNudnMuaGVpZ2h0KTtcbiAgICAvLyBhZGQgdG8gdGhlIGJvZHkgZG9jdW1lbnRcbiAgICB2YXIgYm9keSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiYm9keVwiKVswXTtcbiAgICBib2R5LmFwcGVuZENoaWxkKHRodW1iQ252cyk7XG59XG5cblxuZnVuY3Rpb24gZ2V0TW91c2VYWWluQ2FudmFzKGNhbnZhcywgZSkge1xuICBjb25zdCB7IHRvcCwgbGVmdCwgd2lkdGgsIGhlaWdodCB9ID0gY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICBjb25zdCBjbGllbnRYID0gKGUucGFnZVggLSBsZWZ0KSAvIHdpZHRoO1xuICBjb25zdCBjbGllbnRZID0gKGUucGFnZVkgLSB0b3ApIC8gaGVpZ2h0O1xuICByZXR1cm4gW2NsaWVudFgsIGNsaWVudFldXG59XG5cblxuZnVuY3Rpb24gYWRkQm94VG9Cb2R5KHdpZHRoLCBoZWlnaHQsIG5hbWUsIGJveHRpdGxlKSB7XG4gIC8vIGNyZWF0ZSBvdXRlciBESVZcbiAgdmFyIGlEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgaURpdi5pZCA9ICdibG9jay0nK1N0cmluZyhNYXRoLnJhbmRvbSgpICogMTAwMDApO1xuICBpRGl2LmNsYXNzTmFtZSA9ICdib3gnO1xuICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYm9keScpWzBdLmFwcGVuZENoaWxkKGlEaXYpO1xuICAvLyBjcmVhdGUgY2FudmFzXG4gIGxldCBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgY2FudmFzLndpZHRoID0gd2lkdGg7XG4gIGNhbnZhcy5oZWlnaHQgPSBoZWlnaHQ7XG4gIGNhbnZhcy5zdHlsZS5ib3JkZXIgPSBcIjBweFwiO1xuICBjYW52YXMuaWQgPSBuYW1lO1xuICBsZXQgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gIGN0eC5maWxsU3R5bGUgPSBcIndoaXRlXCI7XG4gIGN0eC5maWxsUmVjdCgwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpO1xuICBsZXQgZGl2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaURpdi5pZCk7XG4gIGRpdi5hcHBlbmRDaGlsZChjYW52YXMpO1xuICAvLyBjcmVhdGUgZGl2IGZvciB0aXRsZVxuICBsZXQgdGl0bGVEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgdGl0bGVEaXYuY2xhc3NOYW1lID0gJ2JveHRpdGxlJztcbiAgdGl0bGVEaXYuaW5uZXJIVE1MICs9IGJveHRpdGxlO1xuICBkaXYuYXBwZW5kQ2hpbGQodGl0bGVEaXYpO1xufVxuXG5cbmV4cG9ydCB7IGFkZEJveFRvQm9keSwgZHJhd0dlc3R1cmUsIGFkZEdlc3R1cmVUaHVtYm5haWwsIGdldE1vdXNlWFlpbkNhbnZhcyB9O1xuIiwiLyoqXG4gKiBSZWNvbmdpemVyIGNsYXNzXG4gKiBTaW1wbGUgdGVtcGxhdGUtYmFzZWQgcmVjb2duaXplclxuICovXG5cbmltcG9ydCAqIGFzIHV0aWxzIGZyb20gJy4vdXRpbHMnXG5cblxuY2xhc3MgUmVjb2duaXplciB7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy50cmFpbmluZ0RhdGEgPSBbXTtcbiAgICB0aGlzLnRyYWluaW5nTGFiZWxzID0gW107XG4gIH1cblxuXG4gIGZpdChkYXRhc2V0KSB7XG4gICAgdGhpcy50cmFpbmluZ0RhdGEgPSBkYXRhc2V0LmdldEdlc3R1cmVzKCk7XG4gICAgdGhpcy50cmFpbmluZ0xhYmVscyA9IGRhdGFzZXQuZ2V0TGFiZWxzKCk7XG4gIH1cblxuICBwcmVkaWN0KGdlc3R1cmUpIHtcbiAgICBsZXQgbWluRGlzdGFuY2UgPSBJbmZpbml0eTtcbiAgICBsZXQgbWluSW5kZXggPSAtMTtcblxuICAgIC8vIFRPRE8gVHJhbnNsYXRlIFN0YXJ0aW5nIHBvaW50IG9mIGdlc3R1cmVzXG5cbiAgICBmb3IgKGxldCBpPTA7IGkgPCB0aGlzLnRyYWluaW5nRGF0YS5sZW5ndGg7IGkrKykge1xuXG4gICAgICBjb25zdCB0ZW1wbGF0ZSA9IHRoaXMudHJhaW5pbmdEYXRhW2ldO1xuICAgICAgbGV0IGRpc3QgPSAwLjA7XG4gICAgICBmb3IgKGxldCBrPTA7IGsgPCBNYXRoLm1pbih0ZW1wbGF0ZS5sZW5ndGgsIGdlc3R1cmUubGVuZ3RoKTsgaysrKXtcbiAgICAgICAgICBkaXN0ID0gZGlzdCArIHV0aWxzLmRpc3RhbmNlKHRlbXBsYXRlW2tdLCBnZXN0dXJlW2tdKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGRpc3QgPCBtaW5EaXN0YW5jZSl7XG4gICAgICAgIG1pbkRpc3RhbmNlID0gZGlzdDtcbiAgICAgICAgbWluSW5kZXggPSBpO1xuICAgICAgfVxuXG4gICAgfVxuICAgIHJldHVybiB0aGlzLnRyYWluaW5nTGFiZWxzW21pbkluZGV4XTtcblxuICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgUmVjb2duaXplcjtcbiIsIlxuLy8vIFwiUFJJVkFURVwiIEZVTkNUSU9OU1xuXG5mdW5jdGlvbiBwYXRoTGVuZ3RoKHBvaW50cylcbntcbiAgICB2YXIgZCA9IDAuMDtcbiAgICBmb3IgKHZhciBpID0gMTsgaSA8IHBvaW50cy5sZW5ndGg7IGkrKylcbiAgICAgICAgZCArPSBkaXN0YW5jZShwb2ludHNbaSAtIDFdLCBwb2ludHNbaV0pO1xuICAgIHJldHVybiBkO1xufVxuXG5mdW5jdGlvbiBib3VuZGluZ0JveChwb2ludHMpXG57XG4gICAgbGV0IG1pblggPSArSW5maW5pdHksIG1heFggPSAtSW5maW5pdHksIG1pblkgPSArSW5maW5pdHksIG1heFkgPSAtSW5maW5pdHk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwb2ludHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgbWluWCA9IE1hdGgubWluKG1pblgsIHBvaW50c1tpXVswXSk7XG4gICAgICAgIG1pblkgPSBNYXRoLm1pbihtaW5ZLCBwb2ludHNbaV1bMV0pO1xuICAgICAgICBtYXhYID0gTWF0aC5tYXgobWF4WCwgcG9pbnRzW2ldWzBdKTtcbiAgICAgICAgbWF4WSA9IE1hdGgubWF4KG1heFksIHBvaW50c1tpXVsxXSk7XG4gICAgfVxuICAgIHJldHVybiBbbWF4WCAtIG1pblgsIG1heFkgLSBtaW5ZXTtcbn1cblxuZnVuY3Rpb24gY2VudHJvaWQocG9pbnRzKVxue1xuICAgIHZhciB4ID0gMC4wLCB5ID0gMC4wO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcG9pbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHggKz0gcG9pbnRzW2ldWzBdO1xuICAgICAgICB5ICs9IHBvaW50c1tpXVsxXTtcbiAgICB9XG4gICAgeCAvPSBwb2ludHMubGVuZ3RoO1xuICAgIHkgLz0gcG9pbnRzLmxlbmd0aDtcbiAgICByZXR1cm4gW3gsIHldO1xufVxuZnVuY3Rpb24gaW5kaWNhdGl2ZUFuZ2xlKHBvaW50cylcbntcbiAgICB2YXIgYyA9IGNlbnRyb2lkKHBvaW50cyk7XG4gICAgcmV0dXJuIE1hdGguYXRhbjIoY1sxXSAtIHBvaW50c1swXVsxXSwgY1swXSAtIHBvaW50c1swXVswXSk7XG59XG5cblxuLy8vIFwiUFVCTElDXCIgRlVOQ1RJT05TXG5cbmZ1bmN0aW9uIGRpc3RhbmNlKHZlY3RvcjEsIHZlY3RvcjIpIHtcbiAgICBsZXQgZGlzdCA9IDAuMDtcbiAgICBmb3IgKGxldCBkID0wOyBkIDwgdmVjdG9yMS5sZW5ndGg7IGQrKykge1xuICAgICAgICBkaXN0ICs9IE1hdGgucG93KHZlY3RvcjFbZF0gLSB2ZWN0b3IyW2RdLCAyKTtcbiAgICB9XG4gICAgcmV0dXJuIE1hdGguc3FydChkaXN0KTtcbn1cblxuZnVuY3Rpb24gcmVzYW1wbGUoZGF0YV8sIG4pXG57XG4gICAgbGV0IGRhdGEgPSBkYXRhXztcbiAgICBsZXQgSSA9IHBhdGhMZW5ndGgoZGF0YSkgLyAobiAtIDEpOyAvLyBpbnRlcnZhbCBsZW5ndGhcbiAgICBsZXQgRCA9IDAuMDtcbiAgICBsZXQgbmV3cG9pbnRzID0gW107XG4gICAgbmV3cG9pbnRzLnB1c2goZGF0YVswXSlcbiAgICBmb3IgKGxldCBpID0gMTsgaSA8IGRhdGEubGVuZ3RoOyBpKyspXG4gICAge1xuICAgICAgICBsZXQgZCA9IGRpc3RhbmNlKGRhdGFbaSAtIDFdLCBkYXRhW2ldKTtcbiAgICAgICAgaWYgKChEICsgZCkgPj0gSSlcbiAgICAgICAge1xuICAgICAgICAgICAgbGV0IHF4ID0gZGF0YVtpIC0gMV1bMF0gKyAoKEkgLSBEKSAvIGQpICogKGRhdGFbaV1bMF0gLSBkYXRhW2kgLSAxXVswXSk7XG4gICAgICAgICAgICBsZXQgcXkgPSBkYXRhW2kgLSAxXVsxXSArICgoSSAtIEQpIC8gZCkgKiAoZGF0YVtpXVsxXSAtIGRhdGFbaSAtIDFdWzFdKTtcbiAgICAgICAgICAgIGxldCBxID0gW3F4LCBxeV07XG4gICAgICAgICAgICBuZXdwb2ludHMucHVzaChbcXgsIHF5XSk7XG4gICAgICAgICAgICBkYXRhLnNwbGljZShpLCAwLCBxKTsgLy8gaW5zZXJ0ICdxJyBhdCBwb3NpdGlvbiBpIGluIHBvaW50cyBzLnQuICdxJyB3aWxsIGJlIHRoZSBuZXh0IGlcbiAgICAgICAgICAgIEQgPSAwLjA7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBEICs9IGQ7XG4gICAgfVxuICAgIGlmIChuZXdwb2ludHMubGVuZ3RoID09IG4gLSAxKSB7XG4gICAgICAgIG5ld3BvaW50cy5wdXNoKFtkYXRhW2RhdGEubGVuZ3RoIC0gMV1bMF0sIGRhdGFbZGF0YS5sZW5ndGggLSAxXVsxXV0pO1xuICAgIH1cbiAgICByZXR1cm4gbmV3cG9pbnRzO1xufVxuXG5cbmZ1bmN0aW9uIHJvdGF0ZShwb2ludHMpIC8vIHJvdGF0ZXMgcG9pbnRzIGFyb3VuZCBjZW50cm9pZFxue1xuICAgIGxldCByYWRpYW5zID0gLSBpbmRpY2F0aXZlQW5nbGUocG9pbnRzKTtcbiAgICBsZXQgYyA9IGNlbnRyb2lkKHBvaW50cyk7XG4gICAgbGV0IGNvcyA9IE1hdGguY29zKHJhZGlhbnMpO1xuICAgIGxldCBzaW4gPSBNYXRoLnNpbihyYWRpYW5zKTtcbiAgICBsZXQgbmV3cG9pbnRzID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwb2ludHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgbGV0IHF4ID0gKHBvaW50c1tpXVswXSAtIGNbMF0pICogY29zIC0gKHBvaW50c1tpXVsxXSAtIGNbMV0pICogc2luICsgY1swXVxuICAgICAgICBsZXQgcXkgPSAocG9pbnRzW2ldWzBdIC0gY1swXSkgKiBzaW4gKyAocG9pbnRzW2ldWzFdIC0gY1sxXSkgKiBjb3MgKyBjWzFdO1xuICAgICAgICBuZXdwb2ludHMucHVzaChbcXgsIHF5XSk7XG4gICAgfVxuICAgIHJldHVybiBuZXdwb2ludHM7XG59XG5cblxuZnVuY3Rpb24gc2NhbGUocG9pbnRzKSAvLyBub24tdW5pZm9ybSBzY2FsZTsgYXNzdW1lcyAyRCBnZXN0dXJlcyAoaS5lLiwgbm8gbGluZXMpXG57XG4gICAgbGV0IHNpemUgPSAwLjU7XG4gICAgbGV0IGJCb3ggPSBib3VuZGluZ0JveChwb2ludHMpO1xuICAgIGxldCBuZXdwb2ludHMgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBvaW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBsZXQgcXggPSBwb2ludHNbaV1bMF0gKiAoc2l6ZSAvIGJCb3hbMF0pO1xuICAgICAgICBsZXQgcXkgPSBwb2ludHNbaV1bMV0gKiAoc2l6ZSAvIGJCb3hbMV0pO1xuICAgICAgICBuZXdwb2ludHMucHVzaChbcXgsIHF5XSk7XG4gICAgfVxuICAgIHJldHVybiBuZXdwb2ludHM7XG59XG5cbmZ1bmN0aW9uIHRyYW5zbGF0ZVRvT3JpZ2luKHBvaW50cykgLy8gdHJhbnNsYXRlcyBwb2ludHMnIGNlbnRyb2lkXG57XG4gICAgY29uc3Qgb3JpZyA9IFswLjUsIDAuNV07XG4gICAgY29uc3QgYyA9IGNlbnRyb2lkKHBvaW50cyk7XG4gICAgbGV0IG5ld3BvaW50cyA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcG9pbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGxldCBxeCA9IHBvaW50c1tpXVswXSArIG9yaWdbMF0gLSBjWzBdO1xuICAgICAgICBsZXQgcXkgPSBwb2ludHNbaV1bMV0gKyBvcmlnWzFdIC0gY1sxXTtcbiAgICAgICAgbmV3cG9pbnRzLnB1c2goW3F4LCBxeV0pO1xuICAgIH1cbiAgICByZXR1cm4gbmV3cG9pbnRzO1xufVxuXG5cbmV4cG9ydCB7IGRpc3RhbmNlLCByZXNhbXBsZSwgcm90YXRlLCBzY2FsZSwgdHJhbnNsYXRlVG9PcmlnaW4gfTtcbiIsIm1vZHVsZS5leHBvcnRzID0geyBcImRlZmF1bHRcIjogcmVxdWlyZShcImNvcmUtanMvbGlicmFyeS9mbi9vYmplY3QvZGVmaW5lLXByb3BlcnR5XCIpLCBfX2VzTW9kdWxlOiB0cnVlIH07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbmV4cG9ydHMuZGVmYXVsdCA9IGZ1bmN0aW9uIChpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHtcbiAgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG52YXIgX2RlZmluZVByb3BlcnR5ID0gcmVxdWlyZShcIi4uL2NvcmUtanMvb2JqZWN0L2RlZmluZS1wcm9wZXJ0eVwiKTtcblxudmFyIF9kZWZpbmVQcm9wZXJ0eTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9kZWZpbmVQcm9wZXJ0eSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbmV4cG9ydHMuZGVmYXVsdCA9IGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTtcbiAgICAgIGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTtcbiAgICAgIGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTtcbiAgICAgIGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7XG4gICAgICAoMCwgX2RlZmluZVByb3BlcnR5Mi5kZWZhdWx0KSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykge1xuICAgIGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7XG4gICAgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7XG4gICAgcmV0dXJuIENvbnN0cnVjdG9yO1xuICB9O1xufSgpOyIsInJlcXVpcmUoJy4uLy4uL21vZHVsZXMvZXM2Lm9iamVjdC5kZWZpbmUtcHJvcGVydHknKTtcbnZhciAkT2JqZWN0ID0gcmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9fY29yZScpLk9iamVjdDtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZGVmaW5lUHJvcGVydHkoaXQsIGtleSwgZGVzYykge1xuICByZXR1cm4gJE9iamVjdC5kZWZpbmVQcm9wZXJ0eShpdCwga2V5LCBkZXNjKTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICBpZiAodHlwZW9mIGl0ICE9ICdmdW5jdGlvbicpIHRocm93IFR5cGVFcnJvcihpdCArICcgaXMgbm90IGEgZnVuY3Rpb24hJyk7XG4gIHJldHVybiBpdDtcbn07XG4iLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIGlmICghaXNPYmplY3QoaXQpKSB0aHJvdyBUeXBlRXJyb3IoaXQgKyAnIGlzIG5vdCBhbiBvYmplY3QhJyk7XG4gIHJldHVybiBpdDtcbn07XG4iLCJ2YXIgY29yZSA9IG1vZHVsZS5leHBvcnRzID0geyB2ZXJzaW9uOiAnMi41LjMnIH07XG5pZiAodHlwZW9mIF9fZSA9PSAnbnVtYmVyJykgX19lID0gY29yZTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bmRlZlxuIiwiLy8gb3B0aW9uYWwgLyBzaW1wbGUgY29udGV4dCBiaW5kaW5nXG52YXIgYUZ1bmN0aW9uID0gcmVxdWlyZSgnLi9fYS1mdW5jdGlvbicpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZm4sIHRoYXQsIGxlbmd0aCkge1xuICBhRnVuY3Rpb24oZm4pO1xuICBpZiAodGhhdCA9PT0gdW5kZWZpbmVkKSByZXR1cm4gZm47XG4gIHN3aXRjaCAobGVuZ3RoKSB7XG4gICAgY2FzZSAxOiByZXR1cm4gZnVuY3Rpb24gKGEpIHtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEpO1xuICAgIH07XG4gICAgY2FzZSAyOiByZXR1cm4gZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEsIGIpO1xuICAgIH07XG4gICAgY2FzZSAzOiByZXR1cm4gZnVuY3Rpb24gKGEsIGIsIGMpIHtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEsIGIsIGMpO1xuICAgIH07XG4gIH1cbiAgcmV0dXJuIGZ1bmN0aW9uICgvKiAuLi5hcmdzICovKSB7XG4gICAgcmV0dXJuIGZuLmFwcGx5KHRoYXQsIGFyZ3VtZW50cyk7XG4gIH07XG59O1xuIiwiLy8gVGhhbmsncyBJRTggZm9yIGhpcyBmdW5ueSBkZWZpbmVQcm9wZXJ0eVxubW9kdWxlLmV4cG9ydHMgPSAhcmVxdWlyZSgnLi9fZmFpbHMnKShmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHkoe30sICdhJywgeyBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIDc7IH0gfSkuYSAhPSA3O1xufSk7XG4iLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbnZhciBkb2N1bWVudCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpLmRvY3VtZW50O1xuLy8gdHlwZW9mIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQgaXMgJ29iamVjdCcgaW4gb2xkIElFXG52YXIgaXMgPSBpc09iamVjdChkb2N1bWVudCkgJiYgaXNPYmplY3QoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gaXMgPyBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGl0KSA6IHt9O1xufTtcbiIsInZhciBnbG9iYWwgPSByZXF1aXJlKCcuL19nbG9iYWwnKTtcbnZhciBjb3JlID0gcmVxdWlyZSgnLi9fY29yZScpO1xudmFyIGN0eCA9IHJlcXVpcmUoJy4vX2N0eCcpO1xudmFyIGhpZGUgPSByZXF1aXJlKCcuL19oaWRlJyk7XG52YXIgUFJPVE9UWVBFID0gJ3Byb3RvdHlwZSc7XG5cbnZhciAkZXhwb3J0ID0gZnVuY3Rpb24gKHR5cGUsIG5hbWUsIHNvdXJjZSkge1xuICB2YXIgSVNfRk9SQ0VEID0gdHlwZSAmICRleHBvcnQuRjtcbiAgdmFyIElTX0dMT0JBTCA9IHR5cGUgJiAkZXhwb3J0Lkc7XG4gIHZhciBJU19TVEFUSUMgPSB0eXBlICYgJGV4cG9ydC5TO1xuICB2YXIgSVNfUFJPVE8gPSB0eXBlICYgJGV4cG9ydC5QO1xuICB2YXIgSVNfQklORCA9IHR5cGUgJiAkZXhwb3J0LkI7XG4gIHZhciBJU19XUkFQID0gdHlwZSAmICRleHBvcnQuVztcbiAgdmFyIGV4cG9ydHMgPSBJU19HTE9CQUwgPyBjb3JlIDogY29yZVtuYW1lXSB8fCAoY29yZVtuYW1lXSA9IHt9KTtcbiAgdmFyIGV4cFByb3RvID0gZXhwb3J0c1tQUk9UT1RZUEVdO1xuICB2YXIgdGFyZ2V0ID0gSVNfR0xPQkFMID8gZ2xvYmFsIDogSVNfU1RBVElDID8gZ2xvYmFsW25hbWVdIDogKGdsb2JhbFtuYW1lXSB8fCB7fSlbUFJPVE9UWVBFXTtcbiAgdmFyIGtleSwgb3duLCBvdXQ7XG4gIGlmIChJU19HTE9CQUwpIHNvdXJjZSA9IG5hbWU7XG4gIGZvciAoa2V5IGluIHNvdXJjZSkge1xuICAgIC8vIGNvbnRhaW5zIGluIG5hdGl2ZVxuICAgIG93biA9ICFJU19GT1JDRUQgJiYgdGFyZ2V0ICYmIHRhcmdldFtrZXldICE9PSB1bmRlZmluZWQ7XG4gICAgaWYgKG93biAmJiBrZXkgaW4gZXhwb3J0cykgY29udGludWU7XG4gICAgLy8gZXhwb3J0IG5hdGl2ZSBvciBwYXNzZWRcbiAgICBvdXQgPSBvd24gPyB0YXJnZXRba2V5XSA6IHNvdXJjZVtrZXldO1xuICAgIC8vIHByZXZlbnQgZ2xvYmFsIHBvbGx1dGlvbiBmb3IgbmFtZXNwYWNlc1xuICAgIGV4cG9ydHNba2V5XSA9IElTX0dMT0JBTCAmJiB0eXBlb2YgdGFyZ2V0W2tleV0gIT0gJ2Z1bmN0aW9uJyA/IHNvdXJjZVtrZXldXG4gICAgLy8gYmluZCB0aW1lcnMgdG8gZ2xvYmFsIGZvciBjYWxsIGZyb20gZXhwb3J0IGNvbnRleHRcbiAgICA6IElTX0JJTkQgJiYgb3duID8gY3R4KG91dCwgZ2xvYmFsKVxuICAgIC8vIHdyYXAgZ2xvYmFsIGNvbnN0cnVjdG9ycyBmb3IgcHJldmVudCBjaGFuZ2UgdGhlbSBpbiBsaWJyYXJ5XG4gICAgOiBJU19XUkFQICYmIHRhcmdldFtrZXldID09IG91dCA/IChmdW5jdGlvbiAoQykge1xuICAgICAgdmFyIEYgPSBmdW5jdGlvbiAoYSwgYiwgYykge1xuICAgICAgICBpZiAodGhpcyBpbnN0YW5jZW9mIEMpIHtcbiAgICAgICAgICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGNhc2UgMDogcmV0dXJuIG5ldyBDKCk7XG4gICAgICAgICAgICBjYXNlIDE6IHJldHVybiBuZXcgQyhhKTtcbiAgICAgICAgICAgIGNhc2UgMjogcmV0dXJuIG5ldyBDKGEsIGIpO1xuICAgICAgICAgIH0gcmV0dXJuIG5ldyBDKGEsIGIsIGMpO1xuICAgICAgICB9IHJldHVybiBDLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICB9O1xuICAgICAgRltQUk9UT1RZUEVdID0gQ1tQUk9UT1RZUEVdO1xuICAgICAgcmV0dXJuIEY7XG4gICAgLy8gbWFrZSBzdGF0aWMgdmVyc2lvbnMgZm9yIHByb3RvdHlwZSBtZXRob2RzXG4gICAgfSkob3V0KSA6IElTX1BST1RPICYmIHR5cGVvZiBvdXQgPT0gJ2Z1bmN0aW9uJyA/IGN0eChGdW5jdGlvbi5jYWxsLCBvdXQpIDogb3V0O1xuICAgIC8vIGV4cG9ydCBwcm90byBtZXRob2RzIHRvIGNvcmUuJUNPTlNUUlVDVE9SJS5tZXRob2RzLiVOQU1FJVxuICAgIGlmIChJU19QUk9UTykge1xuICAgICAgKGV4cG9ydHMudmlydHVhbCB8fCAoZXhwb3J0cy52aXJ0dWFsID0ge30pKVtrZXldID0gb3V0O1xuICAgICAgLy8gZXhwb3J0IHByb3RvIG1ldGhvZHMgdG8gY29yZS4lQ09OU1RSVUNUT1IlLnByb3RvdHlwZS4lTkFNRSVcbiAgICAgIGlmICh0eXBlICYgJGV4cG9ydC5SICYmIGV4cFByb3RvICYmICFleHBQcm90b1trZXldKSBoaWRlKGV4cFByb3RvLCBrZXksIG91dCk7XG4gICAgfVxuICB9XG59O1xuLy8gdHlwZSBiaXRtYXBcbiRleHBvcnQuRiA9IDE7ICAgLy8gZm9yY2VkXG4kZXhwb3J0LkcgPSAyOyAgIC8vIGdsb2JhbFxuJGV4cG9ydC5TID0gNDsgICAvLyBzdGF0aWNcbiRleHBvcnQuUCA9IDg7ICAgLy8gcHJvdG9cbiRleHBvcnQuQiA9IDE2OyAgLy8gYmluZFxuJGV4cG9ydC5XID0gMzI7ICAvLyB3cmFwXG4kZXhwb3J0LlUgPSA2NDsgIC8vIHNhZmVcbiRleHBvcnQuUiA9IDEyODsgLy8gcmVhbCBwcm90byBtZXRob2QgZm9yIGBsaWJyYXJ5YFxubW9kdWxlLmV4cG9ydHMgPSAkZXhwb3J0O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZXhlYykge1xuICB0cnkge1xuICAgIHJldHVybiAhIWV4ZWMoKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG59O1xuIiwiLy8gaHR0cHM6Ly9naXRodWIuY29tL3psb2lyb2NrL2NvcmUtanMvaXNzdWVzLzg2I2lzc3VlY29tbWVudC0xMTU3NTkwMjhcbnZhciBnbG9iYWwgPSBtb2R1bGUuZXhwb3J0cyA9IHR5cGVvZiB3aW5kb3cgIT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93Lk1hdGggPT0gTWF0aFxuICA/IHdpbmRvdyA6IHR5cGVvZiBzZWxmICE9ICd1bmRlZmluZWQnICYmIHNlbGYuTWF0aCA9PSBNYXRoID8gc2VsZlxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tbmV3LWZ1bmNcbiAgOiBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuaWYgKHR5cGVvZiBfX2cgPT0gJ251bWJlcicpIF9fZyA9IGdsb2JhbDsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bmRlZlxuIiwidmFyIGRQID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJyk7XG52YXIgY3JlYXRlRGVzYyA9IHJlcXVpcmUoJy4vX3Byb3BlcnR5LWRlc2MnKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSA/IGZ1bmN0aW9uIChvYmplY3QsIGtleSwgdmFsdWUpIHtcbiAgcmV0dXJuIGRQLmYob2JqZWN0LCBrZXksIGNyZWF0ZURlc2MoMSwgdmFsdWUpKTtcbn0gOiBmdW5jdGlvbiAob2JqZWN0LCBrZXksIHZhbHVlKSB7XG4gIG9iamVjdFtrZXldID0gdmFsdWU7XG4gIHJldHVybiBvYmplY3Q7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSAhcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSAmJiAhcmVxdWlyZSgnLi9fZmFpbHMnKShmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHkocmVxdWlyZSgnLi9fZG9tLWNyZWF0ZScpKCdkaXYnKSwgJ2EnLCB7IGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gNzsgfSB9KS5hICE9IDc7XG59KTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiB0eXBlb2YgaXQgPT09ICdvYmplY3QnID8gaXQgIT09IG51bGwgOiB0eXBlb2YgaXQgPT09ICdmdW5jdGlvbic7XG59O1xuIiwidmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG52YXIgSUU4X0RPTV9ERUZJTkUgPSByZXF1aXJlKCcuL19pZTgtZG9tLWRlZmluZScpO1xudmFyIHRvUHJpbWl0aXZlID0gcmVxdWlyZSgnLi9fdG8tcHJpbWl0aXZlJyk7XG52YXIgZFAgPSBPYmplY3QuZGVmaW5lUHJvcGVydHk7XG5cbmV4cG9ydHMuZiA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgPyBPYmplY3QuZGVmaW5lUHJvcGVydHkgOiBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0eShPLCBQLCBBdHRyaWJ1dGVzKSB7XG4gIGFuT2JqZWN0KE8pO1xuICBQID0gdG9QcmltaXRpdmUoUCwgdHJ1ZSk7XG4gIGFuT2JqZWN0KEF0dHJpYnV0ZXMpO1xuICBpZiAoSUU4X0RPTV9ERUZJTkUpIHRyeSB7XG4gICAgcmV0dXJuIGRQKE8sIFAsIEF0dHJpYnV0ZXMpO1xuICB9IGNhdGNoIChlKSB7IC8qIGVtcHR5ICovIH1cbiAgaWYgKCdnZXQnIGluIEF0dHJpYnV0ZXMgfHwgJ3NldCcgaW4gQXR0cmlidXRlcykgdGhyb3cgVHlwZUVycm9yKCdBY2Nlc3NvcnMgbm90IHN1cHBvcnRlZCEnKTtcbiAgaWYgKCd2YWx1ZScgaW4gQXR0cmlidXRlcykgT1tQXSA9IEF0dHJpYnV0ZXMudmFsdWU7XG4gIHJldHVybiBPO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGJpdG1hcCwgdmFsdWUpIHtcbiAgcmV0dXJuIHtcbiAgICBlbnVtZXJhYmxlOiAhKGJpdG1hcCAmIDEpLFxuICAgIGNvbmZpZ3VyYWJsZTogIShiaXRtYXAgJiAyKSxcbiAgICB3cml0YWJsZTogIShiaXRtYXAgJiA0KSxcbiAgICB2YWx1ZTogdmFsdWVcbiAgfTtcbn07XG4iLCIvLyA3LjEuMSBUb1ByaW1pdGl2ZShpbnB1dCBbLCBQcmVmZXJyZWRUeXBlXSlcbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xuLy8gaW5zdGVhZCBvZiB0aGUgRVM2IHNwZWMgdmVyc2lvbiwgd2UgZGlkbid0IGltcGxlbWVudCBAQHRvUHJpbWl0aXZlIGNhc2Vcbi8vIGFuZCB0aGUgc2Vjb25kIGFyZ3VtZW50IC0gZmxhZyAtIHByZWZlcnJlZCB0eXBlIGlzIGEgc3RyaW5nXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCwgUykge1xuICBpZiAoIWlzT2JqZWN0KGl0KSkgcmV0dXJuIGl0O1xuICB2YXIgZm4sIHZhbDtcbiAgaWYgKFMgJiYgdHlwZW9mIChmbiA9IGl0LnRvU3RyaW5nKSA9PSAnZnVuY3Rpb24nICYmICFpc09iamVjdCh2YWwgPSBmbi5jYWxsKGl0KSkpIHJldHVybiB2YWw7XG4gIGlmICh0eXBlb2YgKGZuID0gaXQudmFsdWVPZikgPT0gJ2Z1bmN0aW9uJyAmJiAhaXNPYmplY3QodmFsID0gZm4uY2FsbChpdCkpKSByZXR1cm4gdmFsO1xuICBpZiAoIVMgJiYgdHlwZW9mIChmbiA9IGl0LnRvU3RyaW5nKSA9PSAnZnVuY3Rpb24nICYmICFpc09iamVjdCh2YWwgPSBmbi5jYWxsKGl0KSkpIHJldHVybiB2YWw7XG4gIHRocm93IFR5cGVFcnJvcihcIkNhbid0IGNvbnZlcnQgb2JqZWN0IHRvIHByaW1pdGl2ZSB2YWx1ZVwiKTtcbn07XG4iLCJ2YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xuLy8gMTkuMS4yLjQgLyAxNS4yLjMuNiBPYmplY3QuZGVmaW5lUHJvcGVydHkoTywgUCwgQXR0cmlidXRlcylcbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogIXJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJyksICdPYmplY3QnLCB7IGRlZmluZVByb3BlcnR5OiByZXF1aXJlKCcuL19vYmplY3QtZHAnKS5mIH0pO1xuIl19
