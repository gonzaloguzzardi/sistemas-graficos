/*
	Sky Dome

*/

var SkyDome = function()
{
	this.setRows();
	this.setCols();
	
	Model.call(this, this.gridType);
	this.init();
}

SkyDome.prototype = Object.create(Model.prototype);
SkyDome.prototype.constructor = SkyDome;

SkyDome.prototype.createGrid = function()
{
	this.createDomeGrid();
}

SkyDome.prototype.setRows = function()
{
	this.rows = 50;
}

SkyDome.prototype.setCols = function()
{
	this.cols = 50;
}

SkyDome.prototype.createDomeGrid = function()
{
	for (var i = 0.0; i < this.rows; i++) 
	{ 
	   for (var j = 0.0; j < this.cols; j++) 
	   {

		   var angle1 = j * 2 * Math.PI / ((this.cols-1)*2);
		   var angle2 = i * 2 * Math.PI / ((this.rows-1)*2);
		   var x = Math.sin(angulo2)*Math.cos(angle1), y = Math.sin(angle2)*Math.sin(angle1), z = Math.cos(angle2);
		   this.position_buffer.push((x*x+y*y+z*z)*x);
		   this.position_buffer.push((x*x+y*y+z*z)*y);
		   this.position_buffer.push((x*x+y*y+z*z)*z);

		   this.color_buffer.push(1.0/this.rows * i);
		   this.color_buffer.push(0.2);
		   this.color_buffer.push(1.0);
		   
		   this.normals_buffer.push((x*x+y*y+z*z)*x);
		   this.normals_buffer.push((x*x+y*y+z*z)*y);
		   this.normals_buffer.push((x*x+y*y+z*z)*z);
	   }
	}
}