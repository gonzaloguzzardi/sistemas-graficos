/****************************************
Tower

Dependencies:
-Group.js
-TowerBase.js
-TowerTop.js
****************************************/

var Tower = function(step, towerTopScales) 
{
	this.th1 = 2.0;
	this.th2 = 1.5;
	this.th3 = 1.0;

	this.towerHeight = 0.0;


	this.buildStep = 0.1;
	if (step !== undefined)
	{
		this.buildStep = step;
	}

	this.towerTopScales = 0.5;
	if (towerTopScales !== undefined)
	{
		this.towerTopScales = towerTopScales;
	}

	this.firstTowerBase = null;
	this.firstTowerTop = null;

	this.secondTowerBase = null;
	this.secondTowerTop = null;

	this.thirdTowerBase = null;

	Group.call(this);

	this.buildTower();
}

Tower.prototype = Object.create(Group.prototype);
Tower.prototype.constructor = Tower;

Tower.prototype.buildTower = function()
{
	this.buildFirstSegment();
	this.buildSecondSegment();
	this.buildThirdSegment();
}

Tower.prototype.buildFirstSegment = function()
{
	this.firstTowerBase = new TowerBase(this.buildStep);
	this.firstTowerTop = new TowerTop(this.buildStep, this.towerTopScales);

	var topY = this.firstTowerBase.height * this.th1;
	var m_towerTop = mat4.create();
	mat4.translate(m_towerTop, m_towerTop, [0.0, topY, 0.0]);
	mat4.scale(m_towerTop, m_towerTop, [1.0, 1.0, this.towerTopScales]);
	this.firstTowerTop.applyMatrix(m_towerTop);

	var m_towerBase = mat4.create();
	mat4.scale(m_towerBase, m_towerBase, [1.0, this.th1, this.towerTopScales]);
	this.firstTowerBase.applyMatrix(m_towerBase);

	this.addModel(this.firstTowerBase);
	this.addModel(this.firstTowerTop);
}

Tower.prototype.buildSecondSegment = function()
{

	this.secondTowerBase = new TowerBase(this.buildStep);
	this.secondTowerTop = new TowerTop(this.buildStep, this.towerTopScales);

	var towerSegmentHeight = this.firstTowerBase.height * this.th1 + this.firstTowerTop.height;
	var topY = towerSegmentHeight + this.secondTowerBase.height * this.th2;

	var m_towerBase = mat4.create();
	mat4.translate(m_towerBase, m_towerBase, [0.0, towerSegmentHeight, 0.0]);
	mat4.scale(m_towerBase, m_towerBase, [this.towerTopScales, 1.0, this.towerTopScales]);
	mat4.scale(m_towerBase, m_towerBase, [1.0, this.th2, 1.0]);
	this.secondTowerBase.applyMatrix(m_towerBase);

	var m_towerTop = mat4.create();
	mat4.translate(m_towerTop, m_towerTop, [0.0, topY, 0.0]);
	mat4.scale(m_towerTop, m_towerTop, [this.towerTopScales, 1.0, this.towerTopScales]);
	this.secondTowerTop.applyMatrix(m_towerTop);

	this.addModel(this.secondTowerBase);
	this.addModel(this.secondTowerTop);
}

Tower.prototype.buildThirdSegment = function()
{

	this.thirdTowerBase = new TowerBase(this.buildStep);

	var towerSegmentHeight = this.firstTowerBase.height * this.th1 + this.firstTowerTop.height + this.secondTowerBase.height * this.th2 + this.secondTowerTop.height;

	this.towerHeight = towerSegmentHeight + this.thirdTowerBase.height * this.th3;

	var m_towerBase = mat4.create();
	mat4.translate(m_towerBase, m_towerBase, [0.0, towerSegmentHeight, 0.0]);
	mat4.scale(m_towerBase, m_towerBase, [this.towerTopScales, 1.0, 1.0]);
	mat4.scale(m_towerBase, m_towerBase, [this.towerTopScales, 1.0, this.towerTopScales]);
	mat4.scale(m_towerBase, m_towerBase, [1.0, this.th3, 1.0]);
	this.thirdTowerBase.applyMatrix(m_towerBase);

	this.addModel(this.thirdTowerBase);
}

Tower.prototype.setTowerHeights = function(th1, th2, th3)
{
	this.th1 = th1;
	this.th2 = th2;
	this.th3 = th3;
}
