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
	var shape = new BezierCurve([ [0, 0, -halfLength], [0.0, 0, 0], [0.0, 0, 0], [0, 0, halfLength]], [0, 1, 0]); //x

	Polygon.call(this);

	this.center = [0,0,0];

	this.generateFromCurve(shape, step);

}

RiverShape.prototype = Object.create(Polygon.prototype);
RiverShape.prototype.constructor = RiverShape;

RiverShape.prototype.generateFromCurve = function(curve, step)
{
	var points = [];
	var normals = [];
	var tangents = [];
	var point;
	var tangent;
	var axisZ = vec3.fromValues(1.0, 0.0, 0.0);
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
	}
	var centerX = x / points.length;
	var centerY = y / points.length;
	var centerZ = z / points.length;
	var center = vec3.fromValues(centerX, centerY, centerZ);
	this.setPoints(points);
	this.setTangents(tangents);
	this.setNormals(normals);
	this.setCenter(center);
}