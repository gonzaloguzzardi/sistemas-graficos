/****************************************
Abstract Class for Curves

section = segment
****************************************/

var Curve = function(points) 
{
	if(this.constructor == Curve)
	{
		throw new Error("Curve is an abstract class, it cannot be instanced.");
	}

	this.bases = null;
	this.base0 = null;
	this.base1 = null;
	this.base2 = null;
	this.base3 = null;

	this.base0der = null;
	this.base1der = null;
	this.base2der = null;
	this.base3der = null;
	
	this.minU = 0;
	this.maxU = 1;
	
	this.sections = 1;	// should change along with the control points
	this.deltaU = 0.01; //step: less deltaU = more detail
	this.controlPoints = null; // List of 3D points

	Model.call(this);

}

Curve.prototype = Object.create(Model.prototype);
Curve.prototype.constructor = Curve;

Curve.prototype.init = function(points)
{
	this.setBases();
	this.setControlPoints(points);

	Model.prototype.init.call(this);

}

	
Curve.prototype.setBases = function(){}

Curve.prototype.getInitialIndexSection = function(section){}
	
Curve.prototype.getSectionsFromPoints = function(points){}

Curve.prototype.setDeltaU = function(delta)
// delta must exist between 0 and 1
{
	if ((delta > 0) && (delta < 1))
	{
		this.deltaU = delta;
	}
}

Curve.prototype.setControlPoints = function(points)
{
	var s = this.getSectionsFromPoints(points);
	this.controlPoints = points.slice();
	this.maxU = s * 1.0;
	this.sections = s;
}


Curve.prototype.pointFromCurve = function(u)
//Cubic curve by default
//u must exist between 0 and maxU
{
	var uLocal = u % 1;
	var section = Math.floor(u) + 1;
	var i = this.getInitialIndexSection(section);

	var p0 = this.controlPoints[i];
	var p1 = this.controlPoints[i + 1];
	var p2 = this.controlPoints[i + 2];
	var p3 = this.controlPoints[i + 3];

	var point = [];

	point.push(this.base0(uLocal) * p0[0] + this.base1(uLocal) * p1[0] + this.base2(uLocal) * p2[0] + this.base3(uLocal) * p3[0]);
	point.push(this.base0(uLocal) * p0[1] + this.base1(uLocal) * p1[1] + this.base2(uLocal) * p2[1] + this.base3(uLocal) * p3[1]);
	point.push(this.base0(uLocal) * p0[2] + this.base1(uLocal) * p1[2] + this.base2(uLocal) * p2[2] + this.base3(uLocal) * p3[2]);

	return point;
}

Curve.prototype.firstDerivFromCurve = function(u)
{
	//Cubic curve by default
	var uLocal = u % 1;
	var section = Math.floor(u) + 1;
	var i = this.getInitialIndexSection(section);

	var p0 = this.controlPoints[i];
	var p1 = this.controlPoints[i + 1];
	var p2 = this.controlPoints[i + 2];
	var p3 = this.controlPoints[i + 3];

	var point = [];

	point.push(this.base0der(uLocal) * p0[0] + this.base1der(uLocal) * p1[0] + this.base2der(uLocal) * p2[0]+this.base3der(uLocal) * p3[0]);
	point.push(this.base0der(uLocal) * p0[1] + this.base1der(uLocal) * p1[1] + this.base2der(uLocal) * p2[1] + this.base3der(uLocal) * p3[1]);
	point.push(this.base0der(uLocal) * p0[2] + this.base1der(uLocal) * p1[2] + this.base2der(uLocal) * p2[2] + this.base3der(uLocal) * p3[2]);

	return point;
}

Curve.prototype.createGrid = function()
{
	this.draw_mode = gl.LINE_STRIP;
	this.rows = 1
	this.cols = Math.ceil(this.sections / this.deltaU);
	var u = 0;
	var col;
	var vec_product = vec3.create();
	var normal = vec3.create();
				
	for (col = 0; col < this.cols; col++)
	{
		//Position
		var point = this.pointFromCurve(u);
		this.position_buffer.push(point[0]);
		this.position_buffer.push(point[1]);
		this.position_buffer.push(point[2]);

		//Color
		this.color_buffer.push(0.5);
		this.color_buffer.push(0.5); 
		this.color_buffer.push(0.5);

		//Tangent
		var derivedPoint = this.firstDerivFromCurve(u);
		this.tangent_buffer.push(derivedPoint[0]);
		this.tangent_buffer.push(derivedPoint[1]);
		this.tangent_buffer.push(derivedPoint[2]);
		
		var tangente = vec3.fromValues(derivedPoint[0], derivedPoint[1], derivedPoint[2]);
		var axisZ = vec3.fromValues(0,0,1);
		vec3.cross(vec_product, axisZ, tangente);
		vec3.cross(normal, vec_product, tangente);

		//Z MUST NOT BE PARALLEL TO THE TANGENT
		vec3.normalize(normal, normal);
		this.normals_buffer.push(normal.x);
		this.normals_buffer.push(normal.y);
		this.normals_buffer.push(normal.z);

		binormal = vec3.create();
		vec3.cross(binormal,tangente,normal);
		vec3.normalize(binormal, binormal)
		this.binormal_buffer.push(binormal.z);
		this.binormal_buffer.push(binormal.y);
		this.binormal_buffer.push(binormal.x);

		this.texture_coord_buffer.push(0.0);
		this.texture_coord_buffer.push(0.0);
		this.texture_coord_buffer.push(0);
		
		u += this.deltaU;
	}
	
}