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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRhdGFzZXQuanMiXSwibmFtZXMiOlsiRGF0YXNldCIsImdlc3R1cmUiLCJhbGxHZXN0dXJlcyIsImFsbExhYmVscyIsImRhdGEiLCJwdXNoIiwibGFiZWwiLCJsZW5ndGgiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7SUFDTUEsTztBQUVKLHFCQUFlO0FBQUE7O0FBQ2IsU0FBS0MsT0FBTCxHQUFlLEVBQWY7QUFDQSxTQUFLQyxXQUFMLEdBQW1CLEVBQW5CO0FBQ0EsU0FBS0MsU0FBTCxHQUFpQixFQUFqQjtBQUNEOzs7O2dDQUVXQyxJLEVBQU07QUFDaEIsV0FBS0gsT0FBTCxDQUFhSSxJQUFiLENBQWtCRCxJQUFsQjtBQUNEOzs7d0NBRW1CRSxLLEVBQU87QUFDekIsV0FBS0osV0FBTCxDQUFpQkcsSUFBakIsQ0FBc0IsS0FBS0osT0FBM0I7QUFDQSxXQUFLQSxPQUFMLEdBQWUsRUFBZjtBQUNBLFdBQUtFLFNBQUwsQ0FBZUUsSUFBZixDQUFvQkMsS0FBcEI7QUFDRDs7O3FDQUVnQjtBQUNmLGFBQU8sS0FBS0osV0FBTCxDQUFpQkssTUFBeEI7QUFDRDs7O3dDQUVtQjtBQUNsQixhQUFPLEtBQUtOLE9BQVo7QUFDRDs7O2tDQUVhO0FBQ1osYUFBTyxLQUFLQyxXQUFaO0FBQ0Q7OztnQ0FFVztBQUNWLGFBQU8sS0FBS0MsU0FBWjtBQUNEOzs7OztrQkFJWUgsTyIsImZpbGUiOiJkYXRhc2V0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG5jbGFzcyBEYXRhc2V0IHtcblxuICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgdGhpcy5nZXN0dXJlID0gW11cbiAgICB0aGlzLmFsbEdlc3R1cmVzID0gW107XG4gICAgdGhpcy5hbGxMYWJlbHMgPSBbXTtcbiAgfVxuXG4gIGZpbGxHZXN0dXJlKGRhdGEpIHtcbiAgICB0aGlzLmdlc3R1cmUucHVzaChkYXRhKTtcbiAgfVxuXG4gIGFkZEdlc3R1cmVXaXRoTGFiZWwobGFiZWwpIHtcbiAgICB0aGlzLmFsbEdlc3R1cmVzLnB1c2godGhpcy5nZXN0dXJlKTtcbiAgICB0aGlzLmdlc3R1cmUgPSBbXTtcbiAgICB0aGlzLmFsbExhYmVscy5wdXNoKGxhYmVsKTtcbiAgfVxuXG4gIGdldE51bUdlc3R1cmVzKCkge1xuICAgIHJldHVybiB0aGlzLmFsbEdlc3R1cmVzLmxlbmd0aDtcbiAgfVxuXG4gIGdldEN1cnJlbnRHZXN0dXJlKCkge1xuICAgIHJldHVybiB0aGlzLmdlc3R1cmU7XG4gIH1cblxuICBnZXRHZXN0dXJlcygpIHtcbiAgICByZXR1cm4gdGhpcy5hbGxHZXN0dXJlcztcbiAgfVxuXG4gIGdldExhYmVscygpIHtcbiAgICByZXR1cm4gdGhpcy5hbGxMYWJlbHM7XG4gIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBEYXRhc2V0OyJdfQ==