/****************************************
Circle Shape

-Defined on the zy plane

Dependencies:
-Polygon.js
-BezierCurve.js
-BSplineCurve.js
****************************************/

var CircleShape = function(radius, step) 
{
	this.radius = radius;
	if (radius !== undefined)
	{
		this.radius = 5.0;
	}

	this.step = 0.1;
	if (step !== undefined)
	{
		this.step = 0.1;
	}

	//var diag = Math.sqrt( this.radius * this.radius + this.radius * this.radius);
	var c = 0.551915024494;
	var shape = new BezierCurve([ [0, 1, 0], [0, 1, c], [0, c, 1], [0, 0, 1],
								  [0, 0, 1],[0, -c, 1], [0, -1, c], [0, -1, 0],
								   [0, -1, 0],[0, -1, -c], [0, -c, -1], [0, 0, -1],
								  [0, 0, -1],[0, c, -1], [0, 1, -c], [0, 1, 0]
								]);

	Polygon.call(this);

	this.center = [0,0,0];

	this.generateFromCurve(shape, this.step);


}

CircleShape.prototype = Object.create(Polygon.prototype);
CircleShape.prototype.constructor = CircleShape;
