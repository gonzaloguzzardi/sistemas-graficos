/****************************************
Bridge Road

Dependencies:
-SweptSurface.js
-RoadShape.js
-BSplineCurve.js
****************************************/

var BridgeRoad = function(length, width, height) 
{
	var step = 0.1;

	this.length = length;
	this.width = width;
	this.height = height;
	this.roadSlopeModifier = 0.8;

	var roadShape = new RoadShape(step, this.width);


	//roadPath it's made of BSpline Curves, Repeating 3 times the beginning point, height point and end point.
	this.roadPath = new BSplineCurve([[-this.length/2.0 - 5.0, 0, 0],[-this.length/2.0 -5.0, 0, 0], [-this.length/2.0 - 5.0, 0, 0], //union con calle
									[-this.length/2.0, 0, 0],[-this.length/2.0, 0, 0], [-this.length/2.0, 0, 0], //punto inicial
									[-this.length/3.0, this.height * this.roadSlopeModifier, 0],
									[-this.length/15.0, this.height, 0.0],
									[0.0, this.height, 0.0], [0.0, this.height, 0.0], [0.0, this.height, 0.0], //punto de altura maxima
									[this.length/15.0, this.height, 0.0],
									[this.length/3.0, this.height * this.roadSlopeModifier, 0],
									[this.length/2.0, 0.0, 0.0], [this.length/2.0, 0.0, 0.0], [this.length/2.0, 0.0, 0.0],
									[this.length/2.0 + 5.0, 0.0, 0.0], [this.length/2.0 +5.0, 0.0, 0.0], [this.length/2.0 + 5.0, 0.0, 0.0], //union con calle
									], [0, 0, 1]);
	//Repite 3 veces union calle
	//Repite 3 inicio curva
	// 1 desvio 1
	// 1 desveio 2
	// repite 3 veces altura max
	// 1 desvio 2
	// 1 desvio 1
	// repite 3 veces final de curva
	// repite 3 veces union calle
	// 16 segmentos

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

	while(u <= this.roadPath.maxU)
	{
		point = this.roadPath.pointFromCurve(u);
		pathPoints.push(point);

		tangent = this.roadPath.firstDerivFromCurve(u);
		nTangent = Math.sqrt ( Math.pow ( tangent[0], 2) + Math.pow (tangent[1], 2) + Math.pow (tangent[2], 2));
		tangent = [tangent[0] / nTangent, tangent[1] / nTangent, tangent[2] / nTangent];

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

	SweptSurface.call(this, roadShape, pathPoints, pathBases);

	this.init();

	this.setColor(getColor("road"));

	this.setUpMaterial();

}

BridgeRoad.prototype = Object.create(SweptSurface.prototype);
BridgeRoad.prototype.constructor = BridgeRoad;

BridgeRoad.prototype.createGrid = function()
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
	var textureValues = this.polygon.textureValues;
				
	for (var row = 0.0; row < this.rows; row++)
	{
		pathPoint = this.pathPoints[row];
		pathBase = this.pathPoints[row];
		transformedPolygon = this.polygon.getTransformedPolygon(pathPoint, pathBase);
		points = transformedPolygon.points;
		tangents = transformedPolygon.tangents;
		normals = transformedPolygon.normals;

		for (var col = 0.0; col < this.cols; col++)
		{
			point = points[col];
			this.position_buffer.push(point[0]);
			this.position_buffer.push(point[1]);
			this.position_buffer.push(point[2]);

			this.color_buffer.push(0.25);
			this.color_buffer.push(0.5); //Color default
			this.color_buffer.push(0.25);

			tangent = tangents[col];
			this.tangent_buffer.push(tangent[0]);
			this.tangent_buffer.push(tangent[1]);
			this.tangent_buffer.push(tangent[2]);

			normal = normals[col];
			this.normals_buffer.push(normal[0]);
			this.normals_buffer.push(normal[1]);
			this.normals_buffer.push(normal[2]);

			binormal = vec3.create();
			vec3.cross(binormal, tangent, normal);
			this.binormal_buffer.push(binormal[0]);
			this.binormal_buffer.push(binormal[1]);
			this.binormal_buffer.push(binormal[2]);

			this.texture_coord_buffer.push(1.0 - col / this.cols);
			this.texture_coord_buffer.push(1.0 - row / this.rows);
			this.texture_coord_buffer.push(textureValues[col]);
		}
	}

}

BridgeRoad.prototype.setUpMaterial = function()
{
	this.loadDiffuseMap("../files/textures/vereda.jpg");
	this.loadSecondDiffuseMap("../files/textures/tramo-doblemarilla.jpg");
	this.loadNormalMap("../files/textures/vereda-normalmap.jpg");
	this.loadSecondNormalMap("../files/textures/ruta-normal.jpg");

	this.ka = 0.45;
	this.kd = 0.75;
	this.ks = 0.1;
	this.shininess = 0.1;

	this.color_specular = vec3.fromValues(0.125, 0.125, 0.125);
	this.reflectiveness = 0.8;

	this.useTexture = 1.0;
	this.useThreeTextures = false;
	this.useTwoTextures = true;
}

