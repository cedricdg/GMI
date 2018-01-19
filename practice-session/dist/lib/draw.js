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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRyYXcuanMiXSwibmFtZXMiOlsiaW5pdERyYXdpbmdQdCIsInByZXZNb3VzZVgiLCJjdXJyTW91c2VYIiwicHJldk1vdXNlWSIsImN1cnJNb3VzZVkiLCJsaW5lV2lkdGgiLCJjb2xvciIsImRyYXdHZXN0dXJlIiwiY2FudmFzIiwicmVzIiwiY29vcmRpbmF0ZXMiLCJjdHgiLCJnZXRDb250ZXh0IiwiY2xlYXJSZWN0Iiwid2lkdGgiLCJoZWlnaHQiLCJiZWdpblBhdGgiLCJmaWxsU3R5bGUiLCJhcmMiLCJNYXRoIiwiUEkiLCJmaWxsIiwiY2xvc2VQYXRoIiwibW92ZVRvIiwibGluZVRvIiwic3Ryb2tlU3R5bGUiLCJzdHJva2UiLCJhZGRHZXN0dXJlVGh1bWJuYWlsIiwiZ2VzdHVyZV9pZCIsInRodW1iQ252cyIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsInN0eWxlIiwiYm9yZGVyIiwiZmlsbFJlY3QiLCJkcmF3SW1hZ2UiLCJib2R5IiwiZ2V0RWxlbWVudHNCeVRhZ05hbWUiLCJhcHBlbmRDaGlsZCIsImdldE1vdXNlWFlpbkNhbnZhcyIsImUiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJ0b3AiLCJsZWZ0IiwiY2xpZW50WCIsInBhZ2VYIiwiY2xpZW50WSIsInBhZ2VZIiwiYWRkQm94VG9Cb2R5IiwibmFtZSIsImJveHRpdGxlIiwiaURpdiIsImlkIiwiU3RyaW5nIiwicmFuZG9tIiwiY2xhc3NOYW1lIiwiZGl2IiwiZ2V0RWxlbWVudEJ5SWQiLCJ0aXRsZURpdiIsImlubmVySFRNTCJdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQTtBQUNBLElBQUlBLGdCQUFnQixLQUFwQjtBQUNBLElBQUlDLGFBQWEsQ0FBakI7QUFDQSxJQUFJQyxhQUFhLENBQWpCO0FBQ0EsSUFBSUMsYUFBYSxDQUFqQjtBQUNBLElBQUlDLGFBQWEsQ0FBakI7QUFDQSxJQUFJQyxZQUFZLENBQWhCO0FBQ0EsSUFBSUMsUUFBUSxRQUFaOztBQUdBLFNBQVNDLFdBQVQsQ0FB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U0FBVCxHQUFxQixVQUFyQjtBQUNBRyxXQUFTQyxTQUFULElBQXNCVCxRQUF0QjtBQUNBTSxNQUFJbEIsV0FBSixDQUFnQm9CLFFBQWhCO0FBQ0Q7O1FBR1FWLFksR0FBQUEsWTtRQUFjekMsVyxHQUFBQSxXO1FBQWFvQixtQixHQUFBQSxtQjtRQUFxQlksa0IsR0FBQUEsa0IiLCJmaWxlIjoiZHJhdy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIERyYXdpbmcgZnVuY3Rpb25zIGluIGNhbnZhc1xubGV0IGluaXREcmF3aW5nUHQgPSBmYWxzZTtcbmxldCBwcmV2TW91c2VYID0gMDtcbmxldCBjdXJyTW91c2VYID0gMDtcbmxldCBwcmV2TW91c2VZID0gMDtcbmxldCBjdXJyTW91c2VZID0gMDtcbmxldCBsaW5lV2lkdGggPSAzO1xubGV0IGNvbG9yID0gXCJvcmFuZ2VcIjtcblxuXG5mdW5jdGlvbiBkcmF3R2VzdHVyZShjYW52YXMsIHJlcywgY29vcmRpbmF0ZXMpIHtcbiAgbGV0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XG4gIGlmIChyZXMgPT0gJ2Rvd24nKSB7XG4gICAgLy8gY2xlYXIgY2FudmFzXG4gICAgY3R4LmNsZWFyUmVjdCgwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpO1xuICAgIHByZXZNb3VzZVggPSBjdXJyTW91c2VYO1xuICAgIHByZXZNb3VzZVkgPSBjdXJyTW91c2VZO1xuICAgIGN1cnJNb3VzZVggPSBjb29yZGluYXRlc1swXSAqIGNhbnZhcy53aWR0aDtcbiAgICBjdXJyTW91c2VZID0gY29vcmRpbmF0ZXNbMV0gKiBjYW52YXMuaGVpZ2h0O1xuICAgIGluaXREcmF3aW5nUHQgPSB0cnVlO1xuICAgIGlmIChpbml0RHJhd2luZ1B0KSB7XG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9IGNvbG9yO1xuICAgICAgICBjdHguYXJjKGN1cnJNb3VzZVgsIGN1cnJNb3VzZVksIDUsIDAsIE1hdGguUEkgKiAyLCB0cnVlKTtcbiAgICAgICAgY3R4LmZpbGwoKTtcbiAgICAgICAgY3R4LmNsb3NlUGF0aCgpO1xuICAgICAgICBpbml0RHJhd2luZ1B0ID0gZmFsc2U7XG4gICAgfVxuICB9XG4gIGlmIChyZXMgPT0gJ21vdmUnKSB7XG4gICAgcHJldk1vdXNlWCA9IGN1cnJNb3VzZVg7XG4gICAgcHJldk1vdXNlWSA9IGN1cnJNb3VzZVk7XG4gICAgY3Vyck1vdXNlWCA9IGNvb3JkaW5hdGVzWzBdICogY2FudmFzLndpZHRoO1xuICAgIGN1cnJNb3VzZVkgPSBjb29yZGluYXRlc1sxXSAqIGNhbnZhcy5oZWlnaHQ7XG4gICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgIGN0eC5tb3ZlVG8ocHJldk1vdXNlWCwgcHJldk1vdXNlWSk7XG4gICAgY3R4LmxpbmVUbyhjdXJyTW91c2VYLCBjdXJyTW91c2VZKTtcbiAgICBjdHguc3Ryb2tlU3R5bGUgPSBjb2xvcjtcbiAgICBjdHgubGluZVdpZHRoID0gbGluZVdpZHRoO1xuICAgIGN0eC5zdHJva2UoKTtcbiAgICBjdHguY2xvc2VQYXRoKCk7XG4gIH1cbn1cblxuXG5mdW5jdGlvbiBhZGRHZXN0dXJlVGh1bWJuYWlsKGNhbnZhcywgZ2VzdHVyZV9pZCkge1xuICAgIC8vIGRlY2xhcmUgdGhlIGNhbnZhIHdoZXJlIHRvIGRyYXcgYSB0aHVtYm5haWxcbiAgICBsZXQgdGh1bWJDbnZzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgdGh1bWJDbnZzLndpZHRoID0gNzA7XG4gICAgdGh1bWJDbnZzLmhlaWdodCA9IDcwO1xuICAgIHRodW1iQ252cy5zdHlsZS5ib3JkZXIgPSBcIjFweCBzb2xpZFwiO1xuICAgIC8vIGdldCBjb250ZXh0IHRvIGZpbGwgd2l0aCBia2cgY29sb3IgYW5kIGltYWdlXG4gICAgbGV0IGN0eCA9IHRodW1iQ252cy5nZXRDb250ZXh0KCcyZCcpO1xuICAgIGN0eC5maWxsU3R5bGUgPSBcIndoaXRlXCI7XG4gICAgY3R4LmZpbGxSZWN0KDAsIDAsIHRodW1iQ252cy53aWR0aCwgdGh1bWJDbnZzLmhlaWdodCk7XG4gICAgY3R4LmRyYXdJbWFnZShjYW52YXMsIDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCwgMCwgMCwgdGh1bWJDbnZzLndpZHRoLCB0aHVtYkNudnMuaGVpZ2h0KTtcbiAgICAvLyBhZGQgdG8gdGhlIGJvZHkgZG9jdW1lbnRcbiAgICB2YXIgYm9keSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiYm9keVwiKVswXTtcbiAgICBib2R5LmFwcGVuZENoaWxkKHRodW1iQ252cyk7XG59XG5cblxuZnVuY3Rpb24gZ2V0TW91c2VYWWluQ2FudmFzKGNhbnZhcywgZSkge1xuICBjb25zdCB7IHRvcCwgbGVmdCwgd2lkdGgsIGhlaWdodCB9ID0gY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICBjb25zdCBjbGllbnRYID0gKGUucGFnZVggLSBsZWZ0KSAvIHdpZHRoO1xuICBjb25zdCBjbGllbnRZID0gKGUucGFnZVkgLSB0b3ApIC8gaGVpZ2h0O1xuICByZXR1cm4gW2NsaWVudFgsIGNsaWVudFldXG59XG5cblxuZnVuY3Rpb24gYWRkQm94VG9Cb2R5KHdpZHRoLCBoZWlnaHQsIG5hbWUsIGJveHRpdGxlKSB7XG4gIC8vIGNyZWF0ZSBvdXRlciBESVZcbiAgdmFyIGlEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgaURpdi5pZCA9ICdibG9jay0nK1N0cmluZyhNYXRoLnJhbmRvbSgpICogMTAwMDApO1xuICBpRGl2LmNsYXNzTmFtZSA9ICdib3gnO1xuICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYm9keScpWzBdLmFwcGVuZENoaWxkKGlEaXYpO1xuICAvLyBjcmVhdGUgY2FudmFzXG4gIGxldCBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgY2FudmFzLndpZHRoID0gd2lkdGg7XG4gIGNhbnZhcy5oZWlnaHQgPSBoZWlnaHQ7XG4gIGNhbnZhcy5zdHlsZS5ib3JkZXIgPSBcIjBweFwiO1xuICBjYW52YXMuaWQgPSBuYW1lO1xuICBsZXQgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gIGN0eC5maWxsU3R5bGUgPSBcIndoaXRlXCI7XG4gIGN0eC5maWxsUmVjdCgwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpO1xuICBsZXQgZGl2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaURpdi5pZCk7XG4gIGRpdi5hcHBlbmRDaGlsZChjYW52YXMpO1xuICAvLyBjcmVhdGUgZGl2IGZvciB0aXRsZVxuICBsZXQgdGl0bGVEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgdGl0bGVEaXYuY2xhc3NOYW1lID0gJ2JveHRpdGxlJztcbiAgdGl0bGVEaXYuaW5uZXJIVE1MICs9IGJveHRpdGxlO1xuICBkaXYuYXBwZW5kQ2hpbGQodGl0bGVEaXYpO1xufVxuXG5cbmV4cG9ydCB7IGFkZEJveFRvQm9keSwgZHJhd0dlc3R1cmUsIGFkZEdlc3R1cmVUaHVtYm5haWwsIGdldE1vdXNlWFlpbkNhbnZhcyB9O1xuIl19