/****************************************
Bridge

Dependencies:
-Group.js
-Tower.js
-BridgeMainCable.js
-BridgeStrap.js
-BridgeRoad.js
****************************************/

var Bridge = function(towerAmount) 
{
	this.initialized = false;

	this.buildStep = 0.1;

	//Bridge Parameters
	this.riverWidth = 75.0;
	this.bridgeWidth = 20.0; //defines road width. The bridge is slighty wider
	this.bridgeLength = 100.0;
	this.towerAmount = 2;

	//Bridge Scale
	this.bridgeScale = 1.0;

	//Bridge parts Heights
	this.ph1 = 25.0;
	this.ph2 = 25.0;
	this.ph3 = 75.0;

	//Strap Distance
	this.s1 = 5.0;

	//Tower Heights
	this.th1 = 20.0;
	this.th2 = 45.0;
	this.th3 = 10.0;

	this.towerTopScales = 0.7;

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

	this.towerOneTwoPositionModifier = 0.9;
	this.towerThreeFourPositionModifier = 0.25;

	if (towerAmount !== undefined)
	{
		this.towerAmount = towerAmount;
	}

	Group.call(this);

}

Bridge.prototype = Object.create(Group.prototype);
Bridge.prototype.constructor = Bridge;

Bridge.prototype.setTowerTopScales = function(scale)
{
	this.towerTopScales = scale;
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

Bridge.prototype.setBridgeDimensions = function(length, width, riverWidth)
{
	this.bridgeWidth = width;
	this.bridgeLength = length;
	this.riverWidth = riverWidth;
}

Bridge.prototype.setMainCableRadius = function(radius)
{
	this.mainCablesRadius = radius;
}

Bridge.prototype.setScale = function(scale)
{
	this.bridgeScale = scale;

	/*this.bridgeWidth *= scale;
	this.bridgeLength *= scale;
	this.ph1 *= scale;
	this.ph2 *= scale;
	this.ph3 *= scale;
	this.th1 *= scale;
	this.th2 *= scale;
	this.th3 *= scale;
	this.mainCablesRadius *= scale;*/
}

Bridge.prototype.buildBridge = function()
{
	// build everything
	this.buildBridgeRoad();
	this.buildTowers();
	this.placeTowersAndCables(this.towerAmount);

	this.initialized = true;
}

Bridge.prototype.buildBridgeRoad = function()
{
	var roadHeight = this.ph2;
	this.bridgeRoad = new BridgeRoad(this.bridgeLength, this.bridgeWidth, roadHeight);
	this.addModel(this.bridgeRoad);

	for (var i = 0; i < this.bridgeRoad.roadPath.sections; i++)
	{
		console.log("u = " + i + " , height = " + this.bridgeRoad.roadPath.pointFromCurve(i)[1]);
	}
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

Bridge.prototype.placeBridgeRoad = function()
{
	//Placing Road dynamically in draw function for making it customizable in runtime
	/*
	var m_bridgeRoad = mat.create();
	mat4.translate(m_bridgeRoad, m_bridgeRoad, [0, this.ph1, 0]);
	this.bridgeRoad.applyMatrix(m_bridgeRoad);
	*/
}

Bridge.prototype.placeTowersAndCables = function(towerAmount)
{
	var halfBridgeWidth = this.bridgeWidth * 0.5;
	var halfRiverWidth = this.riverWidth * 0.5;

	var posModifier = this.towerOneTwoPositionModifier;
	var posTowerLeft1 = [-halfRiverWidth * posModifier, 0, halfBridgeWidth];
	var posTowerRight1 = [-halfRiverWidth * posModifier, 0, -halfBridgeWidth];

	var posTowerLeft2 = [halfRiverWidth * posModifier, 0, halfBridgeWidth];
	var posTowerRight2 = [halfRiverWidth * posModifier, 0, -halfBridgeWidth];

	//Tower 3 and 4 depends on the amount of towers to be placed
	var posTowerLeft3 = [0, 0, 0];
	var posTowerLeft4 = [0, 0, 0];
	var posTowerRight3 = [0, 0, 0];
	var posTowerRight4 = [0, 0, 0];

	if (towerAmount == 3)
	{
		posTowerLeft3 = [0, 0, halfBridgeWidth];
		posTowerRight3 = [0, 0, -halfBridgeWidth];
	}
	if(towerAmount == 4)
	{
		var posThreeFourModifier = this.towerThreeFourPositionModifier;
		posTowerLeft3 = [-halfRiverWidth * posThreeFourModifier, 0, halfBridgeWidth];
		posTowerRight3 = [-halfRiverWidth * posThreeFourModifier, 0, -halfBridgeWidth];

		posTowerLeft4 = [halfRiverWidth * posThreeFourModifier, 0, halfBridgeWidth];
		posTowerRight4 = [halfRiverWidth * posThreeFourModifier, 0, -halfBridgeWidth];
	}

	///////////////////////// TOWERS  ////////////////////////////////////
	var ml1, ml2, ml3, ml4, mr1, mr2, mr3, mr4;
	//left tower 1
	ml1 = mat4.create();
	mat4.translate(ml1, ml1, posTowerLeft1);
	this.leftTower1.applyMatrix(ml1);

	//right tower 1
	mr1 = mat4.create();
	mat4.translate(mr1, mr1, posTowerRight1);
	this.rightTower1.applyMatrix(mr1);

	//left tower 2
	ml2 = mat4.create();
	mat4.translate(ml2, ml2, posTowerLeft2);
	this.leftTower2.applyMatrix(ml2);

	//right tower 2
	mr2 = mat4.create();
	mat4.translate(mr2, mr2, posTowerRight2);
	this.rightTower2.applyMatrix(mr2);

	//left tower 3
	ml3 = mat4.create();
	mat4.translate(ml3, ml3, posTowerLeft3);
	this.leftTower3.applyMatrix(ml3);

	//right tower 3
	mr3 = mat4.create();
	mat4.translate(mr3, mr3, posTowerRight3);
	this.rightTower3.applyMatrix(mr3);

	//left tower 4
	ml4 = mat4.create();
	mat4.translate(ml4, ml4, posTowerLeft4);
	this.leftTower4.applyMatrix(ml4);

	//right tower 4
	mr4 = mat4.create();
	mat4.translate(mr4, mr4, posTowerRight4);
	this.rightTower4.applyMatrix(mr4);

	/////////////////////////// CABLES ////////////////////////////////////////////

	//this.mainCableLeft01 = new BridgeMainCable(startPoint, endPoint, this.mainCablesRadius);

	//this.addModel(this.rightTower4);
}


Bridge.prototype.getFirstSegmentTowerHeight = function(towerNumber)
{
	var halfRiverWith = this.riverWidth * 0.5;
	var coastToBridgeDistance = (this.bridgeLength - this.riverWidth) * 0.5;

	var roadCurve = this.bridgeRoad.roadPath;
	var curveSegments = this.bridgeRoad.roadPath.sections - 8.0; //discard union segments

	var startingU = 3.0 + (coastToBridgeDistance / this.bridgeLength) * curveSegments;

	var curveU;
	var curveHeight;

	//Tower 1 and Tower 2
	if ((towerNumber == 1) || (towerNumber == 2))
	{
		curveU = startingU + (( 1 - this.towerOneTwoPositionModifier) * halfRiverWith / this.riverWidth) * curveSegments;
		curvePoint = roadCurve.pointFromCurve(curveU);
		curveHeight = curvePoint[1] + this.ph1;
	}

	// Tower 3
	if (towerNumber == 3)
	{
		if (this.towerAmount == 3)
		{
			curveU = startingU + 0.5 * curveSegments;
			curvePoint = roadCurve.pointFromCurve(curveU);
			curveHeight = curvePoint[1] + this.ph1;
		}
		if (this.towerAmount == 4)
		{
			curveU = startingU + (( 1 - this.towerThreeFourPositionModifier) * halfRiverWith / this.riverWidth) * curveSegments;
			curvePoint = roadCurve.pointFromCurve(curveU);
			curveHeight = curvePoint[1] + this.ph1;
		}
	}
	// Tower 4
	if (towerNumber == 4)
	{
		curveU = startingU + (( 1 - this.towerThreeFourPositionModifier) * halfRiverWith / this.riverWidth) * curveSegments;
		curvePoint = roadCurve.pointFromCurve(curveU);
		curveHeight = curvePoint[1] + this.ph1;
	}
	return curveHeight;
}

// Returns tower height substracting the first segment
Bridge.prototype.getLeftoverTowerHeight = function(th1)
{
	var leftover = this.ph3 - th1;
	return leftover;
}


Bridge.prototype.draw = function(parentMatrix, glProgram)
{ 
	if (this.initialized == false)
	{
		throw new Error("Bridge was not built. Remember to call buildBridge().");
	}

	var m_bridge = mat4.create();
	if (parentMatrix !== undefined)
	{
		mat4.multiply(m_bridge, parentMatrix, this.group_matrix);
	}
	else
	{
		mat4.multiply(m_bridge, m_bridge, this.group_matrix);
	}
	mat4.scale(m_bridge, m_bridge, [this.bridgeScale, this.bridgeScale, this.bridgeScale]);

	// Draw Bridge Road
	var m_bridgeRoad = mat4.create();
	mat4.multiply(m_bridgeRoad, m_bridgeRoad, m_bridge);
	mat4.translate(m_bridgeRoad, m_bridgeRoad, [0, this.ph1, 0]);
	this.bridgeRoad.draw(m_bridgeRoad, glProgram)


	var th1 = this.getFirstSegmentTowerHeight(1);
	var th2 = this.getLeftoverTowerHeight(th1) * 0.5;
	var th3 = th2;
	// Draw Towers
	this.leftTower1.draw(m_bridge, glProgram, th1 , th2, th3);
	this.leftTower2.draw(m_bridge, glProgram, th1, th2, th3);
	this.rightTower1.draw(m_bridge, glProgram, th1, th2, th3);
	this.rightTower2.draw(m_bridge, glProgram, th1, th2, th3);

	th1 = this.getFirstSegmentTowerHeight(3);
	th2 = this.getLeftoverTowerHeight(th1) * 0.5;
	th3 = th2;
	if (this.towerAmount >= 3)
	{
		this.rightTower3.draw(m_bridge, glProgram, th1, th2, th3);
		this.leftTower3.draw(m_bridge, glProgram, th1, th2, th3);
	}

	th1 = this.getFirstSegmentTowerHeight(4);
	th2 = this.getLeftoverTowerHeight(th1) * 0.5;
	th3 = th2;
	if (this.towerAmount >= 4)
	{
		this.rightTower4.draw(m_bridge, glProgram, th1, th2, th3);
		this.leftTower4.draw(m_bridge, glProgram, th1, th2, th3);
	}

}

