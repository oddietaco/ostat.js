window.tol = function(actual, expected, message) {
		var tolerance = 0.0000001;
		var abs_diff = Math.abs(actual-expected);
		ok(abs_diff <= tolerance, message);
	};

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

test("Exponential Distribution Descriptive Stats", function() {

	// R Commands
	// > rands <- rexp(100,.5)
	// > for(i in 1:length(rands)) {cat(rands[i], ",")}
	// > fitdistr(rands,"exponential")
	var rands = [0.6826029 ,4.851462 ,2.923894 ,0.8253414 ,1.145603 ,1.463468 ,0.3749753 ,3.185948 ,2.327179 ,0.1337683 ,1.099512 ,0.8608593 ,0.779929 ,1.029487 ,3.513356 ,0.6074396 ,3.140017 ,1.140745 ,0.2306563 ,0.6587571 ,4.561497 ,2.04843 ,1.714343 ,3.770192 ,0.9271507 ,1.779728 ,0.430275 ,2.291385 ,1.277593 ,0.5209718 ,0.2628673 ,2.560594 ,5.296953 ,0.690803 ,5.414503 ,3.126599 ,1.324221 ,2.253222 ,2.447557 ,1.697357 ,3.675029 ,4.396744 ,5.243502 ,0.1880432 ,0.2655642 ,1.334174 ,0.928784 ,1.668321 ,0.9924181 ,0.07603756 ,4.979164 ,1.114874 ,0.4879683 ,0.9651583 ,0.3448556 ,0.975693 ,0.7905966 ,1.439678 ,0.7664074 ,2.98376 ,2.845267 ,0.6024091 ,0.2390166 ,5.498525 ,0.9035152 ,0.5973803 ,3.493268 ,0.8641984 ,1.82969 ,2.063291 ,3.222098 ,2.491687 ,9.120368 ,5.99006 ,1.168568 ,0.1177448 ,0.877725 ,1.124252 ,0.3063589 ,3.155881 ,4.407541 ,2.185936 ,2.816697 ,0.9555011 ,0.3982227 ,1.303772 ,6.40398 ,0.1452653 ,6.77525 ,0.1132908 ,0.1894909 ,0.1891689 ,1.313566 ,5.312773 ,0.2008684 ,0.7440731 ,1.313463 ,2.316833 ,0.5093899 ,2.123983];
	var mle_lambda_from_r = 0.51224684;
	var mle_lambda_st_dev_from_r = 0.05122468;

	var mle = DescriptiveStatistics.maximumLikelihood(rands,new ExponentialDistribution(.5));
	tol(mle.lambda, mle_lambda_from_r, "Exponential distribution maximum likelihood should have rate value of " + mle_lambda_from_r);
	tol(mle.stdev, mle_lambda_st_dev_from_r, "Exponential distribution maximum likelihood should have rate value standard deviation of " + mle_lambda_st_dev_from_r);

	// R Commands
	// > rands <- rexp(116,.37)
	// > for(i in 1:length(rands)) {cat(rands[i], ",")}
	// > fitdistr(rands,"exponential")
	rands = [2.083583 ,6.358584 ,1.467783 ,0.4806505 ,1.691876 ,0.4413309 ,1.77653 ,2.47121 ,1.55254 ,3.743019 ,0.8027445 ,1.792803 ,5.439263 ,0.6325518 ,5.308442 ,1.861176 ,1.955115 ,4.547441 ,1.463712 ,5.2673 ,1.011542 ,6.95529 ,2.026804 ,0.9632583 ,1.002323 ,0.294426 ,3.108193 ,1.000391 ,6.092169 ,3.354813 ,0.9641393 ,0.7430641 ,6.449511 ,0.370243 ,9.618335 ,1.27573 ,0.8451992 ,0.5680519 ,1.895926 ,2.961121 ,0.5073284 ,2.345551 ,1.590091 ,1.039575 ,1.263931 ,0.6078513 ,1.546906 ,0.9490575 ,2.002822 ,2.407713 ,2.578932 ,4.200249 ,4.589321 ,0.008934308 ,5.41665 ,0.1282657 ,0.9737367 ,0.05593908 ,0.5934674 ,2.13651 ,4.370024 ,0.6628496 ,0.007492762 ,0.3428009 ,1.26552 ,10.7806 ,1.265776 ,1.047675 ,3.221055 ,4.204252 ,1.066893 ,0.1570542 ,0.7268224 ,0.2500824 ,0.7666561 ,2.913253 ,3.722502 ,2.772791 ,2.282779 ,5.351358 ,0.8379678 ,0.04184181 ,3.483476 ,1.463938 ,8.446082 ,2.884937 ,0.9806624 ,0.7135861 ,7.394993 ,1.441367 ,4.609682 ,0.2994946 ,5.690024 ,0.03538254 ,0.1735651 ,1.241145 ,0.3185126 ,4.296669 ,3.053297 ,0.8581914 ,4.75537 ,3.594031 ,2.777285 ,2.29066 ,5.141947 ,1.784508 ,0.2940309 ,0.01672115 ,5.322276 ,4.182865 ,4.480796 ,1.405188 ,1.948311 ,0.7109037 ,3.513033 ,1.887948];
	mle_lambda_from_r = 0.41857622;
	mle_lambda_st_dev_from_r = 0.03886383;
	mle = DescriptiveStatistics.maximumLikelihood(rands,new ExponentialDistribution(.5));
	tol(mle.lambda, mle_lambda_from_r, "Exponential distribution maximum likelihood should have rate value of " + mle_lambda_from_r);
	tol(mle.stdev, mle_lambda_st_dev_from_r, "Exponential distribution maximum likelihood should have rate value standard deviation of " + mle_lambda_st_dev_from_r);

	// R Commands
	// >  rands <- rexp(1312,2.1)
	// > for(i in 1:length(rands)) {cat(rands[i], ",")}
	// > fitdistr(rands,"exponential")
	rands = [0.4159172 ,0.693315 ,0.3752267 ,0.06977002 ,0.3855972 ,0.0847903 ,0.3173316 ,0.1946505 ,0.3726057 ,0.477924 ,0.1995713 ,0.06485627 ,0.8666971 ,0.121024 ,0.05697398 ,0.1873639 ,0.03498512 ,0.5981265 ,0.04624259 ,0.5144538 ,0.06828715 ,0.7443774 ,0.04372514 ,0.8859952 ,1.021214 ,0.04076608 ,0.2350031 ,0.6933665 ,0.2057152 ,2.161434 ,0.6680046 ,0.1923235 ,1.452055 ,0.5084128 ,0.5436328 ,1.580765 ,0.1158798 ,1.614039 ,0.2712434 ,0.3945215 ,0.02899189 ,0.6780325 ,0.4068497 ,1.368397 ,0.3473595 ,0.00638453 ,0.1213179 ,0.2765062 ,0.08292507 ,0.05494325 ,0.2284723 ,0.142799 ,0.3581424 ,0.3807209 ,0.3439563 ,0.7649364 ,0.02882898 ,0.4266877 ,0.6313317 ,0.1172918 ,0.451788 ,0.2800392 ,0.2872211 ,0.5710431 ,0.4835006 ,0.1315994 ,0.07299047 ,0.106839 ,0.1395838 ,0.4059091 ,0.09465604 ,0.2534682 ,0.8422524 ,0.3627606 ,0.2651601 ,0.5770131 ,0.6744605 ,0.1366911 ,1.420319 ,0.1541117 ,0.5724436 ,0.2336956 ,2.513091 ,0.2267966 ,1.138565 ,0.1144193 ,0.05831382 ,1.322716 ,1.802515 ,0.4795425 ,0.4685907 ,0.1436225 ,0.1333327 ,0.01424658 ,1.076082 ,0.345005 ,0.1839548 ,1.523633 ,0.3895653 ,2.150952 ,0.3362064 ,0.8287012 ,0.7229135 ,0.2916399 ,0.4231797 ,0.3761433 ,0.5170985 ,0.2819013 ,0.56044 ,0.4970705 ,0.3851045 ,0.2582408 ,0.1791087 ,0.2141084 ,0.2047208 ,0.01450183 ,1.267255 ,0.1013001 ,0.5566823 ,0.537737 ,1.118472 ,1.148622 ,1.252319 ,0.02002604 ,0.1227005 ,0.3451905 ,0.4929953 ,1.21576 ,0.6135928 ,1.406679 ,0.2190482 ,0.1353235 ,0.193271 ,0.7281684 ,0.9418539 ,0.2170213 ,0.9483717 ,0.752031 ,0.1040905 ,0.1221899 ,0.03675851 ,0.3307247 ,0.06162192 ,0.09423964 ,1.683426 ,0.7975797 ,0.04041944 ,0.03047427 ,2.870734 ,1.147975 ,0.07906197 ,0.1580979 ,0.2507498 ,0.1627003 ,0.4254472 ,1.239713 ,0.2537927 ,0.2917179 ,0.4783821 ,0.04960488 ,0.6386137 ,0.2141525 ,0.6895563 ,0.7131528 ,0.01145527 ,1.360511 ,1.405867 ,0.1626924 ,0.2817137 ,0.4578935 ,0.4101496 ,0.6157429 ,1.086385 ,0.1218462 ,3.327959 ,0.06795593 ,1.544377 ,0.6832422 ,0.4634019 ,1.227699 ,0.03979612 ,0.8898983 ,0.2819306 ,0.408656 ,0.02490932 ,0.1555264 ,0.4134142 ,0.06466426 ,0.3076865 ,0.9510103 ,0.3024111 ,0.4763021 ,0.2496007 ,1.217656 ,0.4282362 ,0.1512941 ,0.1559483 ,0.1558674 ,0.4034798 ,0.238411 ,0.1975271 ,0.351817 ,1.854893 ,0.3259489 ,1.576306 ,0.0005289898 ,0.006491957 ,0.8310835 ,0.828937 ,0.6073897 ,0.6980365 ,1.054728 ,0.06843932 ,0.8331581 ,0.2635247 ,0.3659237 ,0.2070788 ,0.7615317 ,0.09670785 ,0.2564739 ,2.673071 ,0.3655528 ,0.2959295 ,0.6455911 ,0.5044792 ,0.2429674 ,0.4288092 ,0.09962805 ,0.7251604 ,1.502484 ,0.2916506 ,0.5891004 ,0.6676774 ,0.3075251 ,0.1501055 ,1.244495 ,0.02192938 ,0.3420352 ,0.00522852 ,0.7450349 ,0.003347919 ,0.2396752 ,0.3223706 ,0.01912817 ,0.3529562 ,0.5680792 ,0.05257128 ,0.2944988 ,0.2667214 ,0.1077812 ,0.9062971 ,1.339302 ,0.2695214 ,0.4436896 ,0.2177175 ,0.04392821 ,0.117345 ,0.268745 ,1.262072 ,0.04753242 ,0.4517258 ,1.076313 ,1.521245 ,0.1523582 ,3.689424 ,0.1178361 ,0.2756927 ,1.52063 ,0.8718289 ,0.1753467 ,0.03565605 ,0.3129945 ,0.1297105 ,0.2834777 ,0.415782 ,0.1066879 ,0.8135831 ,0.1233264 ,0.6615755 ,0.26881 ,0.1087852 ,0.07635915 ,0.04155689 ,0.2984071 ,0.2554333 ,0.4117264 ,0.04232407 ,0.5678742 ,0.9377404 ,0.1474801 ,0.3220689 ,0.6209553 ,0.3221755 ,0.5329046 ,0.5764735 ,0.286786 ,0.5226098 ,1.94051 ,0.4559353 ,0.6172485 ,0.1638833 ,0.06755732 ,0.4374742 ,0.9842386 ,0.7323991 ,0.0331415 ,0.4521257 ,0.5440703 ,0.03604076 ,0.778512 ,1.395777 ,0.3427873 ,0.1207921 ,0.376161 ,0.001473945 ,0.8722475 ,0.136073 ,0.254402 ,0.06616234 ,1.087867 ,0.06773697 ,0.821534 ,0.07937167 ,0.1295753 ,0.1794051 ,0.2974712 ,0.4696397 ,1.043024 ,1.200103 ,0.2377293 ,0.1952594 ,0.3742539 ,0.1377561 ,0.1740802 ,0.3982798 ,0.9391584 ,1.13407 ,1.007483 ,0.1116761 ,0.8441278 ,0.7143185 ,0.09840197 ,0.05082719 ,0.0432316 ,0.1386651 ,0.00682797 ,0.1181068 ,0.797493 ,0.7875074 ,0.1026863 ,0.07468528 ,0.2741448 ,0.4713773 ,0.1624497 ,0.1640031 ,0.2596401 ,0.05220525 ,0.6703667 ,0.06152655 ,0.1913252 ,0.3384778 ,0.2828453 ,0.4833483 ,0.9707068 ,0.1786317 ,0.04354893 ,2.14837 ,0.1452894 ,0.3730493 ,0.5599537 ,0.3663183 ,1.421232 ,0.6446531 ,1.127088 ,0.8756449 ,0.0350377 ,0.09236093 ,0.09947922 ,0.7282608 ,0.4113985 ,1.127801 ,0.2546431 ,0.1068371 ,1.075942 ,0.5787484 ,0.7911712 ,0.6933877 ,0.1230069 ,0.1534213 ,0.3792622 ,0.0250298 ,0.2103253 ,0.05566281 ,0.01709109 ,0.3277877 ,1.262145 ,0.5073762 ,1.020113 ,0.1846079 ,0.2979222 ,0.6538383 ,0.1066069 ,0.6002099 ,0.1791279 ,0.1848589 ,0.532109 ,0.1414708 ,0.04058641 ,0.4998404 ,0.05304628 ,0.3676279 ,0.4955372 ,0.3497608 ,0.7077948 ,0.09609871 ,0.5904297 ,0.772749 ,0.07419367 ,1.146844 ,0.5070741 ,0.7843304 ,0.5940719 ,0.319163 ,0.8026256 ,0.0006307726 ,0.4237441 ,0.3411235 ,0.05397891 ,0.03758209 ,0.7430989 ,1.446101 ,0.283576 ,1.049052 ,0.06188117 ,0.001834635 ,0.8416652 ,0.0298573 ,0.1396531 ,0.3506719 ,0.2659132 ,0.4264959 ,0.4871296 ,0.01130655 ,0.1253749 ,2.615334 ,1.866515 ,0.07137858 ,0.2635008 ,0.5582447 ,0.4913591 ,0.2252099 ,0.6459663 ,0.4834394 ,1.994516 ,0.810248 ,0.05979738 ,1.19645 ,0.3120037 ,0.5681432 ,0.1775589 ,0.2780599 ,1.116348 ,0.02985059 ,0.9190907 ,0.2570362 ,0.009476948 ,0.4141452 ,0.401083 ,0.02293114 ,0.03320673 ,0.9436016 ,0.02843223 ,0.1946911 ,0.9717266 ,0.2249004 ,0.1124944 ,0.8626183 ,1.081069 ,1.105356 ,0.3921643 ,0.6936027 ,1.057907 ,0.4106191 ,0.03759714 ,0.1566943 ,0.1423679 ,1.499482 ,0.9923834 ,0.2739219 ,0.3510316 ,1.185011 ,0.1275384 ,0.6416195 ,0.7641682 ,1.355644 ,0.3862454 ,0.5226352 ,0.2834466 ,0.8382705 ,0.756182 ,0.2712532 ,0.1780659 ,0.1492704 ,0.1029171 ,0.03798991 ,0.07138371 ,0.7046563 ,0.8037695 ,0.794617 ,0.6828276 ,0.05668674 ,0.3064276 ,0.2524915 ,0.9632903 ,0.05491585 ,0.05846981 ,1.15238 ,0.5546436 ,0.8216239 ,0.01801394 ,0.5509751 ,0.1402148 ,0.2183907 ,0.006973787 ,0.1432537 ,0.51631 ,0.1966939 ,0.1373737 ,0.2321023 ,1.020301 ,0.05845761 ,0.7542805 ,0.6477698 ,0.8410338 ,0.2082091 ,0.5140566 ,0.04629569 ,0.3008892 ,0.08069372 ,1.037134 ,0.08136529 ,0.1083752 ,1.184755 ,1.141158 ,0.7741751 ,0.2519739 ,1.071532 ,0.1396 ,0.002560658 ,0.03721566 ,0.02944051 ,0.3438141 ,0.5221122 ,1.944058 ,0.9516968 ,0.9123833 ,0.08303649 ,0.02152386 ,0.129019 ,0.2312539 ,0.1751832 ,0.7334078 ,0.02608107 ,0.656352 ,0.1760515 ,0.3797472 ,0.08860437 ,1.163352 ,0.9878802 ,0.6217503 ,0.394639 ,0.05276773 ,0.3248607 ,0.1004382 ,0.04948333 ,0.1371366 ,0.6492106 ,0.7245555 ,0.3208756 ,0.0003049098 ,0.1757947 ,0.03071715 ,0.3268001 ,0.4291654 ,0.000388845 ,0.00285339 ,0.09968469 ,0.1466032 ,1.153985 ,0.4041272 ,0.8487116 ,0.5742039 ,0.356877 ,0.6248646 ,0.2804354 ,0.4622597 ,0.9653308 ,0.284326 ,0.7855415 ,1.087819 ,0.128027 ,1.224789 ,0.2749011 ,0.3119293 ,0.231065 ,0.08407615 ,0.8833871 ,1.038901 ,0.01628803 ,0.5195173 ,1.228115 ,0.1387522 ,0.03652808 ,0.6945258 ,0.4235508 ,0.8520098 ,1.464171 ,2.194744 ,0.1920197 ,0.2075141 ,0.2120897 ,0.5220381 ,0.415887 ,1.581849 ,0.01895019 ,0.05492295 ,0.2883185 ,0.5859068 ,0.8208569 ,0.2044374 ,0.1150423 ,1.889019 ,0.7529414 ,0.2312443 ,0.3099145 ,0.9834251 ,0.2110346 ,0.4750731 ,0.1356033 ,0.3192765 ,0.4983378 ,0.04154581 ,0.01193868 ,1.558564 ,1.71176 ,0.1738408 ,0.3734873 ,0.0524219 ,0.4219808 ,0.6946133 ,0.04730468 ,0.8446683 ,0.5684723 ,0.2597614 ,0.2863027 ,0.1193761 ,1.170861 ,0.1195743 ,0.5132755 ,0.05510325 ,0.03430766 ,0.2562829 ,0.03973232 ,2.155694 ,0.1536317 ,0.01296117 ,1.199555 ,0.9717869 ,0.4894547 ,0.1352414 ,0.2425357 ,0.08739609 ,1.203908 ,0.2763748 ,0.1442588 ,0.1222938 ,0.1061382 ,0.594008 ,0.1481526 ,0.336799 ,1.076891 ,1.018415 ,1.51633 ,0.2516307 ,0.6033583 ,0.5812044 ,1.678119 ,0.6819124 ,0.7469251 ,0.4731142 ,0.51753 ,0.068183 ,0.4480933 ,0.2465472 ,0.02720341 ,0.02693061 ,0.1319935 ,0.3499694 ,0.598058 ,0.1209404 ,0.02072846 ,0.1840395 ,0.3007262 ,0.0754222 ,0.01663538 ,0.9118691 ,1.547559 ,0.4267179 ,0.3377035 ,0.4943623 ,0.1210428 ,0.1744703 ,0.01566457 ,0.1821089 ,0.1298923 ,1.618308 ,0.2514079 ,0.9163328 ,0.07293394 ,0.02839419 ,0.0451185 ,0.05419463 ,0.1727248 ,0.614312 ,0.9841459 ,0.8917979 ,0.3796891 ,0.2967544 ,0.14976 ,0.5462994 ,0.943982 ,1.431356 ,0.416476 ,0.2659896 ,2.541357 ,0.3887664 ,0.1689746 ,0.3665396 ,0.8917491 ,0.8732536 ,0.01006154 ,0.07155942 ,0.2744522 ,0.148332 ,0.1101463 ,1.157506 ,0.2631719 ,0.4809855 ,0.6351227 ,0.2034173 ,0.2325945 ,0.01359949 ,0.3781126 ,1.030601 ,1.143837 ,0.24942 ,0.2777799 ,0.9748871 ,0.1001208 ,0.2125304 ,1.307773 ,0.006995888 ,0.7658679 ,0.5191946 ,0.3859912 ,0.4778182 ,0.199477 ,0.9820989 ,0.5365739 ,0.8301046 ,0.1515028 ,0.5538987 ,0.880051 ,0.1018731 ,0.02234211 ,0.4408415 ,0.2277202 ,0.08576029 ,0.0518965 ,0.01309913 ,0.1344289 ,0.1293405 ,0.2504049 ,0.5341117 ,0.3611293 ,0.2724792 ,1.400417 ,0.736888 ,0.01772389 ,0.4561964 ,0.2562293 ,0.1366716 ,0.03389697 ,0.1279528 ,0.2932466 ,0.3343553 ,0.7542841 ,0.1166031 ,0.0865573 ,0.1418472 ,0.7836697 ,0.04188165 ,0.1298669 ,0.01502155 ,0.7927643 ,0.6716235 ,0.2755064 ,0.05863961 ,0.1594621 ,0.1750668 ,0.01176002 ,0.7798527 ,0.7432324 ,0.4190123 ,0.05503965 ,0.2256128 ,0.2527236 ,0.2887825 ,0.3546545 ,0.3154806 ,0.2327539 ,0.7159528 ,0.002627493 ,0.431084 ,0.3604159 ,0.434568 ,0.37239 ,0.5359988 ,0.080517 ,0.04360072 ,0.2286582 ,0.1843954 ,1.248772 ,0.5288783 ,0.146344 ,0.8863501 ,0.05848293 ,0.2246528 ,0.4524251 ,0.3605131 ,0.2927016 ,0.2910405 ,1.882169 ,0.5536382 ,1.072132 ,1.335965 ,1.013674 ,0.3246816 ,0.2591815 ,0.2269876 ,0.8977804 ,0.0001573055 ,0.03289595 ,0.6058331 ,0.1580241 ,0.05194734 ,1.08696 ,0.006526264 ,0.1302317 ,1.321268 ,1.092122 ,1.011731 ,0.51304 ,0.1881386 ,0.1381141 ,0.2908493 ,0.08179615 ,0.5321853 ,0.001246711 ,0.3125024 ,0.004126188 ,0.5073738 ,0.05297616 ,0.444984 ,0.3975387 ,0.4989636 ,0.1393758 ,0.112716 ,1.538806 ,0.0240045 ,0.5535764 ,0.1097153 ,0.5341165 ,3.196851 ,0.2830451 ,0.08179816 ,0.9651541 ,0.64864 ,0.9410471 ,0.0305612 ,0.2696026 ,0.461396 ,0.1972321 ,0.4297097 ,0.528989 ,0.8812709 ,0.08628576 ,0.1419409 ,0.0391994 ,0.05469449 ,1.578486 ,0.2671954 ,0.2176271 ,0.1392255 ,1.986816 ,0.2142553 ,0.201075 ,0.06318979 ,0.1091771 ,0.5790996 ,0.09150802 ,1.76805 ,0.1798426 ,0.009803908 ,0.2937135 ,0.002938264 ,0.9512964 ,0.007755516 ,1.14141 ,0.9606937 ,0.08593106 ,0.5258268 ,1.249839 ,0.1610677 ,0.9361137 ,3.568728 ,0.6127669 ,0.4315574 ,0.1276812 ,0.04768678 ,0.06500908 ,0.1186655 ,0.1979123 ,0.0804942 ,0.1799078 ,0.2697041 ,0.121993 ,0.8164369 ,0.563183 ,0.551621 ,0.1339309 ,0.2467581 ,0.1529292 ,0.5860482 ,0.9612647 ,0.08002506 ,0.1203415 ,0.03413327 ,0.5268701 ,0.4525603 ,0.4908299 ,1.397357 ,0.1320978 ,1.241671 ,0.08300141 ,0.4005645 ,0.3580319 ,0.01567126 ,0.1567399 ,0.01888396 ,1.788252 ,0.8297228 ,0.2626593 ,0.9586582 ,0.4950215 ,0.3351994 ,0.6483473 ,0.6028034 ,0.1361193 ,0.3051569 ,0.1455064 ,0.7293194 ,0.1046951 ,0.4010606 ,0.4788064 ,0.6536579 ,0.9443498 ,0.07340168 ,0.1996234 ,0.01776909 ,0.06775281 ,0.2940998 ,0.005678082 ,0.6232291 ,0.5116926 ,0.5998835 ,1.712726 ,0.4627092 ,0.7596812 ,0.2457112 ,0.110999 ,1.229988 ,0.06988495 ,0.08789319 ,0.05875651 ,0.304434 ,0.849808 ,0.07870991 ,0.00709929 ,0.198932 ,0.2438975 ,1.093344 ,0.3674338 ,0.6057952 ,0.9098001 ,0.1086038 ,1.57085 ,0.03796434 ,2.537983 ,0.2120892 ,0.6706147 ,0.4272676 ,0.3666838 ,2.231796 ,1.441938 ,0.08726485 ,0.3994121 ,0.9766126 ,0.1705241 ,0.8484521 ,0.4778542 ,0.5819857 ,0.678273 ,0.235143 ,0.7762967 ,0.9868348 ,0.2239402 ,0.5398706 ,0.3055685 ,0.04437985 ,1.314133 ,0.8085181 ,0.3479222 ,0.5296731 ,0.7658916 ,1.173916 ,0.3857664 ,0.5600839 ,0.4514282 ,0.1927013 ,0.4736367 ,0.3446501 ,0.3336439 ,0.1610077 ,0.597911 ,0.5906561 ,0.7067623 ,1.037583 ,0.4096848 ,1.699481 ,0.600208 ,0.190916 ,0.9159592 ,0.2455376 ,0.1196183 ,0.01650748 ,1.654709 ,0.04052533 ,0.3514214 ,0.01033014 ,0.1108156 ,0.2811474 ,0.6923438 ,0.9886489 ,0.7578822 ,0.9842944 ,0.04450664 ,0.1115138 ,0.01958361 ,0.1908854 ,0.3469111 ,1.508418 ,1.962492 ,0.7430338 ,1.156839 ,0.7859584 ,0.4536649 ,0.04152199 ,0.6198989 ,0.157666 ,1.29151 ,0.004656008 ,0.3932139 ,0.4695487 ,0.4863062 ,0.01045827 ,0.1748729 ,0.3254919 ,0.03889952 ,0.04545388 ,0.009601134 ,1.140023 ,1.408729 ,0.03786609 ,1.116539 ,0.3745951 ,0.3776882 ,0.00884937 ,0.831634 ,0.4459373 ,0.09907424 ,0.3003985 ,1.061925 ,1.351139 ,0.3934798 ,1.046024 ,0.1039796 ,1.228901 ,1.292334 ,0.1319476 ,0.2540241 ,2.021977 ,1.166705 ,0.2692055 ,0.1683577 ,0.1816541 ,0.6073582 ,0.1716002 ,0.7187841 ,0.5898981 ,0.1583639 ,0.6562142 ,0.03592317 ,0.7257493 ,0.03840432 ,0.4115912 ,1.198234 ,0.27666 ,0.1831817 ,1.156531 ,0.02339059 ,0.3317988 ,0.2933394 ,0.01076169 ,0.5118327 ,1.231588 ,0.1471477 ,0.2937347 ,0.002065355 ,0.6695621 ,0.02386963 ,0.2532358 ,0.09065149 ,0.05907362 ,0.05107932 ,0.1648442 ,0.02795919 ,0.1740433 ,0.06466554 ,0.1032129 ,0.4950276 ,0.701688 ,0.6686589 ,0.2732245 ,0.2523266 ,0.3183132 ,0.07324283 ,1.470492 ,0.8619073 ,0.006347513 ,0.3386562 ,0.7831508 ,0.5571802 ,0.4183511 ,0.02131067 ,0.1464144 ,0.3225132 ,0.2738235 ,0.7118424 ,1.685862 ,0.4877538 ,1.73916 ,0.0166716 ,0.7122265 ,0.8970532 ,0.2322028 ,0.09701896 ,0.38645 ,0.08207018 ,0.4485573 ,0.4484543 ,0.01718974 ,0.4080195 ,0.1166884 ,0.04172198 ,0.5317697 ,0.8907441 ,0.9257224 ,1.099224 ,0.9486963 ,0.5800912 ,0.03032736 ,0.09756288 ,0.220445 ,0.1445912 ,0.02288913 ,0.241966 ,0.3270033 ,0.2074932 ,0.141216 ,1.907836 ,0.3725421 ,0.1401649 ,0.07806698 ,0.3706557 ,0.2634609 ,0.5542842 ,0.9198107 ,0.8795636 ,0.4294022 ,1.084827 ,0.7481704 ,0.2545705 ,0.2184232 ,0.4027525 ,0.003376035 ,0.3382223 ,0.8952292 ,0.1250428 ,0.3115959 ,0.3656766 ,1.915492 ,0.5098696 ,1.489735 ,0.1826057 ,0.4827453 ,0.411222 ,0.1382548 ,0.2028404 ,0.5945366 ,0.2259578 ,0.01569417 ,0.1738008 ,0.02889474 ,0.0138144 ,0.4649462 ,1.582282 ,0.6211282 ,0.7963117 ,0.1139083 ,0.05518874 ,0.07557021 ,0.1887379 ,0.0345012 ,0.07423639 ,0.1673462 ,0.4011473 ,0.4583791 ,0.7149856 ,0.06128026 ,0.4144007 ,0.1149662 ,0.1673806 ,0.7903057 ,0.1477714 ,0.081382 ,0.2305679 ,0.1107872 ,0.7530252 ,0.21928 ,0.9218398 ,0.04366172 ,0.3098954 ,0.3274484 ,0.2184897 ,1.121494 ,2.50302 ,1.142102 ,0.2181799 ,1.041878 ,0.7048792 ,0.4630718 ,1.893198 ,0.3771342 ,0.03253186 ,0.7188016 ,0.2223994 ,0.5434867 ,0.07723455 ,0.292371 ,0.03052476 ,0.3356441 ,0.3570426 ,0.6285654 ,0.1321965 ,0.6096205 ,0.2778223 ,0.1823035 ,0.3837659 ,0.7531573 ,0.1634537 ,0.4239298 ,0.2875053 ,0.007151611 ,0.001576802 ,0.05879116 ,1.015238 ,0.510108 ,0.05700383 ,0.2440343 ,0.2010949 ,0.2410221 ,0.0668103 ,1.136437 ,0.4348245 ,0.07823367 ,0.2926936 ,0.0265905 ,0.8245082 ,0.1181317 ,0.5877087 ,0.2559806];
	mle_lambda_from_r = 2.07018467;
	mle_lambda_st_dev_from_r = 0.05715341;
	mle = DescriptiveStatistics.maximumLikelihood(rands,new ExponentialDistribution(.5));
	tol(mle.lambda, mle_lambda_from_r, "Exponential distribution maximum likelihood should have rate value of " + mle_lambda_from_r);
	tol(mle.stdev, mle_lambda_st_dev_from_r, "Exponential distribution maximum likelihood should have rate value standard deviation of " + mle_lambda_st_dev_from_r);
});