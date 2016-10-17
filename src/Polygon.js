/****************************************
Polygon
Used for Swept Surfaces.
Polygons are by default on the xy plane
****************************************/

var Polygon = function()
{
	this.points;
	this.tangents;
	this.normals
	this.center;
	this.base; //Orthonormal
}

Polygon.prototype = {

	constructor: Polygon,

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

	setCenter: function(center)
	{
		this.center = center;
	},

	setBase: function(base)
	{
		this.base = base;
	},

	changeBaseMatrix: function(pathBase)
	{
		var matrix = mat3.create();
		var base;
		for (var col = 0; col < pathBase.length; col++)
		{
			base = pathBase[col];
			for (var fil = 0; fil < base.length; fil++)
			{
				matrix[fil * pathBase.length + col] = base[fil];
			}
		}
		return matrix;
	},

	transformVectors: function(vectors, transformation)
	{
		var transformVectors = [];
		var vector;
		var transformVector;
		for (var i = 0; i < vectors.length; i++)
		{
			vector = vec3.fromValues(vectors[i][0],vectors[i][1],vectors[i][2]);
			transformVector = vec3.create();
			vec3.transformMat3(transformVector, vector, transformation);
			transformVectors.push(transformVector);
		}
		return transformVectors;
	},

	addDisplacement: function(points, displacement)
	{
		var displacedPoints = [];
		var displacedPoint;
		var point;
		for (var i = 0; i < points.length; i++)
		{
			point = vec3.fromValues(points[i][0], points[i][1],points[i][2]);
			displacedPoint = vec3.fromValues(point[0] + displacement[0], point[1] + displacement[1], point[2] + displacement[2]);
			displacedPoints.push(displacedPoint);
		}
		return displacedPoints;
	},

	getTransformedPolygon: function(newCenter, newBase)
	{
		var transformPolygon = new Polygon();

		transformPolygon.setCenter(newCenter);

		var distance = vec3.fromValues(newCenter[0] - this.center[0], newCenter[1] - this.center[1], newCenter[2] - this.center[2] )
		var changeBaseMat = this.changeBaseMatrix(newBase);

		var transformPoints = this.transformVectors(this.points, changeBaseMat);
		transformPoints = this.addDisplacement(transformPoints, distance);
		transformPolygon.setPoints(transformPoints);

		var transformTangents = this.transformVectors(this.tangents, changeBaseMat);
		transformPolygon.setTangents(transformTangents);

		var transformNormals = this.transformVectors(this.normals, changeBaseMat);
		transformPolygon.setNormals(transformNormals);

		return transformPolygon;
	},

	generateCurve: function(curve, step)
	// curves must be closed to be a polygon
	//curve is Curve object from Curve.js
	{
		var points = [];
		var normals = [];
		var tangents = [];
		var point;
		var tangent;
		var axisZ = vec3.fromValues(0,0,-1);
		var x = 0; 
		var y = 0;
		var z = 0;

		for (var u = curve.minU ; u <= curve.maxU; u += step)
		{
			var normal = vec3.create();
			point = curve.pointFromCurve(u);
			x += point[0];
			y += point[1];
			z += point[2];
			tangent = curve.firstDerivFromCurve(u);
			vec3.cross(normal, tangent, axisZ);
			points.push(point);
			tangents.push(tangent);
			normals.push(normal);
		}
		var centerX = x / points.length;
		var centerY = y / points.length;
		var centerZ = z / points.length;
		var center = vec3.fromValues(centerX, centerY, centerZ);
		this.setPoints(points);
		this.setTangents(tangents);
		this.setNormals(normals);
		this.setCenter(center);
	}
}