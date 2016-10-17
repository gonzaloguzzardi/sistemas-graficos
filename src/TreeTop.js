/****************************************
Tree Top

Dependencies:
- Profile.js
- RevolutionSurface.js
****************************************/

var TreeTop = function(step)
{
	
	var profile = new Profile();
	var points = [[0,0,0],[-5,0,0],[-10.0,5.0,0],[-7.0,8.0,0],[-5.0,15.0,0],[-5.0,18.0,0],[-10.0,20.0,0]];
	profile.setPoints(points);
	var tangents = [[1,0,0],[0,1,0],[0,1,0],[0,1,0],[0,1,0],[0,1,0],[-1,0,0]];
	profile.setTangents(tangents);
	var normals = [[0,-1,0],[1,0,0],[1,0,0],[1,0,0],[1,0,0],[1,0,0],[0,1,0]];
	profile.setNormals(normals);
	var axis = [0,1,0];
	var angle = 2 * Math.PI;
	
	RevolutionSurface.call(this, profile, axis, angle, step);

	this.init();
}

TreeTop.prototype = Object.create(RevolutionSurface.prototype);
TreeTop.prototype.constructor = TreeTop;
