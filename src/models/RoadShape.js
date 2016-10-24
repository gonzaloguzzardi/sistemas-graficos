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

	this.rampHeight = 2.0;
	this.rampLength = 2.5;
	this.rampSlope = 1.0;


	var halfLength = this.roadLength/2.0;

	/*var shape = new BezierCurve([
								[halfLength, 0.0, 0.0], [halfLength, 0.0, 0.0], [halfLength,0.0, this.rampHeight], [halfLength, 0.0, this.rampHeight],
								[halfLength,0.0, this.rampHeight], [halfLength - this.rampLength,0.0, this.rampHeight],[halfLength - this.rampLength, ,0.0, this.rampHeight],
								[halfLength - this.rampLength - this.rampSlope, 0.0, 0.0], [halfLength - this.rampLength - this.rampSlope, 0.0, 0.0], [halfLength - this.rampLength - this.rampSlope, 0.0, 0.0], 
								[0.0, 0.0, 0.0], [0.0, 0.0, 0.0], [0.0, 0.0, 0.0], 
								[-halfLength + this.rampLength + this.rampSlope, 0.0, 0.0], [-halfLength + this.rampLength + this.rampSlope, 0.0, 0.0], [-halfLength + this.rampLength + this.rampSlope, 0.0, 0.0], 
								[-halfLength + this.rampLength,,0.0, this.rampHeight], [-halfLength + this.rampLength, 0.0, this.rampHeight], [-halfLength + this.rampLength, 0.0, this.rampHeight], 
								[-halfLength, 0.0, this.rampHeight], [-halfLength,0.0, this.rampHeight], [-halfLength, 0.0, this.rampHeight], 
								[-halfLength, 0.0, 0.0], [-halfLength, 0.0, 0.0], [-halfLength, 0.0, 0.0]
								]);*/



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

RoadShape.prototype.getTransformedPolygon = function(newCenter, newBase, scale)
{
	if (scale === undefined)
	{
		scale = [1.0,1.0,1.0];
	}
	var transformPolygon = new RoadShape(0.1, this.width);

	transformPolygon.setCenter(newCenter);

	var distance = vec3.fromValues(newCenter[0] - this.center[0], newCenter[1] - this.center[1], newCenter[2] - this.center[2] )
	var changeBaseMat = this.changeBaseMatrix(newBase, scale);

	var transformPoints = this.transformVectors(this.points, changeBaseMat);
	transformPoints = this.addDisplacement(transformPoints, distance);
	transformPolygon.setPoints(transformPoints);

	var transformTangents = this.transformVectors(this.tangents, changeBaseMat);
	transformPolygon.setTangents(transformTangents);

	var transformNormals = this.transformVectors(this.normals, changeBaseMat);
	transformPolygon.setNormals(transformNormals);

	return transformPolygon;
}
