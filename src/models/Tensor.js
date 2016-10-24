/****************************************
Tensor

Dependencies:
-SweptSurface.js
-Polygon.js
-BezierCurve.js
-BSplineCurve.js
****************************************/

var Tensor = function(step) 
{
	this.width = 100.0;
	this.height = 10.0;
	this.roadSlopeModifier = 0.9;
	this.roadSlopeModifier2 = 15.010;

	var polygon = new Polygon();
	var circle = new BSplineCurve([[-0.1,0,0],[-0.1,0.1,0],[0.1,0.1,0.1],[0.1,0,0.1],[0.1,-0.1,0],[-0.1,-0.1,0.1],[-0.1,0.05,0.1]]);

	var circleStep = 0.1;
	polygon.generateFromCurve(circle, circleStep);

	//roadPath it's made of BSpline Curves, Repeating 3 times the beginning point, height point and end point.
	var curvePath = new BSplineCurve([[-this.width/2.0, 0, 0],[-this.width/2.0, 0, 0], [-this.width/2.0, 0, 0],[-this.width/3.0, this.height * this.roadSlopeModifier, 0],
									[-this.width/this.roadSlopeModifier2, this.height, 0.0],[0.0, this.height, 0.0], [0.0, this.height, 0.0], [0.0, this.height, 0.0],
									[this.width/this.roadSlopeModifier2, this.height, 0.0],[this.width/3.0, this.height * this.roadSlopeModifier, 0.0], [this.width/2.0, 0.0, 0.0],
									[this.width/2.0, 0.0, 0.0], [this.width/2.0, 0.0, 0.0]]);
	
	var u = 0;
	var pathPoints = [];
	var pathBases = [];
	var point;
	var base;
	var tangent;
	var normal;
	var nNormal;
	var normaVec;
	var axisZ = vec3.fromValues(0,0,1);
	var vecAux = vec3.create();
	var nTangent;

	while(u <= curvePath.maxU)
	{
		point = curvePath.pointFromCurve(u);
		pathPoints.push(point);
		tangent = curvePath.firstDerivFromCurve(u);
		nTangent = Math.sqrt ( Math.pow ( tangent[0], 2) + Math.pow (tangent[1], 2) + Math.pow (tangent[2], 2));
		tangent = [-tangent[0] / nTangent, tangent[1] / nTangent, -tangent[2] / nTangent];
		normal = vec3.create();
		vec3.cross(vecAux, axisZ, tangent);
		normaVec = Math.sqrt (Math.pow(vecAux[0], 2) + Math.pow(vecAux[1], 2) + Math.pow(vecAux[2], 2));
		vecAux = [vecAux[0] / normaVec, vecAux[1] / normaVec, vecAux[2] / normaVec];
		vec3.cross(normal,vecAux, tangent);
		nNormal = Math.sqrt(Math.pow(normal[0], 2) + Math.pow(normal[1], 2) + Math.pow(normal[2], 2));
		normal = [normal[0] / nNormal, normal[1] / nNormal, normal[2] / nNormal];
		base = [normal, vecAux, tangent];
		pathBases.push(base);
		u += step;
	}

	SweptSurface.call(this, polygon, pathPoints, pathBases);

	this.init();
}

Tensor.prototype = Object.create(SweptSurface.prototype);
Tensor.prototype.constructor = Tensor;