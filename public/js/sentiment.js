$(document).ready(function() {
	// var spawn = require("child_process").spawn;
	// var process = spawn('python', ['svm.py', arg1, arg2, ...]);
	// print(dataToSendBack)
	// sys.stdout.flush()

	// process.stdout.on('data', function(data) {
	// 	// Do something with the data returned from python script
	// });

	var type, index, // For graph rendering functions
		tweetData; // For Alchemy's init function
	var lastIndexGraph = 0,
		lastIndexData = 0,
		shouldShuffle = false;
	var series = [], // Array to store all scores (for graph rendering)
		dataSeries = []; // Array to store all HTML for raw data display
	var html = '',
		previousSearchText = '',
		countries = ['ABW', 'AFG', 'AGO', 'AIA', 'ALB', 'ALD', 'AND', 'ARE', 'ARG', 'ARM', 'ASM', 'ATA', 'ATC', 'ATF', 'ATG', 'AUS', 'AUT', 'AZE', 'BDI', 'BEL', 'BEN', 'BFA', 'BGD', 'BGR', 'BHR', 'BHS', 'BIH', 'BJN', 'BLM', 'BLR', 'BLZ', 'BMU', 'BOL', 'BRA', 'BRB', 'BRN', 'BTN', 'BWA', 'CAF', 'CAN', 'CHE', 'CHL', 'CHN', 'CIV', 'CLP', 'CMR', 'COD', 'COG', 'COK', 'COL', 'COM', 'CPV', 'CRI', 'CSI', 'CUB', 'CUW', 'CYM', 'CYN', 'CYP', 'CZE', 'DEU', 'DJI', 'DMA', 'DNK', 'DOM', 'DZA', 'ECU', 'EGY', 'ERI', 'ESB', 'ESP', 'EST', 'ETH', 'FIN', 'FJI', 'FLK', 'FRA', 'FRO', 'FSM', 'GAB', 'GBR', 'GEO', 'GGY', 'GHA', 'GIB', 'GIN', 'GMB', 'GNB', 'GNQ', 'GRC', 'GRD', 'GRL', 'GTM', 'GUM', 'GUY', 'HKG', 'HMD', 'HND', 'HRV', 'HTI', 'HUN', 'IDN', 'IMN', 'IND', 'IOA', 'IOT', 'IRL', 'IRN', 'IRQ', 'ISL', 'ISR', 'ITA', 'JAM', 'JEY', 'JOR', 'JPN', 'KAB', 'KAS', 'KAZ', 'KEN', 'KGZ', 'KHM', 'KIR', 'KNA', 'KOR', 'KOS', 'KWT', 'LAO', 'LBN', 'LBR', 'LBY', 'LCA', 'LIE', 'LKA', 'LSO', 'LTU', 'LUX', 'LVA', 'MAC', 'MAF', 'MAR', 'MCO', 'MDA', 'MDG', 'MDV', 'MEX', 'MHL', 'MKD', 'MLI', 'MLT', 'MMR', 'MNE', 'MNG', 'MNP', 'MOZ', 'MRT', 'MSR', 'MUS', 'MWI', 'MYS', 'NAM', 'NCL', 'NER', 'NFK', 'NGA', 'NIC', 'NIU', 'NLD', 'NOR', 'NPL', 'NRU', 'NUL', 'NZL', 'OMN', 'PAK', 'PAN', 'PCN', 'PER', 'PGA', 'PHL', 'PLW', 'PNG', 'POL', 'PRI', 'PRK', 'PRT', 'PRY', 'PSX', 'PYF', 'QAT', 'ROU', 'RUS', 'RWA', 'SAH', 'SAU', 'SCR', 'SDN', 'SDS', 'SEN', 'SER', 'SGP', 'SGS', 'SHN', 'SLB', 'SLE', 'SLV', 'SMR', 'SOL', 'SOM', 'SPM', 'SRB', 'STP', 'SUR', 'SVK', 'SVN', 'SWE', 'SWZ', 'SXM', 'SYC', 'SYR', 'TCA', 'TCD', 'TGO', 'THA', 'TJK', 'TKM', 'TLS', 'TON', 'TTO', 'TUN', 'TUR', 'TUV', 'TWN', 'TZA', 'UGA', 'UKR', 'UMI', 'URY', 'USA', 'USG', 'UZB', 'VAT', 'VCT', 'VEN', 'VGB', 'VIR', 'VNM', 'VUT', 'WLF', 'WSB', 'WSM', 'YEM', 'ZAF', 'ZMB', 'ZWE'];

	$('#itt-mood').hide();
	$('#itt-graph').hide();
	$('#itt-map').hide();
	$('#itt-wordcloud').hide();
	$('#itt-results').hide();

	function inside(point, polygon) {
		// ray-casting algorithm based on
		// http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

		var x = point[0],
			y = point[1];

		var inside = false;
		for (var i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
			var xi = polygon[i][0],
				yi = polygon[i][1];
			var xj = polygon[j][0],
				yj = polygon[j][1];

			var intersect = ((yi > y) != (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
			if (intersect) inside = !inside;
		}

		return inside;
	};

	function renderGraphs(type, index, tmpJSON) {
		series = [];

		var response = tmpJSON.response;

		for (var i = 0; i < response.length; i++) {
			var data = {};
			data.username = response[i].screenName
			data.tweet = response[i].tweet;
			data.url = response[i].tweetLink;
			data.geo = response[i].geo;
			data.location = response[i].location;
			data.value = response[i].score == '--' ? null : response[i].score;
			series.push(data);
		}

		$('.alchemy').hide();
		$('.ct-chart').hide();

		if (type == null)
			type = '';

		if (index === null)
			index = '5';

		switch (type) {
			case "alc":
				if (index === '1') {
					renderAlchemy(tmpJSON);

					$('.alchemy').show();
					$('.ct-chart').hide();
				}

				break;
			case "lin":
				if (index === '1') {
					renderChartistSimpleLine(series);
				} else if (index === '2') {
					renderChartistHolesInData(series);
				} else if (index === '3') {
					renderChartistFilledHolesInData(series);
				} else if (index === '4') {
					renderChartistOnlyWholeNumbers(series);
				} else if (index === '5') {
					renderChartistLineScatterDiagramWithResponsiveSettings(series);
				} else if (index === '6') {
					renderChartistLineChartWithArea(series);
				} else if (index === '7') {
					renderChartistBipolarLineGraphWithAreaOnly(series);
				} else if (index === '8') {
					renderChartistUsingEventsToReplaceGraphics(series);
				} else if (index === '9') {
					renderChartistAdvancedSmilAnimations(series);
				} else if (index === '10') {
					renderChartistSvgPathAnimation(series);
				} else if (index === '11') {
					renderChartistLineInterpolationAndSmoothing(series);
				} else if (index === '12') {
					renderChartistSeriesOverrides(series);
				} else if (index === '13') {
					// renderChartistTimeSeriesWithMomentJs();
					doKmeans();
				}

				$('.alchemy').hide();
				$('.ct-chart').show();

				break;
			case "bar":
				if (index === '1') {
					renderChartistBipolarBar(series);
				} else if (index === '2') {
					renderChartistOverlappingBarsOnMobile(series);
				} else if (index === '3') {
					renderChartistAddPeakCirclesUsingTheDrawEvents(series);
				} else if (index === '4') {
					renderChartistMultilineLabels(series);
				} else if (index === '5') {
					renderChartistStackedBar(series);
				} else if (index === '6') {
					renderChartistHorizontalBar(series);
				} else if (index === '7') {
					renderChartistExtremeResponsiveConfiguration(series);
				} else if (index === '8') {
					renderChartistDistributedSeries(series);
				} else if (index === '9') {
					renderChartistLabelPlacement(series);
				}

				$('.alchemy').hide();
				$('.ct-chart').show();

				break;
			case "pie":
				if (index === '1') {
					renderChartistSimplePie(series);
				} else if (index === '2') {
					renderChartistPieWithCustomLabels(series);
				} else if (index === '3') {
					renderChartistGauge();
				} else if (index === '4') {
					renderChartistAnimatingDonutWithSvgAnimate(series);
				}

				$('.alchemy').hide();
				$('.ct-chart').show();

				break;
			default:
				$('.alchemy').hide();
				$('.ct-chart').show();
				index = '5';
				if (index === '1') {
					renderChartistSimpleLine(series);
				} else if (index === '2') {
					renderChartistHolesInData(series);
				} else if (index === '3') {
					renderChartistFilledHolesInData(series);
				} else if (index === '4') {
					renderChartistOnlyWholeNumbers(series);
				} else if (index === '5') {
					renderChartistLineScatterDiagramWithResponsiveSettings(series);
				} else if (index === '6') {
					renderChartistLineChartWithArea(series);
				} else if (index === '7') {
					renderChartistBipolarLineGraphWithAreaOnly(series);
				} else if (index === '8') {
					renderChartistUsingEventsToReplaceGraphics(series);
				} else if (index === '9') {
					renderChartistAdvancedSmilAnimations(series);
				} else if (index === '10') {
					renderChartistSvgPathAnimation(series);
				} else if (index === '11') {
					renderChartistLineInterpolationAndSmoothing(series);
				} else if (index === '12') {
					renderChartistSeriesOverrides(series);
				} else if (index === '13') {
					// renderChartistTimeSeriesWithMomentJs();
				}
		}
	}

	function doKmeans() {
		var len = series.length;
		var str = 'Expt,Run,Speed\n';
		for (var i = 0; i < len; i++) {
			str += (i + 1) + ',';
			str += (series[i].value ? series[i].value : 0) + '\n';
		}

		var w = 120,
			h = 500,
			m = [10, 50, 20, 50], // top right bottom left
			min = Infinity,
			max = -Infinity;

		var chart = d3.chart.box()
			.whiskers(iqr(1.5))
			.width(w - m[1] - m[3])
			.height(h - m[0] - m[2]);

		d3.csv("/logic/db/sentiments.csv", function(csv) {
			var data = [];

			csv.forEach(function(x) {
				var e = ~~x.Expt - 1,
					r = ~~x.Run - 1,
					s = ~~x.Speed,
					d = data[e];
				if (!d) d = data[e] = [s];
				else d.push(s);
				if (s > max) max = s;
				if (s < min) min = s;
			});

			chart.domain([min, max]);

			var vis = d3.select(".boxplot").selectAll("svg")
				.data(data)
				.enter().append("svg:svg")
				.attr("class", "box")
				.attr("width", w)
				.attr("height", h)
				.append("svg:g")
				.attr("transform", "translate(" + m[3] + "," + m[0] + ")")
				.call(chart);

			chart.duration(1000);
			window.transition = function() {
				vis.map(randomize).call(chart);
			};
		});

		function randomize(d) {
			if (!d.randomizer) d.randomizer = randomizer(d);
			return d.map(d.randomizer);
		}

		function randomizer(d) {
			var k = d3.max(d) * .02;
			return function(d) {
				return Math.max(min, Math.min(max, d + k * (Math.random() - .5)));
			};
		}

		// Returns a function to compute the interquartile range.
		function iqr(k) {
			return function(d, i) {
				var q1 = d.quartiles[0],
					q3 = d.quartiles[2],
					iqr = (q3 - q1) * k,
					i = -1,
					j = d.length;
				while (d[++i] < q1 - iqr);
				while (d[--j] > q3 + iqr);
				return [i, j];
			};
		}

		// var len = series.length;
		// var dataset = [];
		// var tweets = [];

		// for (var i = 0; i < len - 1; i++) {
		// 	var temp = [];
		// 	// var value = series[i].value;
		// 	// temp.push(i);
		// 	// temp.push(value ? value : 0);
		// 	// for (var j = i + 1; j < len; j++) {
		// 	var value = leven(series[i].tweet, series[i + 1].tweet);
		// 	temp.push(value);
		// 	// }

		// 	dataset.push(temp);
		// }

		// var clusters = clusterfck.kmeans(dataset, 3);

		// console.log(clusters);
	}

	function shuffle(array) {
		var m = array.length,
			t, i;

		// While there remain elements to shuffle
		while (m) {
			// Pick a remaining element...
			i = Math.floor(Math.random() * m--);

			// And swap it with the current element.
			t = array[m];
			array[m] = array[i];
			array[i] = t;
		}

		return array;
	}

	function renderMap() {
		d3.select('#map-container').selectAll('*').remove();

		var random = {};

		if (shouldShuffle)
			countries = shuffle(countries);

		var max = min = series[0].value;

		for (var i = series.length - 1; i >= 0; i--) {
			var value = series[i].value;

			if (value > max)
				max = value;

			if (value < min)
				min = value;
		}

		var difference = (max - min) / 2;
		var size = countries.length / 2;
		for (var i = series.length - 1; i >= 0; i--) {
			if (series[i].value != null) {
				var country = countries[i % size];

				// Normalize to [-1.0, 1.0]
				var count = (series[i].value - min) / difference;
				count -= 1;

				var key = (count > 0) ? 'high' : (count === 0) ? 'medium' : (count < 0) ? 'low' : '';

				random[country] = {
					fillKey: key
				};
			}
		}

		// var map = new Datamap({
		// 	element: document.getElementById('map-container'),
		// 	geographyConfig: {
		// 		popupTemplate: function(geo, data) {
		// 			return '<div class="hoverinfo"><strong>' + geo.properties.name + '</strong></div>';
		// 		}
		// 	}
		// });

		var map = new Datamap({
			element: document.getElementById('map-container'),
			projection: 'equirectangular',
			// setProjection: function(element, options) {
			// 	var width = 400,
			// 		height = 400;
			// 	// the scale corresponds to the radius more or less so 1/2 width
			// 	var projection = d3.geo.orthographic()
			// 		.scale(width / 2)
			// 		.clipAngle(90)
			// 		.translate([width / 2, height / 2]);
			// 	var path = d3.geo.path()
			// 		.projection(projection);

			// 	return {
			// 		path: path,
			// 		projection: projection
			// 	};
			// },
			fills: {
				high: '#4caf50',
				medium: '#a07943',
				low: '#f44336',
				defaultFill: '#cfd8dc',
			},
			data: random,
			done: function(datamap) {
				// datamap.svg.call(d3.behavior.drag()
				// 	.on('drag', function() {
				// 		var dx = d3.event.dx;
				// 		var dy = d3.event.dy;

				// 		var rotation = projection.rotate();
				// 		var radius = projection.scale();
				// 		var scale = d3.scale.linear()
				// 			.domain([-1 * radius, radius])
				// 			.range([-90, 90]);
				// 		var degX = scale(dx);
				// 		var degY = scale(dy);
				// 		rotation[0] += degX;
				// 		rotation[1] -= degY;
				// 		if (rotation[1] > 90) rotation[1] = 90;
				// 		if (rotation[1] < -90) rotation[1] = -90;

				// 		if (rotation[0] >= 180) rotation[0] -= 360;
				// 		projection.rotate(rotation);
				// 	}));

				datamap.svg.call(d3.behavior.zoom().on("zoom", function() {
					datamap.svg.selectAll("g").attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
					datamap.svg.selectAll("path").attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
				}));
			}
		});

		map.graticule();
	}

	function renderWordCloud(response) {
		var words = [];

		var len = response.length;
		for (var i = 0; i < len; i++) {
			var tweet = response[i].tweet;

			var eachWord = tweet.split(' ');
			var numWords = eachWord.length;

			for (var j = 0; j < numWords; j++) {
				var pattern = /\w{3,}/;
				if (pattern.exec(eachWord[j]) != null)
					words.push(eachWord[j]);
			}
		}

		var list = [];

		var len = words.length;
		for (var i = 0; i < len; i++) {
			var count = j = 0;
			var temp = [];
			temp.push(words[i]);

			// while ((j = words.indexOf(words[i], j)) != -1) {
			// count++;
			// j++;
			// }

			temp.push(10 + Math.random() * 20);

			list.push(temp);
		}

		WordCloud(document.getElementById('canvas'), {
			list: list,
			backgroundColor: '#efefef',
			fontFamily: 'Droid Sans'
		});
	}

	function onZoom(chart, reset) {
		var resetFnc = reset;
	}

	// BEGIN: Chartist Line Charts
	function renderChartistSimpleLine(series) {
		var labels = [],
			subSeries = [];

		if (lastIndexGraph >= series.length) {
			lastIndexGraph = 0;
		}

		var len = lastIndexGraph + 100;

		if (len > series.length) {
			len = series.length;
		}

		$('#positionGraph').text(lastIndexGraph + ' - ' + len);
		for (var i = lastIndexGraph; i < len; i++) {
			if (series[i].value != null) {
				var data = {};
				data.meta = series[i].tweet;
				data.value = series[i].value;
				data.username = series[i].username;
				data.url = series[i].url;
				labels.push(data.username);
				subSeries.push(data);
			}
		}

		lastIndexGraph = i;

		var chart = new Chartist.Line('.ct-chart', {
			labels: labels,
			series: [
				subSeries
			]
		}, {
			showLine: true,
			showArea: true,
			fullWidth: true,
			low: Math.min.apply(null, series),
			high: Math.max.apply(null, series),
			plugins: [
				Chartist.plugins.tooltip(),
				Chartist.plugins.ctThreshold({
					threshold: 0
				}), Chartist.plugins.ctAxisTitle({
					axisX: {
						axisTitle: 'Username',
						axisClass: 'ct-axis-title',
						offset: {
							x: 0,
							y: 0
						},
						textAnchor: 'middle'
					},
					axisY: {
						axisTitle: 'Sentiment Score',
						axisClass: 'ct-axis-title',
						offset: {
							x: 0,
							y: 0
						},
						textAnchor: 'middle',
						flipTitle: false
					}
				})
			]
		});

		$('.ct-chart').on('click', '.ct-point', function() {
			// console.log(Chartist.deserialize($(this)));
		});
	}

	function renderChartistHolesInData(series) {
		// $('#slider').MaterialSlider.change(lastIndexGraph); // Doesn't work
		// $('#slider').attr({
		// 	'max': series.length,
		// 	'value': lastIndexGraph
		// }); // Works, but not recommended

		var labels = [],
			subSeries = [];

		if (lastIndexGraph >= series.length) {
			lastIndexGraph = 0;
		}

		var len = lastIndexGraph + 100;

		if (len > series.length) {
			len = series.length;
		}

		$('#positionGraph').text(lastIndexGraph + ' - ' + len);

		for (var i = lastIndexGraph; i < len; i++) {
			var data = {};
			data.meta = series[i].tweet;
			data.username = series[i].username;
			data.value = series[i].value;
			labels.push(data.username);
			subSeries.push(data);
		}

		lastIndexGraph = i;

		var chart = new Chartist.Line('.ct-chart', {
			labels: labels,
			series: [
				subSeries
			]
		}, {
			showLine: true,
			showArea: true,
			fullWidth: true,
			low: Math.min.apply(null, series),
			high: Math.max.apply(null, series),
			axisX: {
				// type: Chartist.AutoScaleAxis
			},
			axisY: {
				// type: Chartist.AutoScaleAxis
			},
			plugins: [
				Chartist.plugins.tooltip(),
				Chartist.plugins.ctThreshold({
					threshold: 0
				}),
				Chartist.plugins.ctAxisTitle({
					axisX: {
						axisTitle: 'Username',
						axisClass: 'ct-axis-title',
						offset: {
							x: 0,
							y: 0
						},
						textAnchor: 'middle'
					},
					axisY: {
						axisTitle: 'Sentiment Score',
						axisClass: 'ct-axis-title',
						offset: {
							x: 0,
							y: 0
						},
						textAnchor: 'middle',
						flipTitle: false
					}
				})
			]
		});

		// var btn = document.createElement('button');
		// btn.id = 'reset-zoom-btn';
		// btn.innerHTML = 'Reset Zoom';
		// btn.style.float = 'right';
		// btn.addEventListener('click', function() {
		// 	console.log(resetFnc);
		// 	resetFnc && resetFnc();
		// });
		// var parent = document.querySelector('#graph-container');
		// !parent.querySelector('#reset-zoom-btn') && parent.appendChild(btn);
	}

	function renderChartistFilledHolesInData(series) {
		var labels = [],
			subSeries = [];

		if (lastIndexGraph >= series.length) {
			lastIndexGraph = 0;
		}

		var len = lastIndexGraph + 100;

		if (len > series.length) {
			len = series.length;
		}

		$('#positionGraph').text(lastIndexGraph + ' - ' + len);

		for (var i = lastIndexGraph; i < len; i++) {
			var data = {};
			data.meta = series[i].tweet;
			data.username = series[i].username;
			data.value = series[i].value;
			labels.push(data.username);
			subSeries.push(data);
		}

		lastIndexGraph = i;

		var chart = new Chartist.Line('.ct-chart', {
			labels: labels,
			series: [
				subSeries
			]
		}, {
			showLine: true,
			showArea: true,
			fullWidth: true,
			low: Math.min.apply(null, series),
			high: Math.max.apply(null, series),
			plugins: [
				Chartist.plugins.tooltip(),
				Chartist.plugins.ctThreshold({
					threshold: 0
				}), Chartist.plugins.ctAxisTitle({
					axisX: {
						axisTitle: 'Username',
						axisClass: 'ct-axis-title',
						offset: {
							x: 0,
							y: 0
						},
						textAnchor: 'middle'
					},
					axisY: {
						axisTitle: 'Sentiment Score',
						axisClass: 'ct-axis-title',
						offset: {
							x: 0,
							y: 0
						},
						textAnchor: 'middle',
						flipTitle: false
					}
				})
			],
			lineSmooth: Chartist.Interpolation.cardinal({
				fillHoles: true,
			}),
		});
	}

	function renderChartistOnlyWholeNumbers(series) {
		var labels = [],
			subSeries = [];

		if (lastIndexGraph >= series.length) {
			lastIndexGraph = 0;
		}

		var len = lastIndexGraph + 100;

		if (len > series.length) {
			len = series.length;
		}

		$('#positionGraph').text(lastIndexGraph + ' - ' + len);

		for (var i = lastIndexGraph; i < len; i++) {
			if (series[i].value != null) {
				var data = {};
				data.meta = series[i].tweet;
				data.username = series[i].username;
				data.value = series[i].value;
				labels.push(data.username);
				subSeries.push(data);
			}
		}

		lastIndexGraph = i;

		new Chartist.Line('.ct-chart', {
			labels: labels,
			series: [
				subSeries
			]
		}, {
			showLine: true,
			showArea: true,
			fullWidth: true,
			low: Math.min.apply(null, series),
			high: Math.max.apply(null, series),
			plugins: [
				Chartist.plugins.tooltip(),
				Chartist.plugins.ctThreshold({
					threshold: 0
				}),
				Chartist.plugins.ctAxisTitle({
					axisX: {
						axisTitle: 'Username',
						axisClass: 'ct-axis-title',
						offset: {
							x: 0,
							y: 0
						},
						textAnchor: 'middle'
					},
					axisY: {
						axisTitle: 'Sentiment Score',
						axisClass: 'ct-axis-title',
						offset: {
							x: 0,
							y: 0
						},
						textAnchor: 'middle',
						flipTitle: false
					}
				})
			],
			// As this is axis specific we need to tell Chartist to use whole numbers only on the concerned axis
			axisY: {
				onlyInteger: true,
				offset: 20
			}
		});
	}

	function renderChartistLineScatterDiagramWithResponsiveSettings(series) {
		var labels = [],
			fullLabels = [],
			subSeries = [],
			fullSeries = [];

		if (lastIndexGraph >= series.length) {
			lastIndexGraph = 0;
		}

		var len = lastIndexGraph + 100;

		if (len > series.length) {
			len = series.length;
		}

		$('#positionGraph').text(lastIndexGraph + ' - ' + len);

		for (var i = lastIndexGraph; i < len; i++) {
			var data = {};
			data.meta = series[i].tweet;
			data.username = series[i].username;
			data.value = series[i].value;
			labels.push(data.username);
			subSeries.push(data);
		}

		lastIndexGraph = i;

		var limit = series.length;
		for (var i = 0; i < limit; i++) {
			var data = {};
			data.meta = series[i].tweet;
			data.username = series[i].username;
			data.value = series[i].value;
			fullLabels.push(data.username);
			fullSeries.push(data);
		}

		var data = {
			labels: fullLabels,
			series: [
				fullSeries
			]
		};

		var options = {
			showLine: false,
			showArea: false,
			fullWidth: true,
			low: Math.min.apply(null, series),
			high: Math.max.apply(null, series),
			plugins: [
				Chartist.plugins.tooltip(),
				Chartist.plugins.ctThreshold({
					threshold: 0
				}),
				Chartist.plugins.ctAxisTitle({
					axisX: {
						axisTitle: 'Username',
						axisClass: 'ct-axis-title',
						offset: {
							x: 0,
							y: 0
						},
						textAnchor: 'middle'
					},
					axisY: {
						axisTitle: 'Sentiment Score',
						axisClass: 'ct-axis-title',
						offset: {
							x: 0,
							y: 0
						},
						textAnchor: 'middle',
						flipTitle: false
					}
				})
			],
			axisX: {
				// labelInterpolationFnc: function(value, index) {
				// return index % 13 === 0 ? 'W' + value : null;
				// }
			}
		};

		var responsiveOptions = [
			['screen and (min-width: 640px)', {
				axisX: {
					// labelInterpolationFnc: function(value, index) {
					// return index % 4 === 0 ? 'W' + value : null;
					// }
				}
			}]
		];

		new Chartist.Line('.ct-chart', data, options, responsiveOptions);
	}

	function renderChartistLineChartWithArea(series) {
		var labels = [],
			subSeries = [];

		if (lastIndexGraph >= series.length) {
			lastIndexGraph = 0;
		}

		var len = lastIndexGraph + 100;

		if (len > series.length) {
			len = series.length;
		}

		$('#positionGraph').text(lastIndexGraph + ' - ' + len);

		for (var i = lastIndexGraph; i < len; i++) {
			if (series[i].value != null) {
				var data = {};
				data.meta = series[i].tweet;
				data.username = series[i].username;
				data.value = series[i].value;
				labels.push(data.username);
				subSeries.push(data);
			}
		}

		lastIndexGraph = i;

		new Chartist.Line('.ct-chart', {
			labels: labels,
			series: [
				subSeries
			]
		}, {
			showLine: true,
			showArea: true,
			fullWidth: true,
			low: Math.min.apply(null, series),
			high: Math.max.apply(null, series),
			plugins: [
				Chartist.plugins.tooltip(),
				Chartist.plugins.ctThreshold({
					threshold: 0
				}),
				Chartist.plugins.ctAxisTitle({
					axisX: {
						axisTitle: 'Username',
						axisClass: 'ct-axis-title',
						offset: {
							x: 0,
							y: 0
						},
						textAnchor: 'middle'
					},
					axisY: {
						axisTitle: 'Sentiment Score',
						axisClass: 'ct-axis-title',
						offset: {
							x: 0,
							y: 0
						},
						textAnchor: 'middle',
						flipTitle: false
					}
				})
			]
		});
	}

	function renderChartistBipolarLineGraphWithAreaOnly(series) {
		var labels1 = [],
			labels2 = [],
			labels3 = [],
			labels4 = [],
			subSeries1 = [],
			subSeries2 = [],
			subSeries3 = [],
			subSeries4 = [];

		if (lastIndexGraph >= series.length) {
			lastIndexGraph = 0;
		}

		var len = lastIndexGraph + 100;

		if (len > series.length) {
			len = series.length;
		}

		$('#positionGraph').text(lastIndexGraph + ' - ' + len);

		for (var i = lastIndexGraph; i < len; i++) {
			if (series[i].value != null) {
				var data = {};
				data.meta = series[i].tweet;
				data.username = series[i].username;
				data.value = series[i].value;

				if (i % 4 == 0) {
					labels1.push(data.username);
					subSeries1.push(data);
				} else if (i % 4 == 1) {
					labels2.push(data.username);
					subSeries2.push(data);
				} else if (i % 4 == 2) {
					labels3.push(data.username);
					subSeries3.push(data);
				} else if (i % 4 == 3) {
					labels4.push(data.username);
					subSeries4.push(data);
				}
			}
		}

		lastIndexGraph = i;

		new Chartist.Line('.ct-chart', {
			labels: labels1,
			labels2,
			labels3,
			labels4,
			series: [
				subSeries1,
				subSeries2,
				subSeries3,
				subSeries4
			]
		}, {
			showLine: false,
			showPoint: false,
			showArea: true,
			fullWidth: true,
			low: Math.min.apply(null, series),
			high: Math.max.apply(null, series),
			plugins: [
				Chartist.plugins.tooltip(),
				Chartist.plugins.ctAxisTitle({
					axisX: {
						axisTitle: 'Username',
						axisClass: 'ct-axis-title',
						offset: {
							x: 0,
							y: 0
						},
						textAnchor: 'middle'
					},
					axisY: {
						axisTitle: 'Sentiment Score',
						axisClass: 'ct-axis-title',
						offset: {
							x: 0,
							y: 0
						},
						textAnchor: 'middle',
						flipTitle: false
					}
				})
			],
			axisX: {
				showLabel: false,
				showGrid: false
			}
		});
	}

	function renderChartistUsingEventsToReplaceGraphics(series) {
		var labels = [],
			subSeries = [];

		if (lastIndexGraph >= series.length) {
			lastIndexGraph = 0;
		}

		var len = lastIndexGraph + 100;

		if (len > series.length) {
			len = series.length;
		}

		$('#positionGraph').text(lastIndexGraph + ' - ' + len);


		var max = min = series[0].value;

		for (var i = lastIndexGraph; i < len; i++) {
			var data = {};
			data.meta = series[i].tweet;
			data.username = series[i].username;
			data.value = series[i].value;
			labels.push(data.username);
			subSeries.push(data);

			if (data.value > max)
				max = data.value;

			if (data.value < min)
				min = data.value;
		}

		lastIndexGraph = i;

		var chart = new Chartist.Line('.ct-chart', {
			labels: labels,
			series: [
				subSeries
			]
		}, {
			showLine: true,
			showPoint: true,
			showArea: true,
			fullWidth: true,
			low: Math.min.apply(null, series),
			high: Math.max.apply(null, series),
			plugins: [
				Chartist.plugins.tooltip(),
				Chartist.plugins.ctThreshold({
					threshold: 0
				}),
				Chartist.plugins.ctAxisTitle({
					axisX: {
						axisTitle: 'Username',
						axisClass: 'ct-axis-title',
						offset: {
							x: 0,
							y: 0
						},
						textAnchor: 'middle'
					},
					axisY: {
						axisTitle: 'Sentiment Score',
						axisClass: 'ct-axis-title',
						offset: {
							x: 0,
							y: 0
						},
						textAnchor: 'middle',
						flipTitle: false
					}
				})
			]
		});

		// Listening for draw events that get emitted by the Chartist chart
		chart.on('draw', function(data) {
			// If the draw event was triggered from drawing a point on the line chart
			if (data.type === 'point') {
				if (subSeries[data.index].value === max) {
					// We are creating a new path SVG element that draws a triangle around the point coordinates
					var triangle = new Chartist.Svg('path', {
						d: ['M',
							data.x,
							data.y - 15,
							'L',
							data.x - 15,
							data.y + 8,
							'L',
							data.x + 15,
							data.y + 8,
							'z'
						].join(' '),
						style: 'fill-opacity: 1; fill: #4caf50'
					}, 'ct-area');
					// With data.element we get the Chartist SVG wrapper and we can replace the original point drawn by Chartist with our newly created triangle
					data.element.replace(triangle);
				} else if (subSeries[data.index].value === min) {
					// We are creating a new path SVG element that draws an inverted triangle around the point coordinates
					var triangle = new Chartist.Svg('path', {
						d: ['M',
							data.x - 15,
							data.y,
							'L',
							data.x,
							data.y + 21,
							'L',
							data.x + 15,
							data.y,
							'z'
						].join(' '),
						style: 'fill-opacity: 1; fill: #f44336'
					}, 'ct-area');

					// With data.element we get the Chartist SVG wrapper and we can replace the original point drawn by Chartist with our newly created triangle
					data.element.replace(triangle);
				}
			}
		});
	}

	function renderChartistAdvancedSmilAnimations(series) {
		var labels1 = [],
			labels2 = [],
			labels3 = [],
			labels4 = [],
			subSeries1 = [],
			subSeries2 = [],
			subSeries3 = [],
			subSeries4 = [];

		if (lastIndexGraph >= series.length) {
			lastIndexGraph = 0;
		}

		var len = lastIndexGraph + 100;

		if (len > series.length) {
			len = series.length;
		}

		$('#positionGraph').text(lastIndexGraph + ' - ' + len);

		for (var i = lastIndexGraph; i < len; i++) {
			var data = {};
			data.meta = series[i].tweet;
			data.username = series[i].username;
			data.value = series[i].value;

			if (i % 4 == 0) {
				labels1.push(data.username);
				subSeries1.push(data);
			} else if (i % 4 == 1) {
				labels2.push(data.username);
				subSeries2.push(data);
			} else if (i % 4 == 2) {
				labels3.push(data.username);
				subSeries3.push(data);
			} else if (i % 4 == 3) {
				labels4.push(data.username);
				subSeries4.push(data);
			}
		}

		lastIndexGraph = i;

		var chart = new Chartist.Line('.ct-chart', {
			labels: labels1,
			labels2,
			labels3,
			labels4,
			series: [
				subSeries1,
				subSeries2,
				subSeries3,
				subSeries4
			]
		}, {
			fullWidth: true,
			low: Math.min.apply(null, series),
			high: Math.max.apply(null, series),
			plugins: [
				Chartist.plugins.tooltip(),
				Chartist.plugins.ctAxisTitle({
					axisX: {
						axisTitle: 'Username',
						axisClass: 'ct-axis-title',
						offset: {
							x: 0,
							y: 0
						},
						textAnchor: 'middle'
					},
					axisY: {
						axisTitle: 'Sentiment Score',
						axisClass: 'ct-axis-title',
						offset: {
							x: 0,
							y: 0
						},
						textAnchor: 'middle',
						flipTitle: false
					}
				})
			]
		});

		// Let's put a sequence number aside so we can use it in the event callbacks
		var seq = 0,
			delays = 25,
			durations = 500;

		// Once the chart is fully created we reset the sequence
		chart.on('created', function() {
			seq = 0;
		});

		// On each drawn element by Chartist we use the Chartist.Svg API to trigger SMIL animations
		chart.on('draw', function(data) {
			seq++;

			if (data.type === 'line') {
				// If the drawn element is a line we do a simple opacity fade in. This could also be achieved using CSS3 animations.
				data.element.animate({
					opacity: {
						// The delay when we like to start the animation
						begin: seq * delays + 1000,
						// Duration of the animation
						dur: durations,
						// The value where the animation should start
						from: 0,
						// The value where it should end
						to: 1
					}
				});
			} else if (data.type === 'label' && data.axis === 'x') {
				data.element.animate({
					y: {
						begin: seq * delays,
						dur: durations,
						from: data.y + 100,
						to: data.y,
						// We can specify an easing function from Chartist.Svg.Easing
						easing: 'easeOutQuart'
					}
				});
			} else if (data.type === 'label' && data.axis === 'y') {
				data.element.animate({
					x: {
						begin: seq * delays,
						dur: durations,
						from: data.x - 100,
						to: data.x,
						easing: 'easeOutQuart'
					}
				});
			} else if (data.type === 'point') {
				data.element.animate({
					x1: {
						begin: seq * delays,
						dur: durations,
						from: data.x - 10,
						to: data.x,
						easing: 'easeOutQuart'
					},
					x2: {
						begin: seq * delays,
						dur: durations,
						from: data.x - 10,
						to: data.x,
						easing: 'easeOutQuart'
					},
					opacity: {
						begin: seq * delays,
						dur: durations,
						from: 0,
						to: 1,
						easing: 'easeOutQuart'
					}
				});
			} else if (data.type === 'grid') {
				// Using data.axis we get x or y which we can use to construct our animation definition objects
				var pos1Animation = {
					begin: seq * delays,
					dur: durations,
					from: data[data.axis.units.pos + '1'] - 30,
					to: data[data.axis.units.pos + '1'],
					easing: 'easeOutQuart'
				};

				var pos2Animation = {
					begin: seq * delays,
					dur: durations,
					from: data[data.axis.units.pos + '2'] - 100,
					to: data[data.axis.units.pos + '2'],
					easing: 'easeOutQuart'
				};

				var animations = {};
				animations[data.axis.units.pos + '1'] = pos1Animation;
				animations[data.axis.units.pos + '2'] = pos2Animation;
				animations['opacity'] = {
					begin: seq * delays,
					dur: durations,
					from: 0,
					to: 1,
					easing: 'easeOutQuart'
				};

				data.element.animate(animations);
			}
		});

		// For the sake of the example we update the chart every time it's created with a delay of 10 seconds
		// chart.on('created', function() {
		// if (window.__exampleAnimateTimeout) {
		// clearTimeout(window.__exampleAnimateTimeout);
		// 	window.__exampleAnimateTimeout = null;
		// }
		// window.__exampleAnimateTimeout = setTimeout(chart.update.bind(chart), 12000);
		// });
	}

	function renderChartistSvgPathAnimation(series) {
		var labels1 = [],
			labels2 = [],
			labels3 = [],
			labels4 = [],
			subSeries1 = [],
			subSeries2 = [],
			subSeries3 = [],
			subSeries4 = [];

		if (lastIndexGraph >= series.length) {
			lastIndexGraph = 0;
		}

		var len = lastIndexGraph + 100;

		if (len > series.length) {
			len = series.length;
		}

		$('#positionGraph').text(lastIndexGraph + ' - ' + len);

		for (var i = lastIndexGraph; i < len; i++) {
			if (series[i].value != null) {
				var data = {};
				data.meta = series[i].tweet;
				data.username = series[i].username;
				data.value = series[i].value;

				if (i % 4 == 0) {
					labels1.push(data.username);
					subSeries1.push(data);
				} else if (i % 4 == 1) {
					labels2.push(data.username);
					subSeries2.push(data);
				} else if (i % 4 == 2) {
					labels3.push(data.username);
					subSeries3.push(data);
				} else if (i % 4 == 3) {
					labels4.push(data.username);
					subSeries4.push(data);
				}
			}
		}

		lastIndexGraph = i;

		var chart = new Chartist.Line('.ct-chart', {
			labels: labels1,
			labels2,
			labels3,
			labels4,
			series: [
				subSeries1,
				subSeries2,
				subSeries3,
				subSeries4
			]
		}, {
			showArea: true,
			showPoint: false,
			fullWidth: true,
			high: Math.max.apply(null, series),
			low: Math.min.apply(null, series),
			plugins: [
				Chartist.plugins.tooltip(),
				Chartist.plugins.ctAxisTitle({
					axisX: {
						axisTitle: 'Username',
						axisClass: 'ct-axis-title',
						offset: {
							x: 0,
							y: 0
						},
						textAnchor: 'middle'
					},
					axisY: {
						axisTitle: 'Sentiment Score',
						axisClass: 'ct-axis-title',
						offset: {
							x: 0,
							y: 0
						},
						textAnchor: 'middle',
						flipTitle: false
					}
				})
			]
		});

		chart.on('draw', function(data) {
			if (data.type === 'line' || data.type === 'area') {
				data.element.animate({
					d: {
						begin: 100 * data.index,
						dur: 500,
						from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
						to: data.path.clone().stringify(),
						easing: Chartist.Svg.Easing.easeOutQuint
					}
				});
			}
		});
	}

	function renderChartistLineInterpolationAndSmoothing(series) {
		var labels1 = [],
			labels2 = [],
			subSeries1 = [],
			subSeries2 = [];

		if (lastIndexGraph >= series.length) {
			lastIndexGraph = 0;
		}

		var len = lastIndexGraph + 100;

		if (len > series.length) {
			len = series.length;
		}

		$('#positionGraph').text(lastIndexGraph + ' - ' + len);

		for (var i = lastIndexGraph; i < len; i++) {
			var data = {};
			data.meta = series[i].tweet;
			data.username = series[i].username;
			data.value = series[i].value;

			if (i % 2 == 0) {
				labels1.push(data.username);
				subSeries1.push(data);
			} else {
				labels2.push(data.username);
				subSeries2.push(data);
			}
		}

		lastIndexGraph = i;

		var chart = new Chartist.Line('.ct-chart', {
			labels: labels1,
			labels2,
			series: [
				subSeries1, [],
				subSeries2
			]
		}, {
			// Remove this configuration to see that chart rendered with cardinal spline interpolation
			// Sometimes, on large jumps in data values, it's better to use simple smoothing.
			lineSmooth: Chartist.Interpolation.simple({
				divisor: 2,
				fillHoles: true
			}),
			showArea: true,
			fullWidth: true,
			high: Math.max.apply(null, series),
			low: Math.min.apply(null, series),
			plugins: [
				Chartist.plugins.tooltip(),
				Chartist.plugins.ctAxisTitle({
					axisX: {
						axisTitle: 'Username',
						axisClass: 'ct-axis-title',
						offset: {
							x: 0,
							y: 0
						},
						textAnchor: 'middle'
					},
					axisY: {
						axisTitle: 'Sentiment Score',
						axisClass: 'ct-axis-title',
						offset: {
							x: 0,
							y: 0
						},
						textAnchor: 'middle',
						flipTitle: false
					}
				})
			]
		});
	}

	function renderChartistSeriesOverrides(series) {
		var labels1 = [],
			labels2 = [],
			labels3 = [],
			subSeries1 = [],
			subSeries2 = [],
			subSeries3 = [];

		if (lastIndexGraph >= series.length) {
			lastIndexGraph = 0;
		}

		var len = lastIndexGraph + 100;

		if (len > series.length) {
			len = series.length;
		}

		$('#positionGraph').text(lastIndexGraph + ' - ' + len);

		for (var i = lastIndexGraph; i < len; i++) {
			var data = {};
			data.meta = series[i].tweet;
			data.username = series[i].username;
			data.value = series[i].value;

			if (i % 3 == 0) {
				labels1.push(data.username);
				subSeries1.push(data);
			} else if (i % 3 == 1) {
				labels2.push(data.username);
				subSeries2.push(data);
			} else if (i % 3 == 2) {
				labels3.push(data.username);
				subSeries3.push(data);
			}
		}

		lastIndexGraph = i;

		var chart = new Chartist.Line('.ct-chart', {
			labels: labels1,
			labels2,
			labels3,
			// Naming the series with the series object array notation
			series: [{
				name: 'series-1',
				data: subSeries1
			}, {
				name: 'series-2',
				data: subSeries2
			}, {
				name: 'series-3',
				data: subSeries3
			}]
		}, {
			fullWidth: true,
			// Within the series options you can use the series names
			// to specify configuration that will only be used for the
			// specific series.
			series: {
				'series-1': {
					lineSmooth: Chartist.Interpolation.step()
				},
				'series-2': {
					lineSmooth: Chartist.Interpolation.simple({
						fillHoles: true
					}),
					showArea: true
				},
				'series-3': {
					showPoint: false
				}
			},
			plugins: [
				Chartist.plugins.tooltip(),
				Chartist.plugins.ctAxisTitle({
					axisX: {
						axisTitle: 'Username',
						axisClass: 'ct-axis-title',
						offset: {
							x: 0,
							y: 0
						},
						textAnchor: 'middle'
					},
					axisY: {
						axisTitle: 'Sentiment Score',
						axisClass: 'ct-axis-title',
						offset: {
							x: 0,
							y: 0
						},
						textAnchor: 'middle',
						flipTitle: false
					}
				})
			]
		}, [
			// You can even use responsive configuration overrides to
			// customize your series configuration even further!
			['screen and (max-width: 320px)', {
				series: {
					'series-1': {
						lineSmooth: Chartist.Interpolation.none()
					},
					'series-2': {
						lineSmooth: Chartist.Interpolation.none(),
						showArea: false
					},
					'series-3': {
						lineSmooth: Chartist.Interpolation.none(),
						showPoint: true
					}
				}
			}]
		]);
	}

	// function renderChartistTimeSeriesWithMomentJs() {
	// 	// Requires Moment.js

	// 	var chart = new Chartist.Line('.ct-chart', {
	// 		series: [{
	// 			name: 'series-1',
	// 			data: [{
	// 				x: new Date(143134652600),
	// 				y: 53
	// 			}, {
	// 				x: new Date(143234652600),
	// 				y: 40
	// 			}, {
	// 				x: new Date(143340052600),
	// 				y: 45
	// 			}, {
	// 				x: new Date(143366652600),
	// 				y: 40
	// 			}, {
	// 				x: new Date(143410652600),
	// 				y: 20
	// 			}, {
	// 				x: new Date(143508652600),
	// 				y: 32
	// 			}, {
	// 				x: new Date(143569652600),
	// 				y: 18
	// 			}, {
	// 				x: new Date(143579652600),
	// 				y: 11
	// 			}]
	// 		}, {
	// 			name: 'series-2',
	// 			data: [{
	// 				x: new Date(143134652600),
	// 				y: 53
	// 			}, {
	// 				x: new Date(143234652600),
	// 				y: 35
	// 			}, {
	// 				x: new Date(143334652600),
	// 				y: 30
	// 			}, {
	// 				x: new Date(143384652600),
	// 				y: 30
	// 			}, {
	// 				x: new Date(143568652600),
	// 				y: 10
	// 			}]
	// 		}]
	// 	}, {
	// 		axisX: {
	// 			type: Chartist.FixedScaleAxis,
	// 			divisor: 5,
	// 			labelInterpolationFnc: function(value) {
	// 				return moment(value).format('MMM D');
	// 			}
	// 		}
	// 	});
	// }
	// END: Chartist Line Charts

	// BEGIN: Chartist Bar Charts
	function renderChartistBipolarBar(series) {
		var labels = [],
			subSeries = [];

		if (lastIndexGraph >= series.length) {
			lastIndexGraph = 0;
		}

		var len = lastIndexGraph + 100;

		if (len > series.length) {
			len = series.length;
		}

		$('#positionGraph').text(lastIndexGraph + ' - ' + len);

		var max = min = series[0].value;

		for (var i = lastIndexGraph; i < len; i++) {
			var data = {};
			data.meta = series[i].tweet;
			data.username = series[i].username;
			data.value = series[i].value;
			labels.push(data.username);
			subSeries.push(data);

			if (data.value > max)
				max = data.value;

			if (data.value < min)
				min = data.value;
		}

		lastIndexGraph = i;

		new Chartist.Bar('.ct-chart', {
			labels: labels,
			series: [
				subSeries
			]
		}, {
			high: max,
			low: min,
			plugins: [
				Chartist.plugins.tooltip(),
				Chartist.plugins.ctAxisTitle({
					axisX: {
						axisTitle: 'Username',
						axisClass: 'ct-axis-title',
						offset: {
							x: 0,
							y: 0
						},
						textAnchor: 'middle'
					},
					axisY: {
						axisTitle: 'Sentiment Score',
						axisClass: 'ct-axis-title',
						offset: {
							x: 0,
							y: 0
						},
						textAnchor: 'middle',
						flipTitle: false
					}
				})
			]
		});
	}

	function renderChartistOverlappingBarsOnMobile(series) {
		var labels = [],
			subSeries = [];

		if (lastIndexGraph >= series.length) {
			lastIndexGraph = 0;
		}

		var len = lastIndexGraph + 100;

		if (len > series.length) {
			len = series.length;
		}

		$('#positionGraph').text(lastIndexGraph + ' - ' + len);

		for (var i = lastIndexGraph; i < len; i++) {
			var data = {};
			data.meta = series[i].tweet;
			data.username = series[i].username;
			data.value = series[i].value;
			labels.push(data.username);
			subSeries.push(data);
		}

		lastIndexGraph = i;

		var data = {
			labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
			series: [
				[5, 4, 3, 7, 5, 10, 3, 4, 8, 10, 6, 8],
				[3, 2, 9, 5, 4, 6, 4, 6, 7, 8, 7, 4]
			]
		};

		var options = {
			seriesBarDistance: 10,
			plugins: [
				Chartist.plugins.tooltip(),
				Chartist.plugins.ctAxisTitle({
					axisX: {
						axisTitle: 'Username',
						axisClass: 'ct-axis-title',
						offset: {
							x: 0,
							y: 0
						},
						textAnchor: 'middle'
					},
					axisY: {
						axisTitle: 'Sentiment Score',
						axisClass: 'ct-axis-title',
						offset: {
							x: 0,
							y: 0
						},
						textAnchor: 'middle',
						flipTitle: false
					}
				})
			]
		};

		var responsiveOptions = [
			['screen and (max-width: 640px)', {
				seriesBarDistance: 5,
				axisX: {
					labelInterpolationFnc: function(value) {
						return value[0];
					}
				}
			}]
		];

		new Chartist.Bar('.ct-chart', data, options, responsiveOptions);
	}

	function renderChartistAddPeakCirclesUsingTheDrawEvents(series) {
		var labels = [],
			subSeries = [];

		if (lastIndexGraph >= series.length) {
			lastIndexGraph = 0;
		}

		var len = lastIndexGraph + 100;

		if (len > series.length) {
			len = series.length;
		}

		$('#positionGraph').text(lastIndexGraph + ' - ' + len);

		var max = min = series[0].value;

		for (var i = lastIndexGraph; i < len; i++) {
			var data = {};
			data.meta = series[i].tweet;
			data.username = series[i].username;
			data.value = series[i].value;
			labels.push(data.username);
			subSeries.push(data);

			if (data.value > max)
				max = data.value;

			if (data.value < min)
				min = data.value;
		}

		lastIndexGraph = i;

		// Create a simple bi-polar bar chart
		var chart = new Chartist.Bar('.ct-chart', {
			labels: labels,
			series: [
				subSeries
			]
		}, {
			high: max,
			low: min,
			axisX: {
				labelInterpolationFnc: function(value, index) {
					return index % 2 === 0 ? value : null;
				}
			},
			plugins: [
				Chartist.plugins.tooltip(),
				Chartist.plugins.ctAxisTitle({
					axisX: {
						axisTitle: 'Username',
						axisClass: 'ct-axis-title',
						offset: {
							x: 0,
							y: 0
						},
						textAnchor: 'middle'
					},
					axisY: {
						axisTitle: 'Sentiment Score',
						axisClass: 'ct-axis-title',
						offset: {
							x: 0,
							y: 0
						},
						textAnchor: 'middle',
						flipTitle: false
					}
				})
			]
		});

		// Listen for draw events on the bar chart
		chart.on('draw', function(data) {
			// If this draw event is of type bar we can use the data to create additional content
			if (data.type === 'bar' && (subSeries[data.index].value === max || subSeries[data.index].value === min)) {
				// We use the group element of the current series to append a simple circle with the bar peek coordinates and a circle radius that is depending on the value
				data.group.append(new Chartist.Svg('circle', {
					cx: data.x2,
					cy: data.y2,
					r: Math.abs(Chartist.getMultiValue(data.value)) * 2
				}, 'ct-slice-pie'));
			}
		});
	}

	function renderChartistMultilineLabels(series) {
		var labels = [],
			subSeries = [];

		if (lastIndexGraph >= series.length) {
			lastIndexGraph = 0;
		}

		var len = lastIndexGraph + 100;

		if (len > series.length) {
			len = series.length;
		}

		$('#positionGraph').text(lastIndexGraph + ' - ' + len);

		for (var i = lastIndexGraph; i < len; i++) {
			var data = {};
			data.meta = series[i].tweet;
			data.username = series[i].username;
			data.value = series[i].value;
			labels.push(data.username);
			subSeries.push(data);
		}

		lastIndexGraph = i;

		new Chartist.Bar('.ct-chart', {
			labels: ['First quarter of the year', 'Second quarter of the year', 'Third quarter of the year', 'Fourth quarter of the year'],
			series: [
				[60000, 40000, 80000, 70000],
				[40000, 30000, 70000, 65000],
				[8000, 3000, 10000, 6000]
			]
		}, {
			seriesBarDistance: 10,
			axisX: {
				offset: 60
			},
			axisY: {
				offset: 80,
				labelInterpolationFnc: function(value) {
					return value + ' CHF'
				},
				scaleMinSpace: 15
			},
			plugins: [
				Chartist.plugins.tooltip(),
				Chartist.plugins.ctAxisTitle({
					axisX: {
						axisTitle: 'Username',
						axisClass: 'ct-axis-title',
						offset: {
							x: 0,
							y: 0
						},
						textAnchor: 'middle'
					},
					axisY: {
						axisTitle: 'Sentiment Score',
						axisClass: 'ct-axis-title',
						offset: {
							x: 0,
							y: 0
						},
						textAnchor: 'middle',
						flipTitle: false
					}
				})
			]
		});
	}

	function renderChartistStackedBar() {
		var labels = [],
			subSeries = [];

		if (lastIndexGraph >= series.length) {
			lastIndexGraph = 0;
		}

		var len = lastIndexGraph + 100;

		if (len > series.length) {
			len = series.length;
		}

		$('#positionGraph').text(lastIndexGraph + ' - ' + len);

		for (var i = lastIndexGraph; i < len; i++) {
			var data = {};
			data.meta = series[i].tweet;
			data.username = series[i].username;
			data.value = series[i].value;
			labels.push(data.username);
			subSeries.push(data);
		}

		lastIndexGraph = i;

		new Chartist.Bar('.ct-chart', {
			labels: ['Q1', 'Q2', 'Q3', 'Q4'],
			series: [
				[800000, 1200000, 1400000, 1300000],
				[200000, 400000, 500000, 300000],
				[100000, 200000, 400000, 600000]
			]
		}, {
			stackBars: true,
			axisY: {
				labelInterpolationFnc: function(value) {
					return (value / 1000) + 'k';
				}
			},
			plugins: [
				Chartist.plugins.tooltip(),
				Chartist.plugins.ctAxisTitle({
					axisX: {
						axisTitle: 'Username',
						axisClass: 'ct-axis-title',
						offset: {
							x: 0,
							y: 0
						},
						textAnchor: 'middle'
					},
					axisY: {
						axisTitle: 'Sentiment Score',
						axisClass: 'ct-axis-title',
						offset: {
							x: 0,
							y: 0
						},
						textAnchor: 'middle',
						flipTitle: false
					}
				})
			]
		}).on('draw', function(data) {
			if (data.type === 'bar') {
				data.element.attr({
					style: 'stroke-width: 30px'
				});
			}
		});
	}

	function renderChartistHorizontalBar() {
		var labels = [],
			subSeries = [];

		if (lastIndexGraph >= series.length) {
			lastIndexGraph = 0;
		}

		var len = lastIndexGraph + 100;

		if (len > series.length) {
			len = series.length;
		}

		$('#positionGraph').text(lastIndexGraph + ' - ' + len);

		for (var i = lastIndexGraph; i < len; i++) {
			var data = {};
			data.meta = series[i].tweet;
			data.username = series[i].username;
			data.value = series[i].value;
			labels.push(data.username);
			subSeries.push(data);
		}

		lastIndexGraph = i;

		new Chartist.Bar('.ct-chart', {
			labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
			series: [
				[5, 4, 3, 7, 5, 10, 3],
				[3, 2, 9, 5, 4, 6, 4]
			]
		}, {
			seriesBarDistance: 10,
			reverseData: true,
			horizontalBars: true,
			axisY: {
				offset: 70
			},
			plugins: [
				Chartist.plugins.tooltip(),
				Chartist.plugins.ctAxisTitle({
					axisX: {
						axisTitle: 'Username',
						axisClass: 'ct-axis-title',
						offset: {
							x: 0,
							y: 0
						},
						textAnchor: 'middle'
					},
					axisY: {
						axisTitle: 'Sentiment Score',
						axisClass: 'ct-axis-title',
						offset: {
							x: 0,
							y: 0
						},
						textAnchor: 'middle',
						flipTitle: false
					}
				})
			]
		});
	}

	function renderChartistExtremeResponsiveConfiguration() {
		var labels = [],
			subSeries = [];

		if (lastIndexGraph >= series.length) {
			lastIndexGraph = 0;
		}

		var len = lastIndexGraph + 100;

		if (len > series.length) {
			len = series.length;
		}

		$('#positionGraph').text(lastIndexGraph + ' - ' + len);

		for (var i = lastIndexGraph; i < len; i++) {
			var data = {};
			data.meta = series[i].tweet;
			data.username = series[i].username;
			data.value = series[i].value;
			labels.push(data.username);
			subSeries.push(data);
		}

		lastIndexGraph = i;

		new Chartist.Bar('.ct-chart', {
			labels: ['Quarter 1', 'Quarter 2', 'Quarter 3', 'Quarter 4'],
			series: [
				[5, 4, 3, 7],
				[3, 2, 9, 5],
				[1, 5, 8, 4],
				[2, 3, 4, 6],
				[4, 1, 2, 1]
			]
		}, {
			// Default mobile configuration
			stackBars: true,
			axisX: {
				labelInterpolationFnc: function(value) {
					return value.split(/\s+/).map(function(word) {
						return word[0];
					}).join('');
				}
			},
			axisY: {
				offset: 20
			},
			plugins: [
				Chartist.plugins.tooltip(),
				Chartist.plugins.ctAxisTitle({
					axisX: {
						axisTitle: 'Username',
						axisClass: 'ct-axis-title',
						offset: {
							x: 0,
							y: 0
						},
						textAnchor: 'middle'
					},
					axisY: {
						axisTitle: 'Sentiment Score',
						axisClass: 'ct-axis-title',
						offset: {
							x: 0,
							y: 0
						},
						textAnchor: 'middle',
						flipTitle: false
					}
				})
			]
		}, [
			// Options override for media > 400px
			['screen and (min-width: 400px)', {
				reverseData: true,
				horizontalBars: true,
				axisX: {
					labelInterpolationFnc: Chartist.noop
				},
				axisY: {
					offset: 60
				}
			}],
			// Options override for media > 800px
			['screen and (min-width: 800px)', {
				stackBars: false,
				seriesBarDistance: 10
			}],
			// Options override for media > 1000px
			['screen and (min-width: 1000px)', {
				reverseData: false,
				horizontalBars: false,
				seriesBarDistance: 15
			}]
		]);
	}

	function renderChartistDistributedSeries() {
		var labels = [],
			subSeries = [];

		if (lastIndexGraph >= series.length) {
			lastIndexGraph = 0;
		}

		var len = lastIndexGraph + 100;

		if (len > series.length) {
			len = series.length;
		}

		$('#positionGraph').text(lastIndexGraph + ' - ' + len);

		for (var i = lastIndexGraph; i < len; i++) {
			var data = {};
			data.meta = series[i].tweet;
			data.username = series[i].username;
			data.value = series[i].value;
			labels.push(data.username);
			subSeries.push(data);
		}

		lastIndexGraph = i;

		new Chartist.Bar('.ct-chart', {
			labels: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
			series: [20, 60, 120, 200, 180, 20, 10]
		}, {
			distributeSeries: true,
			plugins: [
				Chartist.plugins.tooltip(),
				Chartist.plugins.ctAxisTitle({
					axisX: {
						axisTitle: 'Username',
						axisClass: 'ct-axis-title',
						offset: {
							x: 0,
							y: 0
						},
						textAnchor: 'middle'
					},
					axisY: {
						axisTitle: 'Sentiment Score',
						axisClass: 'ct-axis-title',
						offset: {
							x: 0,
							y: 0
						},
						textAnchor: 'middle',
						flipTitle: false
					}
				})
			]
		});
	}

	function renderChartistLabelPlacement() {
		var labels = [],
			subSeries = [];

		if (lastIndexGraph >= series.length) {
			lastIndexGraph = 0;
		}

		var len = lastIndexGraph + 100;

		if (len > series.length) {
			len = series.length;
		}

		$('#positionGraph').text(lastIndexGraph + ' - ' + len);

		for (var i = lastIndexGraph; i < len; i++) {
			var data = {};
			data.meta = series[i].tweet;
			data.username = series[i].username;
			data.value = series[i].value;
			labels.push(data.username);
			subSeries.push(data);
		}

		lastIndexGraph = i;

		new Chartist.Bar('.ct-chart', {
			labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
			series: [
				[5, 4, 3, 7, 5, 10, 3],
				[3, 2, 9, 5, 4, 6, 4]
			]
		}, {
			axisX: {
				// On the x-axis start means top and end means bottom
				position: 'start'
			},
			axisY: {
				// On the y-axis start means left and end means right
				position: 'end'
			},
			plugins: [
				Chartist.plugins.tooltip(),
				Chartist.plugins.ctAxisTitle({
					axisX: {
						axisTitle: 'Username',
						axisClass: 'ct-axis-title',
						offset: {
							x: 0,
							y: 0
						},
						textAnchor: 'middle'
					},
					axisY: {
						axisTitle: 'Sentiment Score',
						axisClass: 'ct-axis-title',
						offset: {
							x: 0,
							y: 0
						},
						textAnchor: 'middle',
						flipTitle: false
					}
				})
			]
		});
	}
	// END: Chartist Bar Charts

	// BEGIN: Chartist Pie Charts
	function renderChartistSimplePie() {
		var len = series.length;

		var subSeries = [],
			idk = positive = neutral = negative = 0;

		for (var i = 0; i < len; i++) {
			var value = series[i].value;

			if (value == null)
				idk++;
			else if (value > 0)
				positive++;
			else if (value === 0)
				neutral++;
			else
				negative++;
		}

		subSeries.push(positive);
		subSeries.push(neutral);
		subSeries.push(negative);
		subSeries.push(idk);

		var data = {
			series: subSeries
		};

		var sum = function(a, b) {
			return a + b
		};

		new Chartist.Pie('.ct-chart', data, {
			labelInterpolationFnc: function(value) {
				return Math.round(value / data.series.reduce(sum) * 100) + '%';
			},
			plugins: [
				Chartist.plugins.tooltip()
			]
		});
	}

	function renderChartistPieWithCustomLabels() {
		var len = series.length;

		var subSeries = [],
			idk = positive = neutral = negative = 0;

		for (var i = 0; i < len; i++) {
			var value = series[i].value;

			if (value == null)
				idk++;
			else if (value > 0)
				positive++;
			else if (value === 0)
				neutral++;
			else
				negative++;
		}

		subSeries.push(positive);
		subSeries.push(neutral);
		subSeries.push(negative);
		subSeries.push(idk);

		var data = {
			labels: ['Positive', 'Neutral', 'Negative', 'Unidentified'],
			series: subSeries
		};

		var options = {
			labelInterpolationFnc: function(value) {
				return value[0]
			},
			plugins: [
				Chartist.plugins.tooltip()
			]
		};

		var responsiveOptions = [
			['screen and (min-width: 640px)', {
				chartPadding: 30,
				labelOffset: 100,
				labelDirection: 'explode',
				labelInterpolationFnc: function(value) {
					return value;
				}
			}],
			['screen and (min-width: 1024px)', {
				labelOffset: 80,
				chartPadding: 20
			}]
		];

		new Chartist.Pie('.ct-chart', data, options, responsiveOptions);
	}

	function renderChartistGauge() {
		var len = series.length;

		var subSeries = [],
			idk = positive = neutral = negative = 0;

		for (var i = 0; i < len; i++) {
			var value = series[i].value;

			if (value == null)
				idk++;
			else if (value > 0)
				positive++;
			else if (value === 0)
				neutral++;
			else
				negative++;
		}

		subSeries.push(positive);
		subSeries.push(neutral);
		subSeries.push(negative);
		subSeries.push(idk);

		new Chartist.Pie('.ct-chart', {
			series: subSeries
		}, {
			donut: true,
			donutWidth: 60,
			startAngle: 270,
			total: 200,
			showLabel: false,
			plugins: [
				Chartist.plugins.tooltip()
			]
		});
	}

	function renderChartistAnimatingDonutWithSvgAnimate() {
		var len = series.length;

		var subSeries = [],
			idk = positive = neutral = negative = 0;

		for (var i = 0; i < len; i++) {
			var value = series[i].value;

			if (value == null)
				idk++;
			else if (value > 0)
				positive++;
			else if (value === 0)
				neutral++;
			else
				negative++;
		}

		subSeries.push(positive);
		subSeries.push(neutral);
		subSeries.push(negative);
		subSeries.push(idk);

		var chart = new Chartist.Pie('.ct-chart', {
			series: subSeries,
			labels: ['Positive', 'Neutral', 'Negative', 'Unidentified']
		}, {
			donut: true,
			showLabel: true,
			plugins: [
				Chartist.plugins.tooltip()
			]
		});

		chart.on('draw', function(data) {
			if (data.type === 'slice') {
				// Get the total path length in order to use for dash array animation
				var pathLength = data.element._node.getTotalLength();

				// Set a dasharray that matches the path length as prerequisite to animate dashoffset
				data.element.attr({
					'stroke-dasharray': pathLength + 'px ' + pathLength + 'px'
				});

				// Create animation definition while also assigning an ID to the animation for later sync usage
				var animationDefinition = {
					'stroke-dashoffset': {
						id: 'anim' + data.index,
						dur: 750,
						from: -pathLength + 'px',
						to: '0px',
						easing: Chartist.Svg.Easing.easeOutQuint,
						// We need to use `fill: 'freeze'` otherwise our animation will fall back to initial (not visible)
						fill: 'freeze'
					}
				};

				// If this was not the first slice, we need to time the animation so that it uses the end sync event of the previous animation
				if (data.index !== 0) {
					animationDefinition['stroke-dashoffset'].begin = 'anim' + (data.index - 1) + '.end';
				}

				// We need to set an initial value before the animation starts as we are not in guided mode which would do that for us
				data.element.attr({
					'stroke-dashoffset': -pathLength + 'px'
				});

				// We can't use guided mode as the animations need to rely on setting begin manually
				// See http://gionkunz.github.io/chartist-js/api-documentation.html#chartistsvg-function-animate
				data.element.animate(animationDefinition, false);
			}
		});

		// For the sake of the example we update the chart every time it's created with a delay of 8 seconds
		// chart.on('created', function() {
		// 	if (window.__anim21278907124) {
		// 		clearTimeout(window.__anim21278907124);
		// 		window.__anim21278907124 = null;
		// 	}
		// window.__anim21278907124 = setTimeout(chart.update.bind(chart), 10000);
		// });
	}
	// END: Chartist Pie Charts

	$('#graph-type').on('change', function(e) {
		if ($(this).val() != 'select') {
			var regex = /([a-z]{3})(\d{1,2})/;
			var match = regex.exec($(this).val());
			type = match[1];
			index = match[2];
		}
	});

	$('#search-text').on('keypress', function(e) {
		if (e.which == 13 || e.keyCode == 13) {
			// Clear previous data
			lastIndexGraph = 0;
			lastIndexData = 0;
			series = [];
			dataSeries = [];
			html = '';

			var searchText = $(this).val().trim();
			e.preventDefault();
			if (searchText.length > 0) {
				// initiate an Ajax call to send the data
				fireAJAX(searchText);

				if (previousSearchText !== searchText)
					shouldShuffle = true;
				else
					shouldShuffle = false;

				previousSearchText = searchText;
			}
		}
	});

	$('#search-btn').on('click', function(e) {
		e.preventDefault();

		// if ($('#search-text').val().trim().length > 0) {
		// initiate an Ajax call to send the data
		// fireAJAX($('#search-text').val().trim());
		// }
		$.getJSON('logic/db/sentiments.json', function(json) {
			toggleLoader();
			parseData(json);
			shouldShuffle = false;
		});
	});

	$('#prev-graph-btn').on('click', function(e) {
		e.preventDefault();
		lastIndexGraph -= 200;
		if (lastIndexGraph <= 0) {
			lastIndexGraph = series.length - series.length % 100;
		}

		switch (type) {
			case "alc":
				if (index === '1') {
					$('.alchemy').show();
					$('.ct-chart').hide();
					renderAlchemy(tmpJSON);
				}

				break;
			case "lin":
				$('.alchemy').hide();
				$('.ct-chart').show();
				if (index === '1') {
					renderChartistSimpleLine(series);
				} else if (index === '2') {
					renderChartistHolesInData(series);
				} else if (index === '3') {
					renderChartistFilledHolesInData(series);
				} else if (index === '4') {
					renderChartistOnlyWholeNumbers(series);
				} else if (index === '5') {
					renderChartistLineScatterDiagramWithResponsiveSettings(series);
				} else if (index === '6') {
					renderChartistLineChartWithArea(series);
				} else if (index === '7') {
					renderChartistBipolarLineGraphWithAreaOnly(series);
				} else if (index === '8') {
					renderChartistUsingEventsToReplaceGraphics(series);
				} else if (index === '9') {
					renderChartistAdvancedSmilAnimations(series);
				} else if (index === '10') {
					renderChartistSvgPathAnimation(series);
				} else if (index === '11') {
					renderChartistLineInterpolationAndSmoothing(series);
				} else if (index === '12') {
					renderChartistSeriesOverrides(series);
				} else if (index === '13') {
					// renderChartistTimeSeriesWithMomentJs();
				}

				break;
			case "bar":
				$('.alchemy').hide();
				$('.ct-chart').show();
				if (index === '1') {
					renderChartistBipolarBar(series);
				} else if (index === '2') {
					renderChartistOverlappingBarsOnMobile(series);
				} else if (index === '3') {
					renderChartistAddPeakCirclesUsingTheDrawEvents(series);
				} else if (index === '4') {
					renderChartistMultilineLabels(series);
				} else if (index === '5') {
					renderChartistStackedBar(series);
				} else if (index === '6') {
					renderChartistHorizontalBar(series);
				} else if (index === '7') {
					renderChartistExtremeResponsiveConfiguration(series);
				} else if (index === '8') {
					renderChartistDistributedSeries(series);
				} else if (index === '9') {
					renderChartistLabelPlacement(series);
				}

				break;
			case "pie":
				$('.alchemy').hide();
				$('.ct-chart').show();
				if (index === '1') {
					renderChartistSimplePie(series);
				} else if (index === '2') {
					renderChartistPieWithCustomLabels(series);
				} else if (index === '3') {
					renderChartistGauge();
				} else if (index === '4') {
					renderChartistAnimatingDonutWithSvgAnimate(series);
				}

				break;
		}
	});

	$('#next-graph-btn').on('click', function(e) {
		e.preventDefault();
		switch (type) {
			case "alc":
				if (index === '1') {
					$('.alchemy').show();
					$('.ct-chart').hide();
					renderAlchemy(tmpJSON);
				}

				break;
			case "lin":
				$('.alchemy').hide();
				$('.ct-chart').show();
				if (index === '1') {
					renderChartistSimpleLine(series);
				} else if (index === '2') {
					renderChartistHolesInData(series);
				} else if (index === '3') {
					renderChartistFilledHolesInData(series);
				} else if (index === '4') {
					renderChartistOnlyWholeNumbers(series);
				} else if (index === '5') {
					renderChartistLineScatterDiagramWithResponsiveSettings(series);
				} else if (index === '6') {
					renderChartistLineChartWithArea(series);
				} else if (index === '7') {
					renderChartistBipolarLineGraphWithAreaOnly(series);
				} else if (index === '8') {
					renderChartistUsingEventsToReplaceGraphics(series);
				} else if (index === '9') {
					renderChartistAdvancedSmilAnimations(series);
				} else if (index === '10') {
					renderChartistSvgPathAnimation(series);
				} else if (index === '11') {
					renderChartistLineInterpolationAndSmoothing(series);
				} else if (index === '12') {
					renderChartistSeriesOverrides(series);
				} else if (index === '13') {
					// renderChartistTimeSeriesWithMomentJs();
				}

				break;
			case "bar":
				$('.alchemy').hide();
				$('.ct-chart').show();
				if (index === '1') {
					renderChartistBipolarBar(series);
				} else if (index === '2') {
					renderChartistOverlappingBarsOnMobile(series);
				} else if (index === '3') {
					renderChartistAddPeakCirclesUsingTheDrawEvents(series);
				} else if (index === '4') {
					renderChartistMultilineLabels(series);
				} else if (index === '5') {
					renderChartistStackedBar(series);
				} else if (index === '6') {
					renderChartistHorizontalBar(series);
				} else if (index === '7') {
					renderChartistExtremeResponsiveConfiguration(series);
				} else if (index === '8') {
					renderChartistDistributedSeries(series);
				} else if (index === '9') {
					renderChartistLabelPlacement(series);
				}

				break;
			case "pie":
				$('.alchemy').hide();
				$('.ct-chart').show();
				if (index === '1') {
					renderChartistSimplePie(series);
				} else if (index === '2') {
					renderChartistPieWithCustomLabels(series);
				} else if (index === '3') {
					renderChartistGauge();
				} else if (index === '4') {
					renderChartistAnimatingDonutWithSvgAnimate(series);
				}

				break;
		}
	});

	$('#prev-data-btn').on('click', function(e) {
		e.preventDefault();
		lastIndexData -= 200;
		if (lastIndexData <= 0) {
			lastIndexData = dataSeries.length - dataSeries.length % 100;
		}

		displayData();
	});

	$('#next-data-btn').on('click', function(e) {
		e.preventDefault();
		displayData();
	});

	function fireAJAX(text) {
		$.ajax({
			type: 'POST',
			url: '/search',
			data: {
				search: text
			},
			beforeSend: function(xhr) {
				// $('.tweet-results').html('');
				// $('.results').show();
				toggleLoader();
			},
			success: parseData,
			error: oops
		});
	}

	var toggleLoader = function() {
		var loader = $('#loader');
		loader.toggleClass('is-active');
		// var curr = loader.css('display');
		// if (curr == 'none') {
		// 	loader.css({
		// 		'display': 'block'
		// 	});
		// } else {
		// 	loader.css({
		// 		'display': 'none'
		// 	});
		// }
	};

	function parseData(data) {
		$('#itt-mood').show();
		$('#itt-graph').show();
		$('#itt-map').show();
		$('#itt-wordcloud').show();
		$('#itt-results').show();

		$('html, body').animate({
			scrollTop: $('#itt-mood').offset().top
		}, 500, 'easeInOutExpo');

		toggleLoader();
		html = '';

		var tmpJSON = {};
		tmpJSON.response = Array();

		var tweets = data;
		dataSeries = [];
		// console.log(data);

		for (var i = 0; i < tweets.length; i++) {
			var s = tweets[i].sentiment,
				t = tweets[i].tweet;

			var _o = {
				imgSrc: t.user.profile_image_url,
				backgroundImgSrc: t.user.profile_background_image_url,
				screenName: t.user.screen_name,
				name: tweets[i].user.name,
				userLink: 'http://twitter.com/' + t.user.screen_name,
				tweetId: t.id_str,
				profileLinkColor: t.user.profile_link_color,
				tweetLink: 'http://twitter.com/' + t.user.screen_name + '/status/' + t.id_str,
				tweet: t.text,
				score: s.score ? s.score : '--',
				comparative: s.comparative ? s.comparative : '--',
				favorited: t.favorite_count ? t.favorite_count : 0,
				retweet: t.retweet_count ? t.retweet_count : 0,
				wordsMatched: s.words && s.words.length ? s.words : '--',
				positiveWords: s.positive && s.positive.length ? s.positive : '--',
				negativeWords: s.negative && s.negative.length ? s.negative : '--',
				geo: t.geo,
				location: t.user.location
			};

			tmpJSON.response.push(_o);
			dataSeries.push(tmpl('tweet_tmpl', _o));
		};

		renderGraphs(type, index, tmpJSON);

		renderMap();

		renderWordCloud(tmpJSON.response);

		renderMoods();

		displayData();
	}

	function renderMoods() {
		var happyFaces = MoodJS.get('happy')[0];
		var neutralFace = MoodJS.get('neutral')[0];
		var sadFace = MoodJS.get('sad')[0];

		if (happyFace == null)
			var happyFace = MoodJS.add('happy', '.happyFace');
		if (neutralFace == null)
			var neutralFace = MoodJS.add('neutral', '.neutralFace');
		if (sadFace == null)
			var sadFace = MoodJS.add('sad', '.sadFace');

		var len = series.length;

		var count = positiveCount = neutralCount = negativeCount = 0;
		for (var i = 0; i < len; i++) {
			var temp = series[i];

			count++;
			if (temp.value == null || temp.value === 0)
				neutralCount++;
			else if (temp.value > 0)
				positiveCount++;
			else
				negativeCount++;
		}

		happyFace.setPercentageWithAnimation(positiveCount / count * 100);
		neutralFace.setPercentageWithAnimation(neutralCount / count * 100);
		sadFace.setPercentageWithAnimation(negativeCount / count * 100);

		happyFace.hideNose();
		neutralFace.hideNose();
		sadFace.hideNose();
	}

	function displayData() {
		if (lastIndexData >= dataSeries.length) {
			lastIndexData = 0;
		}

		var len = lastIndexData + 100;

		if (len > dataSeries.length) {
			len = dataSeries.length;
		}

		$('#positionData').text(lastIndexData + ' - ' + len);

		var str = '';

		for (var i = lastIndexData; i < len; i++) {
			str += dataSeries[i];
		}

		lastIndexData = i;

		$('.tweet-results').html(str);
	}

	function oops(data) {
		$('.error').show();
		toggleLoader();
	}

	var renderAlchemy = function(e) {
		D3ok();

		// // create required JSON
		// var obj = {};
		// var nodeArr = Array();
		// var edgeArr = Array();

		// // e = JSON.stringify(e);

		// // console.log(e);

		// for (var i = 0; i < e.response.length; i++) {
		// 	var cluster;
		// 	var resp = e.response[i];
		// 	if (resp.score == 0) {
		// 		cluster = 2;
		// 	} else if (resp.score > 0) {
		// 		cluster = 1;
		// 	} else {
		// 		cluster = 3;
		// 	}
		// 	var tmpNode = {};
		// 	tmpNode.id = i + 1;
		// 	tmpNode.name = resp.name;
		// 	tmpNode.cluster = cluster;
		// 	tmpNode.label = resp.score;
		// 	nodeArr.push(tmpNode);

		// 	var edge = {};
		// 	for (var j = 0; j < e.response.length; j++) {
		// 		edge.source = i + 1;
		// 		edge.target = j;
		// 	}
		// 	edgeArr.push(edge);
		// }
		// obj.nodes = nodeArr;
		// obj.edges = edgeArr;
		// // console.log(JSON.stringify(obj));

		// var config = {
		// 	// dataSource: 'logic/db/philosophers.json',
		// 	// nodeCaption: "title",
		// 	// edgeCaption: "relatedness",
		// 	// nodeCaptionsOnByDefault: true,
		// 	// nodeTypes: {
		// 	// "type": ["philosopher"]
		// 	// },
		// 	// directedEdges: true,
		// 	// nodeStyle: {
		// 	// "philosopher": {
		// 	// "radius": 18
		// 	// }
		// 	// },
		// 	forceLocked: false,
		// 	dataSource: 'logic/db/actors.json',
		// 	nodeCaption: 'name',
		// 	nodeMouseOver: 'name',
		// 	initialScale: 0.7,
		// 	initialTranslate: [250, 150],
		// 	showControlDash: true,
		// 	showStats: true,
		// 	nodeStats: true,
		// 	showFilters: true,
		// 	nodeFilters: true,
		// 	captionToggle: true,
		// 	edgesToggle: true,
		// 	nodesToggle: true,
		// 	toggleRootNotes: false,
		// 	zoomControls: true,
		// 	cluster: true,
		// 	clusterColours: ['#e91e63', '#f44336', '#4caf50', '#009688', '#ff9800'],
		// 	caption: function(node) {
		// 		return node.text;
		// 	}
		// };

		// alchemy.begin(config);
	};
});

// Simple JavaScript Templating
// John Resig - http://ejohn.org/ - MIT Licensed
(function() {
	var cache = {};

	this.tmpl = function tmpl(str, data) {
		// Figure out if we're getting a template, or if we need to
		// load the template - and be sure to cache the result.
		var fn = !/\W/.test(str) ?
			cache[str] = cache[str] ||
			tmpl(document.getElementById(str).innerHTML) :

			// Generate a reusable function that will serve as a template
			// generator (and which will be cached).
			new Function("obj",
				"var p=[],print=function(){p.push.apply(p,arguments);};" +

				// Introduce the data as local variables using with(){}
				"with(obj){p.push('" +

				// Convert the template into pure JavaScript
				str
				.replace(/[\r\t\n]/g, " ")
				.split("{{").join("\t") // modified
				.replace(/((^|\}\})[^\t]*)'/g, "$1\r") // modified
				.replace(/\t=(.*?)}}/g, "',$1,'") // modified
				.split("\t").join("');")
				.split("}}").join("p.push('") // modified
				.split("\r").join("\\'") + "');}return p.join('');");

		// Provide some basic currying to the user
		return data ? fn(data) : fn;
	};
})();
