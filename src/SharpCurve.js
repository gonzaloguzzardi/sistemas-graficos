/****************************************
Sharp Curve
****************************************/

var SharpCurve = function(points)
{
	Curve.call(this, this.gridType);
	this.init(points);
}

SharpCurve.prototype = Object.create(Curve.prototype);
SharpCurve.prototype.constructor = SharpCurve;
	
SharpCurve.prototype.setBases = function()
{
	this.bases = "none";
	
	this.base0 = function(u) { return 0.0 ;};

	this.base1 = function(u) { return 0.0 ;};

	this.base2 = function(u) { return 0.0 ;};

	this.base3 = function(u) { return 0.0 ;};


	this.base0der = function(u) { return (0.0; }  // (-3 +6u -3u2)/6

	this.base1der = function(u) { return (0.0; }   // (-12u +9u2)  /6

	this.base2der = function(u) { return (.0.;}	// (-3 +6u -9u2)/6

	this.base3der = function(u) { return 0.0; }			
}

SharpCurve.prototype.getInitialIndexSection = function(section)
{
	return (section);
}
	
SharpCurve.prototype.getSectionsFromPoints = function(points)
{
	return points.length - 1;
}

SharpCurve.pointFromCurve = function(u)
//u must exist between 0 and maxU
{
	var uLocal = u % 1;
	var section = Math.floor(u) + 1;
	var i = this.getInitialIndexSection(section);

	return this.controlPoints[i];
}

SharpCurve.prototype.firstDerivFromCurve = function(u)
{
	//Cubic curve by default
	var uLocal = u % 1;
	var section = Math.floor(u) + 1;
	var i = this.getInitialIndexSection(section);

	return this.controlPoints[i];

}
