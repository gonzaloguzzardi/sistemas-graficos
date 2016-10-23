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

	this.rampAmount = 2.0;

	this.farLeft = -this.farRight;
	this.middleLeft = -this.middleRight;


	var shape = new BezierCurve([[this.farRight,0,0],[this.farRight/2.0,0,0],[this.farRight/2.0,0,0],[this.middleRight,0,0], //bot right corner

								[this.middleRight,0, this.rampAmount/2.0], [this.middleRight,0, this.rampAmount/2.0],[this.middleRight,0,this.rampAmount],

								[0,0,this.rampAmount], [0,0,this.rampAmount], [this.middleLeft,0,this.rampAmount],

								[this.middleLeft,0,this.rampAmount/2.0], [this.middleLeft,0,this.rampAmount/2.0], [this.middleLeft,0,0],

								[this.farLeft/2.0,0,0], [this.farLeft/2.0,0,0], [this.farLeft,0,0],

								[this.farLeft,0,this.top/2.0], [this.farLeft,0,this.top/2.0], [this.farLeft,0,this.top],

								[this.middleLeft/2.0,0,this.top], [this.middleLeft/2.0,0,this.top], [this.middleLeft,0,this.top],

								[this.middleLeft,0,this.top - (this.rampAmount/2.0)], [this.middleLeft,0,this.top - (this.rampAmount/2.0)], [this.middleLeft,0,this.top - this.rampAmount],

								[0,0,this.top - this.rampAmount], [0,0,this.top - this.rampAmount], [this.middleRight,0, this.top - this.rampAmount],

								[this.middleRight,0,this.top - (this.rampAmount/2.0)], [this.middleRight,0,this.top - (this.rampAmount/2.0)], [this.middleRight,0,this.top],

								[this.farRight/2.0,0,this.top], [this.farRight/2.0,0,this.top], [this.farRight,0,this.top],

								[this.farRight,0,0], [this.farRight,0,0], [this.farRight,0,0]

								]);


	Polygon.call(this);

	this.generateFromCurve(shape, step);

}

TowerShape.prototype = Object.create(Polygon.prototype);
TowerShape.prototype.constructor = TowerShape;
