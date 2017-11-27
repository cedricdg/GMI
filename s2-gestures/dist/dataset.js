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

    this.gestures = [];
    this.labels = [];
  }

  (0, _createClass3.default)(Dataset, [{
    key: "add_gesture",
    value: function add_gesture(data, label) {
      this.gestures.push(data);
      this.labels.push(label);
    }
  }, {
    key: "get_num_gestures",
    value: function get_num_gestures() {
      return this.gestures.length;
    }
  }, {
    key: "get_gestures",
    value: function get_gestures() {
      return this.gestures;
    }
  }, {
    key: "get_labels",
    value: function get_labels() {
      return this.labels;
    }
  }]);
  return Dataset;
}();

exports.default = Dataset;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRhdGFzZXQuanMiXSwibmFtZXMiOlsiRGF0YXNldCIsImdlc3R1cmVzIiwibGFiZWxzIiwiZGF0YSIsImxhYmVsIiwicHVzaCIsImxlbmd0aCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztJQUNNQSxPO0FBRUoscUJBQWU7QUFBQTs7QUFDYixTQUFLQyxRQUFMLEdBQWdCLEVBQWhCO0FBQ0EsU0FBS0MsTUFBTCxHQUFjLEVBQWQ7QUFDRDs7OztnQ0FFV0MsSSxFQUFNQyxLLEVBQU87QUFDdkIsV0FBS0gsUUFBTCxDQUFjSSxJQUFkLENBQW1CRixJQUFuQjtBQUNBLFdBQUtELE1BQUwsQ0FBWUcsSUFBWixDQUFpQkQsS0FBakI7QUFDRDs7O3VDQUVrQjtBQUNqQixhQUFPLEtBQUtILFFBQUwsQ0FBY0ssTUFBckI7QUFDRDs7O21DQUVjO0FBQ2IsYUFBTyxLQUFLTCxRQUFaO0FBQ0Q7OztpQ0FFWTtBQUNYLGFBQU8sS0FBS0MsTUFBWjtBQUNEOzs7OztrQkFJWUYsTyIsImZpbGUiOiJkYXRhc2V0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG5jbGFzcyBEYXRhc2V0IHtcblxuICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgdGhpcy5nZXN0dXJlcyA9IFtdO1xuICAgIHRoaXMubGFiZWxzID0gW107XG4gIH1cblxuICBhZGRfZ2VzdHVyZShkYXRhLCBsYWJlbCkge1xuICAgIHRoaXMuZ2VzdHVyZXMucHVzaChkYXRhKTtcbiAgICB0aGlzLmxhYmVscy5wdXNoKGxhYmVsKTtcbiAgfVxuXG4gIGdldF9udW1fZ2VzdHVyZXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2VzdHVyZXMubGVuZ3RoO1xuICB9XG5cbiAgZ2V0X2dlc3R1cmVzKCkge1xuICAgIHJldHVybiB0aGlzLmdlc3R1cmVzO1xuICB9XG5cbiAgZ2V0X2xhYmVscygpIHtcbiAgICByZXR1cm4gdGhpcy5sYWJlbHM7XG4gIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBEYXRhc2V0OyJdfQ==