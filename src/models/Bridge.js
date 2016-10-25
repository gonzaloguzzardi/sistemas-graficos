/****************************************
Bridge

Dependencies:
-Group.js
-Tower.js
-BridgeRoad.js
****************************************/

var Bridge = function(towerTopScales) 
{
	this.buildStep = 0.1;

	//Bridge Parameters
	this.bridgeWidth = 20.0; //defines road width. The bridge is slighty wider
	this.bridgeLength = 50.0;
	this.towerAmount = 2;

	//Bridge Scale
	this.bridgeScale = 1.0;

	//Bridge parts Heights
	this.ph1 = 25.0;
	this.ph2 = 25.0;;
	this.ph3 = 75.0;;

	//Tower Heights
	this.th1 = 20.0;
	this.th2 = 45.0;
	this.th3 = 10.0;

	this.towerTopScales = 0.5;

	//Towers Models
	this.leftTower1 = null;
	this.leftTower2 = null;
	this.leftTower3 = null;
	this.leftTower4 = null;

	this.rightTower1 = null;
	this.rightTower2 = null;
	this.rightTower3 = null;
	this.rightTower4 = null;

	//Road
	this.bridgeRoad = null;

	//Main Cables
	this.mainCablesRadius = 5.0;

	this.mainCableLeft01 = null;
	this.mainCableLeft12 = null;
	this.mainCableLeft23 = null;
	this.mainCableLeft34 = null;
	this.mainCableLeft40 = null;

	this.mainCableRight01 = null;
	this.mainCableRight12 = null;
	this.mainCableRight23 = null;
	this.mainCableRight34 = null;
	this.mainCableRight40 = null;

	Group.call(this);

	this.buildBridge();
}

Bridge.prototype = Object.create(Group.prototype);
Bridge.prototype.constructor = Bridge;

Bridge.prototype.setTowerTopScales = function(scale)
{
	this.towerTopScales = scale;
}

Bridge.prototype.setTowerHeights = function(th1, th2, th3)
{
	this.th1 = th1;
	this.th2 = th2;
	this.th3 = th3;
}

Bridge.prototype.setBridgeHeights = function(ph1, ph2, ph3)
{
	this.ph1 = ph1;
	this.ph2 = ph2;
	this.ph3 = ph3;
}
Bridge.prototype.setTowerAmount = function(amount)
{
	this.towerAmount = amount;
}

Bridge.prototype.setBridgeDimensions = function(length, width)
{
	this.bridgeWidth = width;
	this.bridgeLength = length;
}

Bridge.prototype.setMainCableRadius = function(radius)
{
	this.mainCablesRadius = radius;
}

Bridge.prototype.setScale = function(scale)
{
	this.bridgeScale = scale;

	this.bridgeWidth *= scale;
	this.bridgeLength *= scale;
	this.ph1 *= scale;
	this.ph2 *= scale;
	this.ph3 *= scale;
	this.th1 *= scale;
	this.th2 *= scale;
	this.th3 *= scale;
	this.mainCablesRadius *= scale;
}

Bridge.prototype.buildBridge = function()
{
	// build everything
	this.buildBridgeRoad();
	this.buildTowers();
	this.placeTowersAndCables(this.towerAmount);
}

Bridge.prototype.buildBridgeRoad = function()
{
	var roadHeight = this.ph2 - this.ph1;
	this.bridgeRoad = new BridgeRoad(this.bridgeLength, this.bridgeWidth, roadHeight);
	this.addModel(this.bridgeRoad);
}

Bridge.prototype.buildTowers = function()
{
	this.leftTower1 = new Tower(this.buildStep, this.towerTopScales);
	this.leftTower2 = new Tower(this.buildStep, this.towerTopScales);
	this.leftTower3 = new Tower(this.buildStep, this.towerTopScales);
	this.leftTower4 = new Tower(this.buildStep, this.towerTopScales);

	this.rightTower1 = new Tower(this.buildStep, this.towerTopScales);
	this.rightTower2 = new Tower(this.buildStep, this.towerTopScales);
	this.rightTower3 = new Tower(this.buildStep, this.towerTopScales);
	this.rightTower4 = new Tower(this.buildStep, this.towerTopScales);

	this.addModel(this.leftTower1);
	this.addModel(this.leftTower2);
	this.addModel(this.leftTower3);
	this.addModel(this.leftTower4);
	this.addModel(this.rightTower1);
	this.addModel(this.rightTower2);
	this.addModel(this.rightTower3);
	this.addModel(this.rightTower4);
}

Bridge.prototype.placeTowersAndCables = function(towerAmount)
{
	var startPoint;
	var endPoint;
	//this.mainCableLeft01 = new BridgeMainCable(startPoint, endPoint, this.mainCablesRadius);

	//this.addModel(this.rightTower4);
}

