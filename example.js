<!DOCTYPE html>
<html>
<head>
  <script>
	
	function ContinuousDistribution() {
		mean = NaN;
		stdev = NaN;

		 // returns the mean
		this.getMean = function() {return mean;}
		
		// returns the standard deviation
		this.getStDev = function() {return stdev;}

		//
		this.unifRand = function(low,high) {
			return Math.random() * (high - low) + low;
		}
	
	}

	function NormalDistribution(mu,sigma) {

		ContinuousDistribution.call(this);

		mean = mu || 0;
		stdev = sigma || 1;
		
		// returns a random number distributed Normal(mean,stdev)
		this.rand = function() {
			// uses the Box-Muller methodd
			var u = this.unifRand(0,1);
			var v = this.unifRand(0,1);

			return (Math.sqrt(-2 * Math.log(u)) * Math.cos(2*v*Math.PI)) * stdev + mean;
		}

		this.toString = function() {
			return "Normal (" + mean.toFixed(2) + "," + stdev.toFixed(2) + ")";
		}
	}

	NormalDistribution.prototype = new ContinuousDistribution();
	NormalDistribution.prototype.constructor = NormalDistribution;

	function ExponentialDistribution(lambda) {
		stdev = mean = 1/lambda || 1;

		this.rand = function() {
			var u = this.unifRand(0,1);
			return (-1*Math.log(u)) / lambda;
		}

		this.toString = function() {
			return "Exp (" + mean.toFixed(2) + ")";
		}
	}

	ExponentialDistribution.prototype = new ContinuousDistribution();
	ExponentialDistribution.prototype.constructor = ExponentialDistribution;

	</script>
</head>

<body>
</body>

</html>
