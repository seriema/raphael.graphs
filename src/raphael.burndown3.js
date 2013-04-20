(function(r) {
	'use strict';

	var defaults = {
		animation: {
			delay: 1000,
			delay2: 1600,
			speed: 600,
			type: 'bounce'
		},
		areaOpacity: 0.2,
		axisColor: 'white',
		colors: {
			burndown: '#2375BB',
			stroke: '#C86D44'
		},
		gutter: {
			x: 45,
			y: 15
		},
		font: {
			'font-family': 'Segoe UI, Arial',
			'font-size': 13,
			'font-weight': 'bold',
			'text-anchor': 'start'
		}
	};

	var _private = {
		axisStepLength: function(fullLength, gutter, steps) {
			return (fullLength - gutter) / steps;
		}
	};

	var math = {
		createPath: function(width, height, storyPoints) {
			var xStep = math.xStepLength(width, math.findXMax(storyPoints));
			var yStep = math.yStepLength(height, math.findYMax(storyPoints));
			var xValues = [];
			var yValues = [];

			for (var i = 0; i < storyPoints.length; i++) {
				var x = math.mapX(i, xStep);
				var y = math.mapY(storyPoints[i], yStep, height);
				xValues.push(x);
				yValues.push(y);
			}

			return { x: xValues, y: yValues };
		},

		findXMax: function(stories) {
			return stories.length-1;
		},

		findYMax: function(stories) {
			var max = 0;

			for (var i = 0, pn = stories.length; i < pn; i++)
				if (max < stories[i])
					max = stories[i];

			return max;
		},

        findYMin: function(stories) {
            var min = Infinity;

            for (var i = 0, pn = stories.length; i < pn; i++)
                if (min > stories[i])
                    min = stories[i];

            return min;
        },

        invertY: function(height, y) {
			return height - y - defaults.gutter.y;
		},

		mapX: function(value, xStep) {
			return value * xStep + defaults.gutter.x;
		},

		mapY: function(value, yStep, height) {
			return math.invertY(height, value * yStep);
		},

        toAreaPath: function(xValues, yValues) {
            var path = math.toPath(xValues, yValues);
            path += ',L' + xValues[0] + ' ' + math.findYMin(yValues);
            path += ',Z';
            return path;
        },

		toPath: function(xValues, yValues) {
			var path = '';
			var min = xValues.length < yValues.length ? xValues.length : yValues.length;

			for (var i = 0; i < min; i++) {
				var p = i === 0 ? 'M' : ',L';
				var x = xValues[i];
				var y = yValues[i];
				path += p + x + ' ' + y;
			}

			return path;
		},

		xStepLength: function(width, steps) {
			return _private.axisStepLength(width, defaults.gutter.x, steps);
		},

		yStepLength: function(height, steps) {
			return _private.axisStepLength(height, defaults.gutter.y, steps);
		}
	};

/*
function createPath(storyPoints) {
	var xStep = math.xStepLength(width, storyPoints.length);
	var yStep = math.yStepLength(height, yMax);
	var xValues = [];
	var yValues = [];

	for (var i = 0; i < storyPoints.length; i++) {
		var x = i * xStep + defaults.gutter.x;
		var y = invertY(storyPoints[i] * yStep);
		xValues.push(x);
		yValues.push(y);
	}
	
	return math.toPath(xValues, yValues);
}
*/

	var burndown = function(guidelineDataStop, burndownDataStop, labels, width, height, colors) {
			var burndown = {};
			var paper = this;
			var invertY = math.invertY.bind(null, height);
			var yMax = math.findYMax(burndownDataStop[0]);

			function createPath(yValues) {
				var xStep = (width - defaults.gutter.x) / (yValues.length - 1);
				var yStep = (height - defaults.gutter.y) / yMax;
				var path = 'M' + defaults.gutter.x + ',' + invertY(yValues[0] * yStep);

				for (var i = 1; i < yValues.length; i++) {
					var x = i * xStep + defaults.gutter.x;
					var y = invertY(yValues[i] * yStep);
					path += 'L' + x + ',' + y;
				}

				return path;
			}

			function createArea(yValues) {
				var path = createPath(yValues);

				path += 'L' + defaults.gutter.x + ',' + invertY(0);
				path += 'Z';

				return path;
			}

			function createHAxisPath(steps) {
				var xStep = (width - defaults.gutter.x) / (steps - 1);
				var path = '';

				for (var i = 0; i < steps; i++) {
					var x = i * xStep + defaults.gutter.x;
					path += 'M' + x + ',' + 0;
					path += 'L' + x + ',' + invertY(0);
				}

				return path;
			}

			function animatePath(target, newPath) {
				target.animate({
					path: newPath
				}, defaults.animation.speed, defaults.animation.type);
			}

			function plotLine(dataStart, dataStop, color) {
				var burndownPathStart = createPath(dataStart);
				var burndownPathStop = createPath(dataStop);

				var burndown = paper.path(burndownPathStart);
				burndown.attr({
					'stroke-width': (color && 2) || 3,
					stroke: color
				});

				setTimeout(function() {
					animatePath(burndown, burndownPathStop);
				}, defaults.animation.delay);
				defaults.animation.delay += 200;

				return burndown;
			}

			function plotBurndown(burndownDataStart, burndownDataStop, color) {
				var burndownAreaStart = createArea(burndownDataStart);
				var burndownAreaStop = createArea(burndownDataStop);

				var burndownArea = paper.path(burndownAreaStart);
				burndownArea.attr({
					'stroke-width': 0,
					fill: color
				});

				var burndown = plotLine(burndownDataStart, burndownDataStop, color);

				setTimeout(function() {
					animatePath(burndownArea, burndownAreaStop);
				}, defaults.animation.delay);
				setTimeout(function() {
					burndownArea.animate({
						'fill-opacity': defaults.areaOpacity
					}, defaults.animation.speed, '>');
				}, defaults.animation.delay2);

				return {
					line: burndown,
					area: burndownArea
				};
			}
/*
		function plotGuideline(guidelineDataStart, guidelineDataStop) {
			var guidelineStart = createPath(guidelineDataStart);
			var guidelineStop = createPath(guidelineDataStop);

			var guideline = paper.path(guidelineStart);
			guideline.attr({ 'stroke-width': 1, stroke: '#AAA' });

			setTimeout(function () {
				animatePath(guideline, guidelineStop);
			}, 1000);

			return guideline;
		}
*/
			function plotHAxis(labels) {
				var xStep = (width - defaults.gutter.x) / (labels.length - 1);

				var labelArray = [];

				for (var i = labels.length; i--;) {
					var x = defaults.gutter.x + xStep * i;
					var y = height;
					labelArray[i] = paper.text(x, y, labels[i]).attr(defaults.font);
				}

				var vAxisPath = createHAxisPath(labels.length);
				var grid = paper.path(vAxisPath).attr({
					stroke: defaults.axisColor
				});

				return {
					grid: grid,
					labels: labelArray
				};
			}

			function plotVAxis() {
				var label1 = paper.text(0, invertY(defaults.gutter.y), '0\nTasks').attr(defaults.font);
				var label2 = paper.text(0, defaults.gutter.y, yMax + '\nTasks').attr(defaults.font);

				return [label1, label2];
			}


			var guidelineDataStart = [];
			var burndownDataStart = [];

			for (var gi = 0, gn = guidelineDataStop.length; gi < gn; gi++)
				guidelineDataStart.push(0);
			for (var bi = 0, bn = burndownDataStop[0].length; bi < bn; bi++)
				burndownDataStart.push(0);

			burndown.burndown = plotBurndown(burndownDataStart, burndownDataStop[0], (colors && colors[0]) || defaults.colors.burndown);
			for (var i = 1, n = burndownDataStop.length; i < n; i++)
				plotLine(burndownDataStart, burndownDataStop[i], (colors && colors[i]) || defaults.colors.stroke);
			burndown.hAxis = plotHAxis(labels);
			burndown.vAxis = plotVAxis();
			//burndown.guideline = plotGuideline(guidelineDataStart, guidelineDataStop);
			return burndown;
		};


	r.fn.burndown3 = burndown;
	r.fn.burndown3.defaults = defaults;
	r.fn.burndown3.math = math;
}(Raphael));
