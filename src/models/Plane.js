/*
*
* Plane
*
*/

var Plane = function(w, h){
	this.setRows(w);
	this.setCols(h);
	
	Model.call(this, this.gridType);
	this.tangent_buffer = [];
	this.binormal_buffer = [];
	this.init();
}

Plane.prototype = Object.create(Model.prototype);
Plane.prototype.constructor = Plane;

Plane.prototype.createGrid = function()
{
	this.createPlaneGrid();
}

Plane.prototype.setRows = function(width)
{
	if(width === undefined)
	{
		width = 2;
	}
	this.rows = width;
}

Plane.prototype.setCols = function(height)
{
	if(height === undefined)
	{
		height = 2;
	}
	this.cols = height;
}

// create Plane mesh
Plane.prototype.createPlaneGrid = function()
{
	for (var i = 0.0; i < this.rows; i++) { 
		for (var j = 0.0; j < this.cols; j++) {

			// y = 0
			var x = i - (this.rows - 1.0) / 2.0;
			x *= 5;
			var z = j - (this.cols - 1.0) / 2.0;
			z *= 5;
			this.position_buffer.push(x);
			this.position_buffer.push(0);
			this.position_buffer.push(z);

			// Color
			this.color_buffer.push(0.35);
			this.color_buffer.push(0.35);
			this.color_buffer.push(0.35);
			
			// Normals
			this.normals_buffer.push(0);
			this.normals_buffer.push(0);
			this.normals_buffer.push(1);
			
			// Tangents
			this.tangent_buffer.push(1);
			this.tangent_buffer.push(0);
			this.tangent_buffer.push(0);
			
			//Binormals
			this.binormal_buffer.push(0);
			this.binormal_buffer.push(1);
			this.binormal_buffer.push(0);
		};
	};
};