/****************************************
Bridge Road

Dependencies:
-SweptSurface.js
-RoadShape.js
-BezierCurve.js
-BSplineCurve.js
****************************************/

var BridgeRoad = function(length, width, height) 
{
	var step = 0.1;

	this.length = length;
	this.width = width;
	this.height = height;
	this.roadSlopeModifier = 0.8;


	var roadShape = new RoadShape(0.1, this.width);


	//roadPath it's made of BSpline Curves, Repeating 3 times the beginning point, height point and end point.
	var roadPath = new BSplineCurve([[-this.length/2.0 - 5.0, 0, 0],[-this.length/2.0 -5.0, 0, 0], [-this.length/2.0 - 5.0, 0, 0], //union con calle
									[-this.length/2.0, 0, 0],[-this.length/2.0, 0, 0], [-this.length/2.0, 0, 0], //punto inicial
									[-this.length/3.0, this.height * this.roadSlopeModifier, 0],
									[-this.length/15.0, this.height, 0.0],
									[0.0, this.height, 0.0], [0.0, this.height, 0.0], [0.0, this.height, 0.0], //punto de altura maxima
									[this.length/15.0, this.height, 0.0],
									[this.length/3.0, this.height * this.roadSlopeModifier, 0],
									[this.length/2.0, 0.0, 0.0], [this.length/2.0, 0.0, 0.0], [this.length/2.0, 0.0, 0.0],
									[this.length/2.0 + 5.0, 0.0, 0.0], [this.length/2.0 +5.0, 0.0, 0.0], [this.length/2.0 + 5.0, 0.0, 0.0], //union con calle
									]);


	var u = 0;
	var pathPoints = [];
	var pathBases = [];
	var point;
	var base;
	var tangent;
	var normal;
	var nNormal;
	var normaVec;
	var axisZ = vec3.fromValues(0,1,0);
	var vecAux = vec3.create();
	var nTangent;

	while(u <= roadPath.maxU)
	{
		point = roadPath.pointFromCurve(u);
		pathPoints.push(point);

		tangent = roadPath.firstDerivFromCurve(u);
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

	SweptSurface.call(this, roadShape, pathPoints, pathBases);

	this.init();
}

BridgeRoad.prototype = Object.create(SweptSurface.prototype);
BridgeRoad.prototype.constructor = BridgeRoad;

