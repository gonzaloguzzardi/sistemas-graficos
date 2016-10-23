/****************************************
Cubic BSpline Curve
****************************************/

var BSplineCurve = function(points)
{
	Curve.call(this, this.gridType);
	this.init(points);
}

BSplineCurve.prototype = Object.create(Curve.prototype);
BSplineCurve.prototype.constructor = BSplineCurve;
	
BSplineCurve.prototype.setBases = function()
{
	this.bases = "bspline3";
	
	this.base0 = function(u) { return (1 - 3 * u + 3 * u * u - u * u * u ) * 1 / 6; }  // (1 -3u +3u2 -u3)/6

	this.base1 = function(u) { return ( 4 - 6 * u * u + 3 * u * u * u ) * 1 / 6; }  // (4  -6u2 +3u3)/6

	this.base2 = function(u) { return (1 + 3 * u + 3 * u * u - 3 * u * u * u) * 1 / 6} // (1 -3u +3u2 -3u3)/6

	this.base3 = function(u) { return (u * u * u ) * 1 / 6; }  //    u3/6


	this.base0der = function(u) { return (-3 + 6 * u - 3 * u * u) / 6 }  // (-3 +6u -3u2)/6

	this.base1der = function(u) { return (-12 * u + 9 * u * u ) / 6 }   // (-12u +9u2)  /6

	this.base2der = function(u) { return (3 + 6 * u - 9 * u * u ) / 6;}	// (-3 +6u -9u2)/6

	this.base3der = function(u) { return (3 * u * u ) * 1 / 6; }			
}

BSplineCurve.prototype.getInitialIndexSection = function(section)
{
	return (section - 1);
}
	
BSplineCurve.prototype.getSectionsFromPoints = function(points)
{
	return points.length - 3;
}

