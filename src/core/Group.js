/****************************************
Group
Used as a models holder capable of applying transformations
****************************************/

var Group = function()
{

		this.group_matrix = mat4.create();
		this.models = [];

}

Group.prototype = {

	constructor: Group,

	cloneGroup: function()
	{		
		var clon = new Group();
		clon.group_matrix = mat4.clone(this.group_matrix);
		for(var i = 0; i < this.models.length; i++)
		{
			clon.add(this.models[i].clone());
		}
		return clon;
	},

	scaleGroup: function(scaleVector)
	{
		if (scaleVector === undefined)
		{
			return;
		}
		var scaleMatrix = mat4.create();
		mat4.scale(scaleMatrix, scaleMatrix, scaleVector);
		for(var i = 0; i < this.models.length; i++)
		{
			this.models[i].applyMatrix(scaleMatrix);
		}
	},
	
	applyMatrix: function(m){
		mat4.multiply(this.group_matrix, m, this.group_matrix);
	},
	
	setTransform: function(m){
		mat4.copy(this.group_matrix, m);
	},
	
	getModel: function(i)
	{
		return this.models[i];
	},
	
	addModel: function(model)
	{
		this.models.push(model);
	},
	
	removeModel: function(model)
	{
		var index = this.models.indexOf(model);
		if(index !== -1)
		{
			this.models.splice(index, 1);
		}
	},


    setupShaders: function(glProgram)
    {
        for ( var i = 0, l = this.models.length; i < l; i ++ ) 
		{
			this.models[i].setupShaders(glProgram);  
		}
	},


	setUpLighting: function(glProgram, lightPosition, ambientColor, diffuseColor)
	{
        for ( var i = 0, l = this.models.length; i < l; i ++ ) 
		{
			this.models[i].setUpLighting(glProgram, lightPosition, ambientColor, diffuseColor);
   		}
	},
	
	draw: function(m, shaderProgram)
	{
		var m_final = mat4.create();
		if(m !== undefined)
		{
			mat4.multiply(m_final, m, this.group_matrix);
		}
		for ( var i = 0, l = this.models.length; i < l; i ++ ) 
		{
			if(m !== undefined)
			{
				this.models[i].draw(m_final, shaderProgram);
			}
			else
			{
				this.models[i].draw(this.group_matrix, shaderProgram);
			}
		}
	},
	
	getCenter: function(m)
	{
		if(m === undefined) 
		{
			m = mat4.create();
		}
		var m_final = mat4.create();
		mat4.multiply(m_final, m, this.group_matrix);
		var center = vec3.fromValues(0, 0, 0);
		for ( var i = 0, l = this.models.length; i < l; i ++ )
		 {
			var modelCenter = this.models[i].getCenter(m_final);
			vec3.add(center, center, modelCenter);
		}
		vec3.scale(center, center, 1/this.models.length);
		return center;
	},
	
	setColor: function(color)
	{
		for ( var i = 0, l = this.models.length; i < l; i ++ ) {
			this.models[i].setColor(color);
		}
	}
}