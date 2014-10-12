var noofPixels = 50;
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
context.fillStyle = "#732662"; //this is the color of the canvas.
context.fillRect(0, 0, width, height);
var xoff = canvas.getBoundingClientRect().left, yoff = canvas.getBoundingClientRect().top;

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
/* An advise is ignore looking at the grid. Forget it's there. Trust that it draws correctly*/
/*--------------------Ends Initialisation------------------------------*/



context.fillStyle = "#40bf45"; //this is the color of a cell. Square of noofPixels is called a cell.
var color = function(event){
	var relativeX = event.pageX - xoff, relativeY = event.pageY - yoff; //these are the coordinates treating canvas left top as origin. We don't use canvas coordinates;
	context.fillRect(noofPixels*Math.floor((relativeX-1)/noofPixels), noofPixels*Math.floor((relativeY - 1)/noofPixels), noofPixels, noofPixels);
//	console.log(noofPixels*Math.floor((relativeX-1)/noofPixels) + " " + relativeX + " " + noofPixels*Math.floor((relativeY - 1)/noofPixels) + " " + relativeY);
}

canvas.addEventListener("click", color);
