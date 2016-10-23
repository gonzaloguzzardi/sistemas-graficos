/****************************************
Bezier Curve
****************************************/

var BezierCurve = function(points) 
{
	Curve.call(this, this.gridType);
	this.init(points);
}

BezierCurve.prototype = Object.create(Curve.prototype);
BezierCurve.prototype.constructor = BezierCurve;
	
BezierCurve.prototype.setBases = function()
{
	this.bases = "bezier3";

	// Berstein Sases
	this.base0 = function(u) { return (1 - u) * (1 - u) * (1 - u);}

	this.base1 = function(u) { return 3 * (1 - u) * (1 - u) * u; }

	this.base2 = function(u) { return 3 * (1 - u) * u * u;}

	this.base3 = function(u) { return u * u * u; }

	// derived bases

	this.base0der = function(u) { return -3 * u * u + 6 * u - 3;} //-3u2 +6u -3

	this.base1der = function(u) { return 9 * u * u - 12 * u + 3; }  // 9u2 -12u +3

	this.base2der = function(u) { return -9 * u * u + 6 * u;}		 // -9u2 +6u

	this.base3der = function(u) { return 3 * u * u; }			// 3u2
}

BezierCurve.prototype.getInitialIndexSection = function(section)
{
	return (section - 1) * 3;
}

BezierCurve.prototype.getSectionsFromPoints = function(points)
{
	return (points.length - 1) / 3;
}