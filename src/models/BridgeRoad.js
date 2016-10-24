/****************************************
Bridge Road

Dependencies:
-SweptSurface.js
-RoadShape.js
-BezierCurve.js
-BSplineCurve.js
****************************************/

var BridgeRoad = function(length, width, height) 
{
	var step = 0.1;

	this.length = length;
	this.width = width;
	this.height = height;
	this.roadSlopeModifier = 0.8;


	var roadShape = new RoadShape(0.1, this.width);


	/*var polygon = new Polygon();
	var circle = new BezierCurve([[-5,0,0],[0,0.1,0],[0,0,0],[5,0,0]]);
	var circleStep = 0.1;
	polygon.generateFromCurve(circle, circleStep);*/


	var roadCurveStep = 0.05;

	//roadPath it's made of BSpline Curves, Repeating 3 times the beginning point, height point and end point.
	var roadPath = new BSplineCurve([[-this.length/2.0, 0, 0],[-this.length/2.0, 0, 0], [-this.length/2.0, 0, 0],[-this.width/3.0, this.height * this.roadSlopeModifier, 0],
									[-this.length/15.0, this.height, 0.0],[0.0, this.height, 0.0], [0.0, this.height, 0.0], [0.0, this.height, 0.0],
									[this.length/15.0, this.height, 0.0],[this.length/3.0, this.height * this.roadSlopeModifier, 0.0], [this.length/2.0, 0.0, 0.0],
									[this.length/2.0, 0.0, 0.0], [this.length/2.0, 0.0, 0.0]]);


	
	var u = 0;
	var pathPoints = [];
	var pathBases = [];
	var point;
	var base;
	var tangent;
	var normal;
	var nNormal;
	var normaVec;
	var axisZ = vec3.fromValues(0,1,0);
	var vecAux = vec3.create();
	var nTangent;

	while(u <= roadPath.maxU)
	{
		point = roadPath.pointFromCurve(u);
		pathPoints.push(point);

		tangent = roadPath.firstDerivFromCurve(u);
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

	SweptSurface.call(this, roadShape, pathPoints, pathBases);

	this.init();
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
				
	for (var row = 0.0; row < this.rows; row++)
	{
		pathPoint = this.pathPoints[row];
		pathBase = this.pathPoints[row];
		transformedPolygon = this.polygon.getTransformedPolygon(pathPoint, pathBase, [1.0, 1.0, 1.0]);
		points = transformedPolygon.points;
		tangents = transformedPolygon.tangents;
		normals = transformedPolygon.normals;
		for (var col = 0.0; col < this.cols; col++)
		{
			point = points[col];
			this.position_buffer.push(point[0]);
			this.position_buffer.push(point[1]);
			this.position_buffer.push(point[2]);

			this.color_buffer.push(0.1);
			this.color_buffer.push(0.5); //Color default
			this.color_buffer.push(0.1);

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
			this.texture_coord_buffer.push(0);
		}
	}

}