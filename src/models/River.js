/****************************************
Road

Dependencies:
-SweptSurface.js
-RiverShape.js
-BSplineCurve.js
****************************************/

var River = function(width, curve, step) 
{
	this.step = 0.1;
	if (this.step !== undefined)
	{
		this.step = step;
	}

	this.width = 25;
	if (this.width !== undefined)
	{
		this.width = width;
	}

	var riverShape = new RiverShape(this.step, this.width);

	if (curve === undefined)
	{
		throw new Error("River needs a curve to be created.");
	}

	this.riverCurve = curve;

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

	while(u <= this.riverCurve.maxU)
	{
		point = this.riverCurve.pointFromCurve(u);
		pathPoints.push(point);

		tangent = this.riverCurve.firstDerivFromCurve(u);
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

	SweptSurface.call(this, riverShape, pathPoints, pathBases);

	this.init();

	this.setColor(getColor("river"));

}

River.prototype = Object.create(SweptSurface.prototype);
River.prototype.constructor = River;