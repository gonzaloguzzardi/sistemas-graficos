/****************************************
Terrain

Dependencies:
-SweptSurface.js
-BSplineCurve.js
****************************************/

var Terrain = function(riverCurve, coastWidth, terrainWidth, terrainElevation, facingRight, step) 
{
	this.step = 0.1;
	if (step !== undefined)
	{
		this.step = step;
	}

	this.coastWidth = 50;
	if (coastWidth !== undefined)
	{
		this.coastWidth = coastWidth;
	}

	this.terrainWidth = 500;
	if (terrainWidth !== undefined)
	{
		this.terrainWidth = terrainWidth;
	}

	this.terrainElevation = 50;
	if (terrainElevation !== undefined)
	{
		this.terrainElevation = terrainElevation;
	}

	this.riverCurve = riverCurve;
	if (riverCurve === undefined)
	{
		console.log("Terrain curve is undefined!");
		return;
	}

	this.facingRight = false;
	if (facingRight !== undefined)
	{
		this.facingRight = facingRight;
	}

	this.coastElevation = this.terrainElevation * 0.1;

	var terrainShape = new Polygon();
	/*var points = [];
	for (var i = 0; i< this.riverCurve.controlPoints.length; i++)
	{
		var point = [this.riverCurve.controlPoints[i][0], this.riverCurve.controlPoints[i][1], this.riverCurve.controlPoints[i][2]];
	}*/

	//var curve = new BSplineCurve(this.riverCurve);

	//terrainShape.generateFromCurve(this.riverCurve, 0.1, [0.0, 0.0, 1.0]);


	var facingRightMultiplayer = facingRight? -1 : 1;
	var modifiedCoastWidth = this.coastWidth * facingRightMultiplayer;
	var modifiedTerrainWidth = this.terrainWidth * facingRightMultiplayer * 0.5;

	this.terrainCurve = new BSplineCurve([[0, 0, modifiedCoastWidth],[0, 0, modifiedCoastWidth],[0, 0, modifiedCoastWidth],
										  //[0, this.coastElevation * 0.25 , modifiedCoastWidth * 1.25],
										  [0,this.coastElevation * 0.5 , modifiedCoastWidth * 1.25],
										  [0 ,this.coastElevation * 0.85, modifiedCoastWidth * 1.95],
										  //[0 ,this.coastElevation * 0.95, modifiedCoastWidth * 1.95],
										  [0 ,this.terrainElevation , modifiedCoastWidth * 2.15],
										  [0, this.terrainElevation, modifiedTerrainWidth + modifiedCoastWidth], [0, this.terrainElevation, modifiedTerrainWidth + modifiedCoastWidth], [0, this.terrainElevation, modifiedTerrainWidth + modifiedCoastWidth]
									], [1.0, 0.0, 0.0]);

		this.terrainCurve = new BSplineCurve([[-10.0, -this.coastElevation * 0.2, 0],[-10.0, -this.coastElevation * 0.2, 0],[0, this.coastElevation * 0.2, 0],
											[0, this.coastElevation * 0.7, modifiedCoastWidth * 0.25],[0, this.coastElevation * 0.75, modifiedCoastWidth * 0.5],[0, this.coastElevation, modifiedCoastWidth * 0.85],
										  [0,this.terrainElevation * 0.75 , modifiedCoastWidth ], [0,this.terrainElevation * 0.9  , modifiedCoastWidth * 1.25 ], [0,this.terrainElevation  , modifiedCoastWidth * 1.45],
										  [0, this.terrainElevation, modifiedTerrainWidth], [0, this.terrainElevation, modifiedTerrainWidth], [0, this.terrainElevation, modifiedTerrainWidth]
									], [1.0, 0.0, 0.0]);

	//this.terrainCurve = new BezierCurve([[0,0,0], [0,0,0],[0,0,0],[0,0,500]]);
	terrainShape.generateFromCurve(this.terrainCurve, 0.1, [1.0, 0.0, 0.0]);


	var u = 0;
	var pathPoints = [];
	var pathBases = [];
	var point;
	var base;
	var tangent;
	var normal;
	var nNormal;
	var normaVec;
	var axisZ = vec3.fromValues(-1.0, 0.0, 0.0);
	var vecAux = vec3.create();
	var nTangent;

	while(u <=  this.riverCurve.maxU)
	{
		point = this.riverCurve.pointFromCurve(u);
		pathPoints.push(point);

		tangent = this.riverCurve.firstDerivFromCurve(u);
		nTangent = Math.sqrt ( Math.pow ( tangent[0], 2) + Math.pow (tangent[1], 2) + Math.pow (tangent[2], 2));
		tangent = [tangent[0] / nTangent, -tangent[1] / nTangent, tangent[2] / nTangent];

		normal = vec3.create();
		vec3.cross(vecAux, axisZ, tangent);
		normaVec = Math.sqrt (Math.pow(vecAux[0], 2) + Math.pow(vecAux[1], 2) + Math.pow(vecAux[2], 2));

		vecAux = [vecAux[0] / normaVec, vecAux[1] / normaVec, vecAux[2] / normaVec];
		vec3.cross(normal,vecAux, tangent);
		nNormal = Math.sqrt(Math.pow(normal[0], 2) + Math.pow(normal[1], 2) + Math.pow(normal[2], 2));
		normal = [normal[0] / nNormal, normal[1] / nNormal, normal[2] / nNormal];


		base = [normal, vecAux, tangent, ];
		pathBases.push(base);
		u += step;
	}

	SweptSurface.call(this, terrainShape, pathPoints, pathBases);

	this.init();

	this.setColor(getColor("green"));

	console.log(this)
}

Terrain.prototype = Object.create(SweptSurface.prototype);
Terrain.prototype.constructor = Terrain;