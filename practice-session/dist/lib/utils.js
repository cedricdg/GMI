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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV0aWxzLmpzIl0sIm5hbWVzIjpbInBhdGhMZW5ndGgiLCJwb2ludHMiLCJkIiwiaSIsImxlbmd0aCIsImRpc3RhbmNlIiwiYm91bmRpbmdCb3giLCJtaW5YIiwiSW5maW5pdHkiLCJtYXhYIiwibWluWSIsIm1heFkiLCJNYXRoIiwibWluIiwibWF4IiwiY2VudHJvaWQiLCJ4IiwieSIsImluZGljYXRpdmVBbmdsZSIsImMiLCJhdGFuMiIsInZlY3RvcjEiLCJ2ZWN0b3IyIiwiZGlzdCIsInBvdyIsInNxcnQiLCJyZXNhbXBsZSIsImRhdGFfIiwibiIsImRhdGEiLCJJIiwiRCIsIm5ld3BvaW50cyIsInB1c2giLCJxeCIsInF5IiwicSIsInNwbGljZSIsInJvdGF0ZSIsInJhZGlhbnMiLCJjb3MiLCJzaW4iLCJzY2FsZSIsInNpemUiLCJiQm94IiwidHJhbnNsYXRlVG9PcmlnaW4iLCJvcmlnIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQTs7QUFFQSxTQUFTQSxVQUFULENBQW9CQyxNQUFwQixFQUNBO0FBQ0ksUUFBSUMsSUFBSSxHQUFSO0FBQ0EsU0FBSyxJQUFJQyxJQUFJLENBQWIsRUFBZ0JBLElBQUlGLE9BQU9HLE1BQTNCLEVBQW1DRCxHQUFuQztBQUNJRCxhQUFLRyxTQUFTSixPQUFPRSxJQUFJLENBQVgsQ0FBVCxFQUF3QkYsT0FBT0UsQ0FBUCxDQUF4QixDQUFMO0FBREosS0FFQSxPQUFPRCxDQUFQO0FBQ0g7O0FBRUQsU0FBU0ksV0FBVCxDQUFxQkwsTUFBckIsRUFDQTtBQUNJLFFBQUlNLE9BQU8sQ0FBQ0MsUUFBWjtBQUFBLFFBQXNCQyxPQUFPLENBQUNELFFBQTlCO0FBQUEsUUFBd0NFLE9BQU8sQ0FBQ0YsUUFBaEQ7QUFBQSxRQUEwREcsT0FBTyxDQUFDSCxRQUFsRTtBQUNBLFNBQUssSUFBSUwsSUFBSSxDQUFiLEVBQWdCQSxJQUFJRixPQUFPRyxNQUEzQixFQUFtQ0QsR0FBbkMsRUFBd0M7QUFDcENJLGVBQU9LLEtBQUtDLEdBQUwsQ0FBU04sSUFBVCxFQUFlTixPQUFPRSxDQUFQLEVBQVUsQ0FBVixDQUFmLENBQVA7QUFDQU8sZUFBT0UsS0FBS0MsR0FBTCxDQUFTSCxJQUFULEVBQWVULE9BQU9FLENBQVAsRUFBVSxDQUFWLENBQWYsQ0FBUDtBQUNBTSxlQUFPRyxLQUFLRSxHQUFMLENBQVNMLElBQVQsRUFBZVIsT0FBT0UsQ0FBUCxFQUFVLENBQVYsQ0FBZixDQUFQO0FBQ0FRLGVBQU9DLEtBQUtFLEdBQUwsQ0FBU0gsSUFBVCxFQUFlVixPQUFPRSxDQUFQLEVBQVUsQ0FBVixDQUFmLENBQVA7QUFDSDtBQUNELFdBQU8sQ0FBQ00sT0FBT0YsSUFBUixFQUFjSSxPQUFPRCxJQUFyQixDQUFQO0FBQ0g7O0FBRUQsU0FBU0ssUUFBVCxDQUFrQmQsTUFBbEIsRUFDQTtBQUNJLFFBQUllLElBQUksR0FBUjtBQUFBLFFBQWFDLElBQUksR0FBakI7QUFDQSxTQUFLLElBQUlkLElBQUksQ0FBYixFQUFnQkEsSUFBSUYsT0FBT0csTUFBM0IsRUFBbUNELEdBQW5DLEVBQXdDO0FBQ3BDYSxhQUFLZixPQUFPRSxDQUFQLEVBQVUsQ0FBVixDQUFMO0FBQ0FjLGFBQUtoQixPQUFPRSxDQUFQLEVBQVUsQ0FBVixDQUFMO0FBQ0g7QUFDRGEsU0FBS2YsT0FBT0csTUFBWjtBQUNBYSxTQUFLaEIsT0FBT0csTUFBWjtBQUNBLFdBQU8sQ0FBQ1ksQ0FBRCxFQUFJQyxDQUFKLENBQVA7QUFDSDtBQUNELFNBQVNDLGVBQVQsQ0FBeUJqQixNQUF6QixFQUNBO0FBQ0ksUUFBSWtCLElBQUlKLFNBQVNkLE1BQVQsQ0FBUjtBQUNBLFdBQU9XLEtBQUtRLEtBQUwsQ0FBV0QsRUFBRSxDQUFGLElBQU9sQixPQUFPLENBQVAsRUFBVSxDQUFWLENBQWxCLEVBQWdDa0IsRUFBRSxDQUFGLElBQU9sQixPQUFPLENBQVAsRUFBVSxDQUFWLENBQXZDLENBQVA7QUFDSDs7QUFHRDs7QUFFQSxTQUFTSSxRQUFULENBQWtCZ0IsT0FBbEIsRUFBMkJDLE9BQTNCLEVBQW9DO0FBQ2hDLFFBQUlDLE9BQU8sR0FBWDtBQUNBLFNBQUssSUFBSXJCLElBQUcsQ0FBWixFQUFlQSxJQUFJbUIsUUFBUWpCLE1BQTNCLEVBQW1DRixHQUFuQyxFQUF3QztBQUNwQ3FCLGdCQUFRWCxLQUFLWSxHQUFMLENBQVNILFFBQVFuQixDQUFSLElBQWFvQixRQUFRcEIsQ0FBUixDQUF0QixFQUFrQyxDQUFsQyxDQUFSO0FBQ0g7QUFDRCxXQUFPVSxLQUFLYSxJQUFMLENBQVVGLElBQVYsQ0FBUDtBQUNIOztBQUVELFNBQVNHLFFBQVQsQ0FBa0JDLEtBQWxCLEVBQXlCQyxDQUF6QixFQUNBO0FBQ0ksUUFBSUMsT0FBT0YsS0FBWDtBQUNBLFFBQUlHLElBQUk5QixXQUFXNkIsSUFBWCxLQUFvQkQsSUFBSSxDQUF4QixDQUFSLENBRkosQ0FFd0M7QUFDcEMsUUFBSUcsSUFBSSxHQUFSO0FBQ0EsUUFBSUMsWUFBWSxFQUFoQjtBQUNBQSxjQUFVQyxJQUFWLENBQWVKLEtBQUssQ0FBTCxDQUFmO0FBQ0EsU0FBSyxJQUFJMUIsSUFBSSxDQUFiLEVBQWdCQSxJQUFJMEIsS0FBS3pCLE1BQXpCLEVBQWlDRCxHQUFqQyxFQUNBO0FBQ0ksWUFBSUQsSUFBSUcsU0FBU3dCLEtBQUsxQixJQUFJLENBQVQsQ0FBVCxFQUFzQjBCLEtBQUsxQixDQUFMLENBQXRCLENBQVI7QUFDQSxZQUFLNEIsSUFBSTdCLENBQUwsSUFBVzRCLENBQWYsRUFDQTtBQUNJLGdCQUFJSSxLQUFLTCxLQUFLMUIsSUFBSSxDQUFULEVBQVksQ0FBWixJQUFrQixDQUFDMkIsSUFBSUMsQ0FBTCxJQUFVN0IsQ0FBWCxJQUFpQjJCLEtBQUsxQixDQUFMLEVBQVEsQ0FBUixJQUFhMEIsS0FBSzFCLElBQUksQ0FBVCxFQUFZLENBQVosQ0FBOUIsQ0FBMUI7QUFDQSxnQkFBSWdDLEtBQUtOLEtBQUsxQixJQUFJLENBQVQsRUFBWSxDQUFaLElBQWtCLENBQUMyQixJQUFJQyxDQUFMLElBQVU3QixDQUFYLElBQWlCMkIsS0FBSzFCLENBQUwsRUFBUSxDQUFSLElBQWEwQixLQUFLMUIsSUFBSSxDQUFULEVBQVksQ0FBWixDQUE5QixDQUExQjtBQUNBLGdCQUFJaUMsSUFBSSxDQUFDRixFQUFELEVBQUtDLEVBQUwsQ0FBUjtBQUNBSCxzQkFBVUMsSUFBVixDQUFlLENBQUNDLEVBQUQsRUFBS0MsRUFBTCxDQUFmO0FBQ0FOLGlCQUFLUSxNQUFMLENBQVlsQyxDQUFaLEVBQWUsQ0FBZixFQUFrQmlDLENBQWxCLEVBTEosQ0FLMEI7QUFDdEJMLGdCQUFJLEdBQUo7QUFDSCxTQVJELE1BU0tBLEtBQUs3QixDQUFMO0FBQ1I7QUFDRCxRQUFJOEIsVUFBVTVCLE1BQVYsSUFBb0J3QixJQUFJLENBQTVCLEVBQStCO0FBQzNCSSxrQkFBVUMsSUFBVixDQUFlLENBQUNKLEtBQUtBLEtBQUt6QixNQUFMLEdBQWMsQ0FBbkIsRUFBc0IsQ0FBdEIsQ0FBRCxFQUEyQnlCLEtBQUtBLEtBQUt6QixNQUFMLEdBQWMsQ0FBbkIsRUFBc0IsQ0FBdEIsQ0FBM0IsQ0FBZjtBQUNIO0FBQ0QsV0FBTzRCLFNBQVA7QUFDSDs7QUFHRCxTQUFTTSxNQUFULENBQWdCckMsTUFBaEIsRUFBd0I7QUFDeEI7QUFDSSxRQUFJc0MsVUFBVSxDQUFFckIsZ0JBQWdCakIsTUFBaEIsQ0FBaEI7QUFDQSxRQUFJa0IsSUFBSUosU0FBU2QsTUFBVCxDQUFSO0FBQ0EsUUFBSXVDLE1BQU01QixLQUFLNEIsR0FBTCxDQUFTRCxPQUFULENBQVY7QUFDQSxRQUFJRSxNQUFNN0IsS0FBSzZCLEdBQUwsQ0FBU0YsT0FBVCxDQUFWO0FBQ0EsUUFBSVAsWUFBWSxFQUFoQjtBQUNBLFNBQUssSUFBSTdCLElBQUksQ0FBYixFQUFnQkEsSUFBSUYsT0FBT0csTUFBM0IsRUFBbUNELEdBQW5DLEVBQXdDO0FBQ3BDLFlBQUkrQixLQUFLLENBQUNqQyxPQUFPRSxDQUFQLEVBQVUsQ0FBVixJQUFlZ0IsRUFBRSxDQUFGLENBQWhCLElBQXdCcUIsR0FBeEIsR0FBOEIsQ0FBQ3ZDLE9BQU9FLENBQVAsRUFBVSxDQUFWLElBQWVnQixFQUFFLENBQUYsQ0FBaEIsSUFBd0JzQixHQUF0RCxHQUE0RHRCLEVBQUUsQ0FBRixDQUFyRTtBQUNBLFlBQUlnQixLQUFLLENBQUNsQyxPQUFPRSxDQUFQLEVBQVUsQ0FBVixJQUFlZ0IsRUFBRSxDQUFGLENBQWhCLElBQXdCc0IsR0FBeEIsR0FBOEIsQ0FBQ3hDLE9BQU9FLENBQVAsRUFBVSxDQUFWLElBQWVnQixFQUFFLENBQUYsQ0FBaEIsSUFBd0JxQixHQUF0RCxHQUE0RHJCLEVBQUUsQ0FBRixDQUFyRTtBQUNBYSxrQkFBVUMsSUFBVixDQUFlLENBQUNDLEVBQUQsRUFBS0MsRUFBTCxDQUFmO0FBQ0g7QUFDRCxXQUFPSCxTQUFQO0FBQ0g7O0FBR0QsU0FBU1UsS0FBVCxDQUFlekMsTUFBZixFQUF1QjtBQUN2QjtBQUNJLFFBQUkwQyxPQUFPLEdBQVg7QUFDQSxRQUFJQyxPQUFPdEMsWUFBWUwsTUFBWixDQUFYO0FBQ0EsUUFBSStCLFlBQVksRUFBaEI7QUFDQSxTQUFLLElBQUk3QixJQUFJLENBQWIsRUFBZ0JBLElBQUlGLE9BQU9HLE1BQTNCLEVBQW1DRCxHQUFuQyxFQUF3QztBQUNwQyxZQUFJK0IsS0FBS2pDLE9BQU9FLENBQVAsRUFBVSxDQUFWLEtBQWdCd0MsT0FBT0MsS0FBSyxDQUFMLENBQXZCLENBQVQ7QUFDQSxZQUFJVCxLQUFLbEMsT0FBT0UsQ0FBUCxFQUFVLENBQVYsS0FBZ0J3QyxPQUFPQyxLQUFLLENBQUwsQ0FBdkIsQ0FBVDtBQUNBWixrQkFBVUMsSUFBVixDQUFlLENBQUNDLEVBQUQsRUFBS0MsRUFBTCxDQUFmO0FBQ0g7QUFDRCxXQUFPSCxTQUFQO0FBQ0g7O0FBRUQsU0FBU2EsaUJBQVQsQ0FBMkI1QyxNQUEzQixFQUFtQztBQUNuQztBQUNJLFFBQU02QyxPQUFPLENBQUMsR0FBRCxFQUFNLEdBQU4sQ0FBYjtBQUNBLFFBQU0zQixJQUFJSixTQUFTZCxNQUFULENBQVY7QUFDQSxRQUFJK0IsWUFBWSxFQUFoQjtBQUNBLFNBQUssSUFBSTdCLElBQUksQ0FBYixFQUFnQkEsSUFBSUYsT0FBT0csTUFBM0IsRUFBbUNELEdBQW5DLEVBQXdDO0FBQ3BDLFlBQUkrQixLQUFLakMsT0FBT0UsQ0FBUCxFQUFVLENBQVYsSUFBZTJDLEtBQUssQ0FBTCxDQUFmLEdBQXlCM0IsRUFBRSxDQUFGLENBQWxDO0FBQ0EsWUFBSWdCLEtBQUtsQyxPQUFPRSxDQUFQLEVBQVUsQ0FBVixJQUFlMkMsS0FBSyxDQUFMLENBQWYsR0FBeUIzQixFQUFFLENBQUYsQ0FBbEM7QUFDQWEsa0JBQVVDLElBQVYsQ0FBZSxDQUFDQyxFQUFELEVBQUtDLEVBQUwsQ0FBZjtBQUNIO0FBQ0QsV0FBT0gsU0FBUDtBQUNIOztRQUdRM0IsUSxHQUFBQSxRO1FBQVVxQixRLEdBQUFBLFE7UUFBVVksTSxHQUFBQSxNO1FBQVFJLEssR0FBQUEsSztRQUFPRyxpQixHQUFBQSxpQiIsImZpbGUiOiJ1dGlscy5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuLy8vIFwiUFJJVkFURVwiIEZVTkNUSU9OU1xuXG5mdW5jdGlvbiBwYXRoTGVuZ3RoKHBvaW50cylcbntcbiAgICB2YXIgZCA9IDAuMDtcbiAgICBmb3IgKHZhciBpID0gMTsgaSA8IHBvaW50cy5sZW5ndGg7IGkrKylcbiAgICAgICAgZCArPSBkaXN0YW5jZShwb2ludHNbaSAtIDFdLCBwb2ludHNbaV0pO1xuICAgIHJldHVybiBkO1xufVxuXG5mdW5jdGlvbiBib3VuZGluZ0JveChwb2ludHMpXG57XG4gICAgbGV0IG1pblggPSArSW5maW5pdHksIG1heFggPSAtSW5maW5pdHksIG1pblkgPSArSW5maW5pdHksIG1heFkgPSAtSW5maW5pdHk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwb2ludHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgbWluWCA9IE1hdGgubWluKG1pblgsIHBvaW50c1tpXVswXSk7XG4gICAgICAgIG1pblkgPSBNYXRoLm1pbihtaW5ZLCBwb2ludHNbaV1bMV0pO1xuICAgICAgICBtYXhYID0gTWF0aC5tYXgobWF4WCwgcG9pbnRzW2ldWzBdKTtcbiAgICAgICAgbWF4WSA9IE1hdGgubWF4KG1heFksIHBvaW50c1tpXVsxXSk7XG4gICAgfVxuICAgIHJldHVybiBbbWF4WCAtIG1pblgsIG1heFkgLSBtaW5ZXTtcbn1cblxuZnVuY3Rpb24gY2VudHJvaWQocG9pbnRzKVxue1xuICAgIHZhciB4ID0gMC4wLCB5ID0gMC4wO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcG9pbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHggKz0gcG9pbnRzW2ldWzBdO1xuICAgICAgICB5ICs9IHBvaW50c1tpXVsxXTtcbiAgICB9XG4gICAgeCAvPSBwb2ludHMubGVuZ3RoO1xuICAgIHkgLz0gcG9pbnRzLmxlbmd0aDtcbiAgICByZXR1cm4gW3gsIHldO1xufVxuZnVuY3Rpb24gaW5kaWNhdGl2ZUFuZ2xlKHBvaW50cylcbntcbiAgICB2YXIgYyA9IGNlbnRyb2lkKHBvaW50cyk7XG4gICAgcmV0dXJuIE1hdGguYXRhbjIoY1sxXSAtIHBvaW50c1swXVsxXSwgY1swXSAtIHBvaW50c1swXVswXSk7XG59XG5cblxuLy8vIFwiUFVCTElDXCIgRlVOQ1RJT05TXG5cbmZ1bmN0aW9uIGRpc3RhbmNlKHZlY3RvcjEsIHZlY3RvcjIpIHtcbiAgICBsZXQgZGlzdCA9IDAuMDtcbiAgICBmb3IgKGxldCBkID0wOyBkIDwgdmVjdG9yMS5sZW5ndGg7IGQrKykge1xuICAgICAgICBkaXN0ICs9IE1hdGgucG93KHZlY3RvcjFbZF0gLSB2ZWN0b3IyW2RdLCAyKTtcbiAgICB9XG4gICAgcmV0dXJuIE1hdGguc3FydChkaXN0KTtcbn1cblxuZnVuY3Rpb24gcmVzYW1wbGUoZGF0YV8sIG4pXG57XG4gICAgbGV0IGRhdGEgPSBkYXRhXztcbiAgICBsZXQgSSA9IHBhdGhMZW5ndGgoZGF0YSkgLyAobiAtIDEpOyAvLyBpbnRlcnZhbCBsZW5ndGhcbiAgICBsZXQgRCA9IDAuMDtcbiAgICBsZXQgbmV3cG9pbnRzID0gW107XG4gICAgbmV3cG9pbnRzLnB1c2goZGF0YVswXSlcbiAgICBmb3IgKGxldCBpID0gMTsgaSA8IGRhdGEubGVuZ3RoOyBpKyspXG4gICAge1xuICAgICAgICBsZXQgZCA9IGRpc3RhbmNlKGRhdGFbaSAtIDFdLCBkYXRhW2ldKTtcbiAgICAgICAgaWYgKChEICsgZCkgPj0gSSlcbiAgICAgICAge1xuICAgICAgICAgICAgbGV0IHF4ID0gZGF0YVtpIC0gMV1bMF0gKyAoKEkgLSBEKSAvIGQpICogKGRhdGFbaV1bMF0gLSBkYXRhW2kgLSAxXVswXSk7XG4gICAgICAgICAgICBsZXQgcXkgPSBkYXRhW2kgLSAxXVsxXSArICgoSSAtIEQpIC8gZCkgKiAoZGF0YVtpXVsxXSAtIGRhdGFbaSAtIDFdWzFdKTtcbiAgICAgICAgICAgIGxldCBxID0gW3F4LCBxeV07XG4gICAgICAgICAgICBuZXdwb2ludHMucHVzaChbcXgsIHF5XSk7XG4gICAgICAgICAgICBkYXRhLnNwbGljZShpLCAwLCBxKTsgLy8gaW5zZXJ0ICdxJyBhdCBwb3NpdGlvbiBpIGluIHBvaW50cyBzLnQuICdxJyB3aWxsIGJlIHRoZSBuZXh0IGlcbiAgICAgICAgICAgIEQgPSAwLjA7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBEICs9IGQ7XG4gICAgfVxuICAgIGlmIChuZXdwb2ludHMubGVuZ3RoID09IG4gLSAxKSB7XG4gICAgICAgIG5ld3BvaW50cy5wdXNoKFtkYXRhW2RhdGEubGVuZ3RoIC0gMV1bMF0sIGRhdGFbZGF0YS5sZW5ndGggLSAxXVsxXV0pO1xuICAgIH1cbiAgICByZXR1cm4gbmV3cG9pbnRzO1xufVxuXG5cbmZ1bmN0aW9uIHJvdGF0ZShwb2ludHMpIC8vIHJvdGF0ZXMgcG9pbnRzIGFyb3VuZCBjZW50cm9pZFxue1xuICAgIGxldCByYWRpYW5zID0gLSBpbmRpY2F0aXZlQW5nbGUocG9pbnRzKTtcbiAgICBsZXQgYyA9IGNlbnRyb2lkKHBvaW50cyk7XG4gICAgbGV0IGNvcyA9IE1hdGguY29zKHJhZGlhbnMpO1xuICAgIGxldCBzaW4gPSBNYXRoLnNpbihyYWRpYW5zKTtcbiAgICBsZXQgbmV3cG9pbnRzID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwb2ludHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgbGV0IHF4ID0gKHBvaW50c1tpXVswXSAtIGNbMF0pICogY29zIC0gKHBvaW50c1tpXVsxXSAtIGNbMV0pICogc2luICsgY1swXVxuICAgICAgICBsZXQgcXkgPSAocG9pbnRzW2ldWzBdIC0gY1swXSkgKiBzaW4gKyAocG9pbnRzW2ldWzFdIC0gY1sxXSkgKiBjb3MgKyBjWzFdO1xuICAgICAgICBuZXdwb2ludHMucHVzaChbcXgsIHF5XSk7XG4gICAgfVxuICAgIHJldHVybiBuZXdwb2ludHM7XG59XG5cblxuZnVuY3Rpb24gc2NhbGUocG9pbnRzKSAvLyBub24tdW5pZm9ybSBzY2FsZTsgYXNzdW1lcyAyRCBnZXN0dXJlcyAoaS5lLiwgbm8gbGluZXMpXG57XG4gICAgbGV0IHNpemUgPSAwLjU7XG4gICAgbGV0IGJCb3ggPSBib3VuZGluZ0JveChwb2ludHMpO1xuICAgIGxldCBuZXdwb2ludHMgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBvaW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBsZXQgcXggPSBwb2ludHNbaV1bMF0gKiAoc2l6ZSAvIGJCb3hbMF0pO1xuICAgICAgICBsZXQgcXkgPSBwb2ludHNbaV1bMV0gKiAoc2l6ZSAvIGJCb3hbMV0pO1xuICAgICAgICBuZXdwb2ludHMucHVzaChbcXgsIHF5XSk7XG4gICAgfVxuICAgIHJldHVybiBuZXdwb2ludHM7XG59XG5cbmZ1bmN0aW9uIHRyYW5zbGF0ZVRvT3JpZ2luKHBvaW50cykgLy8gdHJhbnNsYXRlcyBwb2ludHMnIGNlbnRyb2lkXG57XG4gICAgY29uc3Qgb3JpZyA9IFswLjUsIDAuNV07XG4gICAgY29uc3QgYyA9IGNlbnRyb2lkKHBvaW50cyk7XG4gICAgbGV0IG5ld3BvaW50cyA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcG9pbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGxldCBxeCA9IHBvaW50c1tpXVswXSArIG9yaWdbMF0gLSBjWzBdO1xuICAgICAgICBsZXQgcXkgPSBwb2ludHNbaV1bMV0gKyBvcmlnWzFdIC0gY1sxXTtcbiAgICAgICAgbmV3cG9pbnRzLnB1c2goW3F4LCBxeV0pO1xuICAgIH1cbiAgICByZXR1cm4gbmV3cG9pbnRzO1xufVxuXG5cbmV4cG9ydCB7IGRpc3RhbmNlLCByZXNhbXBsZSwgcm90YXRlLCBzY2FsZSwgdHJhbnNsYXRlVG9PcmlnaW4gfTtcbiJdfQ==