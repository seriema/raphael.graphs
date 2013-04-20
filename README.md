[![Build Status](https://travis-ci.org/seriema/raphael.graphs.png?branch=master)](https://travis-ci.org/seriema/raphael.graphs)

# raphael.graphs

Some simple graphs for Raphaël.

## Introduction

On one occasion I needed two types of graphs, with animation. One pie-chart looking thing and a regular burndown-chart. Here they are.

## Getting started
Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/seriema/raphael.graphs/dist/raphael.graphs.min.js
[max]: https://raw.github.com/seriema/raphael.graphs/dist/raphael.graphs.js

In your web page:

```html
<script src="libs/raphael/raphael.min.js"></script>
<script src="libs/g.raphael/g.raphael.min.js"></script>
<script src="dist/raphael.graphs.min.js"></script>
```

See samples here:


## Documentation
`raphael.graphs` are some graphs I've needed at various points. I do my best to integrate them so they look as part of `raphael` and `g.raphael` so using them feels natural. But I also expose some internals for testing purposes through the `math` object.

There are currently only two types of graphs here, but they are very flexible:
* Burndownchart - A regular burndownchart often used in Agile projects (especially in Scrum)
* Pauline - A specially designed graph that looks very much like a doughnut-chart.

## Examples
__(coming soon)__

## Release history
0.0.1 - 20 april 2013 - First commit, functioning graphs