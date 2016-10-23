/****************************************
Revolution Surface
Abstract Class
Create a surface from a profile

Dependencies:
- Model.js
- Profile.js
****************************************/

var RevolutionSurface = function (profile, axis, angle, step) 
{
	if(this.constructor == RevolutionSurface){
		throw new Error("RevolutionSurface is an abstract class, it cannot be instanced.");
	}

	this.profile = profile; //Objeto perfil
	this.axis = axis;
	this.angle = angle;
	this.step = step; //porcentaje respecto al angulo
	
	Model.call(this);
}

RevolutionSurface.prototype = Object.create(Model.prototype);
RevolutionSurface.prototype.constructor = RevolutionSurface;

RevolutionSurface.prototype.createGrid = function()
{
	this.draw_mode = gl.TRIANGLE_STRIP; //Estas tres definiciones tienen que estar aca
	this.tangent_buffer = []; //Esta en null por defecto

	this.cols = this.profile.points.length;
	this.rows = Math.ceil( 1 / this.step) + 1;
	var ang;
	var rotatedProfile;
	var points;
	var tangents;
	var normals;
	var point;
	var tangent;
	var normal;
				
	for (row = 0; row <= this.rows; row++)
	{
		ang = row * this.step * this.angle;
		rotatedProfile = this.profile.getRotatedProfile(this.axis, ang); 
		points = rotatedProfile.points;
		tangents = rotatedProfile.tangents;
		normals = rotatedProfile.normals;
		for (col = 0; col < this.cols; col++)
		{
			point = points[col];
			tangente = tangents[col];
			normal = normals[col];
			
			//Position
			this.position_buffer.push(point[0]);
			this.position_buffer.push(point[1]);
			this.position_buffer.push(point[2]);

			//Color
			this.color_buffer.push(0.5);
			this.color_buffer.push(0.5);
			this.color_buffer.push(0.5);

			//Tangents
			this.tangent_buffer.push(tangente[0]);
			this.tangent_buffer.push(tangente[1]);
			this.tangent_buffer.push(tangente[2]);
			
			//Normals
			this.normals_buffer.push(normal[0]);
			this.normals_buffer.push(normal[1]); 
			this.normals_buffer.push(normal[2]);

			//Binormals
			binormal = vec3.create();
			vec3.cross(binormal,tangente,normal);
			this.binormal_buffer.push(binormal[0]);
			this.binormal_buffer.push(binormal[1]);
			this.binormal_buffer.push(binormal[2]);

			//UVs
			this.texture_coord_buffer.push(1.0 - col / this.cols);
			this.texture_coord_buffer.push(1.0 - row / this.rows);
			this.texture_coord_buffer.push(0);
		}
	}

}