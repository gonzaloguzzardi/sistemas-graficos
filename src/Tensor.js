/****************************************
Tensor

Dependencies:
-SweptSurface.js
-Polygon.js
-BezierCurve.js
-BSplineCurve.js
****************************************/

var Tensor = function(curve, step) 
{
	var polygon = new Polygon();
	var circle = new BezierCurve([[-0.1,0,0],[-0.1,0.1,0],[0.1,0.1,0.1],[0.1,0,0.1],[0.1,-0.1,0],[-0.1,-0.1,0.1],[-0.1,0.05,0.1]]);

	var circleStep = 0.05;
	polygon.generateCurve(circle, circleStep);

	var curvePath = curve;
	//var curvePath = new BSplineCurve([[1,1,0],[1,1,0],[1,1,0],[1.5,0.6,0.3],[1.4,0.9,0.4],[0.8,0.3,1],[0.1,0.5,1.5],[0,0,2],[1.3,0.6,1],[1.4,-1.2,1.4],[1.6,0.4,0.5],[1.5,0.5,0.4],[1.5,0.5,0.4],[1.5,0.5,0.4]]);
	
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