/****************************************
Cuadratic Bezier Curve
****************************************/

var BezierCurve2 = function(points) 
{
	Curve.call(this, this.gridType);
	this.init(points);
}

BezierCurve2.prototype = Object.create(Curve.prototype);
BezierCurve2.prototype.constructor = BezierCurve2;
	
BezierCurve2.prototype.setBases = function()
{
	this.bases = "bezier2";

	// Berstein Sases
	this.base0 = function(u) { return (1 - u) * (1 - u);} // 1 - 2u + u2

	this.base1 = function(u) { return (1 - u) * u; } //  u - u2

	this.base2 = function(u) { return u * u;}

	this.base3 = function(u) { return 0.0; }

	// derived bases

	this.base0der = function(u) { return -2 + (2 * u);} 

	this.base1der = function(u) { return 1 - (2 * u); }  

	this.base2der = function(u) { return 2 * u;}

	this.base3der = function(u) { return 0.0; }	
}

BezierCurve2.prototype.getInitialIndexSection = function(section)
{
	return (section) * 2;
}

BezierCurve2.prototype.getSectionsFromPoints = function(points)
{
	return (points.length - 1) / 2;
}

BezierCurve2.prototype.pointFromCurve = function(u)
//u must exist between 0 and maxU
{
	var uLocal = u % 1;
	var section = Math.floor(u) + 1;
	var i = this.getInitialIndexSection(section);

	var p0 = this.controlPoints[i];
	var p1 = this.controlPoints[i + 1];
	var p2 = this.controlPoints[i + 2];
	//console.log("segment " + section + " , point 1: " + p0[0] + " " + p0[1] + " " + p0[2]);
	//console.log("segment " + section + " ,  points 2: " + p1[0] + " " + p1[1] + " " + p1[2]);
	//console.log("segment " + section + " ,  points 3: " + p2[0] + " " + p2[1] + " " + p2[2]);


	var point = [];

	point.push(this.base0(uLocal) * p0[0] + this.base1(uLocal) * p1[0] + this.base2(uLocal) * p2[0]);
	point.push(this.base0(uLocal) * p0[1] + this.base1(uLocal) * p1[1] + this.base2(uLocal) * p2[1]);
	point.push(this.base0(uLocal) * p0[2] + this.base1(uLocal) * p1[2] + this.base2(uLocal) * p2[2]);



	return point;
}

BezierCurve2.prototype.firstDerivFromCurve = function(u)
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