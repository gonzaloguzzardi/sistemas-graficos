/****************************************
Tower Top

Similar to TowerBase but with a scale factor

Dependencies:
-SweptSurface.js
-TowerShape.js
-BezierCurve.js
-BSplineCurve.js
****************************************/

var TowerTop = function(step, scaleLimit) 
{
	this.height = 2.0;

	if (scaleLimit === undefined)
	{
		this.scaleLimit = 0.5;
	}
	else
	{
		this.scaleLimit = scaleLimit;
	}

	var shapeStep = 0.05;
	var polygon = new TowerShape(shapeStep);

	var curvePath = new BezierCurve([[0,0,0],[0,this.height/3,0],[0,this.height / 3 * 2,0],[0,this.height,0]]);
	
	var u = 0;
	var pathPoints = [];
	var pathBases = [];
	var point;
	var base;
	var tangent;
	var normal;
	var nNormal;
	var normaVec;
	var axisZ = vec3.fromValues(0,0,1);
	var vecAux = vec3.create();
	var nTangent;

	while(u <= curvePath.maxU)
	{
		point = curvePath.pointFromCurve(u);
		pathPoints.push(point);
		tangent = curvePath.firstDerivFromCurve(u);
		nTangent = Math.sqrt ( Math.pow ( tangent[0], 2) + Math.pow (tangent[1], 2) + Math.pow (tangent[2], 2));
		tangent = [-tangent[0] / nTangent, tangent[1] / nTangent, -tangent[2] / nTangent];
		normal = vec3.create();
		vec3.cross(vecAux, axisZ, tangent);
		normaVec = Math.sqrt (Math.pow(vecAux[0], 2) + Math.pow(vecAux[1], 2) + Math.pow(vecAux[2], 2));
		vecAux = [vecAux[0] / normaVec, vecAux[1] / normaVec, vecAux[2] / normaVec];
		vec3.cross(normal,vecAux, tangent);
		nNormal = Math.sqrt(Math.pow(normal[0], 2) + Math.pow(normal[1], 2) + Math.pow(normal[2], 2));
		normal = [normal[0] / nNormal, normal[1] / nNormal, normal[2] / nNormal];
		base = [normal, vecAux, tangent];
		pathBases.push(base);
		u += step;
	}

	SweptSurface.call(this, polygon, pathPoints, pathBases);

	this.init();

	this.setUpMaterial();
}

TowerTop.prototype = Object.create(SweptSurface.prototype);
TowerTop.prototype.constructor = TowerTop;

TowerTop.prototype.setScaleLimit = function(limit)
{
	this.scaleLimit = limit;
}

//u must be a number between 0 and 1
TowerTop.prototype.getScaleFactor = function(u)
{
	return (1.0 - ((1.0 - this.scaleLimit) * u));
}

TowerTop.prototype.createGrid = function()
{
	this.draw_mode = gl.TRIANGLE_STRIP;
	this.tangent_buffer = [];

	this.cols = this.polygon.points.length;
	this.rows = this.pathPoints.length;
	
	var points;
	var point;
	var tangent;
	var normal;
	var transformedPolygon;
	var pathPoint;
	var pathBase;
	var tangents;
	var normals;
				
	for (var row = 0.0; row < this.rows; row++)
	{
		pathPoint = this.pathPoints[row];
		pathBase = this.pathPoints[row];

		var progressParameter = row/(this.rows - 1);
		var scaleFactor = this.getScaleFactor(progressParameter);

		transformedPolygon = this.polygon.getTransformedPolygon(pathPoint, pathBase, [scaleFactor, 1.0, scaleFactor]);

		points = transformedPolygon.points;

		tangents = transformedPolygon.tangents;
		normals = transformedPolygon.normals;
		for (var col = 0.0; col < this.cols; col++)
		{
			point = points[col];
			this.position_buffer.push(point[0]);
			this.position_buffer.push(point[1]);
			this.position_buffer.push(point[2]);

			this.color_buffer.push(0.7);
			this.color_buffer.push(0.7);
			this.color_buffer.push(0.7);

			tangent = tangents[col];
			this.tangent_buffer.push(tangent[0]);
			this.tangent_buffer.push(tangent[1]);
			this.tangent_buffer.push(tangent[2]);

			normal = normals[col];
			vec3.normalize(normal, normal);
			this.normals_buffer.push(normal[0]);
			this.normals_buffer.push(normal[1]);
			this.normals_buffer.push(normal[2]);

			binormal = vec3.create();
			vec3.cross(binormal, tangent, normal);
			vec3.normalize(binormal, binormal);
			this.binormal_buffer.push(binormal[0]);
			this.binormal_buffer.push(binormal[1]);
			this.binormal_buffer.push(binormal[2]);

			this.texture_coord_buffer.push(1.0 - col / this.cols);
			this.texture_coord_buffer.push(1.0 - row / this.rows);
			this.texture_coord_buffer.push(0);
		}
	}
}

TowerTop.prototype.setUpMaterial = function()
{
	this.loadDiffuseMap("../files/textures/oxido.jpg");
	this.loadNormalMap("../files/textures/oxido-normal map.jpg");

	this.ka = 0.55;
	this.kd = 0.75;
	this.ks = 0.1;
	this.shininess = 0.1;

	this.color_specular = vec3.fromValues(0.125, 0.125, 0.125);
	this.reflectiveness = 0.8;
}