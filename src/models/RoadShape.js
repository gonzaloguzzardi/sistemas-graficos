/****************************************
Road Shape

Dependencies:
-Polygon.js
-BezierCurve.js
-BSplineCurve.js
****************************************/

var RoadShape = function(step, width) 
{
	this.roadLength = width;

	this.rampHeight = 4.0;
	this.rampLength = 2.5;
	this.rampSlope = 1.0;


	var halfLength = this.roadLength/2.0;


	var shape = new BSplineCurve([ [0.0, 0.0, halfLength], [0.0, 0.0, halfLength], [0.0, 0.0, halfLength],  //inicio
								[0.0, this.rampHeight, halfLength], [0.0, this.rampHeight, halfLength], [0.0, this.rampHeight, halfLength],  //sube
								[0.0, this.rampHeight, halfLength - this.rampLength], [0.0, this.rampHeight, halfLength - this.rampLength], [0.0, this.rampHeight, halfLength - this.rampLength],  //dobla
								[0.0, 0.0, halfLength - this.rampLength - this.rampSlope], [0.0, 0.0, halfLength - this.rampLength - this.rampSlope], [0.0, 0.0, halfLength - this.rampLength - this.rampSlope],  //baja

								[0.0, 0.0, 0.0], [0.0, 0.0, 0.0], [0.0, 0.0, 0.0], 

								[0.0, 0.0, -halfLength + this.rampLength + this.rampSlope], [0.0, 0.0, -halfLength + this.rampLength + this.rampSlope], [0.0, 0.0, -halfLength + this.rampLength + this.rampSlope], 
								[0.0, this.rampHeight, -halfLength + this.rampLength], [0.0, this.rampHeight, -halfLength + this.rampLength], [0.0, this.rampHeight, -halfLength + this.rampLength], 
								[0.0, this.rampHeight, -halfLength], [0.0, this.rampHeight, -halfLength], [0.0, this.rampHeight, -halfLength], 
								[0.0, 0.0, -halfLength], [0.0, 0.0, -halfLength], [0.0, 0.0, -halfLength], 
								[0.0, 0.0, 0.0], [0.0, 0.0, 0.0], [0.0, 0.0, 0.0], 
								[0.0, 0.0, halfLength], [0.0, 0.0, halfLength], [0.0, 0.0, halfLength], 
								]);


	Polygon.call(this);

	this.center = [0,0,0];

	this.generateFromCurve(shape, step);

}

RoadShape.prototype = Object.create(Polygon.prototype);
RoadShape.prototype.constructor = TowerShape;
