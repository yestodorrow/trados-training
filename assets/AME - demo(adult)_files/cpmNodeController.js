angular.module('cpmAppCommon').controller('nodeController', ['$scope','cpmNodeInitializer', function($scope, cpmNodeInitializer) {


     var updateConnectedElementLocations = function() {
         var node = $scope.node;
         var chart = $scope.chart;
         //redraw direct connections
         var associatedConnections = chart.getAssociatedConnections(node.id());
         for (var i = 0; i  < associatedConnections.length; ++i) {
             associatedConnections[i].recomputeLineCoords();
         }

         //redraw decision choices and its connections if the node is type decision
         // recompute decision-choice locations - see nodeInitializer
         if (node.nodeType() === cpmDiagram.NodeType.Decision) {
             var decisionChoices = chart.getAssociatedDecisionchoices(node.id());
             for (var k in decisionChoices) {
                 var dc = decisionChoices[k];
                 var coord = cpmNodeInitializer.decisionChoiceCoordWrtDecision(node, dc.data);
                 dc.data.x = coord.x;
                 dc.data.y = coord.y;
                 var dcConns = chart.getAssociatedConnections(dc.id());
                 for (var j = 0; j < dcConns.length; ++j) {
                     dcConns[j].recomputeLineCoords();
                 }
             }
         }
     }


    $scope.$watch('node.data.nodeWidth',function (newWidth, oldWidth) { updateConnectedElementLocations();});

    $scope.$watch('node.data.nodeHeight',function (newHeight, oldHeight) { updateConnectedElementLocations();});

    $scope.$watch('node.data.x',function (newX, oldX) { updateConnectedElementLocations();});

    $scope.$watch('node.data.y',function (newY, oldY) { updateConnectedElementLocations();});

    if ($scope.node.nodeType() === cpmDiagram.NodeType.Decision) {
        $scope.$watch('node.data.nodeWidth',function (newWidth, oldWidth) { $scope.node.data.nodeHeight = $scope.node.data.nodeWidth;  });

        $scope.$watch('node.data.nodeHeight',function (newHeight, oldHeight) { $scope.node.data.nodeWidth = $scope.node.data.nodeHeight;});
    }

    $scope.needsHighlight = function() {
        return (($scope.node.isHovering() && $scope.node == $scope.mouseOverNode) ||
            ($scope.node.selected() && $scope.node.hasSections()));
    }
}])