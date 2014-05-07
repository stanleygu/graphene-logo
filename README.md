# Creating the Graphene Logo... with Graphene!

See the 'live' version of the logo [here](http://stanleygu.com/graphene-logo/).

![Graphene Log](app/images/logo.png)

## Getting started

System Requirements:

* `node.js`

In this tutorial, we will be using [yeoman](http://yeoman.io/) to quickly scaffold a new angular app.

```
npm install -g yo generator-angular grunt-cli bower # you might need sudo here depending on your node installation
```

Now generate an angular project using yeoman.

`yo angular graphene-logo`

## Installing Graphene

Install graphene using `bower`:

`bower install --save stanleygu/graphene#gh-pages`

## Building the logo

Inside [`app.js`](https://github.com/stanleygu/graphene-logo/blob/master/app/scripts/app.js):

```javascript
angular
  .module('grapheneLogoApp', ['sg.graphene']);
```

Inside [`main.js`](https://github.com/stanleygu/graphene-logo/blob/master/app/scripts/controllers/main.js):

```javascript
var height = 400; // dimensions of hexagonal grid
var width = 400;
var nodes = []; // stores vertixes of each hexagon
var paths = []; // stores the paths of each hexagon
var size = 20; // 'radius' of each hexagon, middle to vertex
var nodeSize = 5; // radius of vertex

var centerToEdge = size * Math.sin(Math.PI / 3); // center of hex to perpendicular edge
var edge = 2 * size * Math.cos(Math.PI / 3); // edge length
var vRange = _.range(0, height, 2 * centerToEdge); // grid of where hexagons go
var hRange = _.range(0, width, edge / 2 + size);
var angles = _.range(0, 360, 60); // angles in a hexagon

var addHexagonNodes = function(size, x, y, nodes) {
  var addNode = function(deg, x, y, nodes, size) {
    nodes.push({
      x: x + size * Math.cos(deg * Math.PI / 180),
      y: y + size * Math.sin(deg * Math.PI / 180)
    });
  };
  _.each(angles, function(angle) {
    addNode(angle, x, y, nodes, size);
  });
};
var makePath = function(x, y, size) {
  var d = 'M ' + (x + size * Math.cos(-Math.PI / 3)) +
          ' ' + (y + size * Math.sin(-Math.PI / 3));
  _.each(angles, function(angle) {
    d += ' ' + (x + size * Math.cos(angle * Math.PI / 180)) +
         ' ' + (y + size * Math.sin(angle * Math.PI / 180));
  });
  return d;
};

_.each(vRange, function(y) {
  _.each(hRange, function(x, ix) {
    if (ix % 2 === 0) {
      addHexagonNodes(size, x, y, nodes);
      paths.push({
        d: makePath(x, y, size)
      });
    } else {
      var offset = centerToEdge; // offset center of hexagon
      addHexagonNodes(size, x, y + offset, nodes);
      paths.push({
        d: makePath(x, y + offset, size)
      });
    }
  });
});

// exports are available to the template view
$scope.exports = {
  height: height,
  width: width,
  nodes: nodes,
  paths: paths,
  nodeSize: nodeSize
};
```

Inside the `template.html` file:

```html
<svg 
  xmlns="http://www.w3.org/2000/svg"
  case-sensitive="viewBox"
  ng-attr-height="{{imports.height || 800}}"
  ng-attr-width="{{imports.width || 800}}"
  ng-attr-viewBox="0 0 300 300"
  style="position: absolute;"
  >
  <g
    ng-repeat="path in imports.paths"
  >
    <path
      ng-attr-d="{{path.d}}" 
      stroke="black" 
      ng-attr-fill="{{path.fill || 'white'}}"
      ng-mouseover="path.fill = 'green'"
      ng-mouseleave="path.fill = 'white'"
    >
  </g>
  <g
    ng-repeat="node in imports.nodes"
    ng-attr-transform="translate({{node.x}},{{node.y}})"
  >
    <circle
      ng-attr-r={{imports.nodeSize}}
      fill="black"
      stroke="black"
    />
  </g>
</svg>
```

Inside [`main.html`]:

```html
<sg-graphene imports="exports" template="views/template.html"></sg-graphene>

<link href='http://fonts.googleapis.com/css?family=Lobster' rel='stylesheet' type='text/css'>
<span style="
      font-family: 'Lobster', cursive;
      font-size: 120px;
      position: absolute;
      top: 125px;
      left: 100px;
      vertical-align:top;
      background-color: rgba(255, 255, 255, 0.64);
    ">Graphene.js</span>
```
