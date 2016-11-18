$(document).ready(function() {

	var type, index; // For graph rendering functions
	var tweetData; // For Alchemy's init function
	var lastIndexGraph = 0;
	var lastIndexData = 0;
	var series = []; // Array to store all scores (for graph rendering)
	var dataSeries = []; // Array to store all HTML for raw data display
	var html = '';

	// BEGIN: Chartist Line Charts
	function renderChartistSimpleLine() {
		new Chartist.Line('.ct-chart', {
			labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
			series: [
				[12, 9, 7, 8, 5],
				[2, 1, 3.5, 7, 3],
				[1, 3, 4, 5, 6]
			]
		}, {
			fullWidth: true,
			chartPadding: {
				right: 40
			}
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
			data.meta = series[i].meta;
			data.value = series[i].value;
			labels.push(data.meta);
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
			chartPadding: {
				right: 10
			},
			low: Math.min.apply(null, series),
			high: Math.max.apply(null, series),
			plugins: [
				Chartist.plugins.tooltip(),
				Chartist.plugins.ctThreshold({
					threshold: 0
				}),
				Chartist.plugins.zoom({
					onZoom: onZoom
				})
			]
		});

		var resetFnc;

		function onZoom(chart, reset) {
			resetFnc = reset;
		}

		chart.on('draw', function(event) {
			if (data.type === 'point' && data.index == selectedIndex) {

			}
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

	function renderChartistFilledHolesInData() {
		var chart = new Chartist.Line('.ct-chart', {
			labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
			series: [
				[5, 5, 10, 8, 7, 5, 4, null, null, null, 10, 10, 7, 8, 6, 9],
				[10, 15, null, 12, null, 10, 12, 15, null, null, 12, null, 14, null, null, null],
				[null, null, null, null, 3, 4, 1, 3, 4, 6, 7, 9, 5, null, null, null],
				[{
					x: 3,
					y: 3
				}, {
					x: 4,
					y: 3
				}, {
					x: 5,
					y: undefined
				}, {
					x: 6,
					y: 4
				}, {
					x: 7,
					y: null
				}, {
					x: 8,
					y: 4
				}, {
					x: 9,
					y: 4
				}]
			]
		}, {
			fullWidth: true,
			chartPadding: {
				right: 10
			},
			lineSmooth: Chartist.Interpolation.cardinal({
				fillHoles: true,
			}),
			low: 0
		});
	}

	function renderChartistOnlyWholeNumbers() {
		new Chartist.Line('.ct-chart', {
			labels: [1, 2, 3, 4, 5, 6, 7, 8],
			series: [
				[1, 2, 3, 1, -2, 0, 1, 0],
				[-2, -1, -2, -1, -3, -1, -2, -1],
				[0, 0, 0, 1, 2, 3, 2, 1],
				[3, 2, 1, 0.5, 1, 0, -1, -3]
			]
		}, {
			high: 3,
			low: -3,
			fullWidth: true,
			// As this is axis specific we need to tell Chartist to use whole numbers only on the concerned axis
			axisY: {
				onlyInteger: true,
				offset: 20
			}
		});
	}

	function renderChartistLineScatterDiagramWithResponsiveSettings() {
		var times = function(n) {
			return Array.apply(null, new Array(n));
		};

		var data = times(52).map(Math.random).reduce(function(data, rnd, index) {
			data.labels.push(index + 1);
			data.series.forEach(function(series) {
				series.push(Math.random() * 100)
			});

			return data;
		}, {
			labels: [],
			series: times(4).map(function() {
				return new Array()
			})
		});

		var options = {
			showLine: false,
			axisX: {
				labelInterpolationFnc: function(value, index) {
					return index % 13 === 0 ? 'W' + value : null;
				}
			}
		};

		var responsiveOptions = [
			['screen and (min-width: 640px)', {
				axisX: {
					labelInterpolationFnc: function(value, index) {
						return index % 4 === 0 ? 'W' + value : null;
					}
				}
			}]
		];

		new Chartist.Line('.ct-chart', data, options, responsiveOptions);
	}

	function renderChartistLineChartWithArea() {
		new Chartist.Line('.ct-chart', {
			labels: [1, 2, 3, 4, 5, 6, 7, 8],
			series: [
				[5, 9, 7, 8, 5, 3, 5, 4]
			]
		}, {
			low: 0,
			showArea: true
		});
	}

	function renderChartistBipolarLineGraphWithAreaOnly() {
		new Chartist.Line('.ct-chart', {
			labels: [1, 2, 3, 4, 5, 6, 7, 8],
			series: [
				[1, 2, 3, 1, -2, 0, 1, 0],
				[-2, -1, -2, -1, -2.5, -1, -2, -1],
				[0, 0, 0, 1, 2, 2.5, 2, 1],
				[2.5, 2, 1, 0.5, 1, 0.5, -1, -2.5]
			]
		}, {
			high: 3,
			low: -3,
			showArea: true,
			showLine: false,
			showPoint: false,
			fullWidth: true,
			axisX: {
				showLabel: false,
				showGrid: false
			}
		});
	}

	function renderChartistUsingEventsToReplaceGraphics() {
		var chart = new Chartist.Line('.ct-chart', {
			labels: [1, 2, 3, 4, 5],
			series: [
				[12, 9, 7, 8, 5]
			]
		});

		// Listening for draw events that get emitted by the Chartist chart
		chart.on('draw', function(data) {
			// If the draw event was triggered from drawing a point on the line chart
			if (data.type === 'point') {
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
					style: 'fill-opacity: 1'
				}, 'ct-area');

				// With data.element we get the Chartist SVG wrapper and we can replace the original point drawn by Chartist with our newly created triangle
				data.element.replace(triangle);
			}
		});
	}

	function renderChartistAdvancedSmilAnimations() {
		var chart = new Chartist.Line('.ct-chart', {
			labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
			series: [
				[12, 9, 7, 8, 5, 4, 6, 2, 3, 3, 4, 6],
				[4, 5, 3, 7, 3, 5, 5, 3, 4, 4, 5, 5],
				[5, 3, 4, 5, 6, 3, 3, 4, 5, 6, 3, 4],
				[3, 4, 5, 6, 7, 6, 4, 5, 6, 7, 6, 3]
			]
		}, {
			low: 0
		});

		// Let's put a sequence number aside so we can use it in the event callbacks
		var seq = 0,
			delays = 80,
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
		chart.on('created', function() {
			if (window.__exampleAnimateTimeout) {
				clearTimeout(window.__exampleAnimateTimeout);
				window.__exampleAnimateTimeout = null;
			}
			window.__exampleAnimateTimeout = setTimeout(chart.update.bind(chart), 12000);
		});
	}

	function renderChartistSvgPathAnimation() {
		var chart = new Chartist.Line('.ct-chart', {
			labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
			series: [
				[1, 5, 2, 5, 4, 3],
				[2, 3, 4, 8, 1, 2],
				[5, 4, 3, 2, 1, 0.5]
			]
		}, {
			low: 0,
			showArea: true,
			showPoint: false,
			fullWidth: true
		});

		chart.on('draw', function(data) {
			if (data.type === 'line' || data.type === 'area') {
				data.element.animate({
					d: {
						begin: 2000 * data.index,
						dur: 2000,
						from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
						to: data.path.clone().stringify(),
						easing: Chartist.Svg.Easing.easeOutQuint
					}
				});
			}
		});
	}

	function renderChartistLineInterpolationAndSmoothing() {
		var chart = new Chartist.Line('.ct-chart', {
			labels: [1, 2, 3, 4, 5],
			series: [
				[1, 5, 10, 0, 1],
				[10, 15, 0, 1, 2]
			]
		}, {
			// Remove this configuration to see that chart rendered with cardinal spline interpolation
			// Sometimes, on large jumps in data values, it's better to use simple smoothing.
			lineSmooth: Chartist.Interpolation.simple({
				divisor: 2
			}),
			fullWidth: true,
			chartPadding: {
				right: 20
			},
			low: 0
		});
	}

	function renderChartistSeriesOverrides() {
		var chart = new Chartist.Line('.ct-chart', {
			labels: ['1', '2', '3', '4', '5', '6', '7', '8'],
			// Naming the series with the series object array notation
			series: [{
				name: 'series-1',
				data: [5, 2, -4, 2, 0, -2, 5, -3]
			}, {
				name: 'series-2',
				data: [4, 3, 5, 3, 1, 3, 6, 4]
			}, {
				name: 'series-3',
				data: [2, 4, 3, 1, 4, 5, 3, 2]
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
					lineSmooth: Chartist.Interpolation.simple(),
					showArea: true
				},
				'series-3': {
					showPoint: false
				}
			}
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
	function renderChartistBipolarBar() {
		var data = {
			labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10'],
			series: [
				[1, 2, 4, 8, 6, -2, -1, -4, -6, -2]
			]
		};

		var options = {
			high: 10,
			low: -10,
			axisX: {
				labelInterpolationFnc: function(value, index) {
					return index % 2 === 0 ? value : null;
				}
			}
		};

		new Chartist.Bar('.ct-chart', data, options);
	}

	function renderChartistOverlappingBarsOnMobile() {
		var data = {
			labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
			series: [
				[5, 4, 3, 7, 5, 10, 3, 4, 8, 10, 6, 8],
				[3, 2, 9, 5, 4, 6, 4, 6, 7, 8, 7, 4]
			]
		};

		var options = {
			seriesBarDistance: 10
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

	function renderChartistAddPeakCirclesUsingTheDrawEvents() {
		// Create a simple bi-polar bar chart
		var chart = new Chartist.Bar('.ct-chart', {
			labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10'],
			series: [
				[1, 2, 4, 8, 6, -2, -1, -4, -6, -2]
			]
		}, {
			high: 10,
			low: -10,
			axisX: {
				labelInterpolationFnc: function(value, index) {
					return index % 2 === 0 ? value : null;
				}
			}
		});

		// Listen for draw events on the bar chart
		chart.on('draw', function(data) {
			// If this draw event is of type bar we can use the data to create additional content
			if (data.type === 'bar') {
				// We use the group element of the current series to append a simple circle with the bar peek coordinates and a circle radius that is depending on the value
				data.group.append(new Chartist.Svg('circle', {
					cx: data.x2,
					cy: data.y2,
					r: Math.abs(Chartist.getMultiValue(data.value)) * 2 + 5
				}, 'ct-slice-pie'));
			}
		});
	}

	function renderChartistMultilineLabels() {
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
			}
		});
	}

	function renderChartistStackedBar() {
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
			}
		}).on('draw', function(data) {
			if (data.type === 'bar') {
				data.element.attr({
					style: 'stroke-width: 30px'
				});
			}
		});
	}

	function renderChartistHorizontalBar() {
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
			}
		});
	}

	function renderChartistExtremeResponsiveConfiguration() {
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
			}
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
		new Chartist.Bar('.ct-chart', {
			labels: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
			series: [20, 60, 120, 200, 180, 20, 10]
		}, {
			distributeSeries: true
		});
	}

	function renderChartistLabelPlacement() {
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
			}
		});
	}
	// END: Chartist Bar Charts

	// BEGIN: Chartist Pie Charts
	function renderChartistSimplePie() {
		var data = {
			series: [5, 3, 4]
		};

		var sum = function(a, b) {
			return a + b
		};

		new Chartist.Pie('.ct-chart', data, {
			labelInterpolationFnc: function(value) {
				return Math.round(value / data.series.reduce(sum) * 100) + '%';
			}
		});
	}

	function renderChartistPieWithCustomLabels() {
		var data = {
			labels: ['Bananas', 'Apples', 'Grapes'],
			series: [20, 15, 40]
		};

		var options = {
			labelInterpolationFnc: function(value) {
				return value[0]
			}
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
		new Chartist.Pie('.ct-chart', {
			series: [20, 10, 30, 40]
		}, {
			donut: true,
			donutWidth: 60,
			startAngle: 270,
			total: 200,
			showLabel: false
		});
	}

	function renderChartistAnimatingDonutWithSvgAnimate() {
		var chart = new Chartist.Pie('.ct-chart', {
			series: [10, 20, 50, 20, 5, 50, 15],
			labels: [1, 2, 3, 4, 5, 6, 7]
		}, {
			donut: true,
			showLabel: false
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
						dur: 1000,
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
		chart.on('created', function() {
			if (window.__anim21278907124) {
				clearTimeout(window.__anim21278907124);
				window.__anim21278907124 = null;
			}
			window.__anim21278907124 = setTimeout(chart.update.bind(chart), 10000);
		});
	}
	// END: Chartist Pie Charts

	$('#itt-features').hide();
	$('#itt-results').hide();

	function renderGraphs(type, index, tmpJSON) {
		var response = tmpJSON.response;

		for (var i = 0; i < response.length; i++) {
			var data = {};
			data.meta = response[i].name;
			data.value = response[i].score == '--' ? null : response[i].score;
			series.push(data);
		}

		$('.alchemy').hide();
		$('.ct-chart').hide();

		// type = 'lin';
		// index = '2';

		switch (type) {
			case "alc":
				if (index == '1') {
					$('.alchemy').show();
					$('.ct-chart').hide();
					renderAlchemy(tmpJSON);
				}

				break;
			case "lin":
				$('.alchemy').hide();
				$('.ct-chart').show();
				if (index == '1') {
					renderChartistSimpleLine();
				} else if (index == '2') {
					renderChartistHolesInData(series);
				} else if (index == '3') {
					renderChartistFilledHolesInData();
				} else if (index == '4') {
					renderChartistOnlyWholeNumbers();
				} else if (index == '5') {
					renderChartistLineScatterDiagramWithResponsiveSettings();
				} else if (index == '6') {
					renderChartistLineChartWithArea();
				} else if (index == '7') {
					renderChartistBipolarLineGraphWithAreaOnly();
				} else if (index == '8') {
					renderChartistUsingEventsToReplaceGraphics();
				} else if (index == '9') {
					renderChartistAdvancedSmilAnimations();
				} else if (index == '10') {
					renderChartistSvgPathAnimation();
				} else if (index == '11') {
					renderChartistLineInterpolationAndSmoothing();
				} else if (index == '12') {
					renderChartistSeriesOverrides();
				} else if (index == '13') {
					// renderChartistTimeSeriesWithMomentJs();
				}

				break;
			case "bar":
				$('.alchemy').hide();
				$('.ct-chart').show();
				if (index == '1') {
					renderChartistBipolarBar();
				} else if (index == '2') {
					renderChartistOverlappingBarsOnMobile();
				} else if (index == '3') {
					renderChartistAddPeakCirclesUsingTheDrawEvents();
				} else if (index == '4') {
					renderChartistMultilineLabels();
				} else if (index == '5') {
					renderChartistStackedBar();
				} else if (index == '6') {
					renderChartistHorizontalBar();
				} else if (index == '7') {
					renderChartistExtremeResponsiveConfiguration();
				} else if (index == '8') {
					renderChartistDistributedSeries();
				} else if (index == '9') {
					renderChartistLabelPlacement();
				}

				break;
			case "pie":
				$('.alchemy').hide();
				$('.ct-chart').show();
				if (index == '1') {
					renderChartistSimplePie();
				} else if (index == '2') {
					renderChartistPieWithCustomLabels();
				} else if (index == '3') {
					renderChartistGauge();
				} else if (index == '4') {
					renderChartistAnimatingDonutWithSvgAnimate();
				}

				break;
		}
	}

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
			e.preventDefault();
			if ($(this).val().trim().length > 0) {
				// initiate an Ajax call to send the data
				fireAJAX($(this).val().trim());
			}
		}
	});

	$('#search-btn').on('click', function(e) {
		e.preventDefault();

		// if ($('#search-text').val().trim().length > 0) {
		// initiate an Ajax call to send the data
		// fireAJAX($('#search-text').val().trim());
		// }
		$.getJSON('data/blah.json', function(json) {
			parseData(json);
		});
	});

	$('#prev-graph-btn').on('click', function(e) {
		e.preventDefault();
		lastIndexGraph -= 200;
		if (lastIndexGraph <= 0) {
			lastIndexGraph = series.length - series.length % 100;
		}

		renderChartistHolesInData(series);
	});

	$('#next-graph-btn').on('click', function(e) {
		e.preventDefault();
		renderChartistHolesInData(series);
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
		$('#itt-features').show();
		$('#itt-results').show();

		$('html, body').animate({
			scrollTop: $('#itt-features').offset().top
		}, 500, 'easeInOutExpo');

		toggleLoader();
		html = '';

		var tmpJSON = {};
		tmpJSON.response = Array();

		var tweets = data;
		dataSeries = [];
		// console.log(data);

		for (var i = 0; i < tweets.length; i++) {
			// console.log(tweets[i]);
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
				negativeWords: s.negative && s.negative.length ? s.negative : '--'
			};

			tmpJSON.response.push(_o);
			dataSeries.push(tmpl('tweet_tmpl', _o));
		};

		renderGraphs(type, index, tmpJSON);

		displayData();
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
		// create required JSON
		var obj = {};
		var nodeArr = Array();
		var edgeArr = Array();

		// e = JSON.stringify(e);

		// console.log(e);

		for (var i = 0; i < e.response.length; i++) {
			var cluster;
			var resp = e.response[i];
			if (resp.score == 0) {
				cluster = 2;
			} else if (resp.score > 0) {
				cluster = 1;
			} else {
				cluster = 3;
			}
			var tmpNode = {};
			tmpNode.id = i + 1;
			tmpNode.name = resp.name;
			tmpNode.cluster = cluster;
			tmpNode.label = resp.score;
			nodeArr.push(tmpNode);

			var edge = {};
			for (var j = 0; j < e.response.length; j++) {
				edge.source = i + 1;
				edge.target = j;
			}
			edgeArr.push(edge);
		}
		obj.nodes = nodeArr;
		obj.edges = edgeArr;
		// console.log(JSON.stringify(obj));

		var config = {
			forceLocked: false,

			dataSource: 'data/actors.json',

			nodeCaption: 'name',
			nodeMouseOver: 'name',

			cluster: true,
			clusterColours: ['#e91e63', '#f44336', '#4caf50', '#009688', '#ff9800'],

			// showControlDash: true,

			// showStats: true,
			// nodeStats: true,

			// showFilters: true,
			// nodeFilters: true,

			zoomControls: true,
			initialScale: 0.5,
			caption: function(node) {
				return node.text;
			}
		};

		alchemy.begin(config);
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
