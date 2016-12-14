/*
	Sky Dome

*/

var SkyDome = function()
{
	this.setRows();
	this.setCols();
	
	Model.call(this, this.gridType);
	this.init();

	this.setUpMaterial();
}

SkyDome.prototype = Object.create(Model.prototype);
SkyDome.prototype.constructor = SkyDome;

SkyDome.prototype.createGrid = function()
{
	this.createDomeGrid();
}

SkyDome.prototype.setRows = function()
{
	this.rows = 50;
}

SkyDome.prototype.setCols = function()
{
	this.cols = 50;
}

SkyDome.prototype.createDomeGrid = function()
{
	var latNumber;
    var longNumber;

    var inverseNormalsFactor = -1.0;

    for (latNumber=0; latNumber <= this.rows; latNumber++) 
    {
        var theta = latNumber * Math.PI / this.rows;
        var sinTheta = Math.sin(theta);
        var cosTheta = Math.cos(theta);

        for (longNumber=0; longNumber <= this.cols; longNumber++) 
        {
            var phi = longNumber * 2 * Math.PI / this.cols;
            var sinPhi = Math.sin(phi);
            var cosPhi = Math.cos(phi);

            var x = cosPhi * sinTheta;
            var y = cosTheta;
            var z = sinPhi * sinTheta;
            var u = 1.0 - (longNumber / this.cols);
            var v = 1.0 - (latNumber / this.rows);

            var normal = vec3.fromValues(x,y,z);
            vec3.negate(normal, normal); //Invierte las normales
            this.normals_buffer.push(normal[0]);
            this.normals_buffer.push(normal[1]);
            this.normals_buffer.push(normal[2]);

            var tangent = vec3.fromValues(0,0,0);
            this.tangent_buffer.push(tangent[0]);
            this.tangent_buffer.push(tangent[1]);
            this.tangent_buffer.push(tangent[2]);

            var binormal = vec3.create();
            vec3.cross(binormal,tangent,normal);
            this.binormal_buffer.push(binormal[0]);
            this.binormal_buffer.push(binormal[1]);
            this.binormal_buffer.push(binormal[2]);

            this.texture_coord_buffer.push(u);
            this.texture_coord_buffer.push(v);
            this.texture_coord_buffer.push(0);

            this.position_buffer.push(x);
            this.position_buffer.push(y);
            this.position_buffer.push(z);
        
            this.color_buffer.push(0.5);
            this.color_buffer.push(0.5);
            this.color_buffer.push(0.5);
        }
    }
}

SkyDome.prototype.createIndexBuffer = function()
{
	this.index_buffer = [];
  
    for (latNumber = 0; latNumber < this.rows; latNumber++) 
    {
        for (longNumber=0; longNumber < this.cols; longNumber++) 
        {
            var first = (latNumber * (this.cols + 1)) + longNumber;
            var second = first + this.rows + 1;
            this.index_buffer.push(first);
            this.index_buffer.push(second);
            this.index_buffer.push(first + 1);

            this.index_buffer.push(second);
            this.index_buffer.push(second + 1);
            this.index_buffer.push(first + 1);
        }
    }
    
}

SkyDome.prototype.setUpMaterial = function()
{
	this.loadDiffuseMap("../files/textures/sky_lightblue.jpg");

	this.ka = 0.75;
	this.kd = 0.65;
	this.ks = 0.1;
	this.shininess = 0.1;

	this.color_specular = vec3.fromValues(0.125, 0.125, 0.125);
	this.reflectiveness = 0.8;
	this.useTexture = 1.0;
	this.useNo
}