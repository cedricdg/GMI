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

var dataset = new _dataset2.default();
var myRecognizer = new _recognizer2.default();

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

// start when mouse is down
$drawing.addEventListener('mousedown', mouseDown);

var mouseDown = function mouseDown(e) {
  draw.drawGesture($drawing, 'down', e);
  var coordinates = draw.getMouseXYinCanvas($drawing, e);
  currentGesture.push(coordinates);
  console.log(coordinates);
  letsDraw = true;
};

// start when mouse is down
$drawing.addEventListener('mousemove', mouseMove);

var mouseMove = function mouseMove(e) {
  if (letsDraw) {
    draw.drawGesture($drawing, 'move', e);
    var coordinates = draw.getMouseXYinCanvas($drawing, e);
    currentGesture.push(coordinates);
    //console.log(coordinates);
  }
};

// stop when mouse is up
$drawing.addEventListener('mouseup', mouseUp);

var mouseUp = function mouseUp(e) {

  letsDraw = false;

  currentGesture = utils.scale(currentGesture);
  currentGesture = utils.translateToOrigin(currentGesture);
  // scale

  if (trainingMode) {
    dataset.addGestureWithLabel(currentGesture, gestureID);
    dataset.plotDatasetInHML();
    gestureID++;
  } else {
    var predictedLabel = myRecognizer.predict(currentGesture);
    console.log(predictedLabel);
  }

  currentGesture = [];
};

var $trainingButton = document.querySelector('#trainingButton');
$trainingButton.addEventListener('click', function (e) {
  trainingMode = true;
});

var $testingButton = document.querySelector('#testingButton');
$testingButton.addEventListener('click', function (e) {
  myRecognizer.fit(dataset);
  trainingMode = false;
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

function drawGesture(canvas, res, e) {
  var ctx = canvas.getContext("2d");
  if (res == 'down') {
    // clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    prevMouseX = currMouseX;
    prevMouseY = currMouseY;
    currMouseX = e.clientX - canvas.offsetLeft;
    currMouseY = e.clientY - canvas.offsetTop;
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
    currMouseX = e.clientX - canvas.offsetLeft;
    currMouseY = e.clientY - canvas.offsetTop;
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
    var size = 1;
    var bBox = boundingBox(points);
    var newpoints = [];
    for (var i = 0; i < points.length; i++) {
        var qx = points[i][0] * (size / bBox[0]);
        var qy = points[i][1] * (size / bBox[1]);
        newpoints.push([qx, qy]);
        console.log([qx, qy]);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkaXN0L2luZGV4LmpzIiwiZGlzdC9saWIvZGF0YXNldC5qcyIsImRpc3QvbGliL2RyYXcuanMiLCJkaXN0L2xpYi9yZWNvZ25pemVyLmpzIiwiZGlzdC9saWIvdXRpbHMuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9jb3JlLWpzL29iamVjdC9kZWZpbmUtcHJvcGVydHkuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9oZWxwZXJzL2NsYXNzQ2FsbENoZWNrLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvaGVscGVycy9jcmVhdGVDbGFzcy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvZm4vb2JqZWN0L2RlZmluZS1wcm9wZXJ0eS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fYS1mdW5jdGlvbi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fYW4tb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19jb3JlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19jdHguanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2Rlc2NyaXB0b3JzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19kb20tY3JlYXRlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19leHBvcnQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2ZhaWxzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19nbG9iYWwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2hpZGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2llOC1kb20tZGVmaW5lLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19pcy1vYmplY3QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1kcC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fcHJvcGVydHktZGVzYy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fdG8tcHJpbWl0aXZlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5vYmplY3QuZGVmaW5lLXByb3BlcnR5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNDQTs7SUFBWSxJOztBQUNaOzs7O0FBQ0E7Ozs7QUFDQTs7SUFBWSxLOzs7Ozs7QUFFWixJQUFJLFdBQVcsS0FBZjtBQUNBLElBQUksaUJBQWlCLEVBQXJCO0FBQ0EsSUFBSSxZQUFZLENBQWhCO0FBQ0EsSUFBSSxlQUFlLElBQW5COztBQUVBLElBQU0sV0FBVyxTQUFTLGFBQVQsQ0FBdUIsVUFBdkIsQ0FBakI7O0FBRUEsSUFBSSxVQUFVLHVCQUFkO0FBQ0EsSUFBSSxlQUFlLDBCQUFuQjs7QUFFQTtBQUNBLFNBQVMsZ0JBQVQsQ0FBMEIsWUFBMUIsRUFBd0MsVUFBUyxDQUFULEVBQVk7QUFDaEQsSUFBRSxjQUFGO0FBQ0EsVUFBUSxHQUFSLENBQVksWUFBWjtBQUNBLFlBQVUsQ0FBVjtBQUNILENBSkQ7QUFLQTtBQUNBLFNBQVMsZ0JBQVQsQ0FBMEIsV0FBMUIsRUFBdUMsVUFBUyxDQUFULEVBQVk7QUFDL0MsSUFBRSxjQUFGO0FBQ0EsVUFBUSxHQUFSLENBQVksV0FBWjtBQUNBLFlBQVUsQ0FBVjtBQUNILENBSkQ7QUFLQTtBQUNBLFNBQVMsZ0JBQVQsQ0FBMEIsVUFBMUIsRUFBc0MsVUFBUyxDQUFULEVBQVk7QUFD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QTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcbmltcG9ydCAqIGFzIGRyYXcgZnJvbSAnLi9saWIvZHJhdydcbmltcG9ydCBEYXRhc2V0IGZyb20gJy4vbGliL2RhdGFzZXQnXG5pbXBvcnQgUmVjb2duaXplciBmcm9tICcuL2xpYi9yZWNvZ25pemVyJ1xuaW1wb3J0ICogYXMgdXRpbHMgZnJvbSAnLi9saWIvdXRpbHMnXG5cbmxldCBsZXRzRHJhdyA9IGZhbHNlO1xubGV0IGN1cnJlbnRHZXN0dXJlID0gW107XG5sZXQgZ2VzdHVyZUlEID0gMTtcbmxldCB0cmFpbmluZ01vZGUgPSB0cnVlO1xuXG5jb25zdCAkZHJhd2luZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNkcmF3Q2FuJyk7XG5cbmxldCBkYXRhc2V0ID0gbmV3IERhdGFzZXQoKTtcbmxldCBteVJlY29nbml6ZXIgPSBuZXcgUmVjb2duaXplcigpO1xuXG4vLyBzdGFydCB3aGVuIG1vdXNlIGlzIGRvd25cbiRkcmF3aW5nLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCBmdW5jdGlvbihlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgXHRjb25zb2xlLmxvZyhcInRvdWNoc3RhcnRcIik7XG4gICAgbW91c2VEb3duKGUpO1xufSk7XG4vLyBzdGFydCB3aGVuIG1vdXNlIGlzIGRvd25cbiRkcmF3aW5nLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIGZ1bmN0aW9uKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICBcdGNvbnNvbGUubG9nKFwidG91Y2htb3ZlXCIpO1xuICAgIG1vdXNlTW92ZShlKTtcbn0pO1xuLy8gc3RhcnQgd2hlbiBtb3VzZSBpcyBkb3duXG4kZHJhd2luZy5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIGZ1bmN0aW9uKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICBcdGNvbnNvbGUubG9nKFwidG91Y2hlbmRcIik7XG4gICAgbW91c2VVcChlKTtcbn0pO1xuXG4vLyBzdGFydCB3aGVuIG1vdXNlIGlzIGRvd25cbiRkcmF3aW5nLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIG1vdXNlRG93bik7XG5cbmNvbnN0IG1vdXNlRG93biA9IGZ1bmN0aW9uKGUpIHtcbiAgIFx0ZHJhdy5kcmF3R2VzdHVyZSgkZHJhd2luZywgJ2Rvd24nLCBlKTtcbiAgIFx0Y29uc3QgY29vcmRpbmF0ZXMgPSBkcmF3LmdldE1vdXNlWFlpbkNhbnZhcygkZHJhd2luZywgZSk7XG4gICBcdGN1cnJlbnRHZXN0dXJlLnB1c2goY29vcmRpbmF0ZXMpO1xuICAgIGNvbnNvbGUubG9nKGNvb3JkaW5hdGVzKTtcbiAgIFx0bGV0c0RyYXcgPSB0cnVlO1xufTtcblxuLy8gc3RhcnQgd2hlbiBtb3VzZSBpcyBkb3duXG4kZHJhd2luZy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBtb3VzZU1vdmUpO1xuXG5jb25zdCBtb3VzZU1vdmUgPSBmdW5jdGlvbihlKSB7XG5cdGlmIChsZXRzRHJhdyl7XG5cdCAgIFx0ZHJhdy5kcmF3R2VzdHVyZSgkZHJhd2luZywgJ21vdmUnLCBlKTtcblx0ICAgXHRjb25zdCBjb29yZGluYXRlcyA9IGRyYXcuZ2V0TW91c2VYWWluQ2FudmFzKCRkcmF3aW5nLCBlKTtcblx0ICAgXHRjdXJyZW50R2VzdHVyZS5wdXNoKGNvb3JkaW5hdGVzKTtcbiAgIFx0XHQvL2NvbnNvbGUubG9nKGNvb3JkaW5hdGVzKTtcblx0ICAgfVxuXG59O1xuXG4vLyBzdG9wIHdoZW4gbW91c2UgaXMgdXBcbiRkcmF3aW5nLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBtb3VzZVVwKTtcblxuY29uc3QgbW91c2VVcCA9IGZ1bmN0aW9uKGUpIHtcblxuICAgXHRsZXRzRHJhdyA9IGZhbHNlO1xuXG4gICAgY3VycmVudEdlc3R1cmUgPSB1dGlscy5zY2FsZShjdXJyZW50R2VzdHVyZSk7XG4gICAgY3VycmVudEdlc3R1cmUgPSB1dGlscy50cmFuc2xhdGVUb09yaWdpbihjdXJyZW50R2VzdHVyZSk7XG4gICAgLy8gc2NhbGVcblxuICAgIGlmKHRyYWluaW5nTW9kZSl7XG5cdFx0XHRkYXRhc2V0LmFkZEdlc3R1cmVXaXRoTGFiZWwoY3VycmVudEdlc3R1cmUsIGdlc3R1cmVJRCk7XG4gICBcdFx0ZGF0YXNldC5wbG90RGF0YXNldEluSE1MKCk7XG5cdFx0XHRnZXN0dXJlSUQrKztcblx0XHR9IGVsc2V7XG5cdFx0XHRjb25zdCBwcmVkaWN0ZWRMYWJlbCA9IG15UmVjb2duaXplci5wcmVkaWN0KGN1cnJlbnRHZXN0dXJlKTtcblx0XHRcdGNvbnNvbGUubG9nKHByZWRpY3RlZExhYmVsKTtcblx0XHR9XG5cblx0ICAgXHRjdXJyZW50R2VzdHVyZSA9IFtdO1xufTtcblxuY29uc3QgJHRyYWluaW5nQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3RyYWluaW5nQnV0dG9uJyk7XG4kdHJhaW5pbmdCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihlKSB7XG5cdHRyYWluaW5nTW9kZSA9IHRydWU7XG59KTtcblxuY29uc3QgJHRlc3RpbmdCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjdGVzdGluZ0J1dHRvbicpO1xuJHRlc3RpbmdCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihlKSB7XG5cdG15UmVjb2duaXplci5maXQoZGF0YXNldCk7XG5cdHRyYWluaW5nTW9kZSA9IGZhbHNlO1xuXG59KTtcbiIsIi8qKlxuICogRGF0YXNldCBDbGFzc1xuICovIFxuXG5jbGFzcyBEYXRhc2V0IHtcblxuICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgdGhpcy5nZXN0dXJlID0gW11cbiAgICB0aGlzLmFsbEdlc3R1cmVzID0gW107XG4gICAgdGhpcy5hbGxMYWJlbHMgPSBbXTtcbiAgfVxuXG4gIGFkZEdlc3R1cmVXaXRoTGFiZWwoZ2VzdHVyZSwgbGFiZWwpIHtcbiAgICB0aGlzLmFsbEdlc3R1cmVzLnB1c2goZ2VzdHVyZSk7XG4gICAgdGhpcy5hbGxMYWJlbHMucHVzaChsYWJlbCk7XG4gIH1cblxuICBnZXROdW1HZXN0dXJlcygpIHtcbiAgICByZXR1cm4gdGhpcy5hbGxHZXN0dXJlcy5sZW5ndGg7XG4gIH1cblxuICBnZXRDdXJyZW50R2VzdHVyZSgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXN0dXJlO1xuICB9XG5cbiAgZ2V0R2VzdHVyZXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuYWxsR2VzdHVyZXM7XG4gIH1cblxuICBnZXRMYWJlbHMoKSB7XG4gICAgcmV0dXJuIHRoaXMuYWxsTGFiZWxzO1xuICB9XG5cbiAgY2xlYXIoKSB7XG4gICAgdGhpcy5hbGxHZXN0dXJlcyA9IFtdO1xuICAgIHRoaXMuYWxsTGFiZWxzID0gW107XG4gICAgLy8gY2xlYXIgcGxvdHMgaWYgdGhlcmUgaXMgYW55XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkYXRhc2V0LWRpdlwiKS5yZW1vdmUoKTtcbiAgICBsZXQgZGF0YXNldERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGRhdGFzZXREaXYuaWQgPSBcImRhdGFzZXQtZGl2XCI7XG4gICAgbGV0IGJvZHkgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImJvZHlcIilbMF07XG4gICAgYm9keS5hcHBlbmRDaGlsZChkYXRhc2V0RGl2KTtcbiAgfVxuXG4gIHBsb3REYXRhc2V0SW5ITUwoKSB7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkYXRhc2V0LWRpdlwiKS5yZW1vdmUoKTtcbiAgICBsZXQgZGF0YXNldERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGRhdGFzZXREaXYuaWQgPSBcImRhdGFzZXQtZGl2XCI7XG4gICAgZGF0YXNldERpdi5jbGFzc05hbWUgPSBcInRodW1ibmFpbFwiO1xuXG4gICAgbGV0IGJvZHkgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImJvZHlcIilbMF07XG4gICAgYm9keS5hcHBlbmRDaGlsZChkYXRhc2V0RGl2KTtcblxuICAgIGxldCBjbGFzc2VzID0gdGhpcy5hbGxMYWJlbHMuZmlsdGVyKCh2LCBpLCBhKSA9PiBhLmluZGV4T2YodikgPT09IGkpO1xuXG4gICAgZm9yIChsZXQgZyA9IDA7IGcgPCB0aGlzLmFsbEdlc3R1cmVzLmxlbmd0aDsgZysrKSB7XG4gICAgLy8gZm9yIChsZXQgYyA9IDA7IGMgPCBjbGFzc2VzLmxlbmd0aDsgYysrKSB7XG4gICAgICAvLyBsZXQgaW5kZXggPSB0aGlzLmFsbExhYmVscy5pbmRleE9mKGNsYXNzZXNbY10pO1xuICAgICAgLy8gY29uc3QgZ2VzdHVyZV8gPSB0aGlzLmFsbEdlc3R1cmVzW2luZGV4XVxuICAgICAgY29uc3QgZ2VzdHVyZV8gPSB0aGlzLmFsbEdlc3R1cmVzW2ddXG4gICAgICAvLyBkZWNsYXJlIHRoZSBjYW52YSB3aGVyZSB0byBkcmF3IGEgdGh1bWJuYWlsXG4gICAgICBsZXQgdGh1bWJDbnZzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgICB0aHVtYkNudnMud2lkdGggPSA3MDtcbiAgICAgIHRodW1iQ252cy5oZWlnaHQgPSA3MDtcbiAgICAgIHRodW1iQ252cy5zdHlsZS5ib3JkZXIgPSBcIjFweCBzb2xpZFwiO1xuICAgICAgLy8gZ2V0IGNvbnRleHQgdG8gZmlsbCB3aXRoIGJrZyBjb2xvciBhbmQgaW1hZ2VcbiAgICAgIGxldCBjdHggPSB0aHVtYkNudnMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICAgIGN0eC5maWxsU3R5bGUgPSBcIndoaXRlXCI7XG4gICAgICBjdHguZmlsbFJlY3QoMCwgMCwgdGh1bWJDbnZzLndpZHRoLCB0aHVtYkNudnMuaGVpZ2h0KTtcbiAgICAgIGZvciAobGV0IG4gPSAwOyBuIDwgZ2VzdHVyZV8ubGVuZ3RoOyBuKyspIHtcbiAgICAgICAgaWYgKG4gPT0gMCkgIHtcbiAgICAgICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IFwib3JhbmdlXCI7XG4gICAgICAgICAgY29uc3QgeCA9IGdlc3R1cmVfW25dWzBdICogNzA7XG4gICAgICAgICAgY29uc3QgeSA9IGdlc3R1cmVfW25dWzFdICogNzA7XG4gICAgICAgICAgY3R4LmFyYyh4LCB5LCA1LCAwLCBNYXRoLlBJICogMiwgdHJ1ZSk7XG4gICAgICAgICAgY3R4LmZpbGwoKTtcbiAgICAgICAgICBjdHguY2xvc2VQYXRoKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc3QgY3VyWCA9IGdlc3R1cmVfW25dWzBdICogNzA7XG4gICAgICAgICAgY29uc3QgY3VyWSA9IGdlc3R1cmVfW25dWzFdICogNzA7XG4gICAgICAgICAgY29uc3QgcHJldlggPSBnZXN0dXJlX1tuLTFdWzBdICogNzA7XG4gICAgICAgICAgY29uc3QgcHJldlkgPSBnZXN0dXJlX1tuLTFdWzFdICogNzA7XG4gICAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgICAgIGN0eC5tb3ZlVG8ocHJldlgsIHByZXZZKTtcbiAgICAgICAgICBjdHgubGluZVRvKGN1clgsIGN1clkpO1xuICAgICAgICAgIGN0eC5zdHJva2VTdHlsZSA9IFwib3JhbmdlXCI7XG4gICAgICAgICAgY3R4LmxpbmVXaWR0aCA9IDI7XG4gICAgICAgICAgY3R4LnN0cm9rZSgpO1xuICAgICAgICAgIGN0eC5jbG9zZVBhdGgoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZGF0YXNldERpdi5hcHBlbmRDaGlsZCh0aHVtYkNudnMpO1xuICAgICAgbGV0IHRleHRTcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgdGV4dFNwYW4uaW5uZXJIVE1MICs9IFN0cmluZyh0aGlzLmFsbExhYmVsc1tnXSk7XG4gICAgICB0ZXh0U3Bhbi5jbGFzc05hbWUgPSBcInRodW1iTGFiZWxcIlxuICAgICAgZGF0YXNldERpdi5hcHBlbmRDaGlsZCh0ZXh0U3Bhbik7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IERhdGFzZXQ7XG4iLCIvLyBEcmF3aW5nIGZ1bmN0aW9ucyBpbiBjYW52YXNcbmxldCBpbml0RHJhd2luZ1B0ID0gZmFsc2U7XG5sZXQgcHJldk1vdXNlWCA9IDA7XG5sZXQgY3Vyck1vdXNlWCA9IDA7IFxubGV0IHByZXZNb3VzZVkgPSAwO1xubGV0IGN1cnJNb3VzZVkgPSAwO1xubGV0IGxpbmVXaWR0aCA9IDM7XG5sZXQgY29sb3IgPSBcIm9yYW5nZVwiO1xuXG5cbmZ1bmN0aW9uIGRyYXdHZXN0dXJlKGNhbnZhcywgcmVzLCBlKSB7XG4gIGxldCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xuICBpZiAocmVzID09ICdkb3duJykge1xuICAgIC8vIGNsZWFyIGNhbnZhc1xuICAgIGN0eC5jbGVhclJlY3QoMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcbiAgICBwcmV2TW91c2VYID0gY3Vyck1vdXNlWDtcbiAgICBwcmV2TW91c2VZID0gY3Vyck1vdXNlWTtcbiAgICBjdXJyTW91c2VYID0gZS5jbGllbnRYIC0gY2FudmFzLm9mZnNldExlZnQ7XG4gICAgY3Vyck1vdXNlWSA9IGUuY2xpZW50WSAtIGNhbnZhcy5vZmZzZXRUb3A7XG4gICAgaW5pdERyYXdpbmdQdCA9IHRydWU7XG4gICAgaWYgKGluaXREcmF3aW5nUHQpIHtcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgICBjdHguZmlsbFN0eWxlID0gY29sb3I7XG4gICAgICAgIGN0eC5hcmMoY3Vyck1vdXNlWCwgY3Vyck1vdXNlWSwgNSwgMCwgTWF0aC5QSSAqIDIsIHRydWUpO1xuICAgICAgICBjdHguZmlsbCgpO1xuICAgICAgICBjdHguY2xvc2VQYXRoKCk7XG4gICAgICAgIGluaXREcmF3aW5nUHQgPSBmYWxzZTtcbiAgICB9XG4gIH1cbiAgaWYgKHJlcyA9PSAnbW92ZScpIHtcbiAgICBwcmV2TW91c2VYID0gY3Vyck1vdXNlWDtcbiAgICBwcmV2TW91c2VZID0gY3Vyck1vdXNlWTtcbiAgICBjdXJyTW91c2VYID0gZS5jbGllbnRYIC0gY2FudmFzLm9mZnNldExlZnQ7XG4gICAgY3Vyck1vdXNlWSA9IGUuY2xpZW50WSAtIGNhbnZhcy5vZmZzZXRUb3A7XG4gICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgIGN0eC5tb3ZlVG8ocHJldk1vdXNlWCwgcHJldk1vdXNlWSk7XG4gICAgY3R4LmxpbmVUbyhjdXJyTW91c2VYLCBjdXJyTW91c2VZKTtcbiAgICBjdHguc3Ryb2tlU3R5bGUgPSBjb2xvcjtcbiAgICBjdHgubGluZVdpZHRoID0gbGluZVdpZHRoO1xuICAgIGN0eC5zdHJva2UoKTtcbiAgICBjdHguY2xvc2VQYXRoKCk7XG4gIH1cbn1cblxuXG5mdW5jdGlvbiBhZGRHZXN0dXJlVGh1bWJuYWlsKGNhbnZhcywgZ2VzdHVyZV9pZCkge1xuICAgIC8vIGRlY2xhcmUgdGhlIGNhbnZhIHdoZXJlIHRvIGRyYXcgYSB0aHVtYm5haWxcbiAgICBsZXQgdGh1bWJDbnZzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgdGh1bWJDbnZzLndpZHRoID0gNzA7XG4gICAgdGh1bWJDbnZzLmhlaWdodCA9IDcwO1xuICAgIHRodW1iQ252cy5zdHlsZS5ib3JkZXIgPSBcIjFweCBzb2xpZFwiO1xuICAgIC8vIGdldCBjb250ZXh0IHRvIGZpbGwgd2l0aCBia2cgY29sb3IgYW5kIGltYWdlXG4gICAgbGV0IGN0eCA9IHRodW1iQ252cy5nZXRDb250ZXh0KCcyZCcpO1xuICAgIGN0eC5maWxsU3R5bGUgPSBcIndoaXRlXCI7XG4gICAgY3R4LmZpbGxSZWN0KDAsIDAsIHRodW1iQ252cy53aWR0aCwgdGh1bWJDbnZzLmhlaWdodCk7XG4gICAgY3R4LmRyYXdJbWFnZShjYW52YXMsIDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCwgMCwgMCwgdGh1bWJDbnZzLndpZHRoLCB0aHVtYkNudnMuaGVpZ2h0KTtcbiAgICAvLyBhZGQgdG8gdGhlIGJvZHkgZG9jdW1lbnRcbiAgICB2YXIgYm9keSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiYm9keVwiKVswXTtcbiAgICBib2R5LmFwcGVuZENoaWxkKHRodW1iQ252cyk7XG59XG5cblxuZnVuY3Rpb24gZ2V0TW91c2VYWWluQ2FudmFzKGNhbnZhcywgZSkge1xuICBjb25zdCB7IHRvcCwgbGVmdCwgd2lkdGgsIGhlaWdodCB9ID0gY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICBjb25zdCBjbGllbnRYID0gKGUucGFnZVggLSBsZWZ0KSAvIHdpZHRoO1xuICBjb25zdCBjbGllbnRZID0gKGUucGFnZVkgLSB0b3ApIC8gaGVpZ2h0O1xuICByZXR1cm4gW2NsaWVudFgsIGNsaWVudFldXG59XG5cblxuZnVuY3Rpb24gYWRkQm94VG9Cb2R5KHdpZHRoLCBoZWlnaHQsIG5hbWUsIGJveHRpdGxlKSB7XG4gIC8vIGNyZWF0ZSBvdXRlciBESVZcbiAgdmFyIGlEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgaURpdi5pZCA9ICdibG9jay0nK1N0cmluZyhNYXRoLnJhbmRvbSgpICogMTAwMDApO1xuICBpRGl2LmNsYXNzTmFtZSA9ICdib3gnO1xuICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYm9keScpWzBdLmFwcGVuZENoaWxkKGlEaXYpO1xuICAvLyBjcmVhdGUgY2FudmFzXG4gIGxldCBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgY2FudmFzLndpZHRoID0gd2lkdGg7XG4gIGNhbnZhcy5oZWlnaHQgPSBoZWlnaHQ7XG4gIGNhbnZhcy5zdHlsZS5ib3JkZXIgPSBcIjBweFwiO1xuICBjYW52YXMuaWQgPSBuYW1lO1xuICBsZXQgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gIGN0eC5maWxsU3R5bGUgPSBcIndoaXRlXCI7XG4gIGN0eC5maWxsUmVjdCgwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpO1xuICBsZXQgZGl2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaURpdi5pZCk7XG4gIGRpdi5hcHBlbmRDaGlsZChjYW52YXMpO1xuICAvLyBjcmVhdGUgZGl2IGZvciB0aXRsZVxuICBsZXQgdGl0bGVEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgdGl0bGVEaXYuY2xhc3NOYW1lID0gJ2JveHRpdGxlJztcbiAgdGl0bGVEaXYuaW5uZXJIVE1MICs9IGJveHRpdGxlO1xuICBkaXYuYXBwZW5kQ2hpbGQodGl0bGVEaXYpO1xufVxuXG5cbmV4cG9ydCB7IGFkZEJveFRvQm9keSwgZHJhd0dlc3R1cmUsIGFkZEdlc3R1cmVUaHVtYm5haWwsIGdldE1vdXNlWFlpbkNhbnZhcyB9O1xuIiwiLyoqXG4gKiBSZWNvbmdpemVyIGNsYXNzXG4gKiBTaW1wbGUgdGVtcGxhdGUtYmFzZWQgcmVjb2duaXplclxuICovXG5cbmltcG9ydCAqIGFzIHV0aWxzIGZyb20gJy4vdXRpbHMnXG5cblxuY2xhc3MgUmVjb2duaXplciB7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy50cmFpbmluZ0RhdGEgPSBbXTtcbiAgICB0aGlzLnRyYWluaW5nTGFiZWxzID0gW107XG4gIH1cblxuXG4gIGZpdChkYXRhc2V0KSB7XG4gICAgdGhpcy50cmFpbmluZ0RhdGEgPSBkYXRhc2V0LmdldEdlc3R1cmVzKCk7XG4gICAgdGhpcy50cmFpbmluZ0xhYmVscyA9IGRhdGFzZXQuZ2V0TGFiZWxzKCk7XG4gIH1cblxuICBwcmVkaWN0KGdlc3R1cmUpIHtcbiAgICBsZXQgbWluRGlzdGFuY2UgPSBJbmZpbml0eTtcbiAgICBsZXQgbWluSW5kZXggPSAtMTtcblxuICAgIC8vIFRPRE8gVHJhbnNsYXRlIFN0YXJ0aW5nIHBvaW50IG9mIGdlc3R1cmVzXG5cbiAgICBmb3IgKGxldCBpPTA7IGkgPCB0aGlzLnRyYWluaW5nRGF0YS5sZW5ndGg7IGkrKykge1xuXG4gICAgICBjb25zdCB0ZW1wbGF0ZSA9IHRoaXMudHJhaW5pbmdEYXRhW2ldO1xuICAgICAgbGV0IGRpc3QgPSAwLjA7XG4gICAgICBmb3IgKGxldCBrPTA7IGsgPCBNYXRoLm1pbih0ZW1wbGF0ZS5sZW5ndGgsIGdlc3R1cmUubGVuZ3RoKTsgaysrKXtcbiAgICAgICAgICBkaXN0ID0gZGlzdCArIHV0aWxzLmRpc3RhbmNlKHRlbXBsYXRlW2tdLCBnZXN0dXJlW2tdKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGRpc3QgPCBtaW5EaXN0YW5jZSl7XG4gICAgICAgIG1pbkRpc3RhbmNlID0gZGlzdDtcbiAgICAgICAgbWluSW5kZXggPSBpO1xuICAgICAgfVxuXG5cbiAgICB9XG4gICAgcmV0dXJuIHRoaXMudHJhaW5pbmdMYWJlbHNbbWluSW5kZXhdO1xuXG4gIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBSZWNvZ25pemVyO1xuIiwiXG4vLy8gXCJQUklWQVRFXCIgRlVOQ1RJT05TXG5cbmZ1bmN0aW9uIHBhdGhMZW5ndGgocG9pbnRzKVxue1xuICAgIHZhciBkID0gMC4wO1xuICAgIGZvciAodmFyIGkgPSAxOyBpIDwgcG9pbnRzLmxlbmd0aDsgaSsrKVxuICAgICAgICBkICs9IGRpc3RhbmNlKHBvaW50c1tpIC0gMV0sIHBvaW50c1tpXSk7XG4gICAgcmV0dXJuIGQ7XG59XG5cbmZ1bmN0aW9uIGJvdW5kaW5nQm94KHBvaW50cylcbntcbiAgICBsZXQgbWluWCA9ICtJbmZpbml0eSwgbWF4WCA9IC1JbmZpbml0eSwgbWluWSA9ICtJbmZpbml0eSwgbWF4WSA9IC1JbmZpbml0eTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBvaW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBtaW5YID0gTWF0aC5taW4obWluWCwgcG9pbnRzW2ldWzBdKTtcbiAgICAgICAgbWluWSA9IE1hdGgubWluKG1pblksIHBvaW50c1tpXVsxXSk7XG4gICAgICAgIG1heFggPSBNYXRoLm1heChtYXhYLCBwb2ludHNbaV1bMF0pO1xuICAgICAgICBtYXhZID0gTWF0aC5tYXgobWF4WSwgcG9pbnRzW2ldWzFdKTtcbiAgICB9XG4gICAgcmV0dXJuIFttYXhYIC0gbWluWCwgbWF4WSAtIG1pblldO1xufVxuXG5mdW5jdGlvbiBjZW50cm9pZChwb2ludHMpXG57XG4gICAgdmFyIHggPSAwLjAsIHkgPSAwLjA7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwb2ludHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgeCArPSBwb2ludHNbaV1bMF07XG4gICAgICAgIHkgKz0gcG9pbnRzW2ldWzFdO1xuICAgIH1cbiAgICB4IC89IHBvaW50cy5sZW5ndGg7XG4gICAgeSAvPSBwb2ludHMubGVuZ3RoO1xuICAgIHJldHVybiBbeCwgeV07XG59XG5mdW5jdGlvbiBpbmRpY2F0aXZlQW5nbGUocG9pbnRzKVxue1xuICAgIHZhciBjID0gY2VudHJvaWQocG9pbnRzKTtcbiAgICByZXR1cm4gTWF0aC5hdGFuMihjWzFdIC0gcG9pbnRzWzBdWzFdLCBjWzBdIC0gcG9pbnRzWzBdWzBdKTtcbn1cblxuXG4vLy8gXCJQVUJMSUNcIiBGVU5DVElPTlNcblxuZnVuY3Rpb24gZGlzdGFuY2UodmVjdG9yMSwgdmVjdG9yMikge1xuICAgIGxldCBkaXN0ID0gMC4wO1xuICAgIGZvciAobGV0IGQgPTA7IGQgPCB2ZWN0b3IxLmxlbmd0aDsgZCsrKSB7XG4gICAgICAgIGRpc3QgKz0gTWF0aC5wb3codmVjdG9yMVtkXSAtIHZlY3RvcjJbZF0sIDIpO1xuICAgIH1cbiAgICByZXR1cm4gTWF0aC5zcXJ0KGRpc3QpO1xufVxuXG5mdW5jdGlvbiByZXNhbXBsZShkYXRhXywgbilcbntcbiAgICBsZXQgZGF0YSA9IGRhdGFfO1xuICAgIGxldCBJID0gcGF0aExlbmd0aChkYXRhKSAvIChuIC0gMSk7IC8vIGludGVydmFsIGxlbmd0aFxuICAgIGxldCBEID0gMC4wO1xuICAgIGxldCBuZXdwb2ludHMgPSBbXTtcbiAgICBuZXdwb2ludHMucHVzaChkYXRhWzBdKVxuICAgIGZvciAobGV0IGkgPSAxOyBpIDwgZGF0YS5sZW5ndGg7IGkrKylcbiAgICB7XG4gICAgICAgIGxldCBkID0gZGlzdGFuY2UoZGF0YVtpIC0gMV0sIGRhdGFbaV0pO1xuICAgICAgICBpZiAoKEQgKyBkKSA+PSBJKVxuICAgICAgICB7XG4gICAgICAgICAgICBsZXQgcXggPSBkYXRhW2kgLSAxXVswXSArICgoSSAtIEQpIC8gZCkgKiAoZGF0YVtpXVswXSAtIGRhdGFbaSAtIDFdWzBdKTtcbiAgICAgICAgICAgIGxldCBxeSA9IGRhdGFbaSAtIDFdWzFdICsgKChJIC0gRCkgLyBkKSAqIChkYXRhW2ldWzFdIC0gZGF0YVtpIC0gMV1bMV0pO1xuICAgICAgICAgICAgbGV0IHEgPSBbcXgsIHF5XTtcbiAgICAgICAgICAgIG5ld3BvaW50cy5wdXNoKFtxeCwgcXldKTtcbiAgICAgICAgICAgIGRhdGEuc3BsaWNlKGksIDAsIHEpOyAvLyBpbnNlcnQgJ3EnIGF0IHBvc2l0aW9uIGkgaW4gcG9pbnRzIHMudC4gJ3EnIHdpbGwgYmUgdGhlIG5leHQgaVxuICAgICAgICAgICAgRCA9IDAuMDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIEQgKz0gZDtcbiAgICB9XG4gICAgaWYgKG5ld3BvaW50cy5sZW5ndGggPT0gbiAtIDEpIHtcbiAgICAgICAgbmV3cG9pbnRzLnB1c2goW2RhdGFbZGF0YS5sZW5ndGggLSAxXVswXSwgZGF0YVtkYXRhLmxlbmd0aCAtIDFdWzFdXSk7XG4gICAgfVxuICAgIHJldHVybiBuZXdwb2ludHM7XG59XG5cblxuZnVuY3Rpb24gcm90YXRlKHBvaW50cykgLy8gcm90YXRlcyBwb2ludHMgYXJvdW5kIGNlbnRyb2lkXG57XG4gICAgbGV0IHJhZGlhbnMgPSAtIGluZGljYXRpdmVBbmdsZShwb2ludHMpO1xuICAgIGxldCBjID0gY2VudHJvaWQocG9pbnRzKTtcbiAgICBsZXQgY29zID0gTWF0aC5jb3MocmFkaWFucyk7XG4gICAgbGV0IHNpbiA9IE1hdGguc2luKHJhZGlhbnMpO1xuICAgIGxldCBuZXdwb2ludHMgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBvaW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBsZXQgcXggPSAocG9pbnRzW2ldWzBdIC0gY1swXSkgKiBjb3MgLSAocG9pbnRzW2ldWzFdIC0gY1sxXSkgKiBzaW4gKyBjWzBdXG4gICAgICAgIGxldCBxeSA9IChwb2ludHNbaV1bMF0gLSBjWzBdKSAqIHNpbiArIChwb2ludHNbaV1bMV0gLSBjWzFdKSAqIGNvcyArIGNbMV07XG4gICAgICAgIG5ld3BvaW50cy5wdXNoKFtxeCwgcXldKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ld3BvaW50cztcbn1cblxuXG5mdW5jdGlvbiBzY2FsZShwb2ludHMpIC8vIG5vbi11bmlmb3JtIHNjYWxlOyBhc3N1bWVzIDJEIGdlc3R1cmVzIChpLmUuLCBubyBsaW5lcylcbntcbiAgICBsZXQgc2l6ZSA9IDE7XG4gICAgbGV0IGJCb3ggPSBib3VuZGluZ0JveChwb2ludHMpO1xuICAgIGxldCBuZXdwb2ludHMgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBvaW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBsZXQgcXggPSBwb2ludHNbaV1bMF0gKiAoc2l6ZSAvIGJCb3hbMF0pO1xuICAgICAgICBsZXQgcXkgPSBwb2ludHNbaV1bMV0gKiAoc2l6ZSAvIGJCb3hbMV0pO1xuICAgICAgICBuZXdwb2ludHMucHVzaChbcXgsIHF5XSk7XG4gICAgICAgIGNvbnNvbGUubG9nKFtxeCwgcXldKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ld3BvaW50cztcbn1cblxuZnVuY3Rpb24gdHJhbnNsYXRlVG9PcmlnaW4ocG9pbnRzKSAvLyB0cmFuc2xhdGVzIHBvaW50cycgY2VudHJvaWRcbntcbiAgICBjb25zdCBvcmlnID0gWzAuNSwgMC41XTtcbiAgICBjb25zdCBjID0gY2VudHJvaWQocG9pbnRzKTtcbiAgICBsZXQgbmV3cG9pbnRzID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwb2ludHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgbGV0IHF4ID0gcG9pbnRzW2ldWzBdICsgb3JpZ1swXSAtIGNbMF07XG4gICAgICAgIGxldCBxeSA9IHBvaW50c1tpXVsxXSArIG9yaWdbMV0gLSBjWzFdO1xuICAgICAgICBuZXdwb2ludHMucHVzaChbcXgsIHF5XSk7XG4gICAgfVxuICAgIHJldHVybiBuZXdwb2ludHM7XG59XG5cblxuZXhwb3J0IHsgZGlzdGFuY2UsIHJlc2FtcGxlLCByb3RhdGUsIHNjYWxlLCB0cmFuc2xhdGVUb09yaWdpbiB9O1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7IFwiZGVmYXVsdFwiOiByZXF1aXJlKFwiY29yZS1qcy9saWJyYXJ5L2ZuL29iamVjdC9kZWZpbmUtcHJvcGVydHlcIiksIF9fZXNNb2R1bGU6IHRydWUgfTsiLCJcInVzZSBzdHJpY3RcIjtcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gZnVuY3Rpb24gKGluc3RhbmNlLCBDb25zdHJ1Y3Rvcikge1xuICBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbnZhciBfZGVmaW5lUHJvcGVydHkgPSByZXF1aXJlKFwiLi4vY29yZS1qcy9vYmplY3QvZGVmaW5lLXByb3BlcnR5XCIpO1xuXG52YXIgX2RlZmluZVByb3BlcnR5MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2RlZmluZVByb3BlcnR5KTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuZXhwb3J0cy5kZWZhdWx0ID0gZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldO1xuICAgICAgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlO1xuICAgICAgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlO1xuICAgICAgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTtcbiAgICAgICgwLCBfZGVmaW5lUHJvcGVydHkyLmRlZmF1bHQpKHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7XG4gICAgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTtcbiAgICBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTtcbiAgICByZXR1cm4gQ29uc3RydWN0b3I7XG4gIH07XG59KCk7IiwicmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9lczYub2JqZWN0LmRlZmluZS1wcm9wZXJ0eScpO1xudmFyICRPYmplY3QgPSByZXF1aXJlKCcuLi8uLi9tb2R1bGVzL19jb3JlJykuT2JqZWN0O1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0eShpdCwga2V5LCBkZXNjKSB7XG4gIHJldHVybiAkT2JqZWN0LmRlZmluZVByb3BlcnR5KGl0LCBrZXksIGRlc2MpO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIGlmICh0eXBlb2YgaXQgIT0gJ2Z1bmN0aW9uJykgdGhyb3cgVHlwZUVycm9yKGl0ICsgJyBpcyBub3QgYSBmdW5jdGlvbiEnKTtcbiAgcmV0dXJuIGl0O1xufTtcbiIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgaWYgKCFpc09iamVjdChpdCkpIHRocm93IFR5cGVFcnJvcihpdCArICcgaXMgbm90IGFuIG9iamVjdCEnKTtcbiAgcmV0dXJuIGl0O1xufTtcbiIsInZhciBjb3JlID0gbW9kdWxlLmV4cG9ydHMgPSB7IHZlcnNpb246ICcyLjUuMycgfTtcbmlmICh0eXBlb2YgX19lID09ICdudW1iZXInKSBfX2UgPSBjb3JlOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVuZGVmXG4iLCIvLyBvcHRpb25hbCAvIHNpbXBsZSBjb250ZXh0IGJpbmRpbmdcbnZhciBhRnVuY3Rpb24gPSByZXF1aXJlKCcuL19hLWZ1bmN0aW9uJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChmbiwgdGhhdCwgbGVuZ3RoKSB7XG4gIGFGdW5jdGlvbihmbik7XG4gIGlmICh0aGF0ID09PSB1bmRlZmluZWQpIHJldHVybiBmbjtcbiAgc3dpdGNoIChsZW5ndGgpIHtcbiAgICBjYXNlIDE6IHJldHVybiBmdW5jdGlvbiAoYSkge1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSk7XG4gICAgfTtcbiAgICBjYXNlIDI6IHJldHVybiBmdW5jdGlvbiAoYSwgYikge1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSwgYik7XG4gICAgfTtcbiAgICBjYXNlIDM6IHJldHVybiBmdW5jdGlvbiAoYSwgYiwgYykge1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSwgYiwgYyk7XG4gICAgfTtcbiAgfVxuICByZXR1cm4gZnVuY3Rpb24gKC8qIC4uLmFyZ3MgKi8pIHtcbiAgICByZXR1cm4gZm4uYXBwbHkodGhhdCwgYXJndW1lbnRzKTtcbiAgfTtcbn07XG4iLCIvLyBUaGFuaydzIElFOCBmb3IgaGlzIGZ1bm55IGRlZmluZVByb3BlcnR5XG5tb2R1bGUuZXhwb3J0cyA9ICFyZXF1aXJlKCcuL19mYWlscycpKGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh7fSwgJ2EnLCB7IGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gNzsgfSB9KS5hICE9IDc7XG59KTtcbiIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xudmFyIGRvY3VtZW50ID0gcmVxdWlyZSgnLi9fZ2xvYmFsJykuZG9jdW1lbnQ7XG4vLyB0eXBlb2YgZG9jdW1lbnQuY3JlYXRlRWxlbWVudCBpcyAnb2JqZWN0JyBpbiBvbGQgSUVcbnZhciBpcyA9IGlzT2JqZWN0KGRvY3VtZW50KSAmJiBpc09iamVjdChkb2N1bWVudC5jcmVhdGVFbGVtZW50KTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBpcyA/IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoaXQpIDoge307XG59O1xuIiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpO1xudmFyIGNvcmUgPSByZXF1aXJlKCcuL19jb3JlJyk7XG52YXIgY3R4ID0gcmVxdWlyZSgnLi9fY3R4Jyk7XG52YXIgaGlkZSA9IHJlcXVpcmUoJy4vX2hpZGUnKTtcbnZhciBQUk9UT1RZUEUgPSAncHJvdG90eXBlJztcblxudmFyICRleHBvcnQgPSBmdW5jdGlvbiAodHlwZSwgbmFtZSwgc291cmNlKSB7XG4gIHZhciBJU19GT1JDRUQgPSB0eXBlICYgJGV4cG9ydC5GO1xuICB2YXIgSVNfR0xPQkFMID0gdHlwZSAmICRleHBvcnQuRztcbiAgdmFyIElTX1NUQVRJQyA9IHR5cGUgJiAkZXhwb3J0LlM7XG4gIHZhciBJU19QUk9UTyA9IHR5cGUgJiAkZXhwb3J0LlA7XG4gIHZhciBJU19CSU5EID0gdHlwZSAmICRleHBvcnQuQjtcbiAgdmFyIElTX1dSQVAgPSB0eXBlICYgJGV4cG9ydC5XO1xuICB2YXIgZXhwb3J0cyA9IElTX0dMT0JBTCA/IGNvcmUgOiBjb3JlW25hbWVdIHx8IChjb3JlW25hbWVdID0ge30pO1xuICB2YXIgZXhwUHJvdG8gPSBleHBvcnRzW1BST1RPVFlQRV07XG4gIHZhciB0YXJnZXQgPSBJU19HTE9CQUwgPyBnbG9iYWwgOiBJU19TVEFUSUMgPyBnbG9iYWxbbmFtZV0gOiAoZ2xvYmFsW25hbWVdIHx8IHt9KVtQUk9UT1RZUEVdO1xuICB2YXIga2V5LCBvd24sIG91dDtcbiAgaWYgKElTX0dMT0JBTCkgc291cmNlID0gbmFtZTtcbiAgZm9yIChrZXkgaW4gc291cmNlKSB7XG4gICAgLy8gY29udGFpbnMgaW4gbmF0aXZlXG4gICAgb3duID0gIUlTX0ZPUkNFRCAmJiB0YXJnZXQgJiYgdGFyZ2V0W2tleV0gIT09IHVuZGVmaW5lZDtcbiAgICBpZiAob3duICYmIGtleSBpbiBleHBvcnRzKSBjb250aW51ZTtcbiAgICAvLyBleHBvcnQgbmF0aXZlIG9yIHBhc3NlZFxuICAgIG91dCA9IG93biA/IHRhcmdldFtrZXldIDogc291cmNlW2tleV07XG4gICAgLy8gcHJldmVudCBnbG9iYWwgcG9sbHV0aW9uIGZvciBuYW1lc3BhY2VzXG4gICAgZXhwb3J0c1trZXldID0gSVNfR0xPQkFMICYmIHR5cGVvZiB0YXJnZXRba2V5XSAhPSAnZnVuY3Rpb24nID8gc291cmNlW2tleV1cbiAgICAvLyBiaW5kIHRpbWVycyB0byBnbG9iYWwgZm9yIGNhbGwgZnJvbSBleHBvcnQgY29udGV4dFxuICAgIDogSVNfQklORCAmJiBvd24gPyBjdHgob3V0LCBnbG9iYWwpXG4gICAgLy8gd3JhcCBnbG9iYWwgY29uc3RydWN0b3JzIGZvciBwcmV2ZW50IGNoYW5nZSB0aGVtIGluIGxpYnJhcnlcbiAgICA6IElTX1dSQVAgJiYgdGFyZ2V0W2tleV0gPT0gb3V0ID8gKGZ1bmN0aW9uIChDKSB7XG4gICAgICB2YXIgRiA9IGZ1bmN0aW9uIChhLCBiLCBjKSB7XG4gICAgICAgIGlmICh0aGlzIGluc3RhbmNlb2YgQykge1xuICAgICAgICAgIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgICAgICAgY2FzZSAwOiByZXR1cm4gbmV3IEMoKTtcbiAgICAgICAgICAgIGNhc2UgMTogcmV0dXJuIG5ldyBDKGEpO1xuICAgICAgICAgICAgY2FzZSAyOiByZXR1cm4gbmV3IEMoYSwgYik7XG4gICAgICAgICAgfSByZXR1cm4gbmV3IEMoYSwgYiwgYyk7XG4gICAgICAgIH0gcmV0dXJuIEMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIH07XG4gICAgICBGW1BST1RPVFlQRV0gPSBDW1BST1RPVFlQRV07XG4gICAgICByZXR1cm4gRjtcbiAgICAvLyBtYWtlIHN0YXRpYyB2ZXJzaW9ucyBmb3IgcHJvdG90eXBlIG1ldGhvZHNcbiAgICB9KShvdXQpIDogSVNfUFJPVE8gJiYgdHlwZW9mIG91dCA9PSAnZnVuY3Rpb24nID8gY3R4KEZ1bmN0aW9uLmNhbGwsIG91dCkgOiBvdXQ7XG4gICAgLy8gZXhwb3J0IHByb3RvIG1ldGhvZHMgdG8gY29yZS4lQ09OU1RSVUNUT1IlLm1ldGhvZHMuJU5BTUUlXG4gICAgaWYgKElTX1BST1RPKSB7XG4gICAgICAoZXhwb3J0cy52aXJ0dWFsIHx8IChleHBvcnRzLnZpcnR1YWwgPSB7fSkpW2tleV0gPSBvdXQ7XG4gICAgICAvLyBleHBvcnQgcHJvdG8gbWV0aG9kcyB0byBjb3JlLiVDT05TVFJVQ1RPUiUucHJvdG90eXBlLiVOQU1FJVxuICAgICAgaWYgKHR5cGUgJiAkZXhwb3J0LlIgJiYgZXhwUHJvdG8gJiYgIWV4cFByb3RvW2tleV0pIGhpZGUoZXhwUHJvdG8sIGtleSwgb3V0KTtcbiAgICB9XG4gIH1cbn07XG4vLyB0eXBlIGJpdG1hcFxuJGV4cG9ydC5GID0gMTsgICAvLyBmb3JjZWRcbiRleHBvcnQuRyA9IDI7ICAgLy8gZ2xvYmFsXG4kZXhwb3J0LlMgPSA0OyAgIC8vIHN0YXRpY1xuJGV4cG9ydC5QID0gODsgICAvLyBwcm90b1xuJGV4cG9ydC5CID0gMTY7ICAvLyBiaW5kXG4kZXhwb3J0LlcgPSAzMjsgIC8vIHdyYXBcbiRleHBvcnQuVSA9IDY0OyAgLy8gc2FmZVxuJGV4cG9ydC5SID0gMTI4OyAvLyByZWFsIHByb3RvIG1ldGhvZCBmb3IgYGxpYnJhcnlgXG5tb2R1bGUuZXhwb3J0cyA9ICRleHBvcnQ7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChleGVjKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuICEhZXhlYygpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn07XG4iLCIvLyBodHRwczovL2dpdGh1Yi5jb20vemxvaXJvY2svY29yZS1qcy9pc3N1ZXMvODYjaXNzdWVjb21tZW50LTExNTc1OTAyOFxudmFyIGdsb2JhbCA9IG1vZHVsZS5leHBvcnRzID0gdHlwZW9mIHdpbmRvdyAhPSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuTWF0aCA9PSBNYXRoXG4gID8gd2luZG93IDogdHlwZW9mIHNlbGYgIT0gJ3VuZGVmaW5lZCcgJiYgc2VsZi5NYXRoID09IE1hdGggPyBzZWxmXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1uZXctZnVuY1xuICA6IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5pZiAodHlwZW9mIF9fZyA9PSAnbnVtYmVyJykgX19nID0gZ2xvYmFsOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVuZGVmXG4iLCJ2YXIgZFAgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKTtcbnZhciBjcmVhdGVEZXNjID0gcmVxdWlyZSgnLi9fcHJvcGVydHktZGVzYycpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpID8gZnVuY3Rpb24gKG9iamVjdCwga2V5LCB2YWx1ZSkge1xuICByZXR1cm4gZFAuZihvYmplY3QsIGtleSwgY3JlYXRlRGVzYygxLCB2YWx1ZSkpO1xufSA6IGZ1bmN0aW9uIChvYmplY3QsIGtleSwgdmFsdWUpIHtcbiAgb2JqZWN0W2tleV0gPSB2YWx1ZTtcbiAgcmV0dXJuIG9iamVjdDtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9ICFyZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpICYmICFyZXF1aXJlKCcuL19mYWlscycpKGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShyZXF1aXJlKCcuL19kb20tY3JlYXRlJykoJ2RpdicpLCAnYScsIHsgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiA3OyB9IH0pLmEgIT0gNztcbn0pO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIHR5cGVvZiBpdCA9PT0gJ29iamVjdCcgPyBpdCAhPT0gbnVsbCA6IHR5cGVvZiBpdCA9PT0gJ2Z1bmN0aW9uJztcbn07XG4iLCJ2YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKTtcbnZhciBJRThfRE9NX0RFRklORSA9IHJlcXVpcmUoJy4vX2llOC1kb20tZGVmaW5lJyk7XG52YXIgdG9QcmltaXRpdmUgPSByZXF1aXJlKCcuL190by1wcmltaXRpdmUnKTtcbnZhciBkUCA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eTtcblxuZXhwb3J0cy5mID0gcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSA/IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSA6IGZ1bmN0aW9uIGRlZmluZVByb3BlcnR5KE8sIFAsIEF0dHJpYnV0ZXMpIHtcbiAgYW5PYmplY3QoTyk7XG4gIFAgPSB0b1ByaW1pdGl2ZShQLCB0cnVlKTtcbiAgYW5PYmplY3QoQXR0cmlidXRlcyk7XG4gIGlmIChJRThfRE9NX0RFRklORSkgdHJ5IHtcbiAgICByZXR1cm4gZFAoTywgUCwgQXR0cmlidXRlcyk7XG4gIH0gY2F0Y2ggKGUpIHsgLyogZW1wdHkgKi8gfVxuICBpZiAoJ2dldCcgaW4gQXR0cmlidXRlcyB8fCAnc2V0JyBpbiBBdHRyaWJ1dGVzKSB0aHJvdyBUeXBlRXJyb3IoJ0FjY2Vzc29ycyBub3Qgc3VwcG9ydGVkIScpO1xuICBpZiAoJ3ZhbHVlJyBpbiBBdHRyaWJ1dGVzKSBPW1BdID0gQXR0cmlidXRlcy52YWx1ZTtcbiAgcmV0dXJuIE87XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoYml0bWFwLCB2YWx1ZSkge1xuICByZXR1cm4ge1xuICAgIGVudW1lcmFibGU6ICEoYml0bWFwICYgMSksXG4gICAgY29uZmlndXJhYmxlOiAhKGJpdG1hcCAmIDIpLFxuICAgIHdyaXRhYmxlOiAhKGJpdG1hcCAmIDQpLFxuICAgIHZhbHVlOiB2YWx1ZVxuICB9O1xufTtcbiIsIi8vIDcuMS4xIFRvUHJpbWl0aXZlKGlucHV0IFssIFByZWZlcnJlZFR5cGVdKVxudmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG4vLyBpbnN0ZWFkIG9mIHRoZSBFUzYgc3BlYyB2ZXJzaW9uLCB3ZSBkaWRuJ3QgaW1wbGVtZW50IEBAdG9QcmltaXRpdmUgY2FzZVxuLy8gYW5kIHRoZSBzZWNvbmQgYXJndW1lbnQgLSBmbGFnIC0gcHJlZmVycmVkIHR5cGUgaXMgYSBzdHJpbmdcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0LCBTKSB7XG4gIGlmICghaXNPYmplY3QoaXQpKSByZXR1cm4gaXQ7XG4gIHZhciBmbiwgdmFsO1xuICBpZiAoUyAmJiB0eXBlb2YgKGZuID0gaXQudG9TdHJpbmcpID09ICdmdW5jdGlvbicgJiYgIWlzT2JqZWN0KHZhbCA9IGZuLmNhbGwoaXQpKSkgcmV0dXJuIHZhbDtcbiAgaWYgKHR5cGVvZiAoZm4gPSBpdC52YWx1ZU9mKSA9PSAnZnVuY3Rpb24nICYmICFpc09iamVjdCh2YWwgPSBmbi5jYWxsKGl0KSkpIHJldHVybiB2YWw7XG4gIGlmICghUyAmJiB0eXBlb2YgKGZuID0gaXQudG9TdHJpbmcpID09ICdmdW5jdGlvbicgJiYgIWlzT2JqZWN0KHZhbCA9IGZuLmNhbGwoaXQpKSkgcmV0dXJuIHZhbDtcbiAgdGhyb3cgVHlwZUVycm9yKFwiQ2FuJ3QgY29udmVydCBvYmplY3QgdG8gcHJpbWl0aXZlIHZhbHVlXCIpO1xufTtcbiIsInZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG4vLyAxOS4xLjIuNCAvIDE1LjIuMy42IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShPLCBQLCBBdHRyaWJ1dGVzKVxuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiAhcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSwgJ09iamVjdCcsIHsgZGVmaW5lUHJvcGVydHk6IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpLmYgfSk7XG4iXX0=
