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


	var facingRightMultiplayer = 1.0;
	if (this.facingRight)
	{
		facingRightMultiplayer = -1.0;
	}
	else
	{
		facingRightMultiplayer = 1.0;
	}
	var modifiedCoastWidth = this.coastWidth * 2.0 * facingRightMultiplayer;
	var modifiedTerrainWidth = this.terrainWidth * facingRightMultiplayer * 0.5;
	var startingPos = 25.0 * facingRightMultiplayer;

	/*this.terrainCurve = new BSplineCurve([[0, 0, modifiedCoastWidth],[0, 0, modifiedCoastWidth],[0, 0, modifiedCoastWidth],
										  //[0, this.coastElevation * 0.25 , modifiedCoastWidth * 1.25],
										  [0,this.coastElevation * 0.5 , modifiedCoastWidth * 1.25],
										  [0 ,this.coastElevation * 0.85, modifiedCoastWidth * 1.95],
										  //[0 ,this.coastElevation * 0.95, modifiedCoastWidth * 1.95],
										  [0 ,this.terrainElevation , modifiedCoastWidth * 2.15],
										  [0, this.terrainElevation, modifiedTerrainWidth + modifiedCoastWidth], [0, this.terrainElevation, modifiedTerrainWidth + modifiedCoastWidth], [0, this.terrainElevation, modifiedTerrainWidth + modifiedCoastWidth]
									], [1.0, 0.0, 0.0]);*/

		this.terrainCurve = new BSplineCurve([[startingPos, -this.coastElevation * 0.2, 0],[startingPos, -this.coastElevation * 0.2, 0],[0, this.coastElevation * 0.2, 0],
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

	this.setUpMaterial();

	console.log(this)
}

Terrain.prototype = Object.create(SweptSurface.prototype);
Terrain.prototype.constructor = Terrain;

Terrain.prototype.createGrid = function()
{
	this.draw_mode = gl.TRIANGLE_STRIP;
	this.tangent_buffer = [];

	this.cols = this.polygon.points.length;
	this.rows = this.pathPoints.length;
	
	var points;
	var point;
	var tangent;
	var normal;
	var transformedPolygon;
	var pathPoint;
	var pathBase;
	var tangents;
	var normals;
				
	for (var row = 0.0; row < this.rows; row++)
	{
		pathPoint = this.pathPoints[row];
		pathBase = this.pathPoints[row];
		transformedPolygon = this.polygon.getTransformedPolygon(pathPoint, pathBase);
		points = transformedPolygon.points;
		tangents = transformedPolygon.tangents;
		normals = transformedPolygon.normals;
		for (var col = 0.0; col < this.cols; col++)
		{
			point = points[col];
			this.position_buffer.push(point[0]);
			this.position_buffer.push(point[1]);
			this.position_buffer.push(point[2]);

			this.color_buffer.push(0.25);
			this.color_buffer.push(0.5); //Color default
			this.color_buffer.push(0.25);

			tangent = tangents[col];
			this.tangent_buffer.push(tangent[0]);
			this.tangent_buffer.push(tangent[1]);
			this.tangent_buffer.push(tangent[2]);

			normal = normals[col];
			this.normals_buffer.push(normal[0]);
			this.normals_buffer.push(normal[1]);
			this.normals_buffer.push(normal[2]);

			binormal = vec3.create();
			vec3.cross(binormal, tangent, normal);
			this.binormal_buffer.push(binormal[0]);
			this.binormal_buffer.push(binormal[1]);
			this.binormal_buffer.push(binormal[2]);

			this.texture_coord_buffer.push(1.0 - col / this.cols);
			this.texture_coord_buffer.push(1.0 - row / this.rows);
			this.texture_coord_buffer.push(point[1]);
		}
	}

}

Terrain.prototype.setUpMaterial = function()
{
	this.loadDiffuseMap("../files/textures/pasto1.jpg");
	this.loadSecondDiffuseMap("../files/textures/rocas2.jpg");
	this.loadThirdDiffuseMap("../files/textures/sand.jpg");

	this.loadNormalMap("../files/textures/terraingrass_normal.jpg");
	this.loadSecondNormalMap("../files/textures/rocas2-normalmap.jpg");
	this.loadThirdNormalMap("../files/textures/sand-normalmap2.jpg");

	this.loadMixerMap("../files/textures/terrain-mixer2.jpg");

	this.ka = 0.75;
	this.kd = 0.65;
	this.ks = 0.1;
	this.shininess = 0.1;

	this.color_specular = vec3.fromValues(0.125, 0.125, 0.125);
	this.reflectiveness = 0.8;
	this.useTexture = 1.0;
	this.useNormalMap = false;

	this.useThreeTextures = true;

	this.terrainHeight = this.terrainElevation;
}