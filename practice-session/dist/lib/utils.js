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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV0aWxzLmpzIl0sIm5hbWVzIjpbInBhdGhMZW5ndGgiLCJwb2ludHMiLCJkIiwiaSIsImxlbmd0aCIsImRpc3RhbmNlIiwiYm91bmRpbmdCb3giLCJtaW5YIiwiSW5maW5pdHkiLCJtYXhYIiwibWluWSIsIm1heFkiLCJNYXRoIiwibWluIiwibWF4IiwiY2VudHJvaWQiLCJ4IiwieSIsImluZGljYXRpdmVBbmdsZSIsImMiLCJhdGFuMiIsInZlY3RvcjEiLCJ2ZWN0b3IyIiwiZGlzdCIsInBvdyIsInNxcnQiLCJyZXNhbXBsZSIsImRhdGFfIiwibiIsImRhdGEiLCJJIiwiRCIsIm5ld3BvaW50cyIsInB1c2giLCJxeCIsInF5IiwicSIsInNwbGljZSIsInJvdGF0ZSIsInJhZGlhbnMiLCJjb3MiLCJzaW4iLCJzY2FsZSIsInNpemUiLCJiQm94IiwiY29uc29sZSIsImxvZyIsInRyYW5zbGF0ZVRvT3JpZ2luIiwib3JpZyJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQ0E7O0FBRUEsU0FBU0EsVUFBVCxDQUFvQkMsTUFBcEIsRUFDQTtBQUNJLFFBQUlDLElBQUksR0FBUjtBQUNBLFNBQUssSUFBSUMsSUFBSSxDQUFiLEVBQWdCQSxJQUFJRixPQUFPRyxNQUEzQixFQUFtQ0QsR0FBbkM7QUFDSUQsYUFBS0csU0FBU0osT0FBT0UsSUFBSSxDQUFYLENBQVQsRUFBd0JGLE9BQU9FLENBQVAsQ0FBeEIsQ0FBTDtBQURKLEtBRUEsT0FBT0QsQ0FBUDtBQUNIOztBQUVELFNBQVNJLFdBQVQsQ0FBcUJMLE1BQXJCLEVBQ0E7QUFDSSxRQUFJTSxPQUFPLENBQUNDLFFBQVo7QUFBQSxRQUFzQkMsT0FBTyxDQUFDRCxRQUE5QjtBQUFBLFFBQXdDRSxPQUFPLENBQUNGLFFBQWhEO0FBQUEsUUFBMERHLE9BQU8sQ0FBQ0gsUUFBbEU7QUFDQSxTQUFLLElBQUlMLElBQUksQ0FBYixFQUFnQkEsSUFBSUYsT0FBT0csTUFBM0IsRUFBbUNELEdBQW5DLEVBQXdDO0FBQ3BDSSxlQUFPSyxLQUFLQyxHQUFMLENBQVNOLElBQVQsRUFBZU4sT0FBT0UsQ0FBUCxFQUFVLENBQVYsQ0FBZixDQUFQO0FBQ0FPLGVBQU9FLEtBQUtDLEdBQUwsQ0FBU0gsSUFBVCxFQUFlVCxPQUFPRSxDQUFQLEVBQVUsQ0FBVixDQUFmLENBQVA7QUFDQU0sZUFBT0csS0FBS0UsR0FBTCxDQUFTTCxJQUFULEVBQWVSLE9BQU9FLENBQVAsRUFBVSxDQUFWLENBQWYsQ0FBUDtBQUNBUSxlQUFPQyxLQUFLRSxHQUFMLENBQVNILElBQVQsRUFBZVYsT0FBT0UsQ0FBUCxFQUFVLENBQVYsQ0FBZixDQUFQO0FBQ0g7QUFDRCxXQUFPLENBQUNNLE9BQU9GLElBQVIsRUFBY0ksT0FBT0QsSUFBckIsQ0FBUDtBQUNIOztBQUVELFNBQVNLLFFBQVQsQ0FBa0JkLE1BQWxCLEVBQ0E7QUFDSSxRQUFJZSxJQUFJLEdBQVI7QUFBQSxRQUFhQyxJQUFJLEdBQWpCO0FBQ0EsU0FBSyxJQUFJZCxJQUFJLENBQWIsRUFBZ0JBLElBQUlGLE9BQU9HLE1BQTNCLEVBQW1DRCxHQUFuQyxFQUF3QztBQUNwQ2EsYUFBS2YsT0FBT0UsQ0FBUCxFQUFVLENBQVYsQ0FBTDtBQUNBYyxhQUFLaEIsT0FBT0UsQ0FBUCxFQUFVLENBQVYsQ0FBTDtBQUNIO0FBQ0RhLFNBQUtmLE9BQU9HLE1BQVo7QUFDQWEsU0FBS2hCLE9BQU9HLE1BQVo7QUFDQSxXQUFPLENBQUNZLENBQUQsRUFBSUMsQ0FBSixDQUFQO0FBQ0g7QUFDRCxTQUFTQyxlQUFULENBQXlCakIsTUFBekIsRUFDQTtBQUNJLFFBQUlrQixJQUFJSixTQUFTZCxNQUFULENBQVI7QUFDQSxXQUFPVyxLQUFLUSxLQUFMLENBQVdELEVBQUUsQ0FBRixJQUFPbEIsT0FBTyxDQUFQLEVBQVUsQ0FBVixDQUFsQixFQUFnQ2tCLEVBQUUsQ0FBRixJQUFPbEIsT0FBTyxDQUFQLEVBQVUsQ0FBVixDQUF2QyxDQUFQO0FBQ0g7O0FBR0Q7O0FBRUEsU0FBU0ksUUFBVCxDQUFrQmdCLE9BQWxCLEVBQTJCQyxPQUEzQixFQUFvQztBQUNoQyxRQUFJQyxPQUFPLEdBQVg7QUFDQSxTQUFLLElBQUlyQixJQUFHLENBQVosRUFBZUEsSUFBSW1CLFFBQVFqQixNQUEzQixFQUFtQ0YsR0FBbkMsRUFBd0M7QUFDcENxQixnQkFBUVgsS0FBS1ksR0FBTCxDQUFTSCxRQUFRbkIsQ0FBUixJQUFhb0IsUUFBUXBCLENBQVIsQ0FBdEIsRUFBa0MsQ0FBbEMsQ0FBUjtBQUNIO0FBQ0QsV0FBT1UsS0FBS2EsSUFBTCxDQUFVRixJQUFWLENBQVA7QUFDSDs7QUFFRCxTQUFTRyxRQUFULENBQWtCQyxLQUFsQixFQUF5QkMsQ0FBekIsRUFDQTtBQUNJLFFBQUlDLE9BQU9GLEtBQVg7QUFDQSxRQUFJRyxJQUFJOUIsV0FBVzZCLElBQVgsS0FBb0JELElBQUksQ0FBeEIsQ0FBUixDQUZKLENBRXdDO0FBQ3BDLFFBQUlHLElBQUksR0FBUjtBQUNBLFFBQUlDLFlBQVksRUFBaEI7QUFDQUEsY0FBVUMsSUFBVixDQUFlSixLQUFLLENBQUwsQ0FBZjtBQUNBLFNBQUssSUFBSTFCLElBQUksQ0FBYixFQUFnQkEsSUFBSTBCLEtBQUt6QixNQUF6QixFQUFpQ0QsR0FBakMsRUFDQTtBQUNJLFlBQUlELElBQUlHLFNBQVN3QixLQUFLMUIsSUFBSSxDQUFULENBQVQsRUFBc0IwQixLQUFLMUIsQ0FBTCxDQUF0QixDQUFSO0FBQ0EsWUFBSzRCLElBQUk3QixDQUFMLElBQVc0QixDQUFmLEVBQ0E7QUFDSSxnQkFBSUksS0FBS0wsS0FBSzFCLElBQUksQ0FBVCxFQUFZLENBQVosSUFBa0IsQ0FBQzJCLElBQUlDLENBQUwsSUFBVTdCLENBQVgsSUFBaUIyQixLQUFLMUIsQ0FBTCxFQUFRLENBQVIsSUFBYTBCLEtBQUsxQixJQUFJLENBQVQsRUFBWSxDQUFaLENBQTlCLENBQTFCO0FBQ0EsZ0JBQUlnQyxLQUFLTixLQUFLMUIsSUFBSSxDQUFULEVBQVksQ0FBWixJQUFrQixDQUFDMkIsSUFBSUMsQ0FBTCxJQUFVN0IsQ0FBWCxJQUFpQjJCLEtBQUsxQixDQUFMLEVBQVEsQ0FBUixJQUFhMEIsS0FBSzFCLElBQUksQ0FBVCxFQUFZLENBQVosQ0FBOUIsQ0FBMUI7QUFDQSxnQkFBSWlDLElBQUksQ0FBQ0YsRUFBRCxFQUFLQyxFQUFMLENBQVI7QUFDQUgsc0JBQVVDLElBQVYsQ0FBZSxDQUFDQyxFQUFELEVBQUtDLEVBQUwsQ0FBZjtBQUNBTixpQkFBS1EsTUFBTCxDQUFZbEMsQ0FBWixFQUFlLENBQWYsRUFBa0JpQyxDQUFsQixFQUxKLENBSzBCO0FBQ3RCTCxnQkFBSSxHQUFKO0FBQ0gsU0FSRCxNQVNLQSxLQUFLN0IsQ0FBTDtBQUNSO0FBQ0QsUUFBSThCLFVBQVU1QixNQUFWLElBQW9Cd0IsSUFBSSxDQUE1QixFQUErQjtBQUMzQkksa0JBQVVDLElBQVYsQ0FBZSxDQUFDSixLQUFLQSxLQUFLekIsTUFBTCxHQUFjLENBQW5CLEVBQXNCLENBQXRCLENBQUQsRUFBMkJ5QixLQUFLQSxLQUFLekIsTUFBTCxHQUFjLENBQW5CLEVBQXNCLENBQXRCLENBQTNCLENBQWY7QUFDSDtBQUNELFdBQU80QixTQUFQO0FBQ0g7O0FBR0QsU0FBU00sTUFBVCxDQUFnQnJDLE1BQWhCLEVBQXdCO0FBQ3hCO0FBQ0ksUUFBSXNDLFVBQVUsQ0FBRXJCLGdCQUFnQmpCLE1BQWhCLENBQWhCO0FBQ0EsUUFBSWtCLElBQUlKLFNBQVNkLE1BQVQsQ0FBUjtBQUNBLFFBQUl1QyxNQUFNNUIsS0FBSzRCLEdBQUwsQ0FBU0QsT0FBVCxDQUFWO0FBQ0EsUUFBSUUsTUFBTTdCLEtBQUs2QixHQUFMLENBQVNGLE9BQVQsQ0FBVjtBQUNBLFFBQUlQLFlBQVksRUFBaEI7QUFDQSxTQUFLLElBQUk3QixJQUFJLENBQWIsRUFBZ0JBLElBQUlGLE9BQU9HLE1BQTNCLEVBQW1DRCxHQUFuQyxFQUF3QztBQUNwQyxZQUFJK0IsS0FBSyxDQUFDakMsT0FBT0UsQ0FBUCxFQUFVLENBQVYsSUFBZWdCLEVBQUUsQ0FBRixDQUFoQixJQUF3QnFCLEdBQXhCLEdBQThCLENBQUN2QyxPQUFPRSxDQUFQLEVBQVUsQ0FBVixJQUFlZ0IsRUFBRSxDQUFGLENBQWhCLElBQXdCc0IsR0FBdEQsR0FBNER0QixFQUFFLENBQUYsQ0FBckU7QUFDQSxZQUFJZ0IsS0FBSyxDQUFDbEMsT0FBT0UsQ0FBUCxFQUFVLENBQVYsSUFBZWdCLEVBQUUsQ0FBRixDQUFoQixJQUF3QnNCLEdBQXhCLEdBQThCLENBQUN4QyxPQUFPRSxDQUFQLEVBQVUsQ0FBVixJQUFlZ0IsRUFBRSxDQUFGLENBQWhCLElBQXdCcUIsR0FBdEQsR0FBNERyQixFQUFFLENBQUYsQ0FBckU7QUFDQWEsa0JBQVVDLElBQVYsQ0FBZSxDQUFDQyxFQUFELEVBQUtDLEVBQUwsQ0FBZjtBQUNIO0FBQ0QsV0FBT0gsU0FBUDtBQUNIOztBQUdELFNBQVNVLEtBQVQsQ0FBZXpDLE1BQWYsRUFBdUI7QUFDdkI7QUFDSSxRQUFJMEMsT0FBTyxHQUFYO0FBQ0EsUUFBSUMsT0FBT3RDLFlBQVlMLE1BQVosQ0FBWDtBQUNBLFFBQUkrQixZQUFZLEVBQWhCO0FBQ0EsU0FBSyxJQUFJN0IsSUFBSSxDQUFiLEVBQWdCQSxJQUFJRixPQUFPRyxNQUEzQixFQUFtQ0QsR0FBbkMsRUFBd0M7QUFDcEMsWUFBSStCLEtBQUtqQyxPQUFPRSxDQUFQLEVBQVUsQ0FBVixLQUFnQndDLE9BQU9DLEtBQUssQ0FBTCxDQUF2QixDQUFUO0FBQ0EsWUFBSVQsS0FBS2xDLE9BQU9FLENBQVAsRUFBVSxDQUFWLEtBQWdCd0MsT0FBT0MsS0FBSyxDQUFMLENBQXZCLENBQVQ7QUFDQVosa0JBQVVDLElBQVYsQ0FBZSxDQUFDQyxFQUFELEVBQUtDLEVBQUwsQ0FBZjtBQUNBVSxnQkFBUUMsR0FBUixDQUFZLENBQUNaLEVBQUQsRUFBS0MsRUFBTCxDQUFaO0FBQ0g7QUFDRCxXQUFPSCxTQUFQO0FBQ0g7O0FBRUQsU0FBU2UsaUJBQVQsQ0FBMkI5QyxNQUEzQixFQUFtQztBQUNuQztBQUNJLFFBQU0rQyxPQUFPLENBQUMsR0FBRCxFQUFNLEdBQU4sQ0FBYjtBQUNBLFFBQU03QixJQUFJSixTQUFTZCxNQUFULENBQVY7QUFDQSxRQUFJK0IsWUFBWSxFQUFoQjtBQUNBLFNBQUssSUFBSTdCLElBQUksQ0FBYixFQUFnQkEsSUFBSUYsT0FBT0csTUFBM0IsRUFBbUNELEdBQW5DLEVBQXdDO0FBQ3BDLFlBQUkrQixLQUFLakMsT0FBT0UsQ0FBUCxFQUFVLENBQVYsSUFBZTZDLEtBQUssQ0FBTCxDQUFmLEdBQXlCN0IsRUFBRSxDQUFGLENBQWxDO0FBQ0EsWUFBSWdCLEtBQUtsQyxPQUFPRSxDQUFQLEVBQVUsQ0FBVixJQUFlNkMsS0FBSyxDQUFMLENBQWYsR0FBeUI3QixFQUFFLENBQUYsQ0FBbEM7QUFDQWEsa0JBQVVDLElBQVYsQ0FBZSxDQUFDQyxFQUFELEVBQUtDLEVBQUwsQ0FBZjtBQUNIO0FBQ0QsV0FBT0gsU0FBUDtBQUNIOztRQUdRM0IsUSxHQUFBQSxRO1FBQVVxQixRLEdBQUFBLFE7UUFBVVksTSxHQUFBQSxNO1FBQVFJLEssR0FBQUEsSztRQUFPSyxpQixHQUFBQSxpQiIsImZpbGUiOiJ1dGlscy5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuLy8vIFwiUFJJVkFURVwiIEZVTkNUSU9OU1xuXG5mdW5jdGlvbiBwYXRoTGVuZ3RoKHBvaW50cylcbntcbiAgICB2YXIgZCA9IDAuMDtcbiAgICBmb3IgKHZhciBpID0gMTsgaSA8IHBvaW50cy5sZW5ndGg7IGkrKylcbiAgICAgICAgZCArPSBkaXN0YW5jZShwb2ludHNbaSAtIDFdLCBwb2ludHNbaV0pO1xuICAgIHJldHVybiBkO1xufVxuXG5mdW5jdGlvbiBib3VuZGluZ0JveChwb2ludHMpXG57XG4gICAgbGV0IG1pblggPSArSW5maW5pdHksIG1heFggPSAtSW5maW5pdHksIG1pblkgPSArSW5maW5pdHksIG1heFkgPSAtSW5maW5pdHk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwb2ludHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgbWluWCA9IE1hdGgubWluKG1pblgsIHBvaW50c1tpXVswXSk7XG4gICAgICAgIG1pblkgPSBNYXRoLm1pbihtaW5ZLCBwb2ludHNbaV1bMV0pO1xuICAgICAgICBtYXhYID0gTWF0aC5tYXgobWF4WCwgcG9pbnRzW2ldWzBdKTtcbiAgICAgICAgbWF4WSA9IE1hdGgubWF4KG1heFksIHBvaW50c1tpXVsxXSk7XG4gICAgfVxuICAgIHJldHVybiBbbWF4WCAtIG1pblgsIG1heFkgLSBtaW5ZXTtcbn1cblxuZnVuY3Rpb24gY2VudHJvaWQocG9pbnRzKVxue1xuICAgIHZhciB4ID0gMC4wLCB5ID0gMC4wO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcG9pbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHggKz0gcG9pbnRzW2ldWzBdO1xuICAgICAgICB5ICs9IHBvaW50c1tpXVsxXTtcbiAgICB9XG4gICAgeCAvPSBwb2ludHMubGVuZ3RoO1xuICAgIHkgLz0gcG9pbnRzLmxlbmd0aDtcbiAgICByZXR1cm4gW3gsIHldO1xufVxuZnVuY3Rpb24gaW5kaWNhdGl2ZUFuZ2xlKHBvaW50cylcbntcbiAgICB2YXIgYyA9IGNlbnRyb2lkKHBvaW50cyk7XG4gICAgcmV0dXJuIE1hdGguYXRhbjIoY1sxXSAtIHBvaW50c1swXVsxXSwgY1swXSAtIHBvaW50c1swXVswXSk7XG59XG5cblxuLy8vIFwiUFVCTElDXCIgRlVOQ1RJT05TXG5cbmZ1bmN0aW9uIGRpc3RhbmNlKHZlY3RvcjEsIHZlY3RvcjIpIHtcbiAgICBsZXQgZGlzdCA9IDAuMDtcbiAgICBmb3IgKGxldCBkID0wOyBkIDwgdmVjdG9yMS5sZW5ndGg7IGQrKykge1xuICAgICAgICBkaXN0ICs9IE1hdGgucG93KHZlY3RvcjFbZF0gLSB2ZWN0b3IyW2RdLCAyKTtcbiAgICB9XG4gICAgcmV0dXJuIE1hdGguc3FydChkaXN0KTtcbn1cblxuZnVuY3Rpb24gcmVzYW1wbGUoZGF0YV8sIG4pXG57XG4gICAgbGV0IGRhdGEgPSBkYXRhXztcbiAgICBsZXQgSSA9IHBhdGhMZW5ndGgoZGF0YSkgLyAobiAtIDEpOyAvLyBpbnRlcnZhbCBsZW5ndGhcbiAgICBsZXQgRCA9IDAuMDtcbiAgICBsZXQgbmV3cG9pbnRzID0gW107XG4gICAgbmV3cG9pbnRzLnB1c2goZGF0YVswXSlcbiAgICBmb3IgKGxldCBpID0gMTsgaSA8IGRhdGEubGVuZ3RoOyBpKyspXG4gICAge1xuICAgICAgICBsZXQgZCA9IGRpc3RhbmNlKGRhdGFbaSAtIDFdLCBkYXRhW2ldKTtcbiAgICAgICAgaWYgKChEICsgZCkgPj0gSSlcbiAgICAgICAge1xuICAgICAgICAgICAgbGV0IHF4ID0gZGF0YVtpIC0gMV1bMF0gKyAoKEkgLSBEKSAvIGQpICogKGRhdGFbaV1bMF0gLSBkYXRhW2kgLSAxXVswXSk7XG4gICAgICAgICAgICBsZXQgcXkgPSBkYXRhW2kgLSAxXVsxXSArICgoSSAtIEQpIC8gZCkgKiAoZGF0YVtpXVsxXSAtIGRhdGFbaSAtIDFdWzFdKTtcbiAgICAgICAgICAgIGxldCBxID0gW3F4LCBxeV07XG4gICAgICAgICAgICBuZXdwb2ludHMucHVzaChbcXgsIHF5XSk7XG4gICAgICAgICAgICBkYXRhLnNwbGljZShpLCAwLCBxKTsgLy8gaW5zZXJ0ICdxJyBhdCBwb3NpdGlvbiBpIGluIHBvaW50cyBzLnQuICdxJyB3aWxsIGJlIHRoZSBuZXh0IGlcbiAgICAgICAgICAgIEQgPSAwLjA7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBEICs9IGQ7XG4gICAgfVxuICAgIGlmIChuZXdwb2ludHMubGVuZ3RoID09IG4gLSAxKSB7XG4gICAgICAgIG5ld3BvaW50cy5wdXNoKFtkYXRhW2RhdGEubGVuZ3RoIC0gMV1bMF0sIGRhdGFbZGF0YS5sZW5ndGggLSAxXVsxXV0pO1xuICAgIH1cbiAgICByZXR1cm4gbmV3cG9pbnRzO1xufVxuXG5cbmZ1bmN0aW9uIHJvdGF0ZShwb2ludHMpIC8vIHJvdGF0ZXMgcG9pbnRzIGFyb3VuZCBjZW50cm9pZFxue1xuICAgIGxldCByYWRpYW5zID0gLSBpbmRpY2F0aXZlQW5nbGUocG9pbnRzKTtcbiAgICBsZXQgYyA9IGNlbnRyb2lkKHBvaW50cyk7XG4gICAgbGV0IGNvcyA9IE1hdGguY29zKHJhZGlhbnMpO1xuICAgIGxldCBzaW4gPSBNYXRoLnNpbihyYWRpYW5zKTtcbiAgICBsZXQgbmV3cG9pbnRzID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwb2ludHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgbGV0IHF4ID0gKHBvaW50c1tpXVswXSAtIGNbMF0pICogY29zIC0gKHBvaW50c1tpXVsxXSAtIGNbMV0pICogc2luICsgY1swXVxuICAgICAgICBsZXQgcXkgPSAocG9pbnRzW2ldWzBdIC0gY1swXSkgKiBzaW4gKyAocG9pbnRzW2ldWzFdIC0gY1sxXSkgKiBjb3MgKyBjWzFdO1xuICAgICAgICBuZXdwb2ludHMucHVzaChbcXgsIHF5XSk7XG4gICAgfVxuICAgIHJldHVybiBuZXdwb2ludHM7XG59XG5cblxuZnVuY3Rpb24gc2NhbGUocG9pbnRzKSAvLyBub24tdW5pZm9ybSBzY2FsZTsgYXNzdW1lcyAyRCBnZXN0dXJlcyAoaS5lLiwgbm8gbGluZXMpXG57XG4gICAgbGV0IHNpemUgPSAwLjU7XG4gICAgbGV0IGJCb3ggPSBib3VuZGluZ0JveChwb2ludHMpO1xuICAgIGxldCBuZXdwb2ludHMgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBvaW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBsZXQgcXggPSBwb2ludHNbaV1bMF0gKiAoc2l6ZSAvIGJCb3hbMF0pO1xuICAgICAgICBsZXQgcXkgPSBwb2ludHNbaV1bMV0gKiAoc2l6ZSAvIGJCb3hbMV0pO1xuICAgICAgICBuZXdwb2ludHMucHVzaChbcXgsIHF5XSk7XG4gICAgICAgIGNvbnNvbGUubG9nKFtxeCwgcXldKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ld3BvaW50cztcbn1cblxuZnVuY3Rpb24gdHJhbnNsYXRlVG9PcmlnaW4ocG9pbnRzKSAvLyB0cmFuc2xhdGVzIHBvaW50cycgY2VudHJvaWRcbntcbiAgICBjb25zdCBvcmlnID0gWzAuNSwgMC41XTtcbiAgICBjb25zdCBjID0gY2VudHJvaWQocG9pbnRzKTtcbiAgICBsZXQgbmV3cG9pbnRzID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwb2ludHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgbGV0IHF4ID0gcG9pbnRzW2ldWzBdICsgb3JpZ1swXSAtIGNbMF07XG4gICAgICAgIGxldCBxeSA9IHBvaW50c1tpXVsxXSArIG9yaWdbMV0gLSBjWzFdO1xuICAgICAgICBuZXdwb2ludHMucHVzaChbcXgsIHF5XSk7XG4gICAgfVxuICAgIHJldHVybiBuZXdwb2ludHM7XG59XG5cblxuZXhwb3J0IHsgZGlzdGFuY2UsIHJlc2FtcGxlLCByb3RhdGUsIHNjYWxlLCB0cmFuc2xhdGVUb09yaWdpbiB9O1xuIl19