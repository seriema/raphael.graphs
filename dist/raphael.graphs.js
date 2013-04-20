/*! Raphaël Graphs - v0.0.1 - 2013-04-20
* https://github.com/seriema/jp.js
* Copyright (c) 2013 John-Philip Johansson; Licensed MIT */
(function (r) {
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
		barColor: '#2375BB',
		gutter: { x: 40, y: 15 },
		font: {
			'font-family': 'Segoe UI, Arial',
			'font-size': 13,
			'font-weight': 'bold',
			'text-anchor': 'start'
		}
	};


	r.fn.burndown = function (guidelineDataStart, guidelineDataStop, burndownDataStart, burndownDataStop, labels, width, height, yMax) {
		var burndown = {};
		var paper = this;

		function invertY(y) {
			return height - y - defaults.gutter.y;
		}

		function createPath(yValues) {
			var xStep = (width - defaults.gutter.x) / (yValues.length - 1);
			var yStep = (height - defaults.gutter.y) / yMax;
			var path = 'M' + defaults.gutter.x + ',' + invertY(yValues[0] * yStep);
			console.log(path);
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
			target.animate({ path: newPath }, defaults.animation.speed, defaults.animation.type);
		}

		function plotBurndown(burndownDataStart, burndownDataStop) {
			var burndownPathStart = createPath(burndownDataStart);
			var burndownPathStop = createPath(burndownDataStop);
			var burndownAreaStart = createArea(burndownDataStart);
			var burndownAreaStop = createArea(burndownDataStop);


			var burndown = paper.path(burndownPathStart);
			burndown.attr({ 'stroke-width': 3, stroke: defaults.barColor });
			var burndownArea = paper.path(burndownAreaStart);
			burndownArea.attr({ 'stroke-width': 0, fill: defaults.barColor });

			setTimeout(function () {
				animatePath(burndownArea, burndownAreaStop);
				animatePath(burndown, burndownPathStop);
			}, defaults.animation.delay);

			setTimeout(function () {
				burndownArea.animate({ 'fill-opacity': defaults.areaOpacity }, defaults.animation.speed, '>');
			}, defaults.animation.delay2);

			return {
				line: burndown,
				area: burndownArea
			};
		}

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

		function plotHAxis(labels) {
			var xStep = (width - defaults.gutter.x) / (labels.length - 1);

			var labelArray = [];

			for (var i = labels.length; i--; ) {
				var x = defaults.gutter.x + xStep * i;
				var y = height;
				labelArray[i] = paper.text(x, y, labels[i]).attr(defaults.font);
			}

			var vAxisPath = createHAxisPath(labels.length);
			var grid = paper.path(vAxisPath).attr({ stroke: defaults.axisColor });

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




		burndown.burndown = plotBurndown(burndownDataStart, burndownDataStop);
		burndown.hAxis = plotHAxis(labels);
		burndown.vAxis = plotVAxis();
		burndown.guideline = plotGuideline(guidelineDataStart, guidelineDataStop);

		return burndown;
	};
} (Raphael));
(function (r) {
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
		gutter: { x: 45, y: 15 },
		font: {
			'font-family': 'Segoe UI, Arial',
			'font-size': 13,
			'font-weight': 'bold',
			'text-anchor': 'start'
		}
	};


	r.fn.burndown2 = function (guidelineDataStart, guidelineDataStop, burndownDataStart, burndownDataStop, labels, width, height, yMax, colors) {
		var burndown = {};
		var paper = this;

		function invertY(y) {
			return height - y - defaults.gutter.y;
		}

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
			target.animate({ path: newPath }, defaults.animation.speed, defaults.animation.type);
		}

		function plotLine(dataStart, dataStop, color) {
			var burndownPathStart = createPath(dataStart);
			var burndownPathStop = createPath(dataStop);

			var burndown = paper.path(burndownPathStart);
			burndown.attr({ 'stroke-width': (color && 2) || 3, stroke: color || '#2375BB' });

			setTimeout(function () {
				animatePath(burndown, burndownPathStop);
			}, defaults.animation.delay);
            defaults.animation.delay += 200;

			return burndown;
		}

		function plotBurndown(burndownDataStart, burndownDataStop) {
			var burndownAreaStart = createArea(burndownDataStart);
			var burndownAreaStop = createArea(burndownDataStop);

			var burndownArea = paper.path(burndownAreaStart);
			burndownArea.attr({ 'stroke-width': 0, fill: '#2375BB' });

			var burndown = plotLine(burndownDataStart, burndownDataStop);

			setTimeout(function () {
				animatePath(burndownArea, burndownAreaStop);
			}, defaults.animation.delay);
			setTimeout(function () {
				burndownArea.animate({ 'fill-opacity': defaults.areaOpacity }, defaults.animation.speed, '>');
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

			for (var i = labels.length; i--; ) {
				var x = defaults.gutter.x + xStep * i;
				var y = height;
				labelArray[i] = paper.text(x, y, labels[i]).attr(defaults.font);
			}

			var vAxisPath = createHAxisPath(labels.length);
			var grid = paper.path(vAxisPath).attr({ stroke: defaults.axisColor });

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




		burndown.burndown = plotBurndown(burndownDataStart, burndownDataStop[0]);
		for (var i = 1, n = burndownDataStop.length; i < n; i++)
			plotLine(burndownDataStart, burndownDataStop[i], colors[i]);
		burndown.hAxis = plotHAxis(labels);
		burndown.vAxis = plotVAxis();
		//burndown.guideline = plotGuideline(guidelineDataStart, guidelineDataStop);

		return burndown;
	};
} (Raphael));
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

(function (Raphael) {
	'use strict';

	var arcBase = { thickness: 40, radius: 100, total: 100, animTime: 1500, animType: 'bounce' };
	var circleBase = { radius: 70, thickness: 10 };
	var arrowBase = { src: 'arrow-right.jpg', width: 80, height: 80, animTime: 1000 };
	var paperBase = { centerX: 0, centerY: 0 };
	var backgroundBase = { color: '#E0E0E0', radius: 100, thickness: 40 };

	var jp = function (paper) {
		paper.customAttributes.arc = function (xloc, yloc, value, total, R) {
			var alpha = 360 / total * value,
				a = (90 - alpha) * Math.PI / 180,
				x = xloc + R * Math.cos(a),
				y = yloc - R * Math.sin(a),
				path;
			if (total === value) {
				path = [
					['M', xloc, yloc - R],
					['A', R, R, 0, 1, 1, xloc - 0.01, yloc - R]
				];
			} else {
				path = [
					['M', xloc, yloc - R],
					['A', R, R, 0, +(alpha > 180), 1, x, y]
				];
			}
			return {
				path: path
			};
		};

		return paper;
	};

	var jparc = function (paper, options) {
		options.thickness = options.thickness || arcBase.thickness;
		options.radius = options.radius || arcBase.radius;
		options.total = options.total || arcBase.total;
		options.animTime = options.animTime || arcBase.animTime;
		options.animType = options.animType || arcBase.animType;

		var arc = paper.path().attr({
			'stroke': options.color,
			'stroke-width': options.thickness,
			arc: [paperBase.centerX, paperBase.centerY, 0, options.total, options.radius]
		});

		arc.animate({
			arc: [paperBase.centerX, paperBase.centerY, options.completeness, options.total, options.radius]
		}, options.animTime, options.animType);

		return arc;
	};

	var jpcircle = function (paper, options, defaultOptions) {
		options.thickness = options.thickness || defaultOptions.thickness;
		options.radius = options.radius || defaultOptions.radius;

		var circle = paper.circle(paperBase.centerX, paperBase.centerY, options.radius);

		circle.attr({ stroke: options.color, 'stroke-width': options.thickness });

		return circle;
	};

	var jparrow = function (paper, options) {
		options.src = options.src || arrowBase.src;
		options.width = options.width || arrowBase.width;
		options.height = options.height || arrowBase.height;
		options.animTime = options.animTime || arrowBase.animTime;

		var arrow = paper.image(options.src, paperBase.centerX - options.width / 2, paperBase.centerY - options.height / 2, options.width, options.height);

		arrow.animate({ transform: 'r' + options.angle }, options.animTime, options.animType);

		return arrow;
	};

	var pauline = function (paper, arrow, circle, arc1, arc2, background) {
		jp(paper);

		paperBase.centerX = (paper.width / 2) || paperBase.centerX;
		paperBase.centerY = (paper.height / 2) || paperBase.centerY;
		arcBase.radius = (paperBase.centerX - arc1.thickness / 2) || arcBase.radius;
		circleBase.radius = (arcBase.radius - arc1.thickness / 2 - circle.thickness) || circleBase.radius;
		backgroundBase.radius = arcBase.radius || backgroundBase.radius;
		backgroundBase.thickness = arc1.thickness || arc2.thickness || backgroundBase.thickness;

		jpcircle(paper, background, backgroundBase);
		jparc(paper, arc2);
		jparc(paper, arc1);
		jpcircle(paper, circle, circleBase);
		jparrow(paper, arrow);
	};

    Raphael.fn.pauline = function (arrow, circle, arc1, arc2, background) {
        pauline(this, arrow, circle, arc1, arc2, background);
    };

	/*
	Raphael.fn.arc = function (xloc, yloc, value, total, R) {
	return this.path({
	arc: [xloc, yloc, value, total, R]
	});
	};
	*/
} (Raphael));

(function (Raphael) {
	'use strict';

    var arcBase = { thickness: 40, radius: 100, total: 100, animTime: 1500, animType: 'bounce' };
    var circleBase = { radius: 70, thickness: 10 };
    var arrowBase = { src: 'arrow-right.jpg', width: 80, height: 80, animTime: 1000 };
    var paperBase = { centerX: 0, centerY: 0 };
    var backgroundBase = { color: '#E0E0E0', radius: 100, thickness: 40 };

    var jp = function (paper) {
        paper.customAttributes.arc = function (xloc, yloc, value, total, R) {
            var alpha = 360 / total * value,
                a = (90 - alpha) * Math.PI / 180,
                x = xloc + R * Math.cos(a),
                y = yloc - R * Math.sin(a),
                path;
            if (total === value) {
                path = [
                    ['M', xloc, yloc - R],
                    ['A', R, R, 0, 1, 1, xloc - 0.01, yloc - R]
                ];
            } else {
                path = [
                    ['M', xloc, yloc - R],
                    ['A', R, R, 0, +(alpha > 180), 1, x, y]
                ];
            }
            return {
                path: path
            };
        };

        return paper;
    };

    var jparc = function (paper, options) {
        options.thickness = options.thickness || arcBase.thickness;
        options.radius = options.radius || arcBase.radius;
        options.total = options.total || arcBase.total;
        options.animTime = options.animTime || arcBase.animTime;
        options.animType = options.animType || arcBase.animType;

        var arc = paper.path().attr({
            'stroke': options.color,
            'stroke-width': options.thickness,
            arc: [paperBase.centerX, paperBase.centerY, 0, options.total, options.radius]
        });

        arc.animate({
            arc: [paperBase.centerX, paperBase.centerY, options.completeness, options.total, options.radius]
        }, options.animTime, options.animType);

        return arc;
    };

    var jparcs = function (paper, arcs, options) {
        for(var i = 0, n = arcs.length; i < n; i++) {
            jparc(paper, arcs[i], options);
        }
    };

    var jpcircle = function (paper, options, defaultOptions) {
        options.thickness = options.thickness || defaultOptions.thickness;
        options.radius = options.radius || defaultOptions.radius;

        var circle = paper.circle(paperBase.centerX, paperBase.centerY, options.radius);

        circle.attr({ stroke: options.color, 'stroke-width': options.thickness });

        return circle;
    };

    var jparrow = function (paper, options) {
        options.src = options.src || arrowBase.src;
        options.width = options.width || arrowBase.width;
        options.height = options.height || arrowBase.height;
        options.animTime = options.animTime || arrowBase.animTime;

        var arrow = paper.image(options.src, paperBase.centerX - options.width / 2, paperBase.centerY - options.height / 2, options.width, options.height);

        arrow.animate({ transform: 'r' + options.angle }, options.animTime, options.animType);

        return arrow;
    };

    var pauline = function (paper, arrow, circle, arcs, background, options) {
        jp(paper);

        paperBase.centerX = (paper.width / 2) || paperBase.centerX;
        paperBase.centerY = (paper.height / 2) || paperBase.centerY;
        arcBase.radius = (paperBase.centerX - arcs.thickness / 2) || arcBase.radius;
        circleBase.radius = (arcBase.radius - arcs.thickness / 2 - circle.thickness) || circleBase.radius;
        backgroundBase.radius = arcBase.radius || backgroundBase.radius;
        backgroundBase.thickness = arcs.thickness || backgroundBase.thickness;

        jpcircle(paper, background, backgroundBase);
        jparcs(paper, arcs, options);
        jpcircle(paper, circle, circleBase);
        jparrow(paper, arrow);
    };

    Raphael.fn.pauline2 = function (arrow, circle, arcs, background, options) {
        pauline(this, arrow, circle, arcs, background, options);
        return this;
    };
} (Raphael));

(function (Raphael) {
	'use strict';

    var arcBase = { thickness: 40, radius: 100, total: 100, animTime: 1500, animType: 'bounce' };
    var circleBase = { radius: 70, thickness: 10 };
    var arrowBase = { src: 'arrow-right.jpg', width: 80, height: 80, animTime: 1000 };
    var paperBase = { centerX: 0, centerY: 0 };
    var backgroundBase = { color: '#E0E0E0', radius: 100, thickness: 40 };

    var jp = function (paper) {
        paper.customAttributes.arc = function (xloc, yloc, value, total, R) {
            var alpha = 360 / total * value,
                a = (90 - alpha) * Math.PI / 180,
                x = xloc + R * Math.cos(a),
                y = yloc - R * Math.sin(a),
                path;
            if (total === value) {
                path = [
                    ['M', xloc, yloc - R],
                    ['A', R, R, 0, 1, 1, xloc - 0.01, yloc - R]
                ];
            } else {
                path = [
                    ['M', xloc, yloc - R],
                    ['A', R, R, 0, +(alpha > 180), 1, x, y]
                ];
            }
            return {
                path: path
            };
        };

        return paper;
    };

    var jparc = function (paper, options) {
        options.thickness = options.thickness || arcBase.thickness;
        options.radius = options.radius || arcBase.radius;
        options.total = options.total || arcBase.total;
        options.animTime = options.animTime || arcBase.animTime;
        options.animType = options.animType || arcBase.animType;

        var arc = paper.path().attr({
            'stroke': options.color,
            'stroke-width': options.thickness,
            arc: [paperBase.centerX, paperBase.centerY, 0, options.total, options.radius]
        });

        arc.animate({
            arc: [paperBase.centerX, paperBase.centerY, options.completeness, options.total, options.radius]
        }, options.animTime, options.animType);

        return arc;
    };

    var jparcs = function (paper, arcs, options) {
        for(var i = 0, n = arcs.length; i < n; i++) {
            jparc(paper, arcs[i], options);
        }
    };

    var jpcircle = function (paper, options, defaultOptions) {
        options.thickness = options.thickness || defaultOptions.thickness;
        options.radius = options.radius || defaultOptions.radius;

        var circle = paper.circle(paperBase.centerX, paperBase.centerY, options.radius);

        circle.attr({ stroke: options.color, 'stroke-width': options.thickness });

        return circle;
    };

    var jparrow = function (paper, options) {
        options.src = options.src || arrowBase.src;
        options.width = options.width || arrowBase.width;
        options.height = options.height || arrowBase.height;
        options.animTime = options.animTime || arrowBase.animTime;

        var arrow = paper.image(options.src, paperBase.centerX - options.width / 2, paperBase.centerY - options.height / 2, options.width, options.height);

        arrow.animate({ transform: 'r' + options.angle }, options.animTime, options.animType);

        return arrow;
    };

    var pauline = function (paper, arrow, circle, arcs, background, options) {
        jp(paper);

        paperBase.centerX = (paper.width / 2) || paperBase.centerX;
        paperBase.centerY = (paper.height / 2) || paperBase.centerY;
        arcBase.radius = (paperBase.centerX - arcs.thickness / 2) || arcBase.radius;
        circleBase.radius = (arcBase.radius - arcs.thickness / 2 - circle.thickness) || circleBase.radius;
        backgroundBase.radius = arcBase.radius || backgroundBase.radius;
        backgroundBase.thickness = arcs.thickness || backgroundBase.thickness;

        jpcircle(paper, background, backgroundBase);
        jparcs(paper, arcs, options);
        jpcircle(paper, circle, circleBase);
        jparrow(paper, arrow);
    };

    Raphael.fn.pauline3 = function (arrow, circle, arcs, background, options) {
        pauline(this, arrow, circle, arcs, background, options);
        return this;
    };
} (Raphael));