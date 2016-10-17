/****************************************
Tree Top

Dependencies:
- Profile.js
- RevolutionSurface.js
****************************************/

var TreeTop = function(step)
{
	this.maxHeight = 30.0;
	this.maxWidth = 18.0;

	var profile = new Profile();
	var points = 
	[[0,0,0], 
	[0,0,0], 
	[0,0,0], 
	[7.5, 1.5, 0],
	[15.0, 2.5, 0],
	[7.0,12.5,0], 
	[6.0, 14.0, 0.0], 
	[7.5,15.0, 0.0],
	[11.0,20.0,0],
	[8.0,22.0,0],
	[0.0,25.0,0],
	[0.0,25.0,0],
	[0.0,24.0,0]];

	var curve = new BSplineCurve(points);
	//var curve = this.generateRandomTopCurve();
	profile.generateFromCurve(curve, 0.1);
	var axis = [0,1,0];
	var angle = 2 * Math.PI;
	
	RevolutionSurface.call(this, profile, axis, angle, step);

	this.init();
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
	this.width = rng.next(15, 30);
	this.height = rng.next (25, 40);

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

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
