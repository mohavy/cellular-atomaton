// the canvas logic should be done once somewhere else 
var w = 500;
var h = 500;
// grid step
var step = 10; 
var canvasElementId = 'grid';
var canvas = document.getElementById(canvasElementId);
// this is how you resize the canvas
canvas.width  = w;
canvas.height = h;
var ctx = canvas.getContext('2d');
// the render logic should be focusing on the rendering 
function getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    drawCell((x-(x%step))/step, (y-(y%step))/step, step, step)
    console.log("x: " + x + " y: " + y)
}

canvas.addEventListener('mousedown', function(e) {
    getCursorPosition(canvas, e)
})
var drawGrid = function(ctx, w, h, step) {
	ctx.beginPath(); 
	for (var x=0;x<=w;x+=step) {
			ctx.moveTo(x, 0);
			ctx.lineTo(x, h);
	}
	// set the color of the line
	ctx.strokeStyle = 'rgb(0,0,0)';
	ctx.lineWidth = 0.2;
	// the stroke will actually paint the current path 
	ctx.stroke(); 
	// for the sake of the example 2nd path
	ctx.beginPath(); 
	for (var y=0;y<=h;y+=step) {
			ctx.moveTo(0, y);
			ctx.lineTo(w, y);
	}
	// set the color of the line
	ctx.strokeStyle = 'rgb(0,20,20)';
	// just for fun
	ctx.lineWidth = 0.2;
	// for your original question - you need to stroke only once
	ctx.stroke(); 
};
var drawCell = function(coX, coY) {
	ctx.beginPath();
	ctx.strokeStyle = 'rgb(0,0,0)';
	ctx.rect(coX*step, coY*step, step, step);
	ctx.stroke();
	ctx.fill();
}
drawGrid(ctx, w, h, step);
drawCell(0, 0);
