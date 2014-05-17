'use strict';

angular.module('grapheneLogoApp')
  .controller('MainCtrl', function($scope) {
    var height = 400; // dimensions of hexagonal grid
    var width = 400;
    var nodes = []; // stores vertixes of each hexagon
    var paths = []; // stores the paths of each hexagon
    var size = 40; // 'radius' of each hexagon, middle to vertex
    var nodeSize = 10; // radius of vertex

    var centerToEdge = size * Math.sin(Math.PI / 3); // center of hex to perpendicular edge
    var edge = 2 * size * Math.cos(Math.PI / 3); // edge length
    var vRange = _.range(0, height, 2 * centerToEdge); // grid of where hexagons go
    var hRange = _.range(0, width, edge / 2 + size);
    var angles = _.range(0, 360, 60); // angles in a hexagon

    var addHexagonNodes = function(size, x, y, nodes) {
      _.each(angles, function(angle) {
        nodes.push({
          x: x + size * Math.cos(angle * Math.PI / 180),
          y: y + size * Math.sin(angle * Math.PI / 180)
        });
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
  });
