/****************************************
Bridge Scene
****************************************/

var BridgeScene = function() 
{
	// Terrain Parameters
	this.terrainElevation = 15.0;
	this.waterLevel = -25.0;

	this.terrainWidth = 1000.0;
	this.terrainHeight = 1000.0;
	this.coastWidth = 100.0;
	this.distanceBetweenTerrainPoints = 20.0;
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
	this.river = null;
	this.trees = [];


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
	this.bridgeLength = this.riverWidth + this.coastWidth;
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

	this.generateRiver();
	this.generateTerrain();
	this.deformTerrain();
	this.generateBridge();
	this.generateTrees();
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
	this.river = new River(this.riverWidth, this.riverCurve, this.buildStep);
}


BridgeScene.prototype.generateTerrain = function()
{
	
	var width = this.terrainWidth / this.distanceBetweenTerrainPoints;
	var height = this.terrainHeight / this.distanceBetweenTerrainPoints;

	this.terrain = new Plane (width, height, this.distanceBetweenTerrainPoints);

	this.terrain.draw_mode = gl.LINE_STRIP;
}


BridgeScene.prototype.generateBridge = function()
{
	   	this.bridge = new Bridge(this.towerAmount);
	    this.bridge.setBridgeHeights( this.terrainElevation, this.ph2, this.ph3);
        this.bridge.setBridgeDimensions(this.bridgeLength, this.roadWidth, this.riverWidth);
        this.bridge.setStrapDistances(this.s1);
        this.bridge.buildBridge();

	    // TODO Place Bridge on scene
	    var minTangentZ = 1.0;
	    var convenientPoint = [0, 0, 0];
	    for (var i = 1; i < this.riverCurve.maxU - 1; i += 0.1)
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
		}
		this.bridgePos = convenientPoint;
		console.log("Convenient point = " + this.bridgePos);
}

BridgeScene.prototype.deformTerrain = function()
{
	//console.log(this.riverCurve);
	var pointsInRows = this.terrainWidth / this.distanceBetweenTerrainPoints;
	var pointsInCol = this.terrainHeight / this.distanceBetweenTerrainPoints;
	var totalPoints = pointsInRows * pointsInCol;

	for (var i = 0; i < totalPoints/2; i += 1)
	{
		var j = i * 3;
		
	}

	var lastRow = -1;
	for (var i = 0; i < this.riverCurve.maxU; i += 0.01)
	{
		var point = this.riverCurve.pointFromCurve(i);
		//row = (width/2 - x) / dist
		var row = Math.floor(((this.terrainWidth * 0.5) - point[0]) / this.distanceBetweenTerrainPoints);
		if (row == lastRow)
		{
			continue;
		}

		var col = Math.floor(((this.terrainHeight * 0.5) - point[2]) / this.distanceBetweenTerrainPoints);
		
		//Levels of height
		var minColRiver = Math.floor(((this.terrainHeight * 0.5) - point[2] - this.riverWidth) / this.distanceBetweenTerrainPoints);
		var maxColRiver = Math.floor(((this.terrainHeight * 0.5) - point[2] - this.riverWidth) / this.distanceBetweenTerrainPoints);

		var bufferPoint = (row * pointsInRows + col) * 3;
		this.terrain.position_buffer[bufferPoint + 1] += this.waterLevel;


		lastRow = row;
	}


	/*for (var dt = 0; dt <= this.terrainWidth; dt += this.distanceBetweenTerrainPoints)
	{
		var u = 500 - dt;
		var point = this.riverCurve.pointFromCurve(u);
		var row = u / this.distanceBetweenTerrainPoints;
		var center = point[2];
		var minCol = (point[2] - this.riverWidth);
		var maxCol = point[2] + this.riverWidth;

		for (var i = minCol; i <= maxCol; i += this.distanceBetweenTerrainPoints)
		{
			var j = i * 3;
			this.terrain.position_buffer[j + 1] -= this.terrainElevation * 4;
		}
	}*/

	/*for (var i = 0; i < this.riverCurve.maxU; i += 0.01)
	{
		console.log(i + " / " + this.riverCurve.maxU + " " + this.riverCurve.pointFromCurve(i));
	}*/

	this.terrain.setupWebGLBuffers();
}


BridgeScene.prototype.generateTrees = function()
{

}

BridgeScene.prototype.draw = function(matrix, glProgram)
{
	this.terrain.draw(matrix, glProgram);

	var m_bridge = mat4.create();
	mat4.multiply(m_bridge, matrix, m_bridge);
	mat4.translate(m_bridge, m_bridge, [-this.bridgePos[2], -this.bridgePos[1], -this.bridgePos[0]]);
	this.bridge.draw(m_bridge, glProgram);

	var m_river = mat4.create();
	//mat4.rotate(m_river, m_river,  Math.PI/2, [0, 1, 0]);
	this.river.draw(m_river, glProgram);
}


