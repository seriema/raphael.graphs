(function() {
	'use strict';

	module('Burndown.attributes');

	var paper;
	var guidelineDataStop = [25, 0];
	var burndownData1 = [25,21,20,17,15, 12,11,10,8, 7,5,3,0];
	var burndownData2 = [25,24,23,19,19, 17,15,12,11, 9,8,5,2];
	var burndownData3 = [25,20,18,14,12, 10,8,6,5, 3,1,0,0];
	var burndownData4 = [25,21,21,19,17, 14,13,11,9, 7,7,4,1];
	var burndownDataStop = [burndownData1, burndownData2, burndownData3, burndownData4];
//	var colors = ['#001', '#002', '#003', '#004'];
	var labels = ['Jan', '', '', '', '', 'Feb', '', '', '', 'Mar', '', '', ''];

	var width = 680;
	var height = 200;
//	var yMax = 25;
	var defaults;
	var burndownF = window.Raphael.fn.burndown3;

	QUnit.testStart(function() {
		paper = window.Raphael('qunit-fixture', width,height);
		defaults = burndownF.defaults;
	});

	QUnit.testDone(function() {
		burndownF.defaults = defaults;
	});

	test('Burndown line uses default color', function() {
		var graph = paper.burndown3(guidelineDataStop, burndownDataStop, labels, width, height);
		var bline = graph.burndown.line.attr('stroke');
		var expected = burndownF.defaults.colors.burndown;

		strictEqual(bline, expected);
	});

	test('Burndown line default color can be changed', function() {
		var color = '#bada55';
		burndownF.defaults.colors.burndown = color;

		var graph = paper.burndown3(guidelineDataStop, burndownDataStop, labels, width, height);
		var bline = graph.burndown.line.attr('stroke');

		strictEqual(bline, color);
	});

	test('Burndown line color can be set by user', function() {
		var color = '#bada55';
		var graph = paper.burndown3(guidelineDataStop, burndownDataStop, labels, width, height, [color]);
		var bline = graph.burndown.line.attr('stroke');

		strictEqual(bline, color);
	});

	test('Burndown area uses default color', function() {
		var graph = paper.burndown3(guidelineDataStop, burndownDataStop, labels, width, height);
		var barea = graph.burndown.area.attr('fill');
		var expected = burndownF.defaults.colors.burndown;

		strictEqual(barea, expected);
	});

	test('Burndown area default color can be changed', function() {
		var color = '#bada55';
		burndownF.defaults.colors.burndown = color;

		var graph = paper.burndown3(guidelineDataStop, burndownDataStop, labels, width, height);
		var barea = graph.burndown.area.attr('fill');

		strictEqual(barea, color);
	});

	test('Burndown area color can be set by user', function() {
		var color = '#bada55';
		var graph = paper.burndown3(guidelineDataStop, burndownDataStop, labels, width, height, [color]);
		var barea = graph.burndown.area.attr('fill');

		strictEqual(barea, color);
	});


	module('Burndown.math');

	test('Finds max Y on optimal burndown', function() {
		var data = [5,4,3,2,1,0];
		var expected = 5;
		var result = burndownF.math.findYMax(data);

		strictEqual(result, expected);
	});

	test('Finds max Y on bad burndown', function() {
		var data = [5,4,3,6,1,0];
		var expected = 6;
		var result = burndownF.math.findYMax(data);

		strictEqual(result, expected);
	});

	test('Finds max Y on horrible burndown', function() {
		var data = [5,6,7,8,9];
		var expected = 9;
		var result = burndownF.math.findYMax(data);

		strictEqual(result, expected);
	});

    test('Finds min Y when its first', function() {
        var data = [5,6,7,8,9];
        var expected = 5;
        var result = burndownF.math.findYMin(data);

        strictEqual(result, expected);
    });

    test('Finds min Y when its last', function() {
        var data = [6,7,8,9,5];
        var expected = 5;
        var result = burndownF.math.findYMin(data);

        strictEqual(result, expected);
    });

    test('Finds min Y', function() {
        var data = [6,5,7,8,9];
        var expected = 5;
        var result = burndownF.math.findYMin(data);

        strictEqual(result, expected);
    });

    test('Inverts Y-value so that 0 on graph has correct value on Raphael paper', function() {
		var yValue = burndownF.math.invertY(height, 0);
		var expected = height - defaults.gutter.y;

		strictEqual(yValue, expected);
	});

	test('Inverts Y-value so that 1 on graph has correct value on Raphael paper', function() {
		var yValue = burndownF.math.invertY(height, 1);
		var expected = height - defaults.gutter.y - 1;

		strictEqual(yValue, expected);
	});

	test('Y=0 maps to correct position on canvas', function() {
		var y = 0;
		var step = 10;
		var height = 110;
		defaults.gutter.y = 20;
		var expected = height - defaults.gutter.y;
		var pos = burndownF.math.mapY(y, step, height);

		strictEqual(pos, expected);
	});

	test('Y=max maps to correct position on canvas', function() {
		var y = 9;
		var step = 10;
		var height = 110;
		defaults.gutter.y = 20;
		var expected = 0;
		var pos = burndownF.math.mapY(y, step, height);

		strictEqual(pos, expected);
	});

	test('Points lists generate correct SVG path data', function() {
		var xValues = [1, 2, 3, 4];
		var yValues = [11, 12, 13, 14];
		var expected = 'M1 11,L2 12,L3 13,L4 14';

		var path = burndownF.math.toPath(xValues, yValues);

		strictEqual(path, expected);
	});

    test('Points lists generate correct SVG path area', function() {
        var xValues = [1, 2, 3, 4];
        var yValues = [11, 12, 13, 14];
        var expected = 'M1 11,L2 12,L3 13,L4 14,L1 11,Z';

        var path = burndownF.math.toAreaPath(xValues, yValues);

        strictEqual(path, expected);
    });

	test('Length between data-points on x-axis is calculated correctly, starting at the gutter', function() {
		var width = 100;
		var values = 10;
		defaults.gutter.x = 10;
		var expected = 9;

		var xStep = burndownF.math.xStepLength(width, values);

		strictEqual(xStep, expected);
	});

	test('Length between data-points on y-axis is calculated correctly, starting at the gutter', function() {
		var height = 100;
		var values = 10;
		defaults.gutter.y = 10;
		var expected = 9;

		var yStep = burndownF.math.yStepLength(height, values);

		strictEqual(yStep, expected);
	});

	test('Simple line has correct coordinates', function() {
		var height = 100;
		var width = 100;
		var gutter = 10;
		var storyPoints = [25, 0];

		defaults.gutter.x = gutter;
		defaults.gutter.y = gutter;

		var expected = {
			x: [gutter, width],
			y: [0, height-gutter]
		};

		var line = burndownF.math.createPath(width, height, storyPoints);

		deepEqual(line, expected);
	});
}());