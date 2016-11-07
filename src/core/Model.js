/****************************************
Geometry

Represents an object that can be drawn using webGL

****************************************/

var Model = function() {

	if(this.constructor == Model){
		throw new Error("Model is an abstract class, it cannot be instanced.");
	}

	this.draw_mode = gl.TRIANGLE_STRIP; //use Triangle Strip by default
	this.childs = [];

	// textures
	this.useTexture = 0.0;
	this.diffuseMap = null;
	this.normalMap = null;
	
	// buffers
	this.position_buffer = [];
	this.color_buffer = [];
	this.index_buffer = [];
	this.normals_buffer = [];
	this.texture_coord_buffer = [];

	this.tangent_buffer = [];
	this.binormal_buffer = [];

	// webGL buffers
	this.webgl_position_buffer = null;
	this.webgl_color_buffer = null;
	this.webgl_index_buffer = null;
	this.webgl_normals_buffer = null;
	this.webgl_texture_coord_buffer = null;
	
	this.webgl_tangent_buffer = null;
	this.webgl_binormal_buffer = null;
	
	// Model Matrux
	this.model_matrix = mat4.create();

	//shader variables

	this.ka = 0.2;
	this.kd = 0.5;
	this.ks = 0.3;
	this.shininess = 0.01;

	this.color_specular = vec3.fromValues(0.125, 0.125, 0.125);
	this.reflectiveness = 0.8;

	this.useNormalMap = false;
	
}

Model.prototype = {

	constructor: Model,

	clone: function(model){

		var clon = new this.constructor();
		clon.position_buffer = this.position_buffer.slice(0);
		clon.color_buffer = this.color_buffer.slice(0);
		return clon;
	},

	init: function(){
		this.createGrid();
		this.createIndexBuffer();
		this.setupWebGLBuffers();
	},

	moveVertex: function(i, x, y, z)
	{
		this.position_buffer.splice(i, 3, x, y, z);
	},


	applyMatrix: function(matrix) 
	{
		mat4.multiply(this.model_matrix, matrix, this.model_matrix);
	},

	addChild: function(model) 
	{
		this.childs.push(model);
	},
	
	getCenter: function(modelMatrix) 
	{
		var vertLength = this.position_buffer.length / 3.0;
		var centerX = 0;
		var centerY = 0;
		var centerZ = 0;
		for ( var i = 0, l = this.position_buffer.length; i < l; i += 3 ) {
			centerX += this.position_buffer[i];
			centerY += this.position_buffer[i + 1];
			centerZ += this.position_buffer[i + 2];
		}
		centerX = centerX / vertLength;
		centerY = centerY / vertLength;
		centerZ = centerZ / vertLength;
		var center = vec3.fromValues(centerX, centerY, centerZ);
		var centerVector = vec3.create();
		if(modelMatrix === undefined)  {
			modelMatrix = mat4.create();
		}
		var resultMatrix = mat4.create();
		mat4.multiply(resultMatrix, modelMatrix, this.model_matrix);
		vec3.transformMat4(centerVector, center, resultMatrix);
		return centerVector;
	},
	
	setTransform: function(matrix) 
	{
		mat4.copy(this.model_matrix, matrix);
	},
	
	// this method should be overwrite for custom grids
	createGrid: function(){	},
	
	// create index buffer depending on the draw mode
	createIndexBuffer: function(){

	var v0, v1, v2, v3, v4;

	if(this.draw_mode == gl.LINE_STRIP)
	{
		for (var i = 0.0; i < this.cols; i++)
		{
			this.index_buffer.push(i);
		}
	}
	else if(this.draw_mode == gl.TRIANGLES){
		for (var i = 0.0; i < this.rows-1; i++) {
			for (var j = 0.0; j < this.cols-1; j++) {
				v0 = (i * this.cols) + j;
				v1 = (i * this.cols) + j + 1;
				v2 = ((i + 1) * this.cols) + j;
				v3 = ((i + 1) * this.cols) + j + 1;
				this.index_buffer.push(v0);
				this.index_buffer.push(v1);
				this.index_buffer.push(v2);
				this.index_buffer.push(v1);
				this.index_buffer.push(v2);
				this.index_buffer.push(v3);
			}
		}
	} 
	else if(this.draw_mode == gl.TRIANGLE_STRIP)
		{
			//Triangle strip
			var i = 0;
			var j = 0;
			var j_add = 1.0;
			var j_add_anterior = 0;
			var i_add = 0;
			while(true)
			{
				if((i != 0 && j == 0) || j == this.cols - 1)
				{
					j_add = -1 * j_add;
					i++;
				}
				//break loop condition
				if(i >= this.rows-1)
				{
					break;
				}
				v0 = 0;
				v1 = 0;
				v2 = 0;
				v3 = 0;
				v4 = 0;

				if(j_add > 0)
				{
					v0 = (i * this.cols) + j;
					v1 = (i * this.cols) + j + 1;
					v2 = ((i + 1) * this.cols) + j;
					v3 = ((i + 1) * this.cols) + j + 1;
					v4 = v3 + this.rows;
		
					if(j == 0)
					{
						this.index_buffer.push(v0);
						this.index_buffer.push(v2);
					}
					this.index_buffer.push(v1);
					this.index_buffer.push(v3);
				} 
				else if (j_add < 0)
				{	
					v0 = (i * this.cols) + j - 1;
					v1 = (i * this.cols) + j;
					v2 = ((i + 1) * this.cols) + j - 1;
					v3 = ((i + 1) * this.cols) + j;
					v4 = v3 + this.rows;
			
					if(j == this.cols-1)
					{
						this.index_buffer.push(v1);
						this.index_buffer.push(v3);
					}
					this.index_buffer.push(v0);
					this.index_buffer.push(v2);
				}
				i += i_add;
				j += j_add;
			}
		}
	},

	loadTexture: function(fileName)
	{
        var auxTex = gl.createTexture();
        var texture = auxTex;
        texture.image = new Image();

        var model = this;

        texture.image.onload = function () 
        {
        	model.handleLoadedTexture(texture)
        }
        texture.image.src = fileName;
    	return texture;
    },

    handleLoadedTexture: function(texture) 
    {
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
        gl.generateMipmap(gl.TEXTURE_2D);

        gl.bindTexture(gl.TEXTURE_2D, null);
    },

	loadDiffuseMap: function(fileName)
	{
		this.diffuseMap = this.loadTexture(fileName);
		this.useTexture = 1.0;
	},

	loadNormalMap: function(fileName)
	{
		this.normalMap = this.loadTexture(fileName);
		this.useNormalMap = true;
	},

    setupShaders: function(glProgram)
    {
        gl.useProgram(glProgram);
    },


	setUpLighting: function(glProgram, lightPosition, ambientColor, diffuseColor)
	{
            // Configuración de la luz
            // Se inicializan las variables asociadas con la Iluminación
            var lighting;
            lighting = true;
            gl.uniform1i(glProgram.useLightingUniform, lighting);       

            gl.uniform3fv(glProgram.lightingDirectionUniform, lightPosition);
            gl.uniform3fv(glProgram.ambientColorUniform, ambientColor );
            gl.uniform3fv(glProgram.directionalColorUniform, diffuseColor);
	},
	
	setColor: function(color)
	{
		for(var i = 0; i < this.color_buffer.length; i+=3)
		{
			this.color_buffer.splice(i, 3, color[0], color[1], color[2]);
		}
		gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_color_buffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.color_buffer), gl.STATIC_DRAW);
	},
	
	setupWebGLBuffers: function(){

		this.webgl_position_buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_position_buffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.position_buffer), gl.STATIC_DRAW);
		this.webgl_position_buffer.itemSize = 3;
        this.webgl_position_buffer.numItems = this.position_buffer.length / 3;

		// Color
		this.webgl_color_buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_color_buffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.color_buffer), gl.STATIC_DRAW);   
		this.webgl_color_buffer.itemSize = 3;
        this.webgl_color_buffer.numItems = this.color_buffer.length / 3;

        // Textures coords
        this.webgl_texture_coord_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_texture_coord_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.texture_coord_buffer), gl.STATIC_DRAW);
        this.webgl_texture_coord_buffer.itemSize = 3;
        this.webgl_texture_coord_buffer.numItems = this.texture_coord_buffer.length / 3;

		// Index Buffer
		this.webgl_index_buffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.index_buffer), gl.STATIC_DRAW);
		this.webgl_index_buffer.itemSize = 1;
        this.webgl_index_buffer.numItems = this.index_buffer.length;
		
		// Normals
		this.webgl_normals_buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_normals_buffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normals_buffer), gl.STATIC_DRAW); 
		this.webgl_normals_buffer.itemSize = 3;
        this.webgl_normals_buffer.numItems = this.normals_buffer.length / 3;

		// Tangent
		if(this.tangent_buffer != null)
		{
			this.webgl_tangent_buffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_tangent_buffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.tangent_buffer), gl.STATIC_DRAW);
			this.webgl_tangent_buffer.itemSize = 3;
        	this.webgl_tangent_buffer.numItems = this.tangent_buffer.length / 3;
		}
		
		// Binormals
		if(this.binormal_buffer != null)
		{
			this.webgl_binormal_buffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_binormal_buffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.binormal_buffer), gl.STATIC_DRAW);
			this.webgl_binormal_buffer.itemSize = 3;
        	this.webgl_binormal_buffer.numItems = this.binormal_buffer.length / 3;
		}
	},

	// draw vertexGrid applying his parent transformations
	draw: function(parentMatrix, glProgram)
	{
		gl.useProgram(glProgram);

        gl.uniform1i(glProgram.uUseNormalMap, this.useNormalMap);
        gl.uniform1f(glProgram.uUseTexture, this.useTexture)
    	gl.uniform3fv(glProgram.uSpecularColor, this.color_specular);

        //Shader Phong Variables
        gl.uniform1f(glProgram.uKa, this.ka);
        gl.uniform1f(glProgram.uKd, this.kd);
        gl.uniform1f(glProgram.uKs, this.ks);
        gl.uniform1f(glProgram.uShininess, this.shininess);
        gl.uniform1f(glProgram.uReflectiveness, this.reflectiveness);


        gl.uniformMatrix4fv(glProgram.pMatrixUniform, false, pMatrix);
        gl.uniformMatrix4fv(glProgram.ViewMatrixUniform, false, CameraMatrix); 

		// Bind Position Buffer
		gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_position_buffer);
		gl.vertexAttribPointer(glProgram.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
	
		//Bind Color Buffer
		gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_color_buffer);
		gl.vertexAttribPointer(glProgram.vertexColorAttribute, 3, gl.FLOAT, false, 0, 0);

		// Bind Textures Coords
		gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_texture_coord_buffer);
        gl.vertexAttribPointer(glProgram.textureCoordAttribute, this.webgl_texture_coord_buffer.itemSize, gl.FLOAT, false, 0, 0);

        // Active Textures
        if (this.useTexture > 0)
        {
	        gl.activeTexture(gl.TEXTURE0);
	        gl.bindTexture(gl.TEXTURE_2D, this.diffuseMap);
	        gl.uniform1i(glProgram.uSampler, 0);
    	}
    	if (this.useNormalMap == true)
    	{
	        gl.activeTexture(gl.TEXTURE1);
	        gl.bindTexture(gl.TEXTURE_2D, this.normalMap);
	        gl.uniform1i(glProgram.uNormalSampler, 1);
   		}
		
        //Bind Normal Buffers
   		gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_normals_buffer);
		gl.vertexAttribPointer(glProgram.vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);
		
		//Model matrix
        var model_matrix_final = mat4.create();
		mat4.multiply(model_matrix_final, parentMatrix, this.model_matrix);
		gl.uniformMatrix4fv(glProgram.ModelMatrixUniform, false, model_matrix_final);

		//Normals Matrix
        /*var normals_matrix = mat4.create();
        mat4.invert(normals_matrix, model_matrix_final);
		mat4.transpose(normals_matrix, normals_matrix);
		gl.uniformMatrix4fv(glProgram.nMatrixUniform, false, normals_matrix);*/

		var normals_matrix = mat3.create();
        mat3.fromMat4(normals_matrix, model_matrix_final);
        mat3.invert(normals_matrix, normals_matrix);
		mat3.transpose(normals_matrix, normals_matrix);
		gl.uniformMatrix3fv(glProgram.nMatrixUniform, false, normals_matrix);

		
		//Tangent Buffer
		if(this.webgl_tangent_buffer != null)
		{
			gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_tangent_buffer);
			gl.vertexAttribPointer(glProgram.vertexTangentAttribute, 3, gl.FLOAT, false, 0, 0);
		}
		
		//Binormal Buffer
		if(this.webgl_binormal_buffer != null)
		{
			gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_binormal_buffer);
			gl.vertexAttribPointer(glProgram.vertexBinormalAttribute, 3, gl.FLOAT, false, 0, 0);
		}

		//Bind Index Buffer
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);

		// Draw Model
		gl.drawElements(this.draw_mode, this.index_buffer.length, gl.UNSIGNED_SHORT, 0);
		
		// draw child Models
		for(var i = 0; i < this.childs.length; i+=1)
		{
			this.childs[i].draw(model_matrix_final, glProgram);
		}
	}
}
