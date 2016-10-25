/****************************************
Bridge Main Cable

Dependencies:
-SweptSurface.js
-CircleShape.js
-BezierCurve.js
-BSplineCurve.js
****************************************/

var BridgeMainCable = function(startPoint, endPoint, radius) 
{

	this.radius = 5.0;
	if (radius !== undefined)
	{
		this.radius = radius;
	}


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

	this.step = 0.1;

	var halfHeightPointLeft = [(this.endPoint[0] - this.startPoint[0]) * 0.3, this.startPoint[1] * 0.2, 0.0];
	var halfHeightPoint = [(this.endPoint[0] - this.startPoint[0]) * 0.5, this.startPoint[1] * 0.2, 0.0];
	var halfHeightPointRight = [(this.endPoint[0] - this.startPoint[0]) * 0.7, this.startPoint[1] * 0.2, 0.0];

	var p1 = [(this.endPoint[0] - this.startPoint[0]) * 0.1, this.startPoint[1] * 0.5, 0.0];
	var p2 = [(this.endPoint[0] - this.startPoint[0]) * 0.9, this.startPoint[1] * 0.5, 0.0];

	var polygon = new CircleShape(this.radius, this.step);

	
	var curvePath = new BSplineCurve([ this.startPoint, this.startPoint, this.startPoint,
										p1, 
										halfHeightPointLeft,
										halfHeightPoint, 
										halfHeightPointRight,
										p2, 
										this.endPoint, this.endPoint, this.endPoint
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

	SweptSurface.call(this, polygon, pathPoints, pathBases);

	this.init();
}

BridgeMainCable.prototype = Object.create(SweptSurface.prototype);
BridgeMainCable.prototype.constructor = BridgeMainCable;

BridgeMainCable.prototype.setRadius = function(radius)
{
	this.radius = radius;
}