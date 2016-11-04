/****************************************
Square Shape

-Defined on the xz plane

Dependencies:
-Polygon.js
-BSplineCurve.js
****************************************/

var SquareShape = function(width, height, step) 
{
	this.width = 2.5;
	if (width !== undefined)
	{
		this.width = width;
	}

	this.height = 2.5;
	if (height !== undefined)
	{
		this.height = height;
	}

	this.step = 0.1;
	if (step !== undefined)
	{
		this.step = step;
	}

	this.roundness = 0.5;

	var halfWidth = this.width * 0.5;
	var halfHeight = this.height * 0.5;

	var shape = new BSplineCurve([ [-halfWidth + this.roundness, 0, -halfHeight], [-halfWidth + this.roundness, 0, -halfHeight], [-halfWidth + this.roundness, 0, -halfHeight], 

									[-halfWidth, 0, -halfHeight], 

									[-halfWidth, 0, -halfHeight + this.roundness], [-halfWidth, 0, -halfHeight + this.roundness], [-halfWidth, 0, -halfHeight + this.roundness], 
									[-halfWidth, 0, halfHeight - this.roundness], [-halfWidth, 0, halfHeight - this.roundness], [-halfWidth, 0, halfHeight - this.roundness], 

									[-halfWidth, 0, halfHeight], 

									[-halfWidth + this.roundness, 0, halfHeight], [-halfWidth + this.roundness, 0, halfHeight], [-halfWidth + this.roundness, 0, halfHeight], 
									[halfWidth - this.roundness, 0, halfHeight], [halfWidth - this.roundness, 0, halfHeight], [halfWidth - this.roundness, 0, halfHeight], 

									[halfWidth, 0, halfHeight], 

									[halfWidth, 0, halfHeight - this.roundness], [halfWidth, 0, halfHeight - this.roundness], [halfWidth, 0, halfHeight - this.roundness], 
									[halfWidth, 0, -halfHeight + this.roundness], [halfWidth, 0, -halfHeight + this.roundness], [halfWidth, 0, -halfHeight + this.roundness], 

									[halfWidth, 0, -halfHeight], 

									[halfWidth - this.roundness, 0, -halfHeight], [halfWidth - this.roundness, 0, -halfHeight], [halfWidth - this.roundness, 0, -halfHeight], 
									[-halfWidth + this.roundness, 0, -halfHeight], [-halfWidth + this.roundness, 0, -halfHeight], [-halfWidth + this.roundness, 0, -halfHeight]

								]);

	Polygon.call(this);

	this.center = [0,0,0];

	this.generateFromCurve(shape, this.step);


}

SquareShape.prototype = Object.create(Polygon.prototype);
SquareShape.prototype.constructor = SquareShape;
