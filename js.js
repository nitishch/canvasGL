var fixedDimension = 600;
var width = 2*fixedDimension, height = fixedDimension;

var canvas = document.getElementsByTagName("canvas")[0];
var context = canvas.getContext("2d");
canvas.width = width;
canvas.height = height;
canvas.style.width = width + "px";
canvas.style.height = height + "px";//these four lines maintain same intrinsic and extrinsic coordinate systems
//context.fillStyle = "#e7c7ec";
//context.fillStyle = "#732664";
//context.fillStyle = "#eadabf";

/*--------------------Ends Initialisation------------------------------*/
document.getElementById("slider").setAttribute("min", 1);
document.getElementById("slider").setAttribute("max", Math.min(width, height)/2);
var noofPixels = 50;
var xoff = canvas.getBoundingClientRect().left, yoff = canvas.getBoundingClientRect().top;


var init = function(){ //remember canvas coordinates are devilish.
	canvas.width = canvas.width; //this is redundant. This clears the canvas.
	context.fillStyle = "#732662"; //this is the color of the canvas.
	context.fillRect(0, 0, width, height);
	/* These two for-loops draw the grid */
	for(var x = 0.5; x < width; x = x + noofPixels){
		context.moveTo(x, 0);
		context.lineTo(x, height);
//		console.log("at x = " + x);
	}
	
	for(var y = 0.5; y < height; y = y + noofPixels){
		context.moveTo(0, y);
		context.lineTo(width, y);
//		console.log("at y = " + y);
	}
	context.strokeStyle = "#bf4040"; //this is the color of the mesh.
	context.stroke();
	/* An advice is ignore looking at the grid. Forget it's there. Trust that it draws correctly*/
	context.fillStyle = "#40bf45"; //this is the color of a cell. Square of noofPixels is called a cell.
}
init();

var colorCell = function(x, y){ //Given canvas cell coordinates, this colours the appropriate cell
	context.fillRect(x, y, noofPixels, noofPixels);
} //this function is just for clarity and must be removed.
	
var changeCoord = function(x, y){ //this takes window coordinates and returns the cell coordinates
	var relativeX = x - xoff, relativeY = y - yoff;
	return {x: noofPixels * Math.floor((relativeX-1)/noofPixels),
			y: noofPixels * Math.floor((relativeY-1)/noofPixels),};
}

var state = {};
var eventArray = []; //this is supposed to be of length 2 atmax. 
var stateID = 0; //if stateID is = i, then we have got i clicks
var bresenham = 
(function(){
	return function(x, y){ //Here x, y are in cell coordinates
		if(stateID === 2){
			init();
			stateID = 0;
		}
		if(!stateID){
			state.x1 = x;
			state.y1 = y;
			colorCell(x, y);
			stateID = 1;
		}
		else if(stateID === 1){
			state.x2 = x;
			state.y2 = y;
			colorCell(x, y);
			var swapped = false;
			if(Math.abs((state.y2 - state.y1)/(state.x2 - state.x1)) > 1){
				console.log("no no");
				var a = state.x1;
				state.x1 = state.y1;
				state.y1 = a;
				a = state.x2;
				state.x2 = state.y2;
				state.y2 = a;
				swapped = true; //if we want to keep this 'store' intact, we have to do some more things.
			}
			var error = 0, slope = Math.abs((state.y2 - state.y1)/(state.x2 - state.x1)), currentY = state.y1, currentX = state.x1;
			var multiplierX = (state.x2 < state.x1) ? -1 : 1;
			var multiplierY = (state.y2 < state.y1) ? -1 : 1;
			for(;currentX != state.x2;currentX += multiplierX * noofPixels){
				if(Math.abs(error) >= Math.abs(state.x2-state.x1)/2){
					currentY += multiplierY * noofPixels;
					error -= Math.abs(state.x2 - state.x1);
				}
				error += Math.abs(state.y2 - state.y1);
				if(swapped) colorCell(currentY, currentX);
				else colorCell(currentX, currentY);
			}
			stateID = 2;
		}
	};       
})();
var color = function(event){
	var got = changeCoord(event.pageX, event.pageY);
	bresenham(got.x, got.y);
	eventArray[stateID - 1] = event;
}

var seeked = function(a){
	console.log("entered");
//	a = document.getElementById("typer").value;
	document.getElementById("value").value = a + "pixels/cell";
	console.log(a);
	noofPixels = Number(a);
	init();
	var dump = stateID;
	stateID = 0;
	for(var i = 0; i < dump; i++){
		color(eventArray[i]);
	}
}

canvas.addEventListener("click", color);
