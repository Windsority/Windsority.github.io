/** @type{HTMLCanvasElement} */
var canvas = document.getElementById("mycanvas");
// var gl = canvas.getContext("webgl");
var context = canvas.getContext("2d");

var onMouseMove = function(event) {
    var x = event.x, y = event.y;
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x + event.movementX, y + event.movementY);
    context.stroke();
}

canvas.onmousedown = function(event) {
    if (event.clientX < 0 || event.clientX > canvas.width) return null;
    if (event.clientY < 0 || event.clientY > canvas.height) return null;
    canvas.addEventListener("mousemove", onMouseMove);
    beingDragged = true;
};
canvas.onmouseup = function(event) {
    canvas.removeEventListener("mousemove", onMouseMove);
    beingDragged = false;
}

var setup = function() {
    // console.log("setup");
    // gl.clearColor(0, 0.7, 0.8, 1);
    // gl.enable(gl.DEPTH_TEST);
    // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

window.onload = setup;