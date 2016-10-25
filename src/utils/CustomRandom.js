//This Custom Random object provides the posibility to seed the Random Generator

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var CustomRandom = function(nseed) 
{    
  
	this.seed;    

	this.constant = Math.pow(2, 13)+1; 
	this.prime = 1987; 
	this.maximum = 1000; 	//maximum number needed for calculation the float precision of the numbers (10^n where n is number of digits after dot)  

    if (nseed === undefined)
     {    
      seed = (new Date()).getTime();   
    }
	else
	{    
      seed = nseed;    
    }    
    
}  

CustomRandom.prototype = {

	constructor: CustomRandom,
	
	next: function(min, max) 
	{    
		//Hasta que se arregle
		if ((min !== undefined) && (max !== undefined))
        {
        	 return Math.floor(Math.random()*(max-min+1)+min);
        }
        else
        {
        	return Math.random();
        }  
		

		////////////////////////

		//while (this.seed > this.constant) this.seed = this.seed/this.prime; 
       /* this.seed *= this.constant; 
        this.seed += this.prime;   
        // if 'min' and 'max' are not provided, return random number between 0 & 1  
        if ((min !== undefined) && (max !== undefined))
        {
        	return ((min + this.seed) % this.maximum/this.maximum*(max-min));
        }
        else
        {
        	return (this.seed % this.maximum/this.maximum);
        }  */
	}
}