/****************************************
Tree
****************************************/

var Tree = function(type) 
{
	//this.baseHeight = 10.0;
	// Terrain Parameters
	this.treeBase = null;
	this.treeTop = null;

	this.type = type;

	this.scale = [1.0,1.0,1.0];
	this.position = [0.0,0.0,0.0];

	this.rng = new CustomRandom(7);

	this.generateTreeBase();
	this.generateTreeTop();

	console.log(this)

}

Tree.prototype.constructor = Tree;

Tree.prototype.generateTreeBase = function()
{
	this.treeBase = new TreeBase(0.1, this.rng.next(10, 20));
}

Tree.prototype.generateTreeTop = function()
{
	this.treeTop = new TreeTop(this.type, 0.1);
}

Tree.prototype.draw = function(matrix, glProgram)
{
	var groupMatrix = mat4.create();
	mat4.multiply(groupMatrix, groupMatrix, matrix);
	mat4.translate(groupMatrix, groupMatrix, this.position); 
	mat4.scale(groupMatrix, groupMatrix, this.scale); 

	var mbase = mat4.create();
	mat4.multiply(mbase, groupMatrix, mbase);
	mat4.scale(mbase, mbase, [ 2.0, 1.0, 2.0]);
	this.treeBase.draw(mbase, glProgram);

	var m = mat4.create();
	mat4.multiply(m, m, groupMatrix);
	mat4.translate(m, m, [0, 10, 0]);
	this.treeTop.draw(m, glProgram);
}

Tree.prototype.setScale = function(scale)
{
	this.scale = scale;
}
Tree.prototype.setPosition = function(position)
{
	this.position = position;
}

Tree.prototype.setupShaders = function(glProgram)
{
	this.treeBase.setupShaders(glProgram);
	this.treeTop.setupShaders(glProgram);
}

Tree.prototype.setUpLighting = function(glProgram, lightPosition, ambientColor, diffuseColor)
{
	this.treeBase.setupShaders(glProgram, lightPosition, ambientColor, diffuseColor);
	this.treeTop.setupShaders(glProgram, lightPosition, ambientColor, diffuseColor);
}