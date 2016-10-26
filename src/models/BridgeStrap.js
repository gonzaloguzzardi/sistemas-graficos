/****************************************
Bridge Strap

Dependencies:
-SweptSurface.js
-SquareShape.js
-BezierCurve.js
****************************************/

var BridgeStrap = function(startPoint, endPoint) 
{

	this.startPoint = [0.0, 50.0, 0.0];
	if (startPoint !== undefined)
	{
		this.startPoint = startPoint;
	}

	this.endPoint = [100.0, 50.0, 0.0];
	if (endPoint !== undefined)
	{
		this.endPoint = endPoint;
	}

	this.step = 0.01;

	this.baseWidth = 2.5;
	this.baseHeight = 2.5;


	var curvePath = new BezierCurve ([[0, 0, 0], [0, 25, 0], [0, 50, 0], [0, 50, 0]]);
	
	var strapShape = new SquareShape(this.baseWidth, this.baseHeight, this.step);
	
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
		u += this.step;
	}

	SweptSurface.call(this, strapShape, pathPoints, pathBases);

	this.init();

	this.setColor(getColor("strap"));
}

BridgeStrap.prototype = Object.create(SweptSurface.prototype);
BridgeStrap.prototype.constructor = BridgeStrap;