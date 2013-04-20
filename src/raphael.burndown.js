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