(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Dataset = function () {
  function Dataset() {
    (0, _classCallCheck3.default)(this, Dataset);

    this.gesture = [];
    this.allGestures = [];
    this.allLabels = [];
  }

  (0, _createClass3.default)(Dataset, [{
    key: "fillGesture",
    value: function fillGesture(data) {
      this.gesture.push(data);
    }
  }, {
    key: "addGestureWithLabel",
    value: function addGestureWithLabel(label) {
      this.allGestures.push(this.gesture);
      this.gesture = [];
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
  }]);
  return Dataset;
}();

exports.default = Dataset;

},{"babel-runtime/helpers/classCallCheck":5,"babel-runtime/helpers/createClass":6}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
// Drawing functions in canvas
var drawing = false;
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
    drawing = true;
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
  if (res == 'up' || res == "out") {
    drawing = false;
  }
  if (res == 'move') {
    if (drawing) {
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

},{}],3:[function(require,module,exports){
'use strict';

var _draw = require('./draw');

var _dataset = require('./dataset');

var _dataset2 = _interopRequireDefault(_dataset);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var $drawing = document.querySelector('#drawCan');

var dataset = new _dataset2.default();

// start when mouse is down
$drawing.addEventListener('mousedown', function (e) {
  var coordinates = (0, _draw.getMouseXYinCanvas)($drawing, e);
  (0, _draw.drawGesture)($drawing, 'down', e);
});

// start when mouse is down
$drawing.addEventListener('mousemove', function (e) {
  (0, _draw.drawGesture)($drawing, 'move', e);
  var coordinates = (0, _draw.getMouseXYinCanvas)($drawing, e);
  dataset.fillGesture(coordinates);
});

// stop when mouse is up
$drawing.addEventListener('mouseup', function (e) {
  (0, _draw.drawGesture)($drawing, 'up', e);
  dataset.addGestureWithLabel(1);
});

// const $show = document.querySelector('#show');
// $show.addEventListener('click', function(e) {
//   console.log('there are ' + String(dataset.getNumGestures()));
// })

},{"./dataset":1,"./draw":2}],4:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/define-property"), __esModule: true };
},{"core-js/library/fn/object/define-property":7}],5:[function(require,module,exports){
"use strict";

exports.__esModule = true;

exports.default = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};
},{}],6:[function(require,module,exports){
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
},{"../core-js/object/define-property":4}],7:[function(require,module,exports){
require('../../modules/es6.object.define-property');
var $Object = require('../../modules/_core').Object;
module.exports = function defineProperty(it, key, desc) {
  return $Object.defineProperty(it, key, desc);
};

},{"../../modules/_core":10,"../../modules/es6.object.define-property":23}],8:[function(require,module,exports){
module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};

},{}],9:[function(require,module,exports){
var isObject = require('./_is-object');
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};

},{"./_is-object":19}],10:[function(require,module,exports){
var core = module.exports = { version: '2.5.3' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef

},{}],11:[function(require,module,exports){
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

},{"./_a-function":8}],12:[function(require,module,exports){
// Thank's IE8 for his funny defineProperty
module.exports = !require('./_fails')(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});

},{"./_fails":15}],13:[function(require,module,exports){
var isObject = require('./_is-object');
var document = require('./_global').document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};

},{"./_global":16,"./_is-object":19}],14:[function(require,module,exports){
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

},{"./_core":10,"./_ctx":11,"./_global":16,"./_hide":17}],15:[function(require,module,exports){
module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};

},{}],16:[function(require,module,exports){
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef

},{}],17:[function(require,module,exports){
var dP = require('./_object-dp');
var createDesc = require('./_property-desc');
module.exports = require('./_descriptors') ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

},{"./_descriptors":12,"./_object-dp":20,"./_property-desc":21}],18:[function(require,module,exports){
module.exports = !require('./_descriptors') && !require('./_fails')(function () {
  return Object.defineProperty(require('./_dom-create')('div'), 'a', { get: function () { return 7; } }).a != 7;
});

},{"./_descriptors":12,"./_dom-create":13,"./_fails":15}],19:[function(require,module,exports){
module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

},{}],20:[function(require,module,exports){
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

},{"./_an-object":9,"./_descriptors":12,"./_ie8-dom-define":18,"./_to-primitive":22}],21:[function(require,module,exports){
module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

},{}],22:[function(require,module,exports){
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

},{"./_is-object":19}],23:[function(require,module,exports){
var $export = require('./_export');
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export($export.S + $export.F * !require('./_descriptors'), 'Object', { defineProperty: require('./_object-dp').f });

},{"./_descriptors":12,"./_export":14,"./_object-dp":20}]},{},[3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkaXN0L2RhdGFzZXQuanMiLCJkaXN0L2RyYXcuanMiLCJkaXN0L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvY29yZS1qcy9vYmplY3QvZGVmaW5lLXByb3BlcnR5LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvaGVscGVycy9jbGFzc0NhbGxDaGVjay5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2hlbHBlcnMvY3JlYXRlQ2xhc3MuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L2ZuL29iamVjdC9kZWZpbmUtcHJvcGVydHkuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2EtZnVuY3Rpb24uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2FuLW9iamVjdC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fY29yZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fY3R4LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19kZXNjcmlwdG9ycy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fZG9tLWNyZWF0ZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fZXhwb3J0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19mYWlscy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fZ2xvYmFsLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19oaWRlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19pZTgtZG9tLWRlZmluZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faXMtb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19vYmplY3QtZHAuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3Byb3BlcnR5LWRlc2MuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3RvLXByaW1pdGl2ZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYub2JqZWN0LmRlZmluZS1wcm9wZXJ0eS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7SUNDTSxPO0FBRUoscUJBQWU7QUFBQTs7QUFDYixTQUFLLE9BQUwsR0FBZSxFQUFmO0FBQ0EsU0FBSyxXQUFMLEdBQW1CLEVBQW5CO0FBQ0EsU0FBSyxTQUFMLEdBQWlCLEVBQWpCO0FBQ0Q7Ozs7Z0NBRVcsSSxFQUFNO0FBQ2hCLFdBQUssT0FBTCxDQUFhLElBQWIsQ0FBa0IsSUFBbEI7QUFDRDs7O3dDQUVtQixLLEVBQU87QUFDekIsV0FBSyxXQUFMLENBQWlCLElBQWpCLENBQXNCLEtBQUssT0FBM0I7QUFDQSxXQUFLLE9BQUwsR0FBZSxFQUFmO0FBQ0EsV0FBSyxTQUFMLENBQWUsSUFBZixDQUFvQixLQUFwQjtBQUNEOzs7cUNBRWdCO0FBQ2YsYUFBTyxLQUFLLFdBQUwsQ0FBaUIsTUFBeEI7QUFDRDs7O3dDQUVtQjtBQUNsQixhQUFPLEtBQUssT0FBWjtBQUNEOzs7a0NBRWE7QUFDWixhQUFPLEtBQUssV0FBWjtBQUNEOzs7Z0NBRVc7QUFDVixhQUFPLEtBQUssU0FBWjtBQUNEOzs7OztrQkFJWSxPOzs7Ozs7OztBQ3JDZjtBQUNBLElBQUksVUFBVSxLQUFkO0FBQ0EsSUFBSSxnQkFBZ0IsS0FBcEI7QUFDQSxJQUFJLGFBQWEsQ0FBakI7QUFDQSxJQUFJLGFBQWEsQ0FBakI7QUFDQSxJQUFJLGFBQWEsQ0FBakI7QUFDQSxJQUFJLGFBQWEsQ0FBakI7QUFDQSxJQUFJLFlBQVksQ0FBaEI7QUFDQSxJQUFJLFFBQVEsUUFBWjs7QUFHQSxTQUFTLFdBQVQsQ0FBcUIsTUFBckIsRUFBNkIsR0FBN0IsRUFBa0MsQ0FBbEMsRUFBcUM7QUFDbkMsTUFBSSxNQUFNLE9BQU8sVUFBUCxDQUFrQixJQUFsQixDQUFWO0FBQ0EsTUFBSSxPQUFPLE1BQVgsRUFBbUI7QUFDakI7QUFDQSxRQUFJLFNBQUosQ0FBYyxDQUFkLEVBQWlCLENBQWpCLEVBQW9CLE9BQU8sS0FBM0IsRUFBa0MsT0FBTyxNQUF6QztBQUNBLGlCQUFhLFVBQWI7QUFDQSxpQkFBYSxVQUFiO0FBQ0EsaUJBQWEsRUFBRSxPQUFGLEdBQVksT0FBTyxVQUFoQztBQUNBLGlCQUFhLEVBQUUsT0FBRixHQUFZLE9BQU8sU0FBaEM7QUFDQSxjQUFVLElBQVY7QUFDQSxvQkFBZ0IsSUFBaEI7QUFDQSxRQUFJLGFBQUosRUFBbUI7QUFDZixVQUFJLFNBQUo7QUFDQSxVQUFJLFNBQUosR0FBZ0IsS0FBaEI7QUFDQSxVQUFJLEdBQUosQ0FBUSxVQUFSLEVBQW9CLFVBQXBCLEVBQWdDLENBQWhDLEVBQW1DLENBQW5DLEVBQXNDLEtBQUssRUFBTCxHQUFVLENBQWhELEVBQW1ELElBQW5EO0FBQ0EsVUFBSSxJQUFKO0FBQ0EsVUFBSSxTQUFKO0FBQ0Esc0JBQWdCLEtBQWhCO0FBQ0g7QUFDRjtBQUNELE1BQUksT0FBTyxJQUFQLElBQWUsT0FBTyxLQUExQixFQUFpQztBQUM3QixjQUFVLEtBQVY7QUFDSDtBQUNELE1BQUksT0FBTyxNQUFYLEVBQW1CO0FBQ2pCLFFBQUksT0FBSixFQUFhO0FBQ1QsbUJBQWEsVUFBYjtBQUNBLG1CQUFhLFVBQWI7QUFDQSxtQkFBYSxFQUFFLE9BQUYsR0FBWSxPQUFPLFVBQWhDO0FBQ0EsbUJBQWEsRUFBRSxPQUFGLEdBQVksT0FBTyxTQUFoQztBQUNBLFVBQUksU0FBSjtBQUNBLFVBQUksTUFBSixDQUFXLFVBQVgsRUFBdUIsVUFBdkI7QUFDQSxVQUFJLE1BQUosQ0FBVyxVQUFYLEVBQXVCLFVBQXZCO0FBQ0EsVUFBSSxXQUFKLEdBQWtCLEtBQWxCO0FBQ0EsVUFBSSxTQUFKLEdBQWdCLFNBQWhCO0FBQ0EsVUFBSSxNQUFKO0FBQ0EsVUFBSSxTQUFKO0FBQ0g7QUFDRjtBQUNGOztBQUdELFNBQVMsbUJBQVQsQ0FBNkIsTUFBN0IsRUFBcUMsVUFBckMsRUFBaUQ7QUFDN0M7QUFDQSxNQUFJLFlBQVksU0FBUyxhQUFULENBQXVCLFFBQXZCLENBQWhCO0FBQ0EsWUFBVSxLQUFWLEdBQWtCLEVBQWxCO0FBQ0EsWUFBVSxNQUFWLEdBQW1CLEVBQW5CO0FBQ0EsWUFBVSxLQUFWLENBQWdCLE1BQWhCLEdBQXlCLFdBQXpCO0FBQ0E7QUFDQSxNQUFJLE1BQU0sVUFBVSxVQUFWLENBQXFCLElBQXJCLENBQVY7QUFDQSxNQUFJLFNBQUosR0FBZ0IsT0FBaEI7QUFDQSxNQUFJLFFBQUosQ0FBYSxDQUFiLEVBQWdCLENBQWhCLEVBQW1CLFVBQVUsS0FBN0IsRUFBb0MsVUFBVSxNQUE5QztBQUNBLE1BQUksU0FBSixDQUFjLE1BQWQsRUFBc0IsQ0FBdEIsRUFBeUIsQ0FBekIsRUFBNEIsT0FBTyxLQUFuQyxFQUEwQyxPQUFPLE1BQWpELEVBQXlELENBQXpELEVBQTRELENBQTVELEVBQStELFVBQVUsS0FBekUsRUFBZ0YsVUFBVSxNQUExRjtBQUNBO0FBQ0EsTUFBSSxPQUFPLFNBQVMsb0JBQVQsQ0FBOEIsTUFBOUIsRUFBc0MsQ0FBdEMsQ0FBWDtBQUNBLE9BQUssV0FBTCxDQUFpQixTQUFqQjtBQUNIOztBQUdELFNBQVMsa0JBQVQsQ0FBNEIsTUFBNUIsRUFBb0MsQ0FBcEMsRUFBdUM7QUFBQSw4QkFDQSxPQUFPLHFCQUFQLEVBREE7QUFBQSxNQUM3QixHQUQ2Qix5QkFDN0IsR0FENkI7QUFBQSxNQUN4QixJQUR3Qix5QkFDeEIsSUFEd0I7QUFBQSxNQUNsQixLQURrQix5QkFDbEIsS0FEa0I7QUFBQSxNQUNYLE1BRFcseUJBQ1gsTUFEVzs7QUFFckMsTUFBTSxVQUFVLENBQUMsRUFBRSxLQUFGLEdBQVUsSUFBWCxJQUFtQixLQUFuQztBQUNBLE1BQU0sVUFBVSxDQUFDLEVBQUUsS0FBRixHQUFVLEdBQVgsSUFBa0IsTUFBbEM7QUFDQSxTQUFPLENBQUMsT0FBRCxFQUFVLE9BQVYsQ0FBUDtBQUNEOztBQUdELFNBQVMsWUFBVCxDQUFzQixLQUF0QixFQUE2QixNQUE3QixFQUFxQyxJQUFyQyxFQUEyQyxRQUEzQyxFQUFxRDtBQUNuRDtBQUNBLE1BQUksT0FBTyxTQUFTLGFBQVQsQ0FBdUIsS0FBdkIsQ0FBWDtBQUNBLE9BQUssRUFBTCxHQUFVLFdBQVMsT0FBTyxLQUFLLE1BQUwsS0FBZ0IsS0FBdkIsQ0FBbkI7QUFDQSxPQUFLLFNBQUwsR0FBaUIsS0FBakI7QUFDQSxXQUFTLG9CQUFULENBQThCLE1BQTlCLEVBQXNDLENBQXRDLEVBQXlDLFdBQXpDLENBQXFELElBQXJEO0FBQ0E7QUFDQSxNQUFJLFNBQVMsU0FBUyxhQUFULENBQXVCLFFBQXZCLENBQWI7QUFDQSxTQUFPLEtBQVAsR0FBZSxLQUFmO0FBQ0EsU0FBTyxNQUFQLEdBQWdCLE1BQWhCO0FBQ0EsU0FBTyxLQUFQLENBQWEsTUFBYixHQUFzQixLQUF0QjtBQUNBLFNBQU8sRUFBUCxHQUFZLElBQVo7QUFDQSxNQUFJLE1BQU0sT0FBTyxVQUFQLENBQWtCLElBQWxCLENBQVY7QUFDQSxNQUFJLFNBQUosR0FBZ0IsT0FBaEI7QUFDQSxNQUFJLFFBQUosQ0FBYSxDQUFiLEVBQWdCLENBQWhCLEVBQW1CLE9BQU8sS0FBMUIsRUFBaUMsT0FBTyxNQUF4QztBQUNBLE1BQUksTUFBTSxTQUFTLGNBQVQsQ0FBd0IsS0FBSyxFQUE3QixDQUFWO0FBQ0EsTUFBSSxXQUFKLENBQWdCLE1BQWhCO0FBQ0E7QUFDQSxNQUFJLFdBQVcsU0FBUyxhQUFULENBQXVCLEtBQXZCLENBQWY7QUFDQSxXQUFTLFNBQVQsR0FBcUIsVUFBckI7QUFDQSxXQUFTLFNBQVQsSUFBc0IsUUFBdEI7QUFDQSxNQUFJLFdBQUosQ0FBZ0IsUUFBaEI7QUFDRDs7UUFFUSxZLEdBQUEsWTtRQUFjLFcsR0FBQSxXO1FBQWEsbUIsR0FBQSxtQjtRQUFxQixrQixHQUFBLGtCOzs7OztBQ3JHekQ7O0FBQ0E7Ozs7OztBQUdBLElBQU0sV0FBVyxTQUFTLGFBQVQsQ0FBdUIsVUFBdkIsQ0FBakI7O0FBRUEsSUFBTSxVQUFVLHVCQUFoQjs7QUFHQTtBQUNBLFNBQVMsZ0JBQVQsQ0FBMEIsV0FBMUIsRUFBdUMsVUFBUyxDQUFULEVBQVk7QUFDakQsTUFBTSxjQUFjLDhCQUFtQixRQUFuQixFQUE2QixDQUE3QixDQUFwQjtBQUNBLHlCQUFZLFFBQVosRUFBc0IsTUFBdEIsRUFBOEIsQ0FBOUI7QUFDRCxDQUhEOztBQUtBO0FBQ0EsU0FBUyxnQkFBVCxDQUEwQixXQUExQixFQUF1QyxVQUFTLENBQVQsRUFBWTtBQUNqRCx5QkFBWSxRQUFaLEVBQXNCLE1BQXRCLEVBQThCLENBQTlCO0FBQ0EsTUFBTSxjQUFjLDhCQUFtQixRQUFuQixFQUE2QixDQUE3QixDQUFwQjtBQUNBLFVBQVEsV0FBUixDQUFvQixXQUFwQjtBQUNELENBSkQ7O0FBTUE7QUFDQSxTQUFTLGdCQUFULENBQTBCLFNBQTFCLEVBQXFDLFVBQVMsQ0FBVCxFQUFZO0FBQy9DLHlCQUFZLFFBQVosRUFBc0IsSUFBdEIsRUFBNEIsQ0FBNUI7QUFDQSxVQUFRLG1CQUFSLENBQTRCLENBQTVCO0FBQ0QsQ0FIRDs7QUFNQTtBQUNBO0FBQ0E7QUFDQTs7O0FDaENBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlxuY2xhc3MgRGF0YXNldCB7XG5cbiAgY29uc3RydWN0b3IgKCkge1xuICAgIHRoaXMuZ2VzdHVyZSA9IFtdXG4gICAgdGhpcy5hbGxHZXN0dXJlcyA9IFtdO1xuICAgIHRoaXMuYWxsTGFiZWxzID0gW107XG4gIH1cblxuICBmaWxsR2VzdHVyZShkYXRhKSB7XG4gICAgdGhpcy5nZXN0dXJlLnB1c2goZGF0YSk7XG4gIH1cblxuICBhZGRHZXN0dXJlV2l0aExhYmVsKGxhYmVsKSB7XG4gICAgdGhpcy5hbGxHZXN0dXJlcy5wdXNoKHRoaXMuZ2VzdHVyZSk7XG4gICAgdGhpcy5nZXN0dXJlID0gW107XG4gICAgdGhpcy5hbGxMYWJlbHMucHVzaChsYWJlbCk7XG4gIH1cblxuICBnZXROdW1HZXN0dXJlcygpIHtcbiAgICByZXR1cm4gdGhpcy5hbGxHZXN0dXJlcy5sZW5ndGg7XG4gIH1cblxuICBnZXRDdXJyZW50R2VzdHVyZSgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXN0dXJlO1xuICB9XG5cbiAgZ2V0R2VzdHVyZXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuYWxsR2VzdHVyZXM7XG4gIH1cblxuICBnZXRMYWJlbHMoKSB7XG4gICAgcmV0dXJuIHRoaXMuYWxsTGFiZWxzO1xuICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgRGF0YXNldDsiLCIvLyBEcmF3aW5nIGZ1bmN0aW9ucyBpbiBjYW52YXNcbmxldCBkcmF3aW5nID0gZmFsc2U7XG5sZXQgaW5pdERyYXdpbmdQdCA9IGZhbHNlO1xubGV0IHByZXZNb3VzZVggPSAwO1xubGV0IGN1cnJNb3VzZVggPSAwO1xubGV0IHByZXZNb3VzZVkgPSAwO1xubGV0IGN1cnJNb3VzZVkgPSAwO1xubGV0IGxpbmVXaWR0aCA9IDM7XG5sZXQgY29sb3IgPSBcIm9yYW5nZVwiO1xuXG5cbmZ1bmN0aW9uIGRyYXdHZXN0dXJlKGNhbnZhcywgcmVzLCBlKSB7XG4gIGxldCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xuICBpZiAocmVzID09ICdkb3duJykge1xuICAgIC8vIGNsZWFyIGNhbnZhc1xuICAgIGN0eC5jbGVhclJlY3QoMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcbiAgICBwcmV2TW91c2VYID0gY3Vyck1vdXNlWDtcbiAgICBwcmV2TW91c2VZID0gY3Vyck1vdXNlWTtcbiAgICBjdXJyTW91c2VYID0gZS5jbGllbnRYIC0gY2FudmFzLm9mZnNldExlZnQ7XG4gICAgY3Vyck1vdXNlWSA9IGUuY2xpZW50WSAtIGNhbnZhcy5vZmZzZXRUb3A7XG4gICAgZHJhd2luZyA9IHRydWU7XG4gICAgaW5pdERyYXdpbmdQdCA9IHRydWU7XG4gICAgaWYgKGluaXREcmF3aW5nUHQpIHtcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgICBjdHguZmlsbFN0eWxlID0gY29sb3I7XG4gICAgICAgIGN0eC5hcmMoY3Vyck1vdXNlWCwgY3Vyck1vdXNlWSwgNSwgMCwgTWF0aC5QSSAqIDIsIHRydWUpO1xuICAgICAgICBjdHguZmlsbCgpO1xuICAgICAgICBjdHguY2xvc2VQYXRoKCk7XG4gICAgICAgIGluaXREcmF3aW5nUHQgPSBmYWxzZTtcbiAgICB9XG4gIH1cbiAgaWYgKHJlcyA9PSAndXAnIHx8IHJlcyA9PSBcIm91dFwiKSB7XG4gICAgICBkcmF3aW5nID0gZmFsc2U7XG4gIH1cbiAgaWYgKHJlcyA9PSAnbW92ZScpIHtcbiAgICBpZiAoZHJhd2luZykge1xuICAgICAgICBwcmV2TW91c2VYID0gY3Vyck1vdXNlWDtcbiAgICAgICAgcHJldk1vdXNlWSA9IGN1cnJNb3VzZVk7XG4gICAgICAgIGN1cnJNb3VzZVggPSBlLmNsaWVudFggLSBjYW52YXMub2Zmc2V0TGVmdDtcbiAgICAgICAgY3Vyck1vdXNlWSA9IGUuY2xpZW50WSAtIGNhbnZhcy5vZmZzZXRUb3A7XG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgY3R4Lm1vdmVUbyhwcmV2TW91c2VYLCBwcmV2TW91c2VZKTtcbiAgICAgICAgY3R4LmxpbmVUbyhjdXJyTW91c2VYLCBjdXJyTW91c2VZKTtcbiAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gY29sb3I7XG4gICAgICAgIGN0eC5saW5lV2lkdGggPSBsaW5lV2lkdGg7IFxuICAgICAgICBjdHguc3Ryb2tlKCk7XG4gICAgICAgIGN0eC5jbG9zZVBhdGgoKTtcbiAgICB9XG4gIH1cbn1cblxuXG5mdW5jdGlvbiBhZGRHZXN0dXJlVGh1bWJuYWlsKGNhbnZhcywgZ2VzdHVyZV9pZCkge1xuICAgIC8vIGRlY2xhcmUgdGhlIGNhbnZhIHdoZXJlIHRvIGRyYXcgYSB0aHVtYm5haWxcbiAgICBsZXQgdGh1bWJDbnZzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgdGh1bWJDbnZzLndpZHRoID0gNzA7XG4gICAgdGh1bWJDbnZzLmhlaWdodCA9IDcwO1xuICAgIHRodW1iQ252cy5zdHlsZS5ib3JkZXIgPSBcIjFweCBzb2xpZFwiO1xuICAgIC8vIGdldCBjb250ZXh0IHRvIGZpbGwgd2l0aCBia2cgY29sb3IgYW5kIGltYWdlXG4gICAgbGV0IGN0eCA9IHRodW1iQ252cy5nZXRDb250ZXh0KCcyZCcpO1xuICAgIGN0eC5maWxsU3R5bGUgPSBcIndoaXRlXCI7XG4gICAgY3R4LmZpbGxSZWN0KDAsIDAsIHRodW1iQ252cy53aWR0aCwgdGh1bWJDbnZzLmhlaWdodCk7IFxuICAgIGN0eC5kcmF3SW1hZ2UoY2FudmFzLCAwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQsIDAsIDAsIHRodW1iQ252cy53aWR0aCwgdGh1bWJDbnZzLmhlaWdodCk7XG4gICAgLy8gYWRkIHRvIHRoZSBib2R5IGRvY3VtZW50XG4gICAgdmFyIGJvZHkgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImJvZHlcIilbMF07XG4gICAgYm9keS5hcHBlbmRDaGlsZCh0aHVtYkNudnMpO1xufVxuXG5cbmZ1bmN0aW9uIGdldE1vdXNlWFlpbkNhbnZhcyhjYW52YXMsIGUpIHtcbiAgY29uc3QgeyB0b3AsIGxlZnQsIHdpZHRoLCBoZWlnaHQgfSA9IGNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgY29uc3QgY2xpZW50WCA9IChlLnBhZ2VYIC0gbGVmdCkgLyB3aWR0aDtcbiAgY29uc3QgY2xpZW50WSA9IChlLnBhZ2VZIC0gdG9wKSAvIGhlaWdodDtcbiAgcmV0dXJuIFtjbGllbnRYLCBjbGllbnRZXVxufVxuXG5cbmZ1bmN0aW9uIGFkZEJveFRvQm9keSh3aWR0aCwgaGVpZ2h0LCBuYW1lLCBib3h0aXRsZSkge1xuICAvLyBjcmVhdGUgb3V0ZXIgRElWXG4gIHZhciBpRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGlEaXYuaWQgPSAnYmxvY2stJytTdHJpbmcoTWF0aC5yYW5kb20oKSAqIDEwMDAwKTtcbiAgaURpdi5jbGFzc05hbWUgPSAnYm94JztcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2JvZHknKVswXS5hcHBlbmRDaGlsZChpRGl2KTtcbiAgLy8gY3JlYXRlIGNhbnZhc1xuICBsZXQgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gIGNhbnZhcy53aWR0aCA9IHdpZHRoO1xuICBjYW52YXMuaGVpZ2h0ID0gaGVpZ2h0O1xuICBjYW52YXMuc3R5bGUuYm9yZGVyID0gXCIwcHhcIjtcbiAgY2FudmFzLmlkID0gbmFtZTtcbiAgbGV0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICBjdHguZmlsbFN0eWxlID0gXCJ3aGl0ZVwiO1xuICBjdHguZmlsbFJlY3QoMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTsgXG4gIGxldCBkaXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpRGl2LmlkKTtcbiAgZGl2LmFwcGVuZENoaWxkKGNhbnZhcyk7XG4gIC8vIGNyZWF0ZSBkaXYgZm9yIHRpdGxlXG4gIGxldCB0aXRsZURpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICB0aXRsZURpdi5jbGFzc05hbWUgPSAnYm94dGl0bGUnO1xuICB0aXRsZURpdi5pbm5lckhUTUwgKz0gYm94dGl0bGU7XG4gIGRpdi5hcHBlbmRDaGlsZCh0aXRsZURpdik7XG59XG5cbmV4cG9ydCB7IGFkZEJveFRvQm9keSwgZHJhd0dlc3R1cmUsIGFkZEdlc3R1cmVUaHVtYm5haWwsIGdldE1vdXNlWFlpbkNhbnZhc307XG4iLCJpbXBvcnQgeyBhZGRCb3hUb0JvZHksIGRyYXdHZXN0dXJlLCBhZGRHZXN0dXJlVGh1bWJuYWlsLCBnZXRNb3VzZVhZaW5DYW52YXN9IGZyb20gJy4vZHJhdyc7XG5pbXBvcnQgRGF0YXNldCBmcm9tICcuL2RhdGFzZXQnO1xuXG5cbmNvbnN0ICRkcmF3aW5nID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2RyYXdDYW4nKTtcblxuY29uc3QgZGF0YXNldCA9IG5ldyBEYXRhc2V0KCk7XG5cblxuLy8gc3RhcnQgd2hlbiBtb3VzZSBpcyBkb3duXG4kZHJhd2luZy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBmdW5jdGlvbihlKSB7XG4gIGNvbnN0IGNvb3JkaW5hdGVzID0gZ2V0TW91c2VYWWluQ2FudmFzKCRkcmF3aW5nLCBlKTtcbiAgZHJhd0dlc3R1cmUoJGRyYXdpbmcsICdkb3duJywgZSk7XG59KTtcblxuLy8gc3RhcnQgd2hlbiBtb3VzZSBpcyBkb3duXG4kZHJhd2luZy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBmdW5jdGlvbihlKSB7XG4gIGRyYXdHZXN0dXJlKCRkcmF3aW5nLCAnbW92ZScsIGUpO1xuICBjb25zdCBjb29yZGluYXRlcyA9IGdldE1vdXNlWFlpbkNhbnZhcygkZHJhd2luZywgZSk7XG4gIGRhdGFzZXQuZmlsbEdlc3R1cmUoY29vcmRpbmF0ZXMpO1xufSk7XG5cbi8vIHN0b3Agd2hlbiBtb3VzZSBpcyB1cFxuJGRyYXdpbmcuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIGZ1bmN0aW9uKGUpIHtcbiAgZHJhd0dlc3R1cmUoJGRyYXdpbmcsICd1cCcsIGUpO1xuICBkYXRhc2V0LmFkZEdlc3R1cmVXaXRoTGFiZWwoMSk7XG59KTtcblxuXG4vLyBjb25zdCAkc2hvdyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzaG93Jyk7XG4vLyAkc2hvdy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbi8vICAgY29uc29sZS5sb2coJ3RoZXJlIGFyZSAnICsgU3RyaW5nKGRhdGFzZXQuZ2V0TnVtR2VzdHVyZXMoKSkpO1xuLy8gfSlcblxuXG5cbiIsIm1vZHVsZS5leHBvcnRzID0geyBcImRlZmF1bHRcIjogcmVxdWlyZShcImNvcmUtanMvbGlicmFyeS9mbi9vYmplY3QvZGVmaW5lLXByb3BlcnR5XCIpLCBfX2VzTW9kdWxlOiB0cnVlIH07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbmV4cG9ydHMuZGVmYXVsdCA9IGZ1bmN0aW9uIChpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHtcbiAgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG52YXIgX2RlZmluZVByb3BlcnR5ID0gcmVxdWlyZShcIi4uL2NvcmUtanMvb2JqZWN0L2RlZmluZS1wcm9wZXJ0eVwiKTtcblxudmFyIF9kZWZpbmVQcm9wZXJ0eTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9kZWZpbmVQcm9wZXJ0eSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbmV4cG9ydHMuZGVmYXVsdCA9IGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTtcbiAgICAgIGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTtcbiAgICAgIGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTtcbiAgICAgIGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7XG4gICAgICAoMCwgX2RlZmluZVByb3BlcnR5Mi5kZWZhdWx0KSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykge1xuICAgIGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7XG4gICAgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7XG4gICAgcmV0dXJuIENvbnN0cnVjdG9yO1xuICB9O1xufSgpOyIsInJlcXVpcmUoJy4uLy4uL21vZHVsZXMvZXM2Lm9iamVjdC5kZWZpbmUtcHJvcGVydHknKTtcbnZhciAkT2JqZWN0ID0gcmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9fY29yZScpLk9iamVjdDtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZGVmaW5lUHJvcGVydHkoaXQsIGtleSwgZGVzYykge1xuICByZXR1cm4gJE9iamVjdC5kZWZpbmVQcm9wZXJ0eShpdCwga2V5LCBkZXNjKTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICBpZiAodHlwZW9mIGl0ICE9ICdmdW5jdGlvbicpIHRocm93IFR5cGVFcnJvcihpdCArICcgaXMgbm90IGEgZnVuY3Rpb24hJyk7XG4gIHJldHVybiBpdDtcbn07XG4iLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIGlmICghaXNPYmplY3QoaXQpKSB0aHJvdyBUeXBlRXJyb3IoaXQgKyAnIGlzIG5vdCBhbiBvYmplY3QhJyk7XG4gIHJldHVybiBpdDtcbn07XG4iLCJ2YXIgY29yZSA9IG1vZHVsZS5leHBvcnRzID0geyB2ZXJzaW9uOiAnMi41LjMnIH07XG5pZiAodHlwZW9mIF9fZSA9PSAnbnVtYmVyJykgX19lID0gY29yZTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bmRlZlxuIiwiLy8gb3B0aW9uYWwgLyBzaW1wbGUgY29udGV4dCBiaW5kaW5nXG52YXIgYUZ1bmN0aW9uID0gcmVxdWlyZSgnLi9fYS1mdW5jdGlvbicpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZm4sIHRoYXQsIGxlbmd0aCkge1xuICBhRnVuY3Rpb24oZm4pO1xuICBpZiAodGhhdCA9PT0gdW5kZWZpbmVkKSByZXR1cm4gZm47XG4gIHN3aXRjaCAobGVuZ3RoKSB7XG4gICAgY2FzZSAxOiByZXR1cm4gZnVuY3Rpb24gKGEpIHtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEpO1xuICAgIH07XG4gICAgY2FzZSAyOiByZXR1cm4gZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEsIGIpO1xuICAgIH07XG4gICAgY2FzZSAzOiByZXR1cm4gZnVuY3Rpb24gKGEsIGIsIGMpIHtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEsIGIsIGMpO1xuICAgIH07XG4gIH1cbiAgcmV0dXJuIGZ1bmN0aW9uICgvKiAuLi5hcmdzICovKSB7XG4gICAgcmV0dXJuIGZuLmFwcGx5KHRoYXQsIGFyZ3VtZW50cyk7XG4gIH07XG59O1xuIiwiLy8gVGhhbmsncyBJRTggZm9yIGhpcyBmdW5ueSBkZWZpbmVQcm9wZXJ0eVxubW9kdWxlLmV4cG9ydHMgPSAhcmVxdWlyZSgnLi9fZmFpbHMnKShmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHkoe30sICdhJywgeyBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIDc7IH0gfSkuYSAhPSA3O1xufSk7XG4iLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbnZhciBkb2N1bWVudCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpLmRvY3VtZW50O1xuLy8gdHlwZW9mIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQgaXMgJ29iamVjdCcgaW4gb2xkIElFXG52YXIgaXMgPSBpc09iamVjdChkb2N1bWVudCkgJiYgaXNPYmplY3QoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gaXMgPyBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGl0KSA6IHt9O1xufTtcbiIsInZhciBnbG9iYWwgPSByZXF1aXJlKCcuL19nbG9iYWwnKTtcbnZhciBjb3JlID0gcmVxdWlyZSgnLi9fY29yZScpO1xudmFyIGN0eCA9IHJlcXVpcmUoJy4vX2N0eCcpO1xudmFyIGhpZGUgPSByZXF1aXJlKCcuL19oaWRlJyk7XG52YXIgUFJPVE9UWVBFID0gJ3Byb3RvdHlwZSc7XG5cbnZhciAkZXhwb3J0ID0gZnVuY3Rpb24gKHR5cGUsIG5hbWUsIHNvdXJjZSkge1xuICB2YXIgSVNfRk9SQ0VEID0gdHlwZSAmICRleHBvcnQuRjtcbiAgdmFyIElTX0dMT0JBTCA9IHR5cGUgJiAkZXhwb3J0Lkc7XG4gIHZhciBJU19TVEFUSUMgPSB0eXBlICYgJGV4cG9ydC5TO1xuICB2YXIgSVNfUFJPVE8gPSB0eXBlICYgJGV4cG9ydC5QO1xuICB2YXIgSVNfQklORCA9IHR5cGUgJiAkZXhwb3J0LkI7XG4gIHZhciBJU19XUkFQID0gdHlwZSAmICRleHBvcnQuVztcbiAgdmFyIGV4cG9ydHMgPSBJU19HTE9CQUwgPyBjb3JlIDogY29yZVtuYW1lXSB8fCAoY29yZVtuYW1lXSA9IHt9KTtcbiAgdmFyIGV4cFByb3RvID0gZXhwb3J0c1tQUk9UT1RZUEVdO1xuICB2YXIgdGFyZ2V0ID0gSVNfR0xPQkFMID8gZ2xvYmFsIDogSVNfU1RBVElDID8gZ2xvYmFsW25hbWVdIDogKGdsb2JhbFtuYW1lXSB8fCB7fSlbUFJPVE9UWVBFXTtcbiAgdmFyIGtleSwgb3duLCBvdXQ7XG4gIGlmIChJU19HTE9CQUwpIHNvdXJjZSA9IG5hbWU7XG4gIGZvciAoa2V5IGluIHNvdXJjZSkge1xuICAgIC8vIGNvbnRhaW5zIGluIG5hdGl2ZVxuICAgIG93biA9ICFJU19GT1JDRUQgJiYgdGFyZ2V0ICYmIHRhcmdldFtrZXldICE9PSB1bmRlZmluZWQ7XG4gICAgaWYgKG93biAmJiBrZXkgaW4gZXhwb3J0cykgY29udGludWU7XG4gICAgLy8gZXhwb3J0IG5hdGl2ZSBvciBwYXNzZWRcbiAgICBvdXQgPSBvd24gPyB0YXJnZXRba2V5XSA6IHNvdXJjZVtrZXldO1xuICAgIC8vIHByZXZlbnQgZ2xvYmFsIHBvbGx1dGlvbiBmb3IgbmFtZXNwYWNlc1xuICAgIGV4cG9ydHNba2V5XSA9IElTX0dMT0JBTCAmJiB0eXBlb2YgdGFyZ2V0W2tleV0gIT0gJ2Z1bmN0aW9uJyA/IHNvdXJjZVtrZXldXG4gICAgLy8gYmluZCB0aW1lcnMgdG8gZ2xvYmFsIGZvciBjYWxsIGZyb20gZXhwb3J0IGNvbnRleHRcbiAgICA6IElTX0JJTkQgJiYgb3duID8gY3R4KG91dCwgZ2xvYmFsKVxuICAgIC8vIHdyYXAgZ2xvYmFsIGNvbnN0cnVjdG9ycyBmb3IgcHJldmVudCBjaGFuZ2UgdGhlbSBpbiBsaWJyYXJ5XG4gICAgOiBJU19XUkFQICYmIHRhcmdldFtrZXldID09IG91dCA/IChmdW5jdGlvbiAoQykge1xuICAgICAgdmFyIEYgPSBmdW5jdGlvbiAoYSwgYiwgYykge1xuICAgICAgICBpZiAodGhpcyBpbnN0YW5jZW9mIEMpIHtcbiAgICAgICAgICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGNhc2UgMDogcmV0dXJuIG5ldyBDKCk7XG4gICAgICAgICAgICBjYXNlIDE6IHJldHVybiBuZXcgQyhhKTtcbiAgICAgICAgICAgIGNhc2UgMjogcmV0dXJuIG5ldyBDKGEsIGIpO1xuICAgICAgICAgIH0gcmV0dXJuIG5ldyBDKGEsIGIsIGMpO1xuICAgICAgICB9IHJldHVybiBDLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICB9O1xuICAgICAgRltQUk9UT1RZUEVdID0gQ1tQUk9UT1RZUEVdO1xuICAgICAgcmV0dXJuIEY7XG4gICAgLy8gbWFrZSBzdGF0aWMgdmVyc2lvbnMgZm9yIHByb3RvdHlwZSBtZXRob2RzXG4gICAgfSkob3V0KSA6IElTX1BST1RPICYmIHR5cGVvZiBvdXQgPT0gJ2Z1bmN0aW9uJyA/IGN0eChGdW5jdGlvbi5jYWxsLCBvdXQpIDogb3V0O1xuICAgIC8vIGV4cG9ydCBwcm90byBtZXRob2RzIHRvIGNvcmUuJUNPTlNUUlVDVE9SJS5tZXRob2RzLiVOQU1FJVxuICAgIGlmIChJU19QUk9UTykge1xuICAgICAgKGV4cG9ydHMudmlydHVhbCB8fCAoZXhwb3J0cy52aXJ0dWFsID0ge30pKVtrZXldID0gb3V0O1xuICAgICAgLy8gZXhwb3J0IHByb3RvIG1ldGhvZHMgdG8gY29yZS4lQ09OU1RSVUNUT1IlLnByb3RvdHlwZS4lTkFNRSVcbiAgICAgIGlmICh0eXBlICYgJGV4cG9ydC5SICYmIGV4cFByb3RvICYmICFleHBQcm90b1trZXldKSBoaWRlKGV4cFByb3RvLCBrZXksIG91dCk7XG4gICAgfVxuICB9XG59O1xuLy8gdHlwZSBiaXRtYXBcbiRleHBvcnQuRiA9IDE7ICAgLy8gZm9yY2VkXG4kZXhwb3J0LkcgPSAyOyAgIC8vIGdsb2JhbFxuJGV4cG9ydC5TID0gNDsgICAvLyBzdGF0aWNcbiRleHBvcnQuUCA9IDg7ICAgLy8gcHJvdG9cbiRleHBvcnQuQiA9IDE2OyAgLy8gYmluZFxuJGV4cG9ydC5XID0gMzI7ICAvLyB3cmFwXG4kZXhwb3J0LlUgPSA2NDsgIC8vIHNhZmVcbiRleHBvcnQuUiA9IDEyODsgLy8gcmVhbCBwcm90byBtZXRob2QgZm9yIGBsaWJyYXJ5YFxubW9kdWxlLmV4cG9ydHMgPSAkZXhwb3J0O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZXhlYykge1xuICB0cnkge1xuICAgIHJldHVybiAhIWV4ZWMoKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG59O1xuIiwiLy8gaHR0cHM6Ly9naXRodWIuY29tL3psb2lyb2NrL2NvcmUtanMvaXNzdWVzLzg2I2lzc3VlY29tbWVudC0xMTU3NTkwMjhcbnZhciBnbG9iYWwgPSBtb2R1bGUuZXhwb3J0cyA9IHR5cGVvZiB3aW5kb3cgIT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93Lk1hdGggPT0gTWF0aFxuICA/IHdpbmRvdyA6IHR5cGVvZiBzZWxmICE9ICd1bmRlZmluZWQnICYmIHNlbGYuTWF0aCA9PSBNYXRoID8gc2VsZlxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tbmV3LWZ1bmNcbiAgOiBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuaWYgKHR5cGVvZiBfX2cgPT0gJ251bWJlcicpIF9fZyA9IGdsb2JhbDsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bmRlZlxuIiwidmFyIGRQID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJyk7XG52YXIgY3JlYXRlRGVzYyA9IHJlcXVpcmUoJy4vX3Byb3BlcnR5LWRlc2MnKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSA/IGZ1bmN0aW9uIChvYmplY3QsIGtleSwgdmFsdWUpIHtcbiAgcmV0dXJuIGRQLmYob2JqZWN0LCBrZXksIGNyZWF0ZURlc2MoMSwgdmFsdWUpKTtcbn0gOiBmdW5jdGlvbiAob2JqZWN0LCBrZXksIHZhbHVlKSB7XG4gIG9iamVjdFtrZXldID0gdmFsdWU7XG4gIHJldHVybiBvYmplY3Q7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSAhcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSAmJiAhcmVxdWlyZSgnLi9fZmFpbHMnKShmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHkocmVxdWlyZSgnLi9fZG9tLWNyZWF0ZScpKCdkaXYnKSwgJ2EnLCB7IGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gNzsgfSB9KS5hICE9IDc7XG59KTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiB0eXBlb2YgaXQgPT09ICdvYmplY3QnID8gaXQgIT09IG51bGwgOiB0eXBlb2YgaXQgPT09ICdmdW5jdGlvbic7XG59O1xuIiwidmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG52YXIgSUU4X0RPTV9ERUZJTkUgPSByZXF1aXJlKCcuL19pZTgtZG9tLWRlZmluZScpO1xudmFyIHRvUHJpbWl0aXZlID0gcmVxdWlyZSgnLi9fdG8tcHJpbWl0aXZlJyk7XG52YXIgZFAgPSBPYmplY3QuZGVmaW5lUHJvcGVydHk7XG5cbmV4cG9ydHMuZiA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgPyBPYmplY3QuZGVmaW5lUHJvcGVydHkgOiBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0eShPLCBQLCBBdHRyaWJ1dGVzKSB7XG4gIGFuT2JqZWN0KE8pO1xuICBQID0gdG9QcmltaXRpdmUoUCwgdHJ1ZSk7XG4gIGFuT2JqZWN0KEF0dHJpYnV0ZXMpO1xuICBpZiAoSUU4X0RPTV9ERUZJTkUpIHRyeSB7XG4gICAgcmV0dXJuIGRQKE8sIFAsIEF0dHJpYnV0ZXMpO1xuICB9IGNhdGNoIChlKSB7IC8qIGVtcHR5ICovIH1cbiAgaWYgKCdnZXQnIGluIEF0dHJpYnV0ZXMgfHwgJ3NldCcgaW4gQXR0cmlidXRlcykgdGhyb3cgVHlwZUVycm9yKCdBY2Nlc3NvcnMgbm90IHN1cHBvcnRlZCEnKTtcbiAgaWYgKCd2YWx1ZScgaW4gQXR0cmlidXRlcykgT1tQXSA9IEF0dHJpYnV0ZXMudmFsdWU7XG4gIHJldHVybiBPO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGJpdG1hcCwgdmFsdWUpIHtcbiAgcmV0dXJuIHtcbiAgICBlbnVtZXJhYmxlOiAhKGJpdG1hcCAmIDEpLFxuICAgIGNvbmZpZ3VyYWJsZTogIShiaXRtYXAgJiAyKSxcbiAgICB3cml0YWJsZTogIShiaXRtYXAgJiA0KSxcbiAgICB2YWx1ZTogdmFsdWVcbiAgfTtcbn07XG4iLCIvLyA3LjEuMSBUb1ByaW1pdGl2ZShpbnB1dCBbLCBQcmVmZXJyZWRUeXBlXSlcbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xuLy8gaW5zdGVhZCBvZiB0aGUgRVM2IHNwZWMgdmVyc2lvbiwgd2UgZGlkbid0IGltcGxlbWVudCBAQHRvUHJpbWl0aXZlIGNhc2Vcbi8vIGFuZCB0aGUgc2Vjb25kIGFyZ3VtZW50IC0gZmxhZyAtIHByZWZlcnJlZCB0eXBlIGlzIGEgc3RyaW5nXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCwgUykge1xuICBpZiAoIWlzT2JqZWN0KGl0KSkgcmV0dXJuIGl0O1xuICB2YXIgZm4sIHZhbDtcbiAgaWYgKFMgJiYgdHlwZW9mIChmbiA9IGl0LnRvU3RyaW5nKSA9PSAnZnVuY3Rpb24nICYmICFpc09iamVjdCh2YWwgPSBmbi5jYWxsKGl0KSkpIHJldHVybiB2YWw7XG4gIGlmICh0eXBlb2YgKGZuID0gaXQudmFsdWVPZikgPT0gJ2Z1bmN0aW9uJyAmJiAhaXNPYmplY3QodmFsID0gZm4uY2FsbChpdCkpKSByZXR1cm4gdmFsO1xuICBpZiAoIVMgJiYgdHlwZW9mIChmbiA9IGl0LnRvU3RyaW5nKSA9PSAnZnVuY3Rpb24nICYmICFpc09iamVjdCh2YWwgPSBmbi5jYWxsKGl0KSkpIHJldHVybiB2YWw7XG4gIHRocm93IFR5cGVFcnJvcihcIkNhbid0IGNvbnZlcnQgb2JqZWN0IHRvIHByaW1pdGl2ZSB2YWx1ZVwiKTtcbn07XG4iLCJ2YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xuLy8gMTkuMS4yLjQgLyAxNS4yLjMuNiBPYmplY3QuZGVmaW5lUHJvcGVydHkoTywgUCwgQXR0cmlidXRlcylcbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogIXJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJyksICdPYmplY3QnLCB7IGRlZmluZVByb3BlcnR5OiByZXF1aXJlKCcuL19vYmplY3QtZHAnKS5mIH0pO1xuIl19
