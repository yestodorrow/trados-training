var cpmDiagram = {};

//
// CpmDiagram ViewModel
//
(function () {

    //
    // Width of a node.
    //
    cpmDiagram.nodeWidth = 250;

    //
    // Amount of space reserved for displaying the node's name.
    //
    cpmDiagram.nodeNameHeight = 40;

    //
    // Height of a connector in a node.
    //
    cpmDiagram.connectorHeight = 35;

    //
    // Compute the Y coordinate of a connector, given its index.
    //
    cpmDiagram.computeConnectorY = function (connectorIndex) {
        //return cpmDiagram.node
        return cpmDiagram.nodeNameHeight + (connectorIndex * cpmDiagram.connectorHeight);
    }

   
    //
    // Compute the position of a connector in the graph.
    //
    cpmDiagram.computeConnectorPos = function (node, connectorIndex, inputConnector) {
        return {
            x: node.inputConnectors[connectorIndex].x() + node.x()/*node.x() + (inputConnector ? 0 : cpmDiagram.nodeWidth))*/,
            y: node.inputConnectors[connectorIndex].y() + node.y()/*node.y() + cpmDiagram.computeConnectorY(connectorIndex)*/,
        };
    };

   
    //
    //Filter node view models
    //
    var getFilteredNodesViewModel = function (nodesViewModel, nodeType) {
        var filteredNodesViewModel = [];
        if (nodeType) {
            //return all of them
            if (nodesViewModel) {
                for (var i = 0; i < nodesViewModel.length; ++i) {
                    if (nodesViewModel[i].data.nodeType == nodeType) nodesViewModel.push(nodesViewModel[i]);
                }
            }
        }

        return filteredNodesViewModel;
    };


   
})();