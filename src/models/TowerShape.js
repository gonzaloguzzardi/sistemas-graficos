/****************************************
Tower Shape

Dependencies:
-Polygon.js
-BezierCurve.js
-BSplineCurve.js
****************************************/

var TowerShape = function(step) 
{
	this.farRight = 5.0;
	this.middleRight = 2;

	this.top = 10.0;
	this.bot = 0.0;

	this.rampAmount = 3.5;

	this.farLeft = -this.farRight;
	this.middleLeft = -this.middleRight;

	var normalAxis = [0, 1, 0];

	var shape = new BezierCurve([[this.farRight,0,this.bot],[this.farRight/2.0,0,this.bot],[this.farRight/2.0,0,this.bot],[this.middleRight,0,this.bot], //bot right corner

								[this.middleRight,0, this.bot + this.rampAmount/2.0], [this.middleRight,0, this.bot + this.rampAmount/2.0],[this.middleRight,0,this.bot + this.rampAmount],

								[0,0,this.bot + this.rampAmount], [0,0,this.bot + this.rampAmount], [this.middleLeft,0,this.bot + this.rampAmount],

								[this.middleLeft,0,this.bot + this.rampAmount/2.0], [this.middleLeft,0,this.bot + this.rampAmount/2.0], [this.middleLeft,0,this.bot],

								[this.farLeft/2.0,0,this.bot], [this.farLeft/2.0,0,this.bot], [this.farLeft,0,this.bot],

								[this.farLeft,0,0], [this.farLeft,0,0], [this.farLeft,0,this.top],

								[this.middleLeft/2.0,0,this.top], [this.middleLeft/2.0,0,this.top], [this.middleLeft,0,this.top],

								[this.middleLeft,0,this.top - (this.rampAmount/2.0)], [this.middleLeft,0,this.top - (this.rampAmount/2.0)], [this.middleLeft,0,this.top - this.rampAmount],

								[0,0,this.top - this.rampAmount], [0,0,this.top - this.rampAmount], [this.middleRight,0, this.top - this.rampAmount],

								[this.middleRight,0,this.top - (this.rampAmount/2.0)], [this.middleRight,0,this.top - (this.rampAmount/2.0)], [this.middleRight,0,this.top],

								[this.farRight/2.0,0,this.top], [this.farRight/2.0,0,this.top], [this.farRight,0,this.top],

								[this.farRight,0,this.bot], [this.farRight,0,this.bot], [this.farRight,0,this.bot]

								], normalAxis);


	Polygon.call(this);

	this.center = [0,0,0];

	this.generateFromCurve(shape, step);

}

TowerShape.prototype = Object.create(Polygon.prototype);
TowerShape.prototype.constructor = TowerShape;

TowerShape.prototype.generateFromCurve = function(curve, step)
{
	var points = [];
	var normals = [];
	var tangents = [];
	var point;
	var tangent;
	var axisZ = vec3.fromValues(0,1,0);
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
