"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Recognizer = function () {
  function Recognizer() {
    (0, _classCallCheck3.default)(this, Recognizer);

    this.training_data = [];
    this.labels = [];
  }

  (0, _createClass3.default)(Recognizer, [{
    key: "fit",
    value: function fit(dataset) {
      this.training_data = [];
      this.labels = [];
      var all_gestures = dataset.get_gestures();
      var all_labels = dataset.get_labels();
      for (var i = 0; i < all_gestures.length; i++) {
        this.training_data.push(all_gestures[i]);
        this.labels.push(all_labels[i]);
      }
      // do clever fitting here

      return true; // flag saying that the model is trained basically
    }
  }, {
    key: "predict",
    value: function predict(data) {
      // random prediction
      var min = 1;
      var max = this.labels[this.labels.length - 1] + 1;
      return Math.floor(Math.random() * (max - min)) + min;
    }
  }]);
  return Recognizer;
}();

exports.default = Recognizer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFsZ28uanMiXSwibmFtZXMiOlsiUmVjb2duaXplciIsInRyYWluaW5nX2RhdGEiLCJsYWJlbHMiLCJkYXRhc2V0IiwiYWxsX2dlc3R1cmVzIiwiZ2V0X2dlc3R1cmVzIiwiYWxsX2xhYmVscyIsImdldF9sYWJlbHMiLCJpIiwibGVuZ3RoIiwicHVzaCIsImRhdGEiLCJtaW4iLCJtYXgiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7SUFBTUEsVTtBQUVKLHdCQUFjO0FBQUE7O0FBQ1osU0FBS0MsYUFBTCxHQUFxQixFQUFyQjtBQUNBLFNBQUtDLE1BQUwsR0FBYyxFQUFkO0FBQ0Q7Ozs7d0JBRUdDLE8sRUFBUztBQUNYLFdBQUtGLGFBQUwsR0FBcUIsRUFBckI7QUFDQSxXQUFLQyxNQUFMLEdBQWMsRUFBZDtBQUNBLFVBQU1FLGVBQWVELFFBQVFFLFlBQVIsRUFBckI7QUFDQSxVQUFNQyxhQUFhSCxRQUFRSSxVQUFSLEVBQW5CO0FBQ0EsV0FBSyxJQUFJQyxJQUFJLENBQWIsRUFBZ0JBLElBQUlKLGFBQWFLLE1BQWpDLEVBQXlDRCxHQUF6QyxFQUE4QztBQUMxQyxhQUFLUCxhQUFMLENBQW1CUyxJQUFuQixDQUF3Qk4sYUFBYUksQ0FBYixDQUF4QjtBQUNBLGFBQUtOLE1BQUwsQ0FBWVEsSUFBWixDQUFpQkosV0FBV0UsQ0FBWCxDQUFqQjtBQUNIO0FBQ0Q7O0FBRUEsYUFBTyxJQUFQLENBWFcsQ0FXRTtBQUNkOzs7NEJBRU9HLEksRUFBTTtBQUNaO0FBQ0EsVUFBTUMsTUFBTSxDQUFaO0FBQ0EsVUFBTUMsTUFBTSxLQUFLWCxNQUFMLENBQVksS0FBS0EsTUFBTCxDQUFZTyxNQUFaLEdBQW1CLENBQS9CLElBQW9DLENBQWhEO0FBQ0EsYUFBT0ssS0FBS0MsS0FBTCxDQUFXRCxLQUFLRSxNQUFMLE1BQWlCSCxNQUFNRCxHQUF2QixDQUFYLElBQTBDQSxHQUFqRDtBQUNEOzs7OztrQkFJWVosVSIsImZpbGUiOiJBbGdvLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgUmVjb2duaXplciB7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy50cmFpbmluZ19kYXRhID0gW107XG4gICAgdGhpcy5sYWJlbHMgPSBbXTtcbiAgfVxuXG4gIGZpdChkYXRhc2V0KSB7XG4gICAgdGhpcy50cmFpbmluZ19kYXRhID0gW107XG4gICAgdGhpcy5sYWJlbHMgPSBbXVxuICAgIGNvbnN0IGFsbF9nZXN0dXJlcyA9IGRhdGFzZXQuZ2V0X2dlc3R1cmVzKCk7XG4gICAgY29uc3QgYWxsX2xhYmVscyA9IGRhdGFzZXQuZ2V0X2xhYmVscygpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYWxsX2dlc3R1cmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHRoaXMudHJhaW5pbmdfZGF0YS5wdXNoKGFsbF9nZXN0dXJlc1tpXSk7XG4gICAgICAgIHRoaXMubGFiZWxzLnB1c2goYWxsX2xhYmVsc1tpXSk7XG4gICAgfVxuICAgIC8vIGRvIGNsZXZlciBmaXR0aW5nIGhlcmVcblxuICAgIHJldHVybiB0cnVlOyAvLyBmbGFnIHNheWluZyB0aGF0IHRoZSBtb2RlbCBpcyB0cmFpbmVkIGJhc2ljYWxseVxuICB9XG5cbiAgcHJlZGljdChkYXRhKSB7XG4gICAgLy8gcmFuZG9tIHByZWRpY3Rpb25cbiAgICBjb25zdCBtaW4gPSAxO1xuICAgIGNvbnN0IG1heCA9IHRoaXMubGFiZWxzW3RoaXMubGFiZWxzLmxlbmd0aC0xXSArIDE7XG4gICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4pKSArIG1pbjtcbiAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IFJlY29nbml6ZXI7Il19