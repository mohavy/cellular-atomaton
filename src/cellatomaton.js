// the canvas logic should be done once somewhere else 
var w = 500;
var h = 500;
// grid step
var step = 10; 
var canvasElementId = 'grid';
var canvas = document.getElementById(canvasElementId);
var button = document.getElementById("single-step");
// this is how you resize the canvas
canvas.width  = w;
canvas.height = h;
var ctx = canvas.getContext('2d');
var activeCells = {};
var borderCells = {};
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
}
function stepGeneration() {

	const borderList = Object.keys(borderCells);
	for(i=0; i<borderList.length; i++) {
		let workingBorderCell = borderCells[borderList[i]];
		workingBorderCell.findNumNeighbors();
		workingBorderCell.doTask();
	};
	const itemList = Object.keys(activeCells);
	for(i=0; i<itemList.length; i++) {
		let workingCell = activeCells[itemList[i]];
		workingCell.findNumNeighbors();
		workingCell.doTask();
	};
	for(i=0; i<itemList.length; i++) {
		let workingCell = activeCells[itemList[i]];
		if(workingCell.nextDie == true) {
			workingCell.die();
		}
	};

}
canvas.addEventListener('mousedown', function(e) {
    getCursorPosition(canvas, e);
})
button.addEventListener('click', stepGeneration);
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
		this.neighbors = 0;
		this.nextDie = false;
	}
	born() {
		ctx.fillStyle = '#000000';
		ctx.fillRect((this.x*step)+1, (this.y*step)+1, step-2, step-2);
		let coords = [this.x, this.y];
		activeCells[coords] = this;
		let n = -1;
		for(let xi = -1; xi <= 1; xi++) {
			for(let yi = -1; yi <= 1; yi++) {
				const coords = [this.x + xi, this.y + yi];
				if(!activeCells[coords]) {
					if(!borderCells[coords]) {
						let cell = new BorderCell(coords[0], coords[1]);
						borderCells[coords] = cell;
					}

				}
			}
		}
	}
	die() {
		ctx.fillStyle = '#FFFFFF';
		ctx.fillRect((this.x*step)+1, (this.y*step)+1, step-2, step-2);
		let coords = [this.x, this.y];
		for(let xi = -1; xi <= 1; xi++) {
			for(let yi = -1; yi <= 1; yi++) {
				const coords = [this.x + xi, this.y + yi];
				if(!activeCells[coords]) {
					console.log("test");
					let cell = borderCells[coords];
					cell.remove();
				}
			}
		}
		delete activeCells[coords];
	}
	findNumNeighbors() {
		let n = -1;
		for(let xi = -1; xi <= 1; xi++) {
			for(let yi = -1; yi <= 1; yi++) {
				const coords = [this.x + xi, this.y + yi];
				if(activeCells[coords]) {
					n++;
				}
				else {
					if(!borderCells[coords]) {
						let cell = new BorderCell(coords[0], coords[1]);
						borderCells[coords] = cell;
					}


				}
			}
		}
		this.neighbors = n;
		//console.log(borderCells);
	}
	doTask() {
		if(this.neighbors <= 1) {
			this.nextDie = true;
			console.log("die");
		}
	}
}
class BorderCell {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.neighbors = 0;
		//ctx.fillStyle = '#FF0000';
		//ctx.fillRect((this.x*step)+1, (this.y*step)+1, step-2, step-2);
	}

	findNumNeighbors() {
		let n = 0;
		for(let xi = -1; xi <= 1; xi++) {
			for(let yi = -1; yi <= 1; yi++) {
				const coords = [this.x + xi, this.y + yi];
				if(activeCells[coords]) {
					n++;
					console.log("thing");
				}

			}
		}
	}
	remove() {
		ctx.fillStyle = '#FFFFFF';
		ctx.fillRect((this.x*step)+1, (this.y*step)+1, step-2, step-2);
		let coords = [this.x, this.y];
		delete borderCells[coords];
	}
	doTask() {
		if(this.neighbors == 3) {
			cell = new Cell(this.x, this.y);
			const coords = [this.x, this.y];
			activeCells[coords] = cell;
		}
		if(this.neighbors == 0) {
			this.remove();
		}
	}

}
