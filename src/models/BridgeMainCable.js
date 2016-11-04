/****************************************
Bridge Main Cable

Dependencies:
-SweptSurface.js
-CircleShape.js
-BezierCurve.js
-BSplineCurve.js
****************************************/

var BridgeMainCable = function(startPoint, endPoint, radius, type, ph2) 
{

	this.type = 1;
	if (type !== undefined)
	{
		this.type = type;
	}

	this.radius = 5.0;
	if (radius !== undefined)
	{
		this.radius = radius;
	}

	this.ph2 = 0.0;
	if (ph2 !== undefined)
	{
		this.ph2 = ph2;
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

	this.step = 0.01;

	var deltaX = this.endPoint[0] - this.startPoint[0];
	var deltaY = this.startPoint[1] - this.endPoint[1];

	var normalAxis = [0, 0, 1];
	this.curvePath;
	var p1, p2, halfHeightPoint, halfHeightPointRight;
	if (this.type == 1)
	{
		p1 = [deltaX * 0.4 + this.startPoint[0], -deltaY * 0.8 + this.startPoint[1], 0.0];
		p2 = [deltaX * 0.6 + this.startPoint[0], -deltaY * 0.8 + this.startPoint[1], 0.0];
		this.curvePath = new BezierCurve ([this.startPoint, p1, p2, this.endPoint], normalAxis);
	}
	else if (this.type == 2)
	{
		deltaY = this.startPoint[1] - this.ph2;
		p1 = [deltaX * 0.1 + this.startPoint[0], -deltaY * 0.775 + this.startPoint[1], 0.0];
		p2 = [deltaX * 0.9 + this.startPoint[0], -deltaY * 0.775 + this.startPoint[1], 0.0];
		this.curvePath = new BezierCurve ([this.startPoint, p1, p2, this.endPoint], normalAxis);
	}
	else if (this.type == 3)
	{
		deltaY = this.startPoint[1] - this.ph2;
		p1 = [deltaX * 0.35 + this.startPoint[0], -deltaY * 0.75 + this.startPoint[1], 0.0];
		p2 = [deltaX * 0.65 + this.startPoint[0], -deltaY * 0.75 + this.startPoint[1], 0.0];
		this.curvePath = new BezierCurve ([this.startPoint, p1, p2, this.endPoint], normalAxis);
	}
	else if (this.type == 4)
	{
		deltaY = this.startPoint[1] - this.ph2;
		p1 = [deltaX * 0.4 + this.startPoint[0], -deltaY * 0.725 + this.startPoint[1], 0.0];
		p2 = [deltaX * 0.6 + this.startPoint[0], -deltaY * 0.725 + this.startPoint[1], 0.0];
		this.curvePath = new BezierCurve ([this.startPoint, p1, p2, this.endPoint], normalAxis);
	}
	else
	{
		this.curvePath = new BezierCurve ([this.startPoint, p1, p2,this.endPoint], normalAxis);
	}


	var cableShape = new CircleShape(this.radius, this.step);
	
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

	while(u <= this.curvePath.maxU)
	{
		point = this.curvePath.pointFromCurve(u);
		pathPoints.push(point);
		tangent = this.curvePath.firstDerivFromCurve(u);
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

	SweptSurface.call(this, cableShape, pathPoints, pathBases);

	this.init();

	this.setColor(getColor("mainCables"));
}

BridgeMainCable.prototype = Object.create(SweptSurface.prototype);
BridgeMainCable.prototype.constructor = BridgeMainCable;

BridgeMainCable.prototype.setRadius = function(radius)
{
	this.radius = radius;
}