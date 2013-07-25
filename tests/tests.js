test("Normal Distribution Instantiation", function() {
	// Standard Normal Distribution
	var stdNormal = new NormalDistribution();
	equal(stdNormal.getMean(),0, "Standard normal mean should be 0.");
	equal(stdNormal.getStDev(),1, "Standard normal standard deviation should be 1.");

	// Normal Distribution with mean 500 and standard deviation 100
	var norm_500_100 = new NormalDistribution(500,100);
	equal(norm_500_100.getMean(),500, "Normal distribution should have mean 500.");
	equal(norm_500_100.getStDev(),100, "Normal distribution should have standard deviation 100.");

	// Negative (and thus, disallowed) standard deviation
	throws(function() {new NormalDistribution(0,-10)},"Should be prevented from creating a normal distribution with negative standard deviation.");
});