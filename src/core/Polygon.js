/****************************************
Polygon
Used for Swept Surfaces.
Polygons are by default on the plane
****************************************/

var Polygon = function()
{
	this.points;
	this.tangents;
	this.normals
	this.center;
	this.base; //Orthonormal
	this.textureValues;
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

	setTextureValues: function(texValues)
	{
		if (texValues === undefined)
		{
			return;
		}
		this.textureValues = texValues.slice(0);
	},

	setCenter: function(center)
	{
		this.center = center;
	},

	setBase: function(base)
	{
		this.base = base;
	},

	scale: function(scaleVector)
	{
		var scaleMatrix = mat3.create();
		mat3.scale(scaleMatrix, scaleMatrix, scaleVector);

		var transformedPoints = this.transformVectors(this.points, scaleMatrix);
		this.setPoints(transformedPoints);

		var transformedTangents = this.transformVectors(this.tangents, scaleMatrix);
		this.setTangents(transformedTangents);

		var transformedNormals = this.transformVectors(this.normals, scaleMatrix);
		this.setNormals(transformedNormals);
	},

	changeBaseMatrix: function(pathBase, scale)
	{
		var matrix = mat3.create();
		
		var base;
		for (var col = 0; col < pathBase.length; col++)
		{
			base = pathBase[col];
			for (var row = 0; row < base.length; row++)
			{
				matrix[row * pathBase.length + col] = base[row];
			}
		}
		mat3.scale(matrix, matrix, scale);
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

	addScaling: function(points, scale)
	{
		var scaledPoints = [];
		var scaledPoint;
		var point;
		for (var i = 0; i < points.length; i++)
		{
			point = vec3.fromValues(points[i][0], points[i][1],points[i][2]);
			scaledPoint = vec3.fromValues(point[0] * scale[0], point[1] * scale[1], point[2] + scale[2]);
			scaledPoints.push(scaledPoint);
		}
		return scaledPoints;
	},

	addRotation: function(points, angle)
	{
		var rotatedPoints = [];
		var scaledPoint;
		var point;
		for (var i = 0; i < points.length; i++)
		{
			point = vec3.fromValues(points[i][0], points[i][1],points[i][2]);
			scaledPoint = vec3.fromValues(point[0] * scale[0], point[1] * scale[1], point[2] + scale[2]);
			scaledPoints.push(scaledPoint);
		}
		return scaledPoints;
	},


	getTransformedPolygon: function(newCenter, newBase, scale)
	{
		//enewBase is an erray with [normal, vecAux, tangent];
		if (scale === undefined)
		{
			scale = [1.0,1.0,1.0];
		}

		var transformPolygon = new Polygon();

		transformPolygon.setCenter(newCenter);

		var distance = vec3.fromValues(newCenter[0] - this.center[0], newCenter[1] - this.center[1], newCenter[2] - this.center[2]);

		var changeBaseMat = this.changeBaseMatrix(newBase, scale);

		var transformPoints = this.transformVectors(this.points, changeBaseMat);

		transformPoints = this.addDisplacement(transformPoints, distance);

		transformPolygon.setPoints(transformPoints);

		var transformTangents = this.transformVectors(this.tangents, changeBaseMat);
		transformPolygon.setTangents(transformTangents);

		var transformNormals = this.transformVectors(this.normals, changeBaseMat);
		transformPolygon.setNormals(transformNormals);

		//transformPolygon.setTextureValues(this.textureValues);

		return transformPolygon;
	},

	generateFromCurve: function(curve, step, normalAxis)
	//curve is Curve object from Curve.js
	{
		var points = [];
		var normals = [];
		var tangents = [];
		var point;
		var tangent;
		var axisZ = vec3.fromValues(0,0,-1);
		if (normalAxis !== undefined)
		{
			axisZ = normalAxis;
		}
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