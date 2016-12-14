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

	this.rampHeight = 5.0;
	this.rampLength = 7.25;
	this.rampSlope = 1.0;

	this.roadWidth = 0.0;


	var halfLength = this.roadLength/2.0;

	var normalAxis = [1, 0, 0];
	this.shape = new BSplineCurve([ [-this.roadWidth, 0.0, halfLength], [-this.roadWidth, 0.0, halfLength], [-this.roadWidth, 0.0, halfLength],  //inicio
								[0.0, this.rampHeight, halfLength], [0.0, this.rampHeight, halfLength], [0.0, this.rampHeight, halfLength],  //sube
								[0.0, this.rampHeight, halfLength - this.rampLength], [0.0, this.rampHeight, halfLength - this.rampLength], [0.0, this.rampHeight, halfLength - this.rampLength],  //dobla
								[0.0, 0.0, halfLength - this.rampLength - this.rampSlope], [0.0, 0.0, halfLength - this.rampLength - this.rampSlope], [0.0, 0.0, halfLength - this.rampLength - this.rampSlope],  //baja

								[0.0, 0.0, 0.0], [0.0, 0.0, 0.0], [0.0, 0.0, 0.0], 

								[0.0, 0.0, -halfLength + this.rampLength + this.rampSlope], [0.0, 0.0, -halfLength + this.rampLength + this.rampSlope], [0.0, 0.0, -halfLength + this.rampLength + this.rampSlope], 
								[0.0, this.rampHeight, -halfLength + this.rampLength], [0.0, this.rampHeight, -halfLength + this.rampLength], [0.0, this.rampHeight, -halfLength + this.rampLength], 
								[0.0, this.rampHeight, -halfLength], [0.0, this.rampHeight, -halfLength], [0.0, this.rampHeight, -halfLength], 
								[0-this.roadWidth, 0.0, -halfLength], [-this.roadWidth, 0.0, -halfLength], [-this.roadWidth, 0.0, -halfLength], 
								//[-this.roadWidth, 0.0, 0.0], [-this.roadWidth, 0.0, 0.0], [-this.roadWidth, 0.0, 0.0], 
								//[-this.roadWidth, 0.0, halfLength], [-this.roadWidth, 0.0, halfLength], [-this.roadWidth, 0.0, halfLength], 
								], normalAxis);


	Polygon.call(this);

	this.center = [0,0,0];

	this.generateFromCurve(this.shape, step, [1, 0, 0]);

}

RoadShape.prototype = Object.create(Polygon.prototype);
RoadShape.prototype.constructor = TowerShape;

RoadShape.prototype.generateFromCurve = function(curve, step)
{
	var points = [];
	var normals = [];
	var tangents = [];
	var textureValues = [];
	var point;
	var tangent;
	var axisZ = vec3.fromValues(-1,0,0);
	var x = 0; 
	var y = 0;
	var z = 0;

	for (var u = curve.minU ; u <= curve.maxU; u += step)
	{
		var normal = vec3.create();
		point = curve.pointFromCurve(u);
		x += point[0];
		y += point[1];
		z += point[2];
		tangent = curve.firstDerivFromCurve(u);
		vec3.cross(normal, tangent, axisZ);
		points.push(point);
		tangents.push(tangent);
		normals.push(normal);

		var textureValue = 0.0;
		if ((u >= 9) && (u <= 15))
		{
			textureValue = 1.0;
		}
		textureValues.push(textureValue);

	}
	var centerX = x / points.length;
	var centerY = y / points.length;
	var centerZ = z / points.length;
	var center = vec3.fromValues(centerX, centerY, centerZ);
	this.setPoints(points);
	this.setTangents(tangents);
	this.setNormals(normals);
	this.setCenter(center);
	this.setTextureValues(textureValues);
}
