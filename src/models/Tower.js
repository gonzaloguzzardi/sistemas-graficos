/****************************************
Tower

Dependencies:
-Group.js
-TowerBase.js
-TowerTop.js
****************************************/

var Tower = function(step, towerTopScales) 
{
	this.th1 = 20.0;
	this.th2 = 45.0;
	this.th3 = 10.0;
	this.scale = 1.0;

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
	this.firstTowerBase.setColor(getColor("towerBase"));

	this.firstTowerTop = new TowerTop(this.buildStep, this.towerTopScales);
	this.firstTowerTop.setColor(getColor("towerTop"));

	this.addModel(this.firstTowerBase);
	this.addModel(this.firstTowerTop);
}

Tower.prototype.buildSecondSegment = function()
{
	this.secondTowerBase = new TowerBase(this.buildStep);
	this.secondTowerBase.setColor(getColor("towerBase"));

	this.secondTowerTop = new TowerTop(this.buildStep, this.towerTopScales);
	this.secondTowerTop.setColor(getColor("towerTop"));

	this.addModel(this.secondTowerBase);
	this.addModel(this.secondTowerTop);
}

Tower.prototype.buildThirdSegment = function()
{
	this.thirdTowerBase = new TowerBase(this.buildStep);
	this.thirdTowerBase.setColor(getColor("towerBase"));

	this.addModel(this.thirdTowerBase);
}

Tower.prototype.setTowerHeights = function(th1, th2, th3)
{
	this.th1 = th1;
	this.th2 = th2;
	this.th3 = th3;
}

Tower.prototype.setScale = function(scale)
{
	this.scale = scale;
}

Tower.prototype.draw = function(parentMatrix, glProgram, th1, th2, th3)
{
		this.setTowerHeights(th1, th2, th3);

		var m_final = mat4.create();
		if(parentMatrix !== undefined)
		{
			mat4.multiply(m_final, parentMatrix, this.group_matrix);
		}

		if(parentMatrix !== undefined)
		{
			this.drawFirstSegment(m_final, glProgram);
			this.drawSecondSegment(m_final, glProgram);
			this.drawThirdSegment(m_final, glProgram);
		}
		else
		{
			this.drawFirstSegment.draw(this.group_matrix, shaderProgram);
			this.drawSecondSegment.draw(this.group_matrix, shaderProgram);
			this.drawThirdSegment.draw(this.group_matrix, shaderProgram);
		}
}

Tower.prototype.drawFirstSegment = function(parentMatrix, glProgram)
{

	var th1 = this.th1 / this.firstTowerBase.height; 

	var topY = this.firstTowerBase.height * th1 * this.scale;

	var m_towerBase = mat4.create();
	mat4.multiply(m_towerBase, this.firstTowerBase.model_matrix, m_towerBase);
	mat4.multiply(m_towerBase, parentMatrix, m_towerBase);

	mat4.scale(m_towerBase, m_towerBase, [1.0, th1, this.towerTopScales]);
	mat4.scale(m_towerBase, m_towerBase, [this.scale, this.scale, this.scale]);
	this.firstTowerBase.draw(m_towerBase, glProgram);

	var m_towerTop = mat4.create();
	mat4.multiply(m_towerTop, this.firstTowerTop.model_matrix, m_towerTop);
	mat4.multiply(m_towerTop, parentMatrix, m_towerTop);

	mat4.translate(m_towerTop, m_towerTop, [0.0, topY, 0.0]);
	mat4.scale(m_towerTop, m_towerTop, [1.0, 1.0, this.towerTopScales]);
	mat4.scale(m_towerTop, m_towerTop, [this.scale, this.scale, this.scale]);
	this.firstTowerTop.draw(m_towerTop, glProgram);


}

Tower.prototype.drawSecondSegment = function(parentMatrix, glProgram)
{
	var th1 = this.th1 / this.firstTowerBase.height; 
	var th2 = this.th2 / this.secondTowerBase.height; 

	var towerSegmentHeight = this.firstTowerBase.height * th1  * this.scale + this.firstTowerTop.height * this.scale;
	var topY = towerSegmentHeight + this.secondTowerBase.height * th2  * this.scale;

	var m_towerBase = mat4.create();
	mat4.multiply(m_towerBase, this.firstTowerBase.model_matrix, m_towerBase);
	mat4.multiply(m_towerBase, parentMatrix, m_towerBase);

	mat4.translate(m_towerBase, m_towerBase, [0.0, towerSegmentHeight, 0.0]);
	mat4.scale(m_towerBase, m_towerBase, [this.towerTopScales, 1.0, this.towerTopScales]);
	mat4.scale(m_towerBase, m_towerBase, [1.0, th2, 1.0]);
	mat4.scale(m_towerBase, m_towerBase, [this.scale, this.scale, this.scale]);
	this.secondTowerBase.draw(m_towerBase, glProgram);

	var m_towerTop = mat4.create();
	mat4.multiply(m_towerTop, this.firstTowerTop.model_matrix, m_towerTop);
	mat4.multiply(m_towerTop, parentMatrix, m_towerTop);
	mat4.translate(m_towerTop, m_towerTop, [0.0, topY, 0.0]);
	mat4.scale(m_towerTop, m_towerTop, [this.towerTopScales, 1.0, this.towerTopScales]);
	mat4.scale(m_towerTop, m_towerTop, [this.scale, this.scale, this.scale]);
	this.secondTowerTop.draw(m_towerTop, glProgram);
}

Tower.prototype.drawThirdSegment = function(parentMatrix, glProgram)
{
	var th1 = this.th1 / this.firstTowerBase.height; 
	var th2 = this.th2 / this.secondTowerBase.height; 
	var th3 = this.th3 / this.thirdTowerBase.height; 

	var towerSegmentHeight = this.firstTowerBase.height * th1  * this.scale + this.firstTowerTop.height * this.scale + this.secondTowerBase.height * th2  * this.scale + this.secondTowerTop.height  * this.scale;

	this.towerHeight = towerSegmentHeight + this.thirdTowerBase.height * th3  * this.scale;

	var m_towerBase = mat4.create();
	mat4.multiply(m_towerBase, this.firstTowerBase.model_matrix, m_towerBase);
	mat4.multiply(m_towerBase, parentMatrix, m_towerBase);
	mat4.translate(m_towerBase, m_towerBase, [0.0, towerSegmentHeight, 0.0]);
	mat4.scale(m_towerBase, m_towerBase, [this.towerTopScales, 1.0, 1.0]);
	mat4.scale(m_towerBase, m_towerBase, [this.towerTopScales, 1.0, this.towerTopScales]);
	mat4.scale(m_towerBase, m_towerBase, [1.0, th3, 1.0]);
	mat4.scale(m_towerBase, m_towerBase, [this.scale, this.scale, this.scale]);
	this.thirdTowerBase.draw(m_towerBase, glProgram);
}
