/****************************************
Tower Base

Dependencies:
-SweptSurface.js
-TowerShape.js
-BezierCurve.js
-BSplineCurve.js
****************************************/

var TowerBase = function(step) 
{
	this.height = 10.0;
	this.towerShape = null;

	var shapeStep = 0.05;
	this.towerShape = new TowerShape(shapeStep);

	//var normalAxis = [0, 0, 1];
	var curvePath = new BezierCurve([[0,0,0],[0,this.height/3,0],[0,this.height / 3 * 2,0],[0,this.height,0]]);
	
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

	SweptSurface.call(this, this.towerShape, pathPoints, pathBases);

	this.init();

	this.setUpMaterial();
}

TowerBase.prototype = Object.create(SweptSurface.prototype);
TowerBase.prototype.constructor = TowerBase;

TowerBase.prototype.setUpMaterial = function()
{
	this.loadDiffuseMap("../files/textures/oxido.jpg");
	this.loadNormalMap("../files/textures/oxido-normal map.jpg");

	this.ka = 0.5;
	this.kd = 0.85;
	this.ks = 0.1;
	this.shininess = 0.1;

	this.color_specular = vec3.fromValues(0.125, 0.125, 0.125);
	this.reflectiveness = 0.8;
}
