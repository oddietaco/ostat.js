var MathExt = {
	H: function(x) {
		if(isNaN(x)) return Math.NaN;
		if(x<0) return 0;
		return 1;
	},

	GammaLn: function(x) {
		var coef = new Array(
				 76.18009172947146,
				-86.50532032941677,
				 24.01409824083091,
				-1.231739572450155,
				 0.001208650973866179,
				-0.000005395239384953
			);

		var b = a = x;

		var tmp = a+5.5-(a+0.5)*Math.log(a+5.5);
		var ser = 1.000000000190015;

		for(var j=0; j<=5; j++) {
			ser += (coef[j]/++b);
		}

		return (Math.log(2.5066282746310005*ser/a)-tmp); 
	}
}

function ContinuousDistribution() {
	mean = NaN;
	stdev = NaN;

	this.getMean = function() {return mean;}

	this.getStDev = function() {return stdev;}

	this.unifRand = function(low,high) {
		return Math.random() * (high - low) + low;
	}

	this.rand = function(num) {
		if(!(num>0)) {
			console.warn("Invalid argument to rand. Number of random elements to generate must be positive");
			return Math.NaN;
		}
		num = num > 0 || 1;
		var randArray = new Array();
		for(var i = 0; i < num; i++) {
			randArray.push(this._rand());
		}
		return randArray;
	}

	this.F = function(x) {
		return this._cdf(x);
	}
}

function NormalDistribution(mu,sigma) {
	ContinuousDistribution.call(this);

	if(sigma <= 0) {
		console.warn("Invalid argument to NormalDistribution. sigma must be greater than 0");
		return Number.NaN;
	}

	mean = mu || 0;
	stdev = sigma || 1;
	
	this._rand = function() {
		var u = this.unifRand(0,1);
		var v = this.unifRand(0,1);

		return (Math.sqrt(-2 * Math.log(u)) * Math.cos(2*v*Math.PI)) * stdev + mean;
	}

	this.toString = function() {
		return "Normal (" + mean.toFixed(2) + "," + stdev.toFixed(2) + ")";
	}

	this._cdf = function(x) {
		x = (x-mu) / stdev;

		// From Johnson, Kotz and Balakrishnan (1994). Continuous univariate distributions, John Wiley and Sons
		var y = 0.7988*x*(1+0.04417*x*x);
		return Math.exp(2*y) / (1+Math.exp(2*y));
	}
}

NormalDistribution.prototype = new ContinuousDistribution();
NormalDistribution.prototype.constructor = NormalDistribution;

function ExponentialDistribution(lambda) {
	ContinuousDistribution.call(this);

	if(lambda <= 0) {
		console.warn("Invalid argument to ExponentialDistribution. lambda must be greater than 0");
		return Number.NaN;
	}

	stdev = mean = 1/lambda || 1;

	this._rand = function() {
		var u = this.unifRand(0,1);
		return (-1*Math.log(u))/lambda;
	}

	this.toString = function() {
		return "Exp (" + mean.toFixed(2) + ")";
	}

	this._cdf = function(x) {
		return MathExt.H(x)*(1-Math.exp(-1*lambda*x));
	}
}

ExponentialDistribution.prototype = new ContinuousDistribution();
ExponentialDistribution.prototype.constructor = ExponentialDistribution;

function UniformDistribution(low,high) {
	ContinuousDistribution.call(this);

	low = low || 0;
	high = high || 1;

	if(high <= low) {
		console.warn("Invalid arguments to UniformDistribution. high must be greater than low.");
		return Number.NaN;
	}

	mean = (1/2)*(low+high);
	stdev = Math.sqrt((1/12)*((high-low)*(high-low)));

	this._rand = function() {
		return this.unifRand(low,high);
	}

	this.toString = function() {
		return "Unif (" + low.toFixed(2) + "," + high.toFixed(2) + ")";
	}

	this._cdf = function(x) {
		if(x < low) return 0;
		if(x > high) return 1;
		return (x-low)/(high-low);
	}
}

UniformDistribution.prototype = new ContinuousDistribution();
UniformDistribution.prototype.constructor = UniformDistribution;

function GammaDistribution(alpha,beta) {
	ContinuousDistribution.call(this);

	if(alpha <= 0 || beta <= 0) {
		console.warn("Invalid arguments to GammaDistribution. Both alpha and beta must be positive");
		return Number.NaN;
	}

	mean = alpha/(alpha+beta);
	variance = alpha*beta/((alpha+beta)^2*(alpha+beta+1));
	stdev = Math.sqrt(variance);

	this._cdf = function(x) {
		// F(x;alpha,beta) = B(x;alpha,beta) / B(alpha,beta)
	}
}