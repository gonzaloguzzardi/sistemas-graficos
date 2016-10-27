/****************************************
Bridge Scene
****************************************/

var BridgeScene = function() 
{
	// Terrain Parameters
	this.terrainElevation = 15.0;

	this.terrainWidth = 500.0;
	this.terrainHeight = 500.0;
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

	this.terrain = null;
	this.trees = [];
	this.river = null;

	// Variables
	this.isRiverInitialized = false;
	this.treeAmount = 10;
	this.riverCurve = null;


	this.create();
}

BridgeScene.prototype.constructor = BridgeScene;

BridgeScene.prototype.setTerrainParameters = function(terrainHeight)
{
	this.terrainHeight = terrainHeight;
}

BridgeScene.prototype.setBridgeParameters = function(towerAmount, length, ph2, ph3, s1)
{
	this.towerAmount = towerAmount;
	this.bridgeLength = length;
	this.ph2 = ph2;
	this.ph3 = ph3;
	this.s1 = s1;
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
			//window.alert("Could not find a river curve!");
			this.generateDefaultRiverCurve();
		}
	}

	this.generateRiver();
	this.generateTerrain();
	this.generateBridge();
	this.generateTrees();
}

BridgeScene.prototype.generateDefaultRiverCurve = function()
{
	var startPoint = [0.0, 0.0, -this.terrainHeight * 0.5];
	var endPoint = [0.0, 0.0, this.terrainHeight * 0.5];
	this.riverCurve = new BSplineCurve(startPoint, startPoint, startPoint, endPoint, endPoint, endPoint);
}


BridgeScene.prototype.generateRiverCurve = function(points)
{
	if (points === undefined)
	{
		return;
	}
	// TODO: generate curve
	this.isRiverInitialized = true;
}

BridgeScene.prototype.generateRiver = function()
{

}

BridgeScene.prototype.generateTerrain = function()
{
	
	var width = this.terrainWidth / this.distanceBetweenTerrainPoints;
	var height = this.terrainHeight / this.distanceBetweenTerrainPoints;
	this.terrain = new Plane(width, height, this.distanceBetweenTerrainPoints);

	this.terrain.draw_mode = gl.LINE_STRIP;
	//this.terrain.setColor(getColor("green"));
}


BridgeScene.prototype.generateBridge = function()
{
	   	this.bridge = new Bridge(this.towerAmount);
	    this.bridge.setBridgeHeights( this.terrainElevation, this.ph2, this.ph3);
        this.bridge.setBridgeDimensions(this.bridgeLength, this.roadWidth, this.riverWidth);
        this.bridge.setStrapDistances(this.s1);
        this.bridge.buildBridge();

	    // TODO Place Bridge on scene
}

BridgeScene.prototype.generateTrees = function()
{

}

BridgeScene.prototype.draw = function(matrix, glProgram)
{
	this.terrain.draw(matrix, glProgram);
	this.bridge.draw(matrix, glProgram);
}


