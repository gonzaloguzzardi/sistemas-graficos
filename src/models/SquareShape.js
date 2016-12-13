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

								], [0, 1, 0]);

	Polygon.call(this);

	this.center = [0,0,0];

	this.generateFromCurve(shape, this.step);


}

SquareShape.prototype = Object.create(Polygon.prototype);
SquareShape.prototype.constructor = SquareShape;

SquareShape.prototype.generateFromCurve = function(curve, step)
{
	var points = [];
	var normals = [];
	var tangents = [];
	var point;
	var tangent;
	var axisZ = vec3.fromValues(0.0, 1.0, 0.0);
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
