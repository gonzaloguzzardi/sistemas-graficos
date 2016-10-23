/****************************************
Cuadratic BSpline Curve
****************************************/

var BSplineCurve2 = function(points)
{
	if(this.constructor == BSplineCurve2){
		throw new Error("BSplineCurve2 is not ready for using.");
	}
	Curve.call(this, this.gridType);
	this.init(points);
}

BSplineCurve2.prototype = Object.create(Curve.prototype);
BSplineCurve2.prototype.constructor = BSplineCurve2;
	
BSplineCurve2.prototype.setBases = function()
{
	this.bases = "bspline2";
	
	this.base0 = function(u) { return (u * u ) * 0.5; }  // 0.5 u2

	this.base1 = function(u) { return ( -u * u + u + 0.5 ); }  // -u2 + u + 0.5

	this.base2 = function(u) { return ((1 - u) * (1 - u) * 0.5)} // (1 - u)2 * 0.5

	this.base3 = function(u) { return 0.0 ;};


	this.base0der = function(u) { return u }  // u

	this.base1der = function(u) { return (-2 * u ) + 1 }   // -2u + 1

	this.base2der = function(u) { return (-2) ;}	// -2

	this.base3der = function(u) { return 0.0 ;};
	
}

BSplineCurve2.prototype.getInitialIndexSection = function(section)
{
	return (section - 1);
}
	
BSplineCurve2.prototype.getSectionsFromPoints = function(points)
{
	return points.length - 2;
}


BSplineCurve2.prototype.pointFromCurve = function(u)
//u must exist between 0 and maxU
{
	var uLocal = u % 1;
	var section = Math.floor(u) + 1;
	var i = this.getInitialIndexSection(section);

	var p0 = this.controlPoints[i];
	var p1 = this.controlPoints[i + 1];
	var p2 = this.controlPoints[i + 2];

	var point = [];

	point.push(this.base0(uLocal) * p0[0] + this.base1(uLocal) * p1[0] + this.base2(uLocal) * p2[0]);
	point.push(this.base0(uLocal) * p0[1] + this.base1(uLocal) * p1[1] + this.base2(uLocal) * p2[1]);
	point.push(this.base0(uLocal) * p0[2] + this.base1(uLocal) * p1[2] + this.base2(uLocal) * p2[2]);

	return point;
}

BSplineCurve2.prototype.firstDerivFromCurve = function(u)
{
	var uLocal = u % 1;
	var section = Math.floor(u) + 1;
	var i = this.getInitialIndexSection(section);

	var p0 = this.controlPoints[i];
	var p1 = this.controlPoints[i + 1];
	var p2 = this.controlPoints[i + 2];

	var point = [];

	point.push(this.base0der(uLocal) * p0[0] + this.base1der(uLocal) * p1[0] + this.base2der(uLocal) * p2[0]);
	point.push(this.base0der(uLocal) * p0[1] + this.base1der(uLocal) * p1[1] + this.base2der(uLocal) * p2[1]);
	point.push(this.base0der(uLocal) * p0[2] + this.base1der(uLocal) * p1[2] + this.base2der(uLocal) * p2[2]);

	return point;
}