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
var activeCells = {};
// the render logic should be focusing on the rendering 
function getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const mouseX = (x-(x%step))/step;
    const mouseY = (y-(y%step))/step;
    let coords = [mouseX, mouseY];
    switch (event.which) {
    	case 1:
    		let cell = new Cell(mouseX, mouseY);
    		cell.born();
    		break;
    	case 3:
    		let dieCell = activeCells[coords];
    		dieCell.die();
    		break;

    }
    console.log(activeCells);
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
	ctx.lineWidth = .2;
	// the stroke will actually paint the current path 
	ctx.stroke(); 
	// for the sake of the example 2nd path
	ctx.beginPath(); 
	for (var y=0;y<=h;y+=step) {
			ctx.moveTo(0, y);
			ctx.lineTo(w, y);
	}
	// set the color of the line
	ctx.strokeStyle = 'rgb(0,0,0)';
	// just for fun
	ctx.lineWidth = .2;
	// for your original question - you need to stroke only once
	ctx.stroke(); 
};
drawGrid(ctx, w, h, step);

var eraseCell = function(coX, coY) {
	ctx.fillStyle = '#FFFFFF';
	ctx.fillRect((coX*step)+1, (coY*step)+1, step-2, step-2);
}
class Cell {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
	born() {
		ctx.fillStyle = '#000000';
		ctx.fillRect((this.x*step)+1, (this.y*step)+1, step-2, step-2);
		let coords = [this.x, this.y];
		activeCells[coords] = this;
	}
	die() {
		ctx.fillStyle = '#FFFFFF';
		ctx.fillRect((this.x*step)+1, (this.y*step)+1, step-2, step-2);
		let coords = [this.x, this.y];
		delete activeCells[coords];
	}
}
