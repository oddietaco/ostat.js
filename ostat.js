/*
 * This contains a number of helpful functions that can be used to help with
 * the calculation of statistical and probabilistic properties. However, they
 * are not necessarily statistical functions.
 *
 */
var MathExt = {

	/*
	 * The Heaviside function.
	 * See http://en.wikipedia.org/wiki/Heaviside_step_function
	 */
	H: function(x) {
		if(isNaN(x)) return Math.NaN;
		if(x<0) return 0;
		return 1;
	},

	/*
	 * Returns the logarithm of the gamma function. GammaLn(A) = Log(Gamma(A)). However,
	 * this function avoids potential problems related to overflow that could occur
	 * if calculated in the Log(Gamma(A)) approach.
	 *
	 * See http://www.mit.edu/~mbarker/formula1/f1help/04-g-m3.htm
	 */
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

var DescriptiveStatistics = {

	/*
	 * Puts a high charts graph into the element with id container. The graph
	 * will represent a historgram of the values in passed in.
	 *
	 */
	plotHistogram: function(container, values, options) {
		bins = this._createBins(values);

		if(!(typeof options == "object" && options !== null)) {
			options = new Object();
		}

		var max_value = Math.max.apply(Math, bins.counts);

		console.log(bins);

		var base_options = new Object();	
		base_options.chart = {type: "column"};
		base_options.xAxis = {type: "linear", /*min:0, max:bins.max*1.1*/};
		base_options.yAxis = {min: 0, max: max_value * 1.1};
		base_options.tooltip = {enabled: false};
		base_options.series = [{
                data: bins.counts,
                showInLegend: false,
                pointStart: bins.min,
                pointInterval: bins.width
            }];

		$.extend(true,options,base_options);
        $(container).highcharts(options);
	},

	/*
	 * @TODO (#9): Currently, this function only supports *adding* an interactive chart to an
	 * existing histogram chart. Expand it to support creating an interactive PDF as the only
	 * chart in the container.
	 *
	 * @TODO (#10): Have this function *add* the slider to the page, rather than requiring that it already
	 * be there.
	 *
	 * Puts an interactive representation of the specified distribution's PDF on a chart.
	 */
	plotInteractivePDF: function(container,distribution,mesh) {
		mesh = mesh || 20;
		var chart = $(container).highcharts();
		if(chart.series.length==0) {
			throw "plotInteractivePDF must plot on top of the historgram";
		}

		var mesh_grid = distribution.meshGrid(mesh);
		var num_bins = chart.series[0].data.length;
 		var pdf_points = new Array();

		var num_variates = 0;
		for(var i=0; i<num_bins; i++) {
			num_variates +=  chart.series[0].data[i].y;
		}

 		var pdf_points = new Array();
		for(var i=0; i<mesh+1;i++) {
			pdf_points.push(num_variates*bin_width*distribution.f(mesh_grid.points[i]));
		}

		if(chart.series.length==1) {
			chart.addSeries({
                data: pdf_points,
                yAxis: 0,
                type: 'spline',
                showInLegend: false,
                marker: {enabled: false},
                pointStart: mesh_grid.min,
                pointInterval: mesh_grid.width
            });
		} else if(chart.series.length==2) {
			chart.series[1].setData(pdf_points,true);
		}
	},

	maximumLikelihood: function(values, distribution) {
		var mle = distribution.maximumLikelihood(values);
		return mle;
	},

	/*
	 * @TODO (#7) Use different binning method
	 *
	 * Helper method to calculate the width and number of bins that will
	 * be used in the Histogram plot. Also, provides the count of values
	 * that occur within each bin.
	 *
	 */
	_createBins: function(orig_values,num_bins) {
		var values = orig_values.slice(0);
		values.sort(function(a,b){return a-b});
		
		// there are other, more sophisticated ways of computing the number of bins
		// maybe some day I'll add one
		num_bins = num_bins || Math.floor(Math.sqrt(values.length));

		var bin_width = (values[values.length-1]-values[0])/num_bins;
		var bin_counts = new Array();
		var bin_limits = new Array();
		var bin_max = values[0]+bin_width;
		var bin_current = 0;

		bin_counts[0] = 0;
		bin_limits[0] = "[" + values[0].toFixed(3) + ", " + bin_max.toFixed(3) + ")";

		for(var i=0; i<values.length;i++) {
			if(values[i]>=bin_max) {
				bin_current++;
				bin_counts[bin_current] = 0;
				bin_limits[bin_current] = "[" + bin_max.toFixed(3) + ", ";
				bin_max += bin_width;
				bin_limits[bin_current] += bin_max.toFixed(3) + ")";
			}
			bin_counts[bin_current]++;
		}

		bins = {
			counts: bin_counts,
			limits: bin_limits,
			min: values[0],
			max: values[values.length-1],
			width: bin_width
		}

		return bins;
	}
}

/*
 * Abstract class that is provides common functions for
 * all continuous distributions.
 *
 */
function ContinuousDistribution() {
	mean = NaN;
	stdev = NaN;

	/*
	 * Returns the mean of the distribution. Objects that have
	 * ContinuousDistribution as their prototype should ensure
	 * that they calculate their own mean, and store it.
	 *
	 */
	this.getMean = function() {return mean;}

	/*
	 * Returns the standard deviation of the distribution. Objects that have
	 * ContinuousDistribution as their prototype should ensure
	 * that they calculate their own standard deviation, and store it.
	 *
	 */
	this.getStDev = function() {return stdev;}

	/*
	 * Returns a random number, distributed uniformly
	 * between low and high.
	 *
	 */
	this._unifRand = function(low,high) {
		return Math.random() * (high - low) + low;
	}

	/*
	 * Returns an array (of lenght num) of random variables distributed according
	 * to the type of object that has this object as its prototype.
	 *
	 */
	this.rand = function(num) {
		if(isNaN(num)) {
			console.warn("Invalid argument to rand. Number of random elements to generate must be a positive integer");
			return Math.NaN;
		}

		if(!(num>0)) {
			console.warn("Invalid argument to rand. Number of random elements to generate must be positive");
			return Math.NaN;
		}

		var rand_array = new Array();
		for(var i = 0; i < num; i++) {
			rand_array.push(this._rand());
		}
		return rand_array;
	}

	/*
	 * Returns the Pr(X<=x), according to X being distributed according to the
	 * type of object that has this object as its prototype
	 *
	 */
	this.F = function(x) {
		return this._cdf(x);
	}

	/*
	 * Returns the value of x on the probability density function.
	 *
	 */
	this.f = function(x) {
		return this._pdf(x);
	}

	/*
	 * @TODO (#11): Refactor so that _determineMesh returns the information needed to create the 
	 * mesh, but doesn't actually create the mesh.
	 *
	 */
	this.meshGrid = function(mesh) {
		return this._determineMesh(mesh);
	}

	this.maximumLikelihood = function(values) {
		return this._mle(values);
	}
}

/*
 * The Normal Distribution, which inherits from the ContinuousDistribution.
 *
 */
function NormalDistribution(mu,sigma) {
	if(sigma <= 0) {
		throw "Invalid argument to NormalDistribution. sigma must be greater than 0";
	}

	ContinuousDistribution.call(this);
	mean = mu || 0;
	stdev = sigma || 1;
	
	this._rand = function() {
		var u = this._unifRand(0,1);
		var v = this._unifRand(0,1);

		return (Math.sqrt(-2 * Math.log(u)) * Math.cos(2*v*Math.PI)) * stdev + mean;
	}

	this.toString = function() {
		return "Normal (" + mean.toFixed(2) + "," + stdev.toFixed(2) + ")";
	}

	this._determineMesh = function(mesh_grain) {
		min = mean-5*stdev;
		max = mean+5*stdev;

		var mesh_increment = (max-min)/mesh_grain;
		var mesh_points = new Array();

		for(var i=0; i<=mesh_grain; i++) {
			mesh_points.push(min+mesh_increment*i);
		}

		var mesh = {
			min: min,
			max: max,
			points: mesh_points,
			width: mesh_increment
		};

		return mesh;
	}

	/*
	 * Uses the numerical approximation to the Normal Distributions CDF that is stated in
	 * Johnson, Kotz and Balakrishnan (1994), Continuous univariate distributions, John Wiley and Sons
	 */
	this._cdf = function(x) {
		x = (x-mu) / stdev;

		// From Johnson, Kotz and Balakrishnan (1994), Continuous univariate distributions, John Wiley and Sons
		var y = 0.7988*x*(1+0.04417*x*x);
		return Math.exp(2*y) / (1+Math.exp(2*y));
	}

	this._pdf = function(x) {
		var scale = 1/(Math.sqrt(2*Math.PI)*stdev);
		var exponent = -1*((x-mean)*(x-mean))/(2*stdev*stdev);
		return scale*Math.exp(exponent);
	}
}
NormalDistribution.prototype = new ContinuousDistribution();
NormalDistribution.prototype.constructor = NormalDistribution;

/*
 * The Exponential Distribution, with rate parameter lambda.
 *
 */
function ExponentialDistribution(lambda) {
	ContinuousDistribution.call(this);

	if(isNaN(lambda) || lambda <= 0) {
		console.warn("Invalid argument to ExponentialDistribution. lambda must be a number greater than 0");
		return Number.NaN;
	}

	stdev = mean = 1/lambda || 1;

	this._rand = function() {
		var u = this._unifRand(0,1);
		return (-1*Math.log(u))/lambda;
	}

	this.toString = function() {
		return "Exp (" + lambda.toFixed(2) + ")";
	}

	this._cdf = function(x) {
		return MathExt.H(x)*(1-Math.exp(-1*lambda*x));
	}
	
	this._pdf = function(x) {
		return lambda*Math.exp(-1*lambda*x);
	}

	this._determineMesh = function(mesh_grain) {
		min = 0;
		max = -1*Math.log(1-.995)/lambda;

		var mesh_increment = (max-min)/mesh_grain;
		var mesh_points = new Array();

		for(var i=0; i<=mesh_grain; i++) {
			mesh_points.push(min+mesh_increment*i);
		}

		var mesh = {
			min: min,
			max: max,
			points: mesh_points,
			width: mesh_increment
		};

		return mesh;
	}

	this._mle = function(values) {
		var mle = new Object();
		var sum = 0;

		for(var i=0; i<values.length; i++) {
			sum += values[i];
		}

		var average = sum/values.length;

		mle.lambda = 1/average;

		return mle;
	}
}
ExponentialDistribution.prototype = new ContinuousDistribution();
ExponentialDistribution.prototype.constructor = ExponentialDistribution;

/*
 * The Uniform Distribution, with low and high values. 
 *
 */
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
		return this._unifRand(low,high);
	}

	this.toString = function() {
		return "Unif (" + low.toFixed(2) + "," + high.toFixed(2) + ")";
	}

	this._cdf = function(x) {
		if(x < low) return 0;
		if(x > high) return 1;
		return (x-low)/(high-low);
	}

	this._pdf = function(x) {
		if(x < low) return 0;
		if(x > high) return 0;
		return 1/(high-low);
	}

	this._determineMesh = function(mesh_grain) {
		min = low;
		max = high;
		var mesh_increment = (max-min)/mesh_grain;
		var mesh_points = new Array();

		for(var i=0; i<=mesh_grain; i++) {
			mesh_points.push(min+mesh_increment*i);
		}

		var mesh = {
			min: min,
			max: max,
			points: mesh_points,
			width: mesh_increment
		};

		return mesh;
	}
}
UniformDistribution.prototype = new ContinuousDistribution();
UniformDistribution.prototype.constructor = UniformDistribution;

/*
 * The Gamma distribution. Far from being done.
 *
 */
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