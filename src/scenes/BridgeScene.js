/****************************************
Bridge Scene
****************************************/

var BridgeScene = function() 
{
	//sun
	this.sunLight = null;
	this.sunLightDirection = [3.5, 3.0,2.25 ];
	this.sunLightAmbient = [1.0, 1.0, 1.0];
	this.sunLightIntensity = [1.0, 1.0, 1.0];

	// Terrain Parameters
	this.terrainElevation = 15.0;
	this.waterSubmergence= 25.0;

	this.terrainWidth = 1000.0;
	this.terrainHeight = 1000.0;
	this.coastWidth = 100.0;
	this.distanceBetweenTerrainPoints = 5.0;
	this.riverWidth = 125.0;

	// Bridge Parameters
	this.towerAmount = 4;
	this.bridgeLength = 250.0;
	this.roadWidth = 40.0;
	this.ph2 = 18.0;
	this.ph3 = 75.0;
	this.s1 = 10.0;

	//Scales
	this.bridgeAndRoadsScale = 1.0;

	//Models
	this.bridge = null;
	this.leftRoad = null;
	this.rightRoad = null;

	//Terrain models
	this.terrain = null;
	this.terrain2 = null; // Agregado en el cambio de implementación. La implementación anterior, deformando el terreno, se complicaba para calcular las normales.
	this.river = null;
	this.trees = [];

	this.skyDome = null;


	// Variables
	this.treeAmount = 10;
	this.riverCurve = null;
	this.bridgePos = [0, 0, 0];

	this.buildStep = 0.1;

}

BridgeScene.prototype.constructor = BridgeScene;

BridgeScene.prototype.setTerrainParameters = function(terrainElevation, coastWidth, terrainWidth, terrainHeight)
{
	this.terrainElevation = terrainElevation;
	this.coastWidth = coastWidth;
	this.terrainWidth = terrainWidth;
	this.terrainHeight = terrainHeight;
}

BridgeScene.prototype.setBridgeParameters = function(towerAmount, length, ph2, ph3, s1)
{
	this.towerAmount = towerAmount;
	this.bridgeLength = length;
	this.ph2 = ph2;
	this.ph3 = ph3;
	this.s1 = s1;

	//maybe
	this.bridgeLength = this.riverWidth + this.coastWidth * 2;
}

BridgeScene.prototype.setAmountOfTrees = function(amount)
{
	this.treeAmount = amount;
}

BridgeScene.prototype.setRoadParameters = function(roadWidth)
{
	this.roadWidth = roadWidth;
}

BridgeScene.prototype.setRiverWidth = function(riverWidth)
{
	this.riverWidth = riverWidth;
}

BridgeScene.prototype.create = function()
{
	if (this.isRiverInitialized == false)
	{
		if (this.riverCurve == null)
		{
			window.alert("Could not find a river curve!");
			this.generateDefaultRiverCurve();
		}
	}
	this.generateSkybox();
	this.generateSun();
	this.generateRiver();
	this.generateTerrain();
	//this.deformTerrain();
	this.generateBridge();
	this.generateRoads();
	this.generateTrees();
}

BridgeScene.prototype.generateSkybox = function()
{
	this.skyDome = new SkyDome();
}


BridgeScene.prototype.generateSun = function()
{
	this.sunLight = new DirectionalLight();
	this.sunLight.setParameters(this.sunLightDirection, this.sunLightAmbient, this.sunLightIntensity);
}

BridgeScene.prototype.setSunAmbientLight = function(sunLightAmbient)
{
	if (sunLightAmbient === undefined) return;
	this.sunLightAmbient = sunLightAmbient;
}
BridgeScene.prototype.setSunLightIntensity = function(sunLightIntensity)
{
	if (sunLightIntensity === undefined) return;
	this.sunLightIntensity = sunLightIntensity;
}

BridgeScene.prototype.generateDefaultRiverCurve = function()
{
	var startPoint = [0.0, 0.0, -this.terrainHeight * 0.5];
	var endPoint = [0.0, 0.0, this.terrainHeight * 0.5];
	this.riverCurve = new BSplineCurve(startPoint, startPoint, startPoint, endPoint, endPoint, endPoint);
}


BridgeScene.prototype.setRiverCurvePoints = function(points, canvas2DWidth, canvas2DHeight)
{
	if ((points === undefined) || (points.length < 4))
	{
		return;
	}
	var transformPoints = this.pointsToTerrain(points, canvas2DWidth, canvas2DHeight);

	this.riverCurve = new BSplineCurve(transformPoints);

}

BridgeScene.prototype.pointsToTerrain = function(points, canvas2DWidth, canvas2DHeight)
{
	//2d canvas has the (0,0) point in the top left corner and z = 0
	//I need x pos to be z and y to be x
	//2D X --> 3D Z
	//2D Y --> 3D X
	//Y = 0
	var widthRatio = this.terrainWidth / canvas2DWidth;
	var heightRatio = this.terrainHeight / canvas2DHeight;
	var transformPoints = [];
	for (var i = 0; i < points.length; i++)
	{
		var point = [];
		var y = 0.0;
		var z = (points[i][0] - (canvas2DWidth * 0.5)) * widthRatio;
		var x = (points[i][1] - (canvas2DHeight * 0.5)) * heightRatio;
		point.push(x);
		point.push(y);
		point.push(z);
		transformPoints.push(point);
	}
	return transformPoints;
}



BridgeScene.prototype.generateRiver = function()
{
	var detail = 50.0
	var width = this.terrainWidth / detail;
	var height = this.terrainHeight / detail;
	//this.river = new River(this.riverWidth , this.riverCurve, this.buildStep);
	this.river = new Plane (width, height, detail);
	this.river.setColor(getColor("river"));
}


BridgeScene.prototype.generateTerrain = function()
{
	
	var width = this.terrainWidth / this.distanceBetweenTerrainPoints;
	var height = this.terrainHeight / this.distanceBetweenTerrainPoints;

	//this.terrain = new Plane (width, height, this.distanceBetweenTerrainPoints);
	this.terrain = new Terrain(this.riverCurve, this.coastWidth, this.terrainWidth, this.terrainElevation, false, 0.1);

	this.terrain2 = new Terrain(this.riverCurve, this.coastWidth, this.terrainWidth, this.terrainElevation, true, 0.1);
	//this.terrain.draw_mode = gl.LINE_STRIP;
}


BridgeScene.prototype.generateBridge = function()
{
	   	this.bridge = new Bridge(this.towerAmount);
	    this.bridge.setBridgeHeights( this.terrainElevation, this.ph2, this.ph3);
        this.bridge.setBridgeDimensions(this.bridgeLength, this.roadWidth, this.riverWidth);
        this.bridge.setStrapDistances(this.s1);
        this.bridge.buildBridge();

	    // TODO Place Bridge on scene
	    /*var minTangentZ = 1.0;
	    var convenientPoint = [0, 0, 0];
	    for (var i = 1; i < this.riverCurve.maxU - 1; i += 0.01)
		{
			var point = this.riverCurve.pointFromCurve(i);
			if (( point[0] < (-this.terrainWidth * 0.5 * 0.5)) || (point[0] > (this.terrainWidth * 0.5 * 0.5)))
			{
				//No acepta puntos cercanos a los bordes
				continue;
			}

			var tangent = this.riverCurve.firstDerivFromCurve(i);
			if (tangent[2] <= minTangentZ)
			{
				convenientPoint = this.riverCurve.pointFromCurve(i);
			}
		}*/
		this.bridgePos = this.riverCurve.pointFromCurve(this.riverCurve.maxU/2.0);
		//console.log("Convenient point = " + this.bridgePos);
}

BridgeScene.prototype.deformTerrain = function()
{
	//console.log(this.riverCurve);
	var pointsInRows = this.terrainWidth / this.distanceBetweenTerrainPoints;

	var lastRow = -1;
	for (var i = 0; i < this.riverCurve.maxU; i += 0.001)
	{
		var point = this.riverCurve.pointFromCurve(i);
		//row = (width/2 - x) / dist
		var row = Math.floor(((this.terrainWidth * 0.5) - point[0]) / this.distanceBetweenTerrainPoints);
		if (row == lastRow)
		{
			continue;
		}
		//console.log(row);

		var col = Math.floor(((this.terrainHeight * 0.5) - point[2]) / this.distanceBetweenTerrainPoints);
		
		//Terrain Heights

		//Deformation for water
		var minColRiver = Math.floor(((this.terrainHeight * 0.5) - point[2] - (this.riverWidth/2)) / this.distanceBetweenTerrainPoints);
		var maxColRiver = Math.floor(((this.terrainHeight * 0.5) - point[2] + (this.riverWidth/2)) / this.distanceBetweenTerrainPoints);

		for (var j = minColRiver; j < maxColRiver; j++)
		{
			var bufferPoint = (row * pointsInRows + j) * 3;
			this.terrain.position_buffer[bufferPoint + 1] -= (this.waterSubmergence + this.terrainElevation);
		}
		//Deformation for coast
		var minColCoast = Math.floor(((this.terrainHeight * 0.5) - point[2] - (this.riverWidth/2) - this.coastWidth) / this.distanceBetweenTerrainPoints);
		var maxColCoast = Math.floor(((this.terrainHeight * 0.5) - point[2] + (this.riverWidth/2) + this.coastWidth) / this.distanceBetweenTerrainPoints);

		if (minColCoast > minColRiver) minColCoast = minColRiver;
		if (maxColCoast < maxColRiver) maxColCoast = maxColRiver;

		for (var j = minColCoast; j < minColRiver; j++)
		{
			var bufferPoint = (row * pointsInRows + j) * 3;
			this.terrain.position_buffer[bufferPoint + 1] -= this.terrainElevation;
		}
		//this.terrain.position_buffer[(row * pointsInRows + minColRiver) + 1] -= this.terrainElevation * 0.5;
		for (var j = maxColRiver; j < maxColCoast; j++)
		{
			var bufferPoint = (row * pointsInRows + j) * 3;
			this.terrain.position_buffer[bufferPoint + 1] -= this.terrainElevation;
		}
		//this.terrain.position_buffer[(row * pointsInRows + maxColRiver) + 1] -= this.terrainElevation * 0.5;

		lastRow = row;
	}

	this.terrain.setupWebGLBuffers();
}

BridgeScene.prototype.smoothTerrain = function()
{
	for (var i = 0; i < this.terrain.position_buffer.length; i += 3)
	{
		var ada = Math.max(Math.abs(Math.acos(this.terrain.normals_buffer[i].n(j))));
	}
}



BridgeScene.prototype.generateRoads = function()
{
	//this.leftRoad = new Road(this.terrainHeight * 0.5 + this.bridgePos[2] - this.bridgeLength * 0.5, this.roadWidth, this.buildStep);
	//this.rightRoad = new Road(this.terrainHeight * 0.5 - this.bridgePos[2] - this.bridgeLength * 0.5, this.roadWidth, this.buildStep);
	this.leftRoad = new Road(this.terrainHeight * 0.5 + this.bridgePos[2] - this.bridgeLength * 0.5, this.roadWidth + 5, this.buildStep);
	this.rightRoad = new Road(this.terrainHeight * 0.5 - this.bridgePos[2] - this.bridgeLength * 0.5, this.roadWidth + 5, this.buildStep);
}


BridgeScene.prototype.generateTrees = function()
{
	this.trees = [];
	for (var i = 0; i < this.treeAmount; i++)
	{
		var rng = new CustomRandom(21);
		var tree = new Tree(rng.next(1, 3));
		var randomY = rng.next(5, 25)/10.0;
		var randomXZ = rng.next(5,25)/10.0;
		var randomScale = [randomXZ, randomY, randomXZ];
		tree.setScale(randomScale);

		//cambiar
		var randomX = rng.next(-this.terrainWidth*0.5, this.terrainWidth*0.5);
		var randomZ = rng.next(-this.terrainHeight*0.5, this.terrainHeight*0.5);
		tree.setPosition([randomX, this.terrainElevation, randomZ]);
		this.trees.push(tree);
	}
}

BridgeScene.prototype.drawSunLight = function(glProgram)
{        
	var lighting;
	lighting = true;
	gl.uniform1i(glProgram.uUseLighting, lighting);       
	var lightPosition = vec3.fromValues(-100.0, -75.0, -10.0); 
	gl.uniform3fv(glProgram.uLightPosition, lightPosition);   
	this.sunLight.setParameters(this.sunLightDirection, this.sunLightAmbient, this.sunLightIntensity);  
	this.sunLight.render(glProgram);
}


BridgeScene.prototype.draw = function(matrix, glProgram)
{

	this.drawSunLight(glProgram);

	var m_skyDome = mat4.create();
	mat4.multiply(m_skyDome, m_skyDome, matrix);
	var domeScale = 3000.0;
	mat4.scale(m_skyDome, m_skyDome, [domeScale, domeScale, domeScale]);
	this.skyDome.draw(m_skyDome, glProgram);

	var m_terrain = mat4.create();
	mat4.multiply(m_terrain, m_terrain, matrix);
	mat4.translate(m_terrain, m_terrain, [-this.coastWidth * 1.75 * 1.333333333, this.terrainElevation*0.45, 0.0]);
	mat4.rotate(m_terrain, m_terrain, -Math.PI/2, [0.0, 1.0, 0.0]);
	this.terrain.draw(m_terrain, glProgram);

	var m_terrain2 = mat4.create();
	mat4.multiply(m_terrain2, m_terrain2, matrix);
	mat4.translate(m_terrain2, m_terrain2, [this.coastWidth * 1.75 * 1.3333333, this.terrainElevation*0.45, 0.0]);
	mat4.rotate(m_terrain2, m_terrain2, Math.PI/2, [0.0, 1.0, 0.0]);
	this.terrain.draw(m_terrain2, glProgram);

	var m_bridge = mat4.create();
	mat4.multiply(m_bridge, matrix, m_bridge);
	mat4.translate(m_bridge, m_bridge, [-this.bridgePos[2], -this.bridgePos[1], -this.bridgePos[0]]);
	this.bridge.draw(m_bridge, glProgram);

	var m_leftRoad = mat4.create();
	mat4.multiply(m_leftRoad, matrix, m_leftRoad);
	mat4.translate(m_leftRoad, m_leftRoad, [-this.bridgePos[2] - this.rightRoad.length*0.5 - this.bridgeLength*0.5, -this.bridgePos[1], -this.bridgePos[0]]);
	mat4.translate(m_leftRoad, m_leftRoad, [0.0, this.terrainElevation + 2.5, 0.0]);
	this.rightRoad.draw(m_leftRoad, glProgram);

	var m_rightRoad = mat4.create();
	mat4.multiply(m_rightRoad, matrix, m_rightRoad);
	mat4.translate(m_rightRoad, m_rightRoad, [-this.bridgePos[2] + this.leftRoad.length*0.5 + this.bridgeLength*0.5, -this.bridgePos[1], -this.bridgePos[0]]);
	mat4.translate(m_rightRoad, m_rightRoad, [0.0, this.terrainElevation + 2.5, 0.0]);
	this.leftRoad.draw(m_rightRoad, glProgram);

	var m_river = mat4.create();
	mat4.multiply(m_river, m_river, matrix);
	mat4.translate(m_river, m_river, [0.0, 1.0, 0.0]); // estetico nomas
	mat4.rotate(m_river, m_river, -Math.PI/2, [0.0, 1.0, 0.0]);
	this.river.draw(m_river, glProgram);

	for (var i = 0; i < this.trees.length; i++)
	{
		//var m_tree = mat4.create();
		this.trees[i].draw(matrix, glProgram);
	}
}





