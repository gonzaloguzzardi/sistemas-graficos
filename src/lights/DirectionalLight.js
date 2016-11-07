/****************************************
Directional Light
Contains information about a light source coming from the infinity:
vec3 direction;
vec3 ambient;
vec3 intensity;
****************************************/
var lightID = 0;

var DirectionalLight = function (direction, ambientColor, intensity)
{
	this.index = lightID;
	this.direction = vec3.create();
	this.intensity = vec3.create();
	this.ambientColor = vec3.create();
	this.on = true;
	
	this.setParameters(direction, ambientColor, intensity);

	lightID++;
}

DirectionalLight.prototype = 
{

	constructor: DirectionalLight,

	render: function(glProgram)
	{
		var i = this.index;
		if(!this.on)
		{
			this.hide(glProgram);
			return;
		}
	
		gl.uniform3fv(glProgram.sunLightDirection, this.direction);
		gl.uniform3fv(glProgram.sunLightAmbient, this.ambientColor);
		gl.uniform3fv(glProgram.sunLightIntensity, this.intensity);
	},
	
	hide: function(glProgram)
	{
		var i = this.index;
		gl.uniform3fv(glProgram.sunLightAmbient, [0, 0, 0]);
		gl.uniform3fv(glProgram.sunLightIntensity, [0, 0, 0]);
	},

	turnOn: function()
	{
		this.on = true;
	},

	turnOff: function()
	{
		this.on = false;
	},

	setParameters: function(direction, ambientColor, intensity)
	{
		if (direction !== undefined)
		{
			this.direction = vec3.fromValues(direction[0], direction[1], direction[2]);
		}

		if (ambientColor !== undefined)
		{
			this.ambientColor = vec3.fromValues(ambientColor[0], ambientColor[1], ambientColor[2]);
		}

		if (intensity !== undefined)
		{
			this.intensity = vec3.fromValues(intensity[0], intensity[1], intensity[2]);
		}
	}
	
}