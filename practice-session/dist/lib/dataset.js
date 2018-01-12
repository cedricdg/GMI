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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRhdGFzZXQuanMiXSwibmFtZXMiOlsiRGF0YXNldCIsImdlc3R1cmUiLCJhbGxHZXN0dXJlcyIsImFsbExhYmVscyIsImxhYmVsIiwicHVzaCIsImxlbmd0aCIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJyZW1vdmUiLCJkYXRhc2V0RGl2IiwiY3JlYXRlRWxlbWVudCIsImlkIiwiYm9keSIsImdldEVsZW1lbnRzQnlUYWdOYW1lIiwiYXBwZW5kQ2hpbGQiLCJjbGFzc05hbWUiLCJjbGFzc2VzIiwiZmlsdGVyIiwidiIsImkiLCJhIiwiaW5kZXhPZiIsImciLCJnZXN0dXJlXyIsInRodW1iQ252cyIsIndpZHRoIiwiaGVpZ2h0Iiwic3R5bGUiLCJib3JkZXIiLCJjdHgiLCJnZXRDb250ZXh0IiwiZmlsbFN0eWxlIiwiZmlsbFJlY3QiLCJuIiwiYmVnaW5QYXRoIiwieCIsInkiLCJhcmMiLCJNYXRoIiwiUEkiLCJmaWxsIiwiY2xvc2VQYXRoIiwiY3VyWCIsImN1clkiLCJwcmV2WCIsInByZXZZIiwibW92ZVRvIiwibGluZVRvIiwic3Ryb2tlU3R5bGUiLCJsaW5lV2lkdGgiLCJzdHJva2UiLCJ0ZXh0U3BhbiIsImlubmVySFRNTCIsIlN0cmluZyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0lBSU1BLE87QUFFSixxQkFBZTtBQUFBOztBQUNiLFNBQUtDLE9BQUwsR0FBZSxFQUFmO0FBQ0EsU0FBS0MsV0FBTCxHQUFtQixFQUFuQjtBQUNBLFNBQUtDLFNBQUwsR0FBaUIsRUFBakI7QUFDRDs7Ozt3Q0FFbUJGLE8sRUFBU0csSyxFQUFPO0FBQ2xDLFdBQUtGLFdBQUwsQ0FBaUJHLElBQWpCLENBQXNCSixPQUF0QjtBQUNBLFdBQUtFLFNBQUwsQ0FBZUUsSUFBZixDQUFvQkQsS0FBcEI7QUFDRDs7O3FDQUVnQjtBQUNmLGFBQU8sS0FBS0YsV0FBTCxDQUFpQkksTUFBeEI7QUFDRDs7O3dDQUVtQjtBQUNsQixhQUFPLEtBQUtM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QUFYLEVBQWMsQ0FBZCxJQUFtQixFQUFqQztBQUNBSixnQkFBSUssU0FBSjtBQUNBTCxnQkFBSWlCLE1BQUosQ0FBV0YsS0FBWCxFQUFrQkMsS0FBbEI7QUFDQWhCLGdCQUFJa0IsTUFBSixDQUFXTCxJQUFYLEVBQWlCQyxJQUFqQjtBQUNBZCxnQkFBSW1CLFdBQUosR0FBa0IsUUFBbEI7QUFDQW5CLGdCQUFJb0IsU0FBSixHQUFnQixDQUFoQjtBQUNBcEIsZ0JBQUlxQixNQUFKO0FBQ0FyQixnQkFBSVksU0FBSjtBQUNEO0FBQ0Y7QUFDRGhDLG1CQUFXSyxXQUFYLENBQXVCVSxTQUF2QjtBQUNBLFlBQUkyQixXQUFXN0MsU0FBU0ksYUFBVCxDQUF1QixNQUF2QixDQUFmO0FBQ0F5QyxpQkFBU0MsU0FBVCxJQUFzQkMsT0FBTyxLQUFLbkQsU0FBTCxDQUFlb0IsQ0FBZixDQUFQLENBQXRCO0FBQ0E2QixpQkFBU3BDLFNBQVQsR0FBcUIsWUFBckI7QUFDQU4sbUJBQVdLLFdBQVgsQ0FBdUJxQyxRQUF2QjtBQUNEO0FBQ0Y7Ozs7O2tCQUdZcEQsTyIsImZpbGUiOiJkYXRhc2V0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBEYXRhc2V0IENsYXNzXG4gKi8gXG5cbmNsYXNzIERhdGFzZXQge1xuXG4gIGNvbnN0cnVjdG9yICgpIHtcbiAgICB0aGlzLmdlc3R1cmUgPSBbXVxuICAgIHRoaXMuYWxsR2VzdHVyZXMgPSBbXTtcbiAgICB0aGlzLmFsbExhYmVscyA9IFtdO1xuICB9XG5cbiAgYWRkR2VzdHVyZVdpdGhMYWJlbChnZXN0dXJlLCBsYWJlbCkge1xuICAgIHRoaXMuYWxsR2VzdHVyZXMucHVzaChnZXN0dXJlKTtcbiAgICB0aGlzLmFsbExhYmVscy5wdXNoKGxhYmVsKTtcbiAgfVxuXG4gIGdldE51bUdlc3R1cmVzKCkge1xuICAgIHJldHVybiB0aGlzLmFsbEdlc3R1cmVzLmxlbmd0aDtcbiAgfVxuXG4gIGdldEN1cnJlbnRHZXN0dXJlKCkge1xuICAgIHJldHVybiB0aGlzLmdlc3R1cmU7XG4gIH1cblxuICBnZXRHZXN0dXJlcygpIHtcbiAgICByZXR1cm4gdGhpcy5hbGxHZXN0dXJlcztcbiAgfVxuXG4gIGdldExhYmVscygpIHtcbiAgICByZXR1cm4gdGhpcy5hbGxMYWJlbHM7XG4gIH1cblxuICBjbGVhcigpIHtcbiAgICB0aGlzLmFsbEdlc3R1cmVzID0gW107XG4gICAgdGhpcy5hbGxMYWJlbHMgPSBbXTtcbiAgICAvLyBjbGVhciBwbG90cyBpZiB0aGVyZSBpcyBhbnlcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRhdGFzZXQtZGl2XCIpLnJlbW92ZSgpO1xuICAgIGxldCBkYXRhc2V0RGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZGF0YXNldERpdi5pZCA9IFwiZGF0YXNldC1kaXZcIjtcbiAgICBsZXQgYm9keSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiYm9keVwiKVswXTtcbiAgICBib2R5LmFwcGVuZENoaWxkKGRhdGFzZXREaXYpO1xuICB9XG5cbiAgcGxvdERhdGFzZXRJbkhNTCgpIHtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRhdGFzZXQtZGl2XCIpLnJlbW92ZSgpO1xuICAgIGxldCBkYXRhc2V0RGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZGF0YXNldERpdi5pZCA9IFwiZGF0YXNldC1kaXZcIjtcbiAgICBkYXRhc2V0RGl2LmNsYXNzTmFtZSA9IFwidGh1bWJuYWlsXCI7XG5cbiAgICBsZXQgYm9keSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiYm9keVwiKVswXTtcbiAgICBib2R5LmFwcGVuZENoaWxkKGRhdGFzZXREaXYpO1xuXG4gICAgbGV0IGNsYXNzZXMgPSB0aGlzLmFsbExhYmVscy5maWx0ZXIoKHYsIGksIGEpID0+IGEuaW5kZXhPZih2KSA9PT0gaSk7XG5cbiAgICBmb3IgKGxldCBnID0gMDsgZyA8IHRoaXMuYWxsR2VzdHVyZXMubGVuZ3RoOyBnKyspIHtcbiAgICAvLyBmb3IgKGxldCBjID0gMDsgYyA8IGNsYXNzZXMubGVuZ3RoOyBjKyspIHtcbiAgICAgIC8vIGxldCBpbmRleCA9IHRoaXMuYWxsTGFiZWxzLmluZGV4T2YoY2xhc3Nlc1tjXSk7XG4gICAgICAvLyBjb25zdCBnZXN0dXJlXyA9IHRoaXMuYWxsR2VzdHVyZXNbaW5kZXhdXG4gICAgICBjb25zdCBnZXN0dXJlXyA9IHRoaXMuYWxsR2VzdHVyZXNbZ11cbiAgICAgIC8vIGRlY2xhcmUgdGhlIGNhbnZhIHdoZXJlIHRvIGRyYXcgYSB0aHVtYm5haWxcbiAgICAgIGxldCB0aHVtYkNudnMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgICAgIHRodW1iQ252cy53aWR0aCA9IDcwO1xuICAgICAgdGh1bWJDbnZzLmhlaWdodCA9IDcwO1xuICAgICAgdGh1bWJDbnZzLnN0eWxlLmJvcmRlciA9IFwiMXB4IHNvbGlkXCI7XG4gICAgICAvLyBnZXQgY29udGV4dCB0byBmaWxsIHdpdGggYmtnIGNvbG9yIGFuZCBpbWFnZVxuICAgICAgbGV0IGN0eCA9IHRodW1iQ252cy5nZXRDb250ZXh0KCcyZCcpO1xuICAgICAgY3R4LmZpbGxTdHlsZSA9IFwid2hpdGVcIjtcbiAgICAgIGN0eC5maWxsUmVjdCgwLCAwLCB0aHVtYkNudnMud2lkdGgsIHRodW1iQ252cy5oZWlnaHQpO1xuICAgICAgZm9yIChsZXQgbiA9IDA7IG4gPCBnZXN0dXJlXy5sZW5ndGg7IG4rKykge1xuICAgICAgICBpZiAobiA9PSAwKSAge1xuICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgICBjdHguZmlsbFN0eWxlID0gXCJvcmFuZ2VcIjtcbiAgICAgICAgICBjb25zdCB4ID0gZ2VzdHVyZV9bbl1bMF0gKiA3MDtcbiAgICAgICAgICBjb25zdCB5ID0gZ2VzdHVyZV9bbl1bMV0gKiA3MDtcbiAgICAgICAgICBjdHguYXJjKHgsIHksIDUsIDAsIE1hdGguUEkgKiAyLCB0cnVlKTtcbiAgICAgICAgICBjdHguZmlsbCgpO1xuICAgICAgICAgIGN0eC5jbG9zZVBhdGgoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zdCBjdXJYID0gZ2VzdHVyZV9bbl1bMF0gKiA3MDtcbiAgICAgICAgICBjb25zdCBjdXJZID0gZ2VzdHVyZV9bbl1bMV0gKiA3MDtcbiAgICAgICAgICBjb25zdCBwcmV2WCA9IGdlc3R1cmVfW24tMV1bMF0gKiA3MDtcbiAgICAgICAgICBjb25zdCBwcmV2WSA9IGdlc3R1cmVfW24tMV1bMV0gKiA3MDtcbiAgICAgICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICAgICAgY3R4Lm1vdmVUbyhwcmV2WCwgcHJldlkpO1xuICAgICAgICAgIGN0eC5saW5lVG8oY3VyWCwgY3VyWSk7XG4gICAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gXCJvcmFuZ2VcIjtcbiAgICAgICAgICBjdHgubGluZVdpZHRoID0gMjtcbiAgICAgICAgICBjdHguc3Ryb2tlKCk7XG4gICAgICAgICAgY3R4LmNsb3NlUGF0aCgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBkYXRhc2V0RGl2LmFwcGVuZENoaWxkKHRodW1iQ252cyk7XG4gICAgICBsZXQgdGV4dFNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICB0ZXh0U3Bhbi5pbm5lckhUTUwgKz0gU3RyaW5nKHRoaXMuYWxsTGFiZWxzW2ddKTtcbiAgICAgIHRleHRTcGFuLmNsYXNzTmFtZSA9IFwidGh1bWJMYWJlbFwiXG4gICAgICBkYXRhc2V0RGl2LmFwcGVuZENoaWxkKHRleHRTcGFuKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgRGF0YXNldDtcbiJdfQ==