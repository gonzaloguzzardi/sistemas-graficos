/****************************************
Profile
Used for Revolution Surfaces.
Profiels are by default on the xy plane.
****************************************/

var Profile = function() 
{
	this.points;
	this.normals;
	this.tangents;
}

Profile.prototype = {

	constructor: Profile,

	setPoints: function(points)
	{
		this.points = points.slice(0);
	},

	setNormals: function(normals)
	{
		this.normals = normals.slice(0);
	},

	setTangents: function(tangents)
	{
		this.tangents = tangents.slice(0);
	},

	rotateVectors: function(vectors, rotation)
	{
		var rotatedVectors = [];
		var vector;
		var rotatedVector;
		for (var i = 0; i < vectors.length; i++)
		{
			vector = vec3.fromValues(vectors[i][0],vectors[i][1],vectors[i][2]);
			rotatedVector = vec3.create();
			vec3.transformMat4(rotatedVector, vector, rotation);
			rotatedVectors.push(rotatedVector);
		}
		return rotatedVectors;
	},
	
	getRotatedProfile: function(axis, angle)
	{
		var rotatedProfile = new Profile();
		var matrix = mat4.create();
		mat4.identity(matrix);
		mat4.rotate(matrix, matrix, angle, axis);
		
		var rotatedPoints = this.rotateVectors(this.points, matrix);
		rotatedProfile.setPoints(rotatedPoints);

		var rotatedTangents = this.rotateVectors(this.tangents, matrix);
		rotatedProfile.setTangents(rotatedTangents);
		var rotatedNormals = this.rotateVectors(this.normals, matrix);
		rotatedProfile.setNormals(rotatedNormals);
		
		return rotatedProfile;
	},

	generateFromCurve: function(curve, step)
	//curve is a Curve object from Curve.js
	{
		var points = [];
		var normals = [];
		var tangents = [];
		var point;
		var tangent;
		var normal;
		var axisZ = vec3.fromValues(0,0,1);

		for (var u = curve.minU ; u <= curve.maxU; u += step)
		{
			normal = vec3.create();
			point = curve.pointFromCurve(u);
			tangent = curve.firstDerivFromCurve(u);

			vec3.cross(normal,tangent,axisZ);
			points.push(point);
			tangents.push(tangent);
			normals.push(normal);
		}
		this.setPoints(points);
		this.setTangents(tangents);
		this.setNormals(normals);
	}
}