'use strict';

angular.module('grapheneLogoApp')
  .controller('MainCtrl', function($scope) {
    var height = 400;
    var width = 400;
    var nodes = [];
    var paths = [];
    var size = 20; // 'radius' of each hexagon, middle to vertex
    var nodeSize = 5;

    var centerToEdge = size * Math.sin(Math.PI / 3);
    var edge = 2 * size * Math.cos(Math.PI / 3);
    var vRange = _.range(0, height, 2 * centerToEdge);
    var hRange = _.range(0, width, edge / 2 + size);
    var angles = _.range(0, 360, 60);

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
      var d = 'M ' + (x + size * Math.cos(-Math.PI / 3)) + ' ' + (y + size * Math.sin(-Math.PI / 3));
      _.each(angles, function(angle) {
        d += ' ' + (x + size * Math.cos(angle * Math.PI / 180)) + ' ' + (y + size * Math.sin(angle * Math.PI / 180));
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
          var offset = centerToEdge;
          addHexagonNodes(size, x, y + offset, nodes);
          paths.push({
            d: makePath(x, y + offset, size)
          });
        }
      });

    });

    $scope.exports = {
      height: height,
      width: width,
      nodes: nodes,
      paths: paths,
      nodeSize: nodeSize
    };
  });
