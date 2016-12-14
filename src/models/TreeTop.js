/****************************************
Tree Top

Dependencies:
- Profile.js
- RevolutionSurface.js
****************************************/

var TreeTop = function(type, step)
{
	this.height = 25.0;
	this.width = 15.0;
	this.maxHeight = 25.0;
	this.maxWidth = 15.0;

	this.type = 1;
	if (type !== undefined)
	{
		this.type = type;
	}

	var profile = new Profile();
	this.points = [];


	this.generateTreeTop();

	var curve = new BSplineCurve(this.points);
	//var curve = this.generateRandomTopCurve();
	profile.generateFromCurve(curve, 0.1);
	var axis = [0,1,0];
	var angle = 2 * Math.PI;
	
	RevolutionSurface.call(this, profile, axis, angle, step);

	this.init();

	this.setColor(getColor("tree"));

	this.loadDiffuseMap("../files/textures/foliage.jpg");

	this.useNormal = false;

}


TreeTop.prototype = Object.create(RevolutionSurface.prototype);
TreeTop.prototype.constructor = TreeTop;

//Algo no funciona en el custom Random
TreeTop.prototype.generateRandomTopCurve = function()
{
	var curve;
	var points = [];
	var intermediatePoints = 8;
	var seed = 23;
	var rng = new CustomRandom(seed);

	for (var i = 0; i < 3; i++)
	{
		points.push([0.0, 0.0, 0.0]);
	}

	var halfWidth = this.maxWidth/2.0;
	var halfHeight = this.maxHeight/2.0;
	points.push( [rng.next(halfWidth - 2.0, halfWidth + 2.0), rng.next(0.5, 2.0), 0.0 ]);
	points.push([rng.next(this.maxWidth - 4.0, this.maxWidth), rng.next(1.9, 3.5), 0.0 ]);
	points.push([rng.next(halfWidth - 3.0, halfWidth + 1.5), rng.next(halfHeight - 2.5, halfHeight + 2.5), 0.0 ]);
	points.push([rng.next(halfWidth - 3.0, halfWidth), rng.next(halfHeight , halfHeight + 2.5), 0.0 ]);
	points.push([rng.next(halfWidth, halfWidth + 1.5), rng.next(halfHeight + 2.5, halfHeight + 4.5), 0.0 ]);
	points.push([rng.next((this.maxWidth - 5.0), (this.maxWidth) - 3.0), rng.next(this.maxHeight - 7.0, this.maxHeight - 5.0), 0.0 ]);
	points.push([rng.next((this.maxWidth - 3.0), (this.maxWidth) - 2.0), rng.next(this.maxHeight - 5.0, this.maxHeight - 4.0), 0.0 ]);

	var randomEnd = rng.next(this.maxHeight - 2.5, this.maxHeight + 2.5);

	points.push([0.0, randomEnd, 0.0]);
	points.push([0.0, randomEnd, 0.0]);
	points.push([0.0, randomEnd - rng.next(1.0, 2.0), 0.0]);

	curve = new BSplineCurve(points);

	return curve;

}

TreeTop.prototype.generateTreeTop = function()
{
	if (this.type == 1)
	{
		this.points = [[0,0,0], 
						[0,0,0], 
						[0,0,0], 
						[this.width, 1.5, 0],
						[this.width + this.width * 0.2, 2.5, 0],
						[this.width *0.6,this.height * 0.5,0], 
						[this.width * 0.5 - 1, this.height * 0.5 + 1.5, 0.0], 
						[this.width * 0.48,this.height * 0.5 + 2.5, 0.0],
						[this.width - 4.0,this.height - 5.0,0],
						[this.width * 0.45,this.height - 3.0,0],
						[0.0,this.height,0],
						[0.0,this.height,0],
						[0.0,this.height - 1.0,0]];
	}
	if (this.type == 2)
	{
		this.points = [[0,0,0], 
						[0,0,0], 
						[0,0,0], 
						[this.width, 0, 0], [this.width, 0, 0], [this.width, 0, 0],
						[this.width * 0.8, this.height * 0.15, 0],
						[this.width *0.65, this.height * 0.35, 0],[this.width *0.65, this.height * 0.35, 0],[this.width *0.65, this.height * 0.35, 0],

						[this.width *0.85, this.height * 0.35, 0],[this.width *0.85, this.height * 0.35, 0],[this.width *0.85, this.height * 0.35, 0],
						[this.width * 0.6, this.height * 0.6, 0],
						[this.width *0.3, this.height * 0.75, 0],[this.width *0.3, this.height * 0.75, 0],[this.width *0.3, this.height * 0.75, 0],
						[this.width * 0.5, this.height * 0.75, 0],[this.width * 0.5, this.height * 0.75, 0],[this.width * 0.5, this.height * 0.75, 0],
						[this.width * 0.4, this.height * 0.9, 0],
						[0.0,this.height,0],
						[0.0,this.height,0],
						[0.0,this.height - 1.0,0]];
	}

	if (this.type == 3)
	{
		this.points = [[0,0,0], 
						[0,0,0], 
						[0,0,0], 
						[this.width, 0, 0], [this.width, 0, 0], [this.width, 0, 0],
						[this.width *0.55, this.height * 0.45, 0],[this.width *0.55, this.height * 0.45, 0],[this.width *0.55, this.height * 0.45, 0],

						[this.width *0.75, this.height * 0.45, 0],[this.width *0.75, this.height * 0.45, 0],[this.width *0.75, this.height * 0.47, 0],
						//[this.width * 0.6, this.height * 0.6, 0],
						[this.width *0.35, this.height * 0.75, 0],[this.width *0.35, this.height * 0.75, 0],[this.width *0.35, this.height * 0.75, 0],
						[this.width * 0.5, this.height * 0.75, 0],[this.width * 0.5, this.height * 0.75, 0],[this.width * 0.5, this.height * 0.75, 0],
						//[this.width * 0.4, this.height * 0.9, 0],
						[0.0,this.height,0],
						[0.0,this.height,0],
						[0.0,this.height - 1.0,0]];
	}

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
