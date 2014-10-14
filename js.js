//var totalHeight = screen.availHeight;
//var totalWidth = screen.availWidth;
var fixedDimension = 600;
var width = 2*fixedDimension, height = fixedDimension;
//document.getElementById("output").firstChild.nodeValue = "height: " + height + "\n width: " + width;

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

var noofPixels = 50;
var xoff = canvas.getBoundingClientRect().left, yoff = canvas.getBoundingClientRect().top;


var init = function(){
	context.fillStyle = "#732662"; //this is the color of the canvas.
	context.fillRect(0, 0, width, height);
	/* These two for-loops draw the grid */
	for(var x = 0.5; x < width; x = x + noofPixels){
		context.moveTo(x, 0);
		context.lineTo(x, height);
	}
	
	for(var y = 0.5; y < height; y = y + noofPixels){
		context.moveTo(0, y);
		context.lineTo(width, y);
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

var bresenham = 
(function(){
	var stateID = 0; //state 0 is zero cliks, 1 is 1 click, 2 is 2clicks. In stage 2, we have to draw the line
	var state = {};
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
//	colorCell(got.x, got.y);
	bresenham(got.x, got.y);
}


canvas.addEventListener("click", color);
