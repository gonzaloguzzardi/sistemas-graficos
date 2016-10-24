/****************************************
Tower Shape

Dependencies:
-Polygon.js
-BezierCurve.js
-BSplineCurve.js
****************************************/

var TowerShape = function(step) 
{
	this.farRight = 5.0;
	this.middleRight = 0.8;

	this.top = 10.0;
	this.bot = 0.0;

	this.rampAmount = 2.0;

	this.farLeft = -this.farRight;
	this.middleLeft = -this.middleRight;


	var shape = new BezierCurve([[this.farRight,0,this.bot],[this.farRight/2.0,0,this.bot],[this.farRight/2.0,0,this.bot],[this.middleRight,0,this.bot], //bot right corner

								[this.middleRight,0, this.bot + this.rampAmount/2.0], [this.middleRight,0, this.bot + this.rampAmount/2.0],[this.middleRight,0,this.bot + this.rampAmount],

								[0,0,this.bot + this.rampAmount], [0,0,this.bot + this.rampAmount], [this.middleLeft,0,this.bot + this.rampAmount],

								[this.middleLeft,0,this.bot + this.rampAmount/2.0], [this.middleLeft,0,this.bot + this.rampAmount/2.0], [this.middleLeft,0,this.bot],

								[this.farLeft/2.0,0,this.bot], [this.farLeft/2.0,0,this.bot], [this.farLeft,0,this.bot],

								[this.farLeft,0,0], [this.farLeft,0,0], [this.farLeft,0,this.top],

								[this.middleLeft/2.0,0,this.top], [this.middleLeft/2.0,0,this.top], [this.middleLeft,0,this.top],

								[this.middleLeft,0,this.top - (this.rampAmount/2.0)], [this.middleLeft,0,this.top - (this.rampAmount/2.0)], [this.middleLeft,0,this.top - this.rampAmount],

								[0,0,this.top - this.rampAmount], [0,0,this.top - this.rampAmount], [this.middleRight,0, this.top - this.rampAmount],

								[this.middleRight,0,this.top - (this.rampAmount/2.0)], [this.middleRight,0,this.top - (this.rampAmount/2.0)], [this.middleRight,0,this.top],

								[this.farRight/2.0,0,this.top], [this.farRight/2.0,0,this.top], [this.farRight,0,this.top],

								[this.farRight,0,this.bot], [this.farRight,0,this.bot], [this.farRight,0,this.bot]

								]);


	Polygon.call(this);

	this.center = [0,0,0];

	this.generateFromCurve(shape, step);

}

TowerShape.prototype = Object.create(Polygon.prototype);
TowerShape.prototype.constructor = TowerShape;
