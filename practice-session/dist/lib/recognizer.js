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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlY29nbml6ZXIuanMiXSwibmFtZXMiOlsidXRpbHMiLCJSZWNvZ25pemVyIiwidHJhaW5pbmdEYXRhIiwidHJhaW5pbmdMYWJlbHMiLCJkYXRhc2V0IiwiZ2V0R2VzdHVyZXMiLCJnZXRMYWJlbHMiLCJnZXN0dXJlIiwibWluRGlzdGFuY2UiLCJJbmZpbml0eSIsIm1pbkluZGV4IiwiaSIsImxlbmd0aCIsInRlbXBsYXRlIiwiZGlzdCIsImsiLCJNYXRoIiwibWluIiwiZGlzdGFuY2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBS0E7O0lBQVlBLEs7Ozs7OztJQUdOQyxVO0FBRUosd0JBQWM7QUFBQTs7QUFDWixTQUFLQyxZQUFMLEdBQW9CLEVBQXBCO0FBQ0EsU0FBS0MsY0FBTCxHQUFzQixFQUF0QjtBQUNEOzs7O3dCQUdHQyxPLEVBQVM7QUFDWCxXQUFLRixZQUFMLEdBQW9CRSxRQUFRQyxXQUFSLEVBQXBCO0FBQ0EsV0FBS0YsY0FBTCxHQUFzQkMsUUFBUUUsU0FBUixFQUF0QjtBQUNEOzs7NEJBRU9DLE8sRUFBUztBQUNmLFVBQUlDLGNBQWNDLFFBQWxCO0FBQ0EsVUFBSUMsV0FBVyxDQUFDLENBQWhCOztBQUVBOztBQUVBLFdBQUssSUFBSUMsSUFBRSxDQUFYLEVBQWNBLElBQUksS0FBS1QsWUFBTCxDQUFrQlUsTUFBcEMsRUFBNENELEdBQTVDLEVBQWlEOztBQUUvQyxZQUFNRSxXQUFXLEtBQUtYLFlBQUwsQ0FBa0JTLENBQWxCLENBQWpCO0FBQ0EsWUFBSUcsT0FBTyxHQUFYO0FBQ0EsYUFBSyxJQUFJQyxJQUFFLENBQVgsRUFBY0EsSUFBSUMsS0FBS0MsR0FBTCxDQUFTSixTQUFTRCxNQUFsQixFQUEwQkwsUUFBUUssTUFBbEMsQ0FBbEIsRUFBNkRHLEdBQTdELEVBQWlFO0FBQzdERCxpQkFBT0EsT0FBT2QsTUFBTWtCLFFBQU4sQ0FBZUwsU0FBU0UsQ0FBVCxDQUFmLEVBQTRCUixRQUFRUSxDQUFSLENBQTVCLENBQWQ7QUFDSDs7QUFFRCxZQUFJRCxPQUFPTixXQUFYLEVBQXVCO0FBQ3JCQSx3QkFBY00sSUFBZDtBQUNBSixxQkFBV0MsQ0FBWDtBQUNEO0FBRUY7QUFDRCxhQUFPLEtBQUtSLGNBQUwsQ0FBb0JPLFFBQXBCLENBQVA7QUFFRDs7O0tBM0NIOzs7OztrQkErQ2VULFUiLCJmaWxlIjoicmVjb2duaXplci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogUmVjb25naXplciBjbGFzc1xuICogU2ltcGxlIHRlbXBsYXRlLWJhc2VkIHJlY29nbml6ZXJcbiAqL1xuXG5pbXBvcnQgKiBhcyB1dGlscyBmcm9tICcuL3V0aWxzJ1xuXG5cbmNsYXNzIFJlY29nbml6ZXIge1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMudHJhaW5pbmdEYXRhID0gW107XG4gICAgdGhpcy50cmFpbmluZ0xhYmVscyA9IFtdO1xuICB9XG5cblxuICBmaXQoZGF0YXNldCkge1xuICAgIHRoaXMudHJhaW5pbmdEYXRhID0gZGF0YXNldC5nZXRHZXN0dXJlcygpO1xuICAgIHRoaXMudHJhaW5pbmdMYWJlbHMgPSBkYXRhc2V0LmdldExhYmVscygpO1xuICB9XG5cbiAgcHJlZGljdChnZXN0dXJlKSB7XG4gICAgbGV0IG1pbkRpc3RhbmNlID0gSW5maW5pdHk7XG4gICAgbGV0IG1pbkluZGV4ID0gLTE7XG5cbiAgICAvLyBUT0RPIFRyYW5zbGF0ZSBTdGFydGluZyBwb2ludCBvZiBnZXN0dXJlc1xuXG4gICAgZm9yIChsZXQgaT0wOyBpIDwgdGhpcy50cmFpbmluZ0RhdGEubGVuZ3RoOyBpKyspIHtcblxuICAgICAgY29uc3QgdGVtcGxhdGUgPSB0aGlzLnRyYWluaW5nRGF0YVtpXTtcbiAgICAgIGxldCBkaXN0ID0gMC4wO1xuICAgICAgZm9yIChsZXQgaz0wOyBrIDwgTWF0aC5taW4odGVtcGxhdGUubGVuZ3RoLCBnZXN0dXJlLmxlbmd0aCk7IGsrKyl7XG4gICAgICAgICAgZGlzdCA9IGRpc3QgKyB1dGlscy5kaXN0YW5jZSh0ZW1wbGF0ZVtrXSwgZ2VzdHVyZVtrXSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChkaXN0IDwgbWluRGlzdGFuY2Upe1xuICAgICAgICBtaW5EaXN0YW5jZSA9IGRpc3Q7XG4gICAgICAgIG1pbkluZGV4ID0gaTtcbiAgICAgIH1cblxuICAgIH1cbiAgICByZXR1cm4gdGhpcy50cmFpbmluZ0xhYmVsc1ttaW5JbmRleF07XG5cbiAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IFJlY29nbml6ZXI7XG4iXX0=