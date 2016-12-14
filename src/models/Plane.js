/*
*
* Plane
*
* Use as River
*/

var Plane = function(width, height, pointDistance)
{
	this.pointsDistance = 25.0;

	if (pointDistance !== undefined)
	{
		this.pointsDistance = pointDistance;
	}

	this.setRows(width);
	this.setCols(height);
	
	Model.call(this, this.gridType);
	this.tangent_buffer = [];
	this.binormal_buffer = [];
	this.init();

	this.setUpMaterial();

	this.alpha = 0.5;
}

Plane.prototype = Object.create(Model.prototype);
Plane.prototype.constructor = Plane;

Plane.prototype.createGrid = function()
{
	this.createPlaneGrid();
}

Plane.prototype.setRows = function(width)
{
	if(width === undefined)
	{
		width = 2;
	}
	this.rows = width;
}

Plane.prototype.setCols = function(height)
{
	if(height === undefined)
	{
		height = 2;
	}
	this.cols = height;
}

// create Plane mesh
Plane.prototype.createPlaneGrid = function()
{
	var width = this.rows * this.pointsDistance;
	var height = this.cols * this.pointsDistance;
	for (var i = 0.0; i < this.rows; i++) { 
		for (var j = 0.0; j < this.cols; j++) {

			// y = 0
			var x = i - (this.rows - 1.0) / 2.0;
			x *= this.pointsDistance;
			var z = j - (this.cols - 1.0) / 2.0;
			z *= this.pointsDistance;
			//console.log("x = " + x + " , y = " + z);
			this.position_buffer.push(x);
			this.position_buffer.push(0);
			this.position_buffer.push(z);

			this.texture_coord_buffer.push(x / width);
			this.texture_coord_buffer.push(z / height);
			this.texture_coord_buffer.push(0);

			// Color
			this.color_buffer.push(0.0);
			this.color_buffer.push(1.0);
			this.color_buffer.push(0.0);
			
			// Normals
			this.normals_buffer.push(0);
			this.normals_buffer.push(1);
			this.normals_buffer.push(0);
			
			// Tangents
			this.tangent_buffer.push(1);
			this.tangent_buffer.push(0);
			this.tangent_buffer.push(0);
			
			//Binormals
			this.binormal_buffer.push(0);
			this.binormal_buffer.push(0);
			this.binormal_buffer.push(1);
		};
	};
};

Plane.prototype.setUpMaterial = function()
{
	this.loadDiffuseMap("../files/textures/aguaDeMar.jpg");
	this.loadNormalMap("../files/textures/agua-normalmap.jpg");
	this.loadReflectionMap("../files/textures/sky_lightblue.jpg");

	this.ka = 0.75;
	this.kd = 0.65;
	this.ks = 0.1;
	this.shininess = 0.1;

	this.color_specular = vec3.fromValues(0.125, 0.125, 0.125);
	this.reflectiveness = 0.8;
	this.useTexture = 1.0;
	this.useNormalMap = true;
	this.useReflectionMap = false; // DESACTIVO EL REFLECTION MAP PORQUE SE VE MUCHO PEOR. ARRUINA EL SCROLL

	this.scrollTexture = true;

	this.alpha = 0.8;
}