/**
*
* Cylinder
*
*/

var Cylinder = function(r, c){
	this.setRows(r);
	this.setCols(c);
	
	Model.call(this);
	this.init();
}

Cylinder.prototype = Object.create(Model.prototype);
Cylinder.prototype.constructor = Cylinder;

Cylinder.prototype.createGrid = function(){
	this.createCilinderGrid();
}

Cylinder.prototype.setRows = function(rowAmount){
	if(rowAmount === undefined)
	{
		rowAmount = 2;
	}
	this.rows = rowAmount;
}

Cylinder.prototype.setCols = function(colAmount){
	if(colAmount === undefined)
	{
		colAmount = 2;
	}
	this.cols = colAmount;
}


Cylinder.prototype.createCilinderGrid = function(){
	// Bot
	for(var j = 0.0; j < this.cols; j++){
		this.position_buffer.push(0);
		this.position_buffer.push(0);
		this.position_buffer.push(-(this.rows - 1) / 2);
		
		this.color_buffer.push(1.0);
		this.color_buffer.push(0.2);
		this.color_buffer.push(1.0);
		
		this.normals_buffer.push(0);
		this.normals_buffer.push(0);
		this.normals_buffer.push(-1);
	}
	
	// Side
	for (var j = 0.0; j < this.cols; j++) {

		var angle = j * 2 * Math.PI / (this.cols - 1);
		this.position_buffer.push(Math.cos(angle));
		this.position_buffer.push(Math.sin(angle));
		this.position_buffer.push(-(this.rows - 1) / 2);

		this.color_buffer.push(0.5);
		this.color_buffer.push(0.2);
		this.color_buffer.push(0.3);
		
		this.normals_buffer.push(0);
		this.normals_buffer.push(0);
		this.normals_buffer.push(-1);
	}
	
	// Cylinder body
	for (var i = 0.0; i < this.rows; i++) {
		for (var j = 0.0; j < this.cols; j++) {

			// coords with z = 0
			var angle = j * 2 * Math.PI / (this.cols - 1);
			this.position_buffer.push(Math.cos(angle));
			this.position_buffer.push(Math.sin(angle));
			this.position_buffer.push(i-(this.rows - 1) / 2);

			this.color_buffer.push(0.5);
			this.color_buffer.push(0.2);
			this.color_buffer.push(0.3);
			
			this.normals_buffer.push(Math.cos(angle));
			this.normals_buffer.push(Math.sin(angle));
			this.normals_buffer.push(0);
		}
	}
	
	// Side
	for (var j = 0.0; j < this.cols; j++) {

		// dup vert for normals
		var angulo = j * 2 * Math.PI / (this.cols-  1);
		this.position_buffer.push(Math.cos(angulo));
		this.position_buffer.push(Math.sin(angulo));
		this.position_buffer.push(1 / 2);

		this.color_buffer.push(0.5);
		this.color_buffer.push(0.2);
		this.color_buffer.push(0.3);
		
		this.normals_buffer.push(0);
		this.normals_buffer.push(0);
		this.normals_buffer.push(1);
	}
	
	// Top
	for(var j = 0.0; j < this.cols; j++){
		this.position_buffer.push(0);
		this.position_buffer.push(0);
		this.position_buffer.push(this.rows - 1 - (this.rows - 1) / 2);
		
		this.color_buffer.push(1.0);
		this.color_buffer.push(0.2);
		this.color_buffer.push(1.0);
		
		this.normals_buffer.push(0);
		this.normals_buffer.push(0);
		this.normals_buffer.push(1);
	}
	
	this.rows++;
	this.rows++;
	this.rows++;
	this.rows++;
};