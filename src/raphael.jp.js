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
