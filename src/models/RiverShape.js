/****************************************
River Shape

Dependencies:
-Polygon.js
-BezierCurve.js
****************************************/

var RiverShape = function(step, width) 
{
	this.riverWidth = 15.0;
	if (this.riverWidth !== undefined)
	{
		this.riverWidth = width;
	}

	var halfLength = this.riverWidth * 0.5;

	//var shape = new BezierCurve([ [-halfLength, 0, 0], [0.0, 0, 0], [0.0, 0, 0], [halfLength, 0, 0]]); //x
	//var shape = new BezierCurve([ [0, -halfLength, 0], [0.0, 0, 0], [0.0, 0, 0], [0, halfLength, 0]]); //y
	var shape = new BezierCurve([ [0, 0, -halfLength], [0.0, 0, 0], [0.0, 0, 0], [0, 0, halfLength]]); //x

	Polygon.call(this);

	this.center = [0,0,0];

	this.generateFromCurve(shape, step);

}

RiverShape.prototype = Object.create(Polygon.prototype);
RiverShape.prototype.constructor = RiverShape;