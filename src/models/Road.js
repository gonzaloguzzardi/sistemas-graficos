/****************************************
Road

Dependencies:
-SweptSurface.js
-RoadShape.js
-BezierCurve.js
****************************************/

var Road = function(length, width, step) 
{
	this.step = 0.1;
	if (step !== undefined)
	{
		this.step = step;
	}

	this.length = 50;
	if (length !== undefined)
	{
		this.length = length;
	}

	this.width = 25;
	if (width !== undefined)
	{
		this.width = width;
	}


	var roadShape = new RoadShape(this.step, this.width);

	var halfLength = this.length * 0.5;

	var normalAxis = [0, 0, 1];
	this.roadPath = new BezierCurve([[-halfLength, 0, 0],
									[-halfLength * 0.5, 0, 0],
									[halfLength * 0.5, 0, 0],
									[halfLength, 0, 0]
									], normalAxis);


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

	while(u <= this.roadPath.maxU)
	{
		point = this.roadPath.pointFromCurve(u);
		pathPoints.push(point);

		tangent = this.roadPath.firstDerivFromCurve(u);
		nTangent = Math.sqrt ( Math.pow ( tangent[0], 2) + Math.pow (tangent[1], 2) + Math.pow (tangent[2], 2));
		tangent = [tangent[0] / nTangent, tangent[1] / nTangent, tangent[2] / nTangent];

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

	this.setColor(getColor("road"));

}

Road.prototype = Object.create(SweptSurface.prototype);
Road.prototype.constructor = Road;