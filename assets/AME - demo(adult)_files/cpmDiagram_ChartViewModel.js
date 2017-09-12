var cpmDiagram = cpmDiagram || {};


(function() {
//
// View model for the chart.
    //
    //USING: cpmDiagram.ConnectionViewModel
    //USING: cpmDiagram.NodeViewModel
    //INIT_REQUIRES: cpmDiagram.ConnectionViewModel
    //INIT_REQUIRES: cpmDiagram.NodeViewModel
    cpmDiagram.ChartViewModel = function(chartDataModel) {

        var that = this;

        /*********************************
         PRIVATE METHODS 
        **********************************/
        this.getAssociatedDecisionchoices = function(decisionNodeId) {
            var associatedDecisionChoiceNodes = [];
            for (var i = 0; i < that.connections.length; ++i) {
                if ( that.connections[i].data.source.nodeID === decisionNodeId) {
                    var connectedNode = that.connections[i].dest.parentNode();
                    // the connectedNode is a decision-choice type
                    if (connectedNode.nodeType() === 5) {
                        associatedDecisionChoiceNodes[associatedDecisionChoiceNodes.length] = connectedNode;
                    }
                }
            }
            return associatedDecisionChoiceNodes;
        }

        this.getAssociatedConnections = function(nodeId) {
            var associatedConnections = [];
            for (var i = 0; i < that.connections.length; ++i) {
                if (that.connections[i].data.dest.nodeID === nodeId || that.connections[i].data.source.nodeID === nodeId) {
                    associatedConnections[associatedConnections.length] = that.connections[i];
                }
            }
            return associatedConnections;
        };

        // 
        // Wrap the nodes data-model in a view-model.
        //
        var createNodesViewModel = function(nodesDataModel, nodeType) {
            var nodesViewModel = [];
            if (nodeType) {
                //return ones that match the node type
                if (nodesDataModel) {
                    for (var i = 0; i < nodesDataModel.length; ++i) {
                        if (nodesDataModel[i].nodeType == nodeType) {
                            nodesViewModel.push(new cpmDiagram.NodeViewModel(nodesDataModel[i]));
                        }
                    }
                }
            } else {
                //return all of them
                if (nodesDataModel) {
                    for (var i = 0; i < nodesDataModel.length; ++i) {
                        //Update the model if it does not yet have related content items defined
                        if (!nodesDataModel[i].relatedContentItems) {
                            nodesDataModel[i].relatedContentItems = []; 
                        }
                        nodesViewModel.push(new cpmDiagram.NodeViewModel(nodesDataModel[i]));
                    }
                }
            }

            return nodesViewModel;
        };
        /*********************************
        CONSTRUCTOR FUNCTIONS
        **********************************/
        //
        // Find a specific input connector within the chart.
        //

        this.findInputConnector = function(nodeID, connectorIndex) {

            var node = this.findNode(nodeID);

            //for a decision-choice, whatever might be the connectorIndex return the first connector.
            if (node.nodeType() === 5) {
                var connector = node.inputConnectors[0];
                
                if (!connector) {
                    throw new Error("Decision-choice node with " + nodeID + " has no connectors");
                }
                return connector;
            }

            if (!node.inputConnectors || node.inputConnectors.length <= connectorIndex) {
                throw new Error("Node " + nodeID + " has invalid input connectors.");
            }

            return node.inputConnectors[connectorIndex];
        };

        //
        // Find a specific output connector within the chart.
        //
        this.findOutputConnector = function(nodeId, connectorIndex) {
            return this.findInputConnector(nodeId, connectorIndex);
        };

        this.findNodeByChartNodeID = function(chartNodeID){
          for (var i = 0; i < this.nodes.length; ++i) {
                var node = this.nodes[i];
                if (node.data.chartNodeId == chartNodeID) {
                    return node;
                }
            }

            throw new Error("Failed to find node " + chartNodeID);
        }

        //
        // Find a specific node within the chart.
        //
        this.findNode = function(nodeID) {

            for (var i = 0; i < this.nodes.length; ++i) {
                var node = this.nodes[i];
                if (node.data.id == nodeID) {
                    return node;
                }
            }

            throw new Error("Failed to find node " + nodeID);
        };

        //
        // Retrieve a list of specific nodes based on nodeType.
        //
        this.findNodesByType = function(nodeType) {
            if (!nodeType) {
                 return this.nodes;
            }
            var nodes = [];
            for (var i = 0; i < this.nodes.length; ++i) {
                var node = this.nodes[i];
                if (node.nodeType() === nodeType) {
                    nodes.push(node);
                }
            }
            return nodes;
        };

        //
        // Determine if Parent Node is a Bracket and pass parent information back
        //
        this.GetParentInfo = function(node,connector) {
            //check wether any of the other connectors have connections with this node's guid as destination.  If so, check that source connector to determine if its a bracket
            //if parent connector is a bracket, collapse siblings
            var isParentBracket = false;
            var parentNode = null;
            var parentIndex = -1;
            for (var i = 0; i < this.connections.length; i++) {
                //NOTE: this assumes that a parent connection is not connected to the same connector as the child nodes.  we 
                //are not currently distinguishing between input and output connectors and that would be a major shift in our models at this point
                if (this.connections[i].data.dest.nodeID == node.id() && this.connections[i].data.dest.connectorIndex != connector.index()) {
                    //check source connector for bracket 
                    parentNode = this.findNode(this.connections[i].data.source.nodeID);
                    parentIndex = this.connections[i].data.source.connectorIndex;
                    if (parentNode.inputConnectors[this.connections[i].data.source.connectorIndex].isBracket()) {
                        isParentBracket = true;
                        break; //found, break loop
                    }
                }
            }
            return { isBracket: isParentBracket, parentNode: parentNode, parentIndex: parentIndex };
        }

        //
        //Toggle expanded along with returning all the childran that need to be updated.  Note: do not toggle expanded on nodes that do not have children
        //
        this.ToggleExpandIfChildrenPresent = function(sibling, connectionIndex) {
            var connections = [];
            if (typeof sibling.inputConnectors[connectionIndex] != 'undefined' && sibling.inputConnectors[connectionIndex].expanded()) {
                //Test to ensure there is at least one child otherwise ignore
                var found = false;
                for (var k = 0; k < this.connections.length; k++) {
                    //just checking source will remove the change we look at the incoming connector
                    if (this.connections[k].data.source.nodeID == sibling.id() && this.connections[k].data.source.connectorIndex == connectionIndex) {
                        found = true;
                        break;
                    }
                }

                if (found) {
                    this.recursiveFindExpandedChildConnectionIndexes(false, sibling.id(), connectionIndex,sibling.nodeType(), connections);
                    sibling.inputConnectors[connectionIndex].toggleExpanded();
                }
            }
            return connections;
        }

        //
        //Find all the child connections that are expanded
        //
        this.recursiveFindExpandedChildConnectionIndexes = function (firstPass, nodeId, connectorIndex, nodeType, childConnectionsIn) {
            var childConnections = childConnectionsIn;
            var isDecisionNode = false;
            if (typeof nodeType != 'undefined' && nodeType === 5) {
                    isDecisionNode = true;
            }

            for (var i = 0; i < this.connections.length; i++) {
               
                if (this.connections[i].data.source.nodeID == nodeId && (this.connections[i].data.source.connectorIndex == connectorIndex || isDecisionNode)) {
                    //We have a match, add connection to array of children
                    if (childConnections.indexOf(i) >=0) continue;
                    childConnections.push(i);


                    var node = this.findNode(this.connections[i].data.dest.nodeID);

                    //if connector is not expanded, then skip
                    //check each additional connection if its expanded is set to true
                    //TODO: if a connector loops back to the source node, might all the items be hidden?  test this edge case and account for it/*(!firstPass || connectorIndex != 1) && */
                    if (typeof node.inputConnectors[0] != 'undefined' && node.inputConnectors[0].expanded()) this.recursiveFindExpandedChildConnectionIndexes(false, this.connections[i].data.dest.nodeID, 0, node.nodeType(), childConnectionsIn);
                    if (typeof node.inputConnectors[1] != 'undefined' && node.inputConnectors[1].expanded()) this.recursiveFindExpandedChildConnectionIndexes(false, this.connections[i].data.dest.nodeID, 1, node.nodeType(), childConnectionsIn);
                    if (typeof node.inputConnectors[2] != 'undefined' && node.inputConnectors[2].expanded()) this.recursiveFindExpandedChildConnectionIndexes(false, this.connections[i].data.dest.nodeID, 2, node.nodeType(), childConnectionsIn);
                    if (typeof node.inputConnectors[3] != 'undefined' && node.inputConnectors[3].expanded()) this.recursiveFindExpandedChildConnectionIndexes(false, this.connections[i].data.dest.nodeID, 3, node.nodeType(), childConnectionsIn);

                }
            }

            //return childConnections;
        }

        this.arrayUnique = function(array) {
            var a = array.concat();
            for(var i=0; i<a.length; ++i) {
                for(var j=i+1; j<a.length; ++j) {
                    if(a[i] === a[j])
                        a.splice(j--, 1);
                }
            }

            return a;
        };

        //
        // Create a view model for connection from the data model.
        //
        this.createConnectionViewModel = function(connectionDataModel) {

            var sourceConnector = this.findOutputConnector(connectionDataModel.source.nodeID, connectionDataModel.source.connectorIndex);
            var destConnector = this.findInputConnector(connectionDataModel.dest.nodeID, connectionDataModel.dest.connectorIndex);
            return new cpmDiagram.ConnectionViewModel(connectionDataModel, sourceConnector, destConnector);
        }

        // 
        // Wrap the connections data-model in a view-model.
        //
        this.createConnectionsViewModel = function(connectionsDataModel) {

            var connectionsViewModel = [];

            if (connectionsDataModel) {
                for (var i = 0; i < connectionsDataModel.length; ++i) {
                    connectionsViewModel.push(this.createConnectionViewModel(connectionsDataModel[i]));
                }
            }

            return connectionsViewModel;
        };


        //
        // Create a view-model for section-marker from the data-model.
        //
        this.createSectionMarkerViewModel = function(sectionMarkerDataModel) {
            var bc = null;
            if (!!sectionMarkerDataModel.associatedBranchchoiceId) {
                bc = this.findNode(sectionMarkerDataModel.associatedBranchchoiceId);
            }
            var sectionMarkerViewModel = new cpmDiagram.SectionMarkerViewModel(sectionMarkerDataModel);
            sectionMarkerViewModel.setAssociatedBranchchoice(bc);

            return sectionMarkerViewModel;
        }

        this.linkBranchChoiceVmToSectionMarkerVm = function(sectionMarkerId, branchChoiceId) {

            if (!sectionMarkerId || !branchChoiceId) {
                return;
            }
            var bc = this.findNode(branchChoiceId);
            var sectionMarkerViewModel = this.findSectionMarker(sectionMarkerId);
            if (!!bc && !! sectionMarkerViewModel) {
                sectionMarkerViewModel.setAssociatedBranchchoice(bc);
            }
        }

        this.findSectionMarker = function(sectionMarkerId) {

            for (var i = 0; i < this.sectionMarkers.length; ++i) {
                var sectionMarker = this.sectionMarkers[i];
                if (sectionMarker.data.chartSectionMarkerId == sectionMarkerId) {
                    return sectionMarker;
                }
            }

            throw new Error("Failed to find Section-Marker " + sectionMarkerId);
        }

        //
        // Wrap the section-marker data-model in a view-model
        //
        this.createSectionMarkersViewModel = function(sectionMarkersDataModel) {
            var sectionMarkersViewModel = [];
            if (sectionMarkersDataModel) {
                for (var i = 0; i < sectionMarkersDataModel.length; ++i) {
                    sectionMarkersViewModel.push(this.createSectionMarkerViewModel(sectionMarkersDataModel[i]));
                }
            }
            return sectionMarkersViewModel;
        };

        this.findFarthestX = function() {

            var minimumWidth = 800;
            var farthestX = minimumWidth;
            for(var i in this.nodes) {
                var node = this.nodes[i];
                if(node.visible() && farthestX < node.data.x)
                {
                    farthestX = node.data.x;
                }
            }
            return farthestX;
        }

        this.findFarthestY = function() {

            var minimumHeight = 600;
            var farthestY = minimumHeight;
            for(var i in this.nodes) {
                var node = this.nodes[i];
                if(node.visible() && farthestY < (node.data.y+node.height()))
                {
                    farthestY = node.data.y + node.height();
                    if (node.nodeType() == cpmDiagram.NodeType.BranchChoice) {
                        farthestY += 24;
                    }
                }
            }
            return farthestY;
        }

        this.updateSvgHeight = function (currentNodeY) {
            var offset = 60;//TODO: account for node height in offset calculations
            var farY;
            if (!currentNodeY) {
               farY = this.findFarthestY();
            } else {
               if (currentNodeY > (this.svgHeight - offset)) {
                   farY = currentNodeY;
               } else {
                   return;
               }
            }
            this.svgHeight = farY + offset;
        }

        this.svgDynamicHeight = function () {
            //Only update if not draggin, as fary could change
            if(!this.IsDragging) this.updateSvgHeight();
            return this.svgHeight;
        }

        this.updateSvgWidth = function (currentNodeX) {
            var offset = 300;//TODO: account for node width in offset calculations
            var farX;
            if (!currentNodeX) {
               farX = this.findFarthestX();
            } else {
               if (currentNodeX > (this.svgWidth - offset)) {
                   farX = currentNodeX;
               } else {
                   return;
               }
            }
            this.svgWidth = farX + offset;
        }

        this.svgDynamicWidth = function() {
            this.updateSvgWidth();
            return this.svgWidth;
        }
        /***************************************
    PROPERTIES
    ***************************************/
        /*INITED PROPERTIES*/
        this.IsDragging = false;
        // Reference to the underlying data.
        this.data = chartDataModel;

        // Create a view-model for nodes.
        this.nodes = createNodesViewModel(this.data.nodes);

        // Create a view-model for connections.
        this.connections = this.createConnectionsViewModel(this.data.connections);

        //Create a view-model for section-markers.
        this.sectionMarkers = this.createSectionMarkersViewModel(this.data.sectionMarkers);

        //initial canvas width and height
        this.svgHeight = 100;
        this.svgWidth = 100;

        var originalNode;

 /***********************************
    WRAPPED PROPERTIES
    *************************************/
        this.name = function() {
            return this.data.name;
        }
        this.id = function() {
            return this.data.id;
        }

     

        /*****************************
    MEMBERS
    *****************************/
        this.GetNextChartViewId = function(){
            if(this.data.nodeSeedId){
                this.data.nodeSeedId += 1;
                return this.data.nodeSeedId;
            }else{
                this.data.nodeSeedId = 1;
                return this.data.nodeSeedId;
            }
        }
        //
        // Create a view model for a new connection.
        //
        this.createNewConnection = function(sourceConnector, destConnector) {


            //debug.assertObjectValid(sourceConnector);
            //debug.assertObjectValid(destConnector);

            var connectionsDataModel = this.data.connections;
            if (!connectionsDataModel) {
                connectionsDataModel = this.data.connections = [];
            }

            var connectionsViewModel = this.connections;
            if (!connectionsViewModel) {
                connectionsViewModel = this.connections = [];
            }
            var destNode = destConnector.parentNode();
            var sourceNode = sourceConnector.parentNode();

            // removing validation of connections as the below rules have become out of date
            // and Editors are needing ability to make connections freely
            // This is just causing recurring maintenance -KK
            //var cDType = parseInt(destNode.nodeType());

            //De
            //var valid = false;
            //switch (sourceNode.nodeType()) {
            //    case cpmDiagram.NodeType.Step:
            //        //Steps can connect to anything 
            //        valid = cDType != cpmDiagram.NodeType.LinkToExtCpm;
            //        break;
            //    case cpmDiagram.NodeType.Decision:
            //        //Decisions cannot connect directly to step, branch, linktoextcpm, branchchoice 
            //        valid = cDType != cpmDiagram.NodeType.LinkToExtCpm && cDType != cpmDiagram.NodeType.Branch && cDType != cpmDiagram.NodeType.BranchChoice;
            //        break;
            //    case cpmDiagram.NodeType.DecisionChoice:
            //        //Decision choices cannot connect to branch choices 
            //        valid = cDType != cpmDiagram.NodeType.BranchChoice;
            //        break;
            //    case cpmDiagram.NodeType.BranchChoice:
            //        //Branch choice cannot be linked to Decision Choice
            //        valid = cDType != cpmDiagram.NodeType.DecisionChoice;
            //        break;
            //    case cpmDiagram.NodeType.Branch:
            //        //Branch can only connect to Branch Choices
            //        valid = cDType == cpmDiagram.NodeType.BranchChoice;
            //        break;
            //    case cpmDiagram.NodeType.LinkToExtCpm:
            //        //Link to ext cannot be connected to any item
            //        valid = false;
            //        break;
            //};

            //if (!valid) return false;
            var sourceConnectorIndex = sourceNode.inputConnectors.indexOf(sourceConnector);
            if (sourceConnectorIndex == -1) {
                throw new Error("Failed to find source connector within inputConnectors of source node.");
            }

          
            var destConnectorIndex = destNode.inputConnectors.indexOf(destConnector);
            if (destConnectorIndex == -1) {
                throw new Error("Failed to find dest connector within inputConnectors of dest node.");
            }

            var connectionDataModel = {
                source: {
                    nodeID: sourceNode.data.id,
                    connectorIndex: sourceConnectorIndex,
                },
                dest: {
                    nodeID: destNode.data.id,
                    connectorIndex: destConnectorIndex,
                },
                type: "SShape_DragAlongY",
                connectionBreakLength:null
            };
            connectionsDataModel.push(connectionDataModel);

            var connectionViewModel = new cpmDiagram.ConnectionViewModel(connectionDataModel, sourceConnector, destConnector);
            connectionsViewModel.push(connectionViewModel);
        };

        //
        // apply buiness rules around valid connections
        //
        this.validateConnection = function (sourceNodeType, destNodeType) {
            var cDType = parseInt(destNodeType);

            //De
            switch(sourceNodeType) {
                case cpmDiagram.NodeType.Step:
                    //Steps can connect to anything 
                    return cDType != cpmDiagram.NodeType.LinkToExtCpm;
                    break;
                case cpmDiagram.NodeType.Decision:
                    //Decisions cannot connect directly to step, branch, linktoextcpm, branchchoice 
                    return destNodeType != cpmDiagram.NodeType.LinkToExtCpm && destNodeType != cpmDiagram.NodeType.Branch && destNodeType != cpmDiagram.NodeType.BranchChoice;
                    break;
                case cpmDiagram.NodeType.DecisionChoice:
                    //Decision choices cannot connect to branch choices 
                    return cDType != cpmDiagram.NodeType.BranchChoice;
                    break;
                case cpmDiagram.NodeType.BranchChoice:
                    //Branch choice cannot be linked to Decision Choice
                    return cDType != cpmDiagram.NodeType.DecisionChoice;
                    break;
                case cpmDiagram.NodeType.Branch:
                    //Branch can only connect to Branch Choices
                    return cDType == cpmDiagram.NodeType.BranchChoice;
                    break;
                case cpmDiagram.NodeType.LinkToExtCpm:
                    //Link to ext cannot be connected to any item
                    return false;
                default:
                    return true;
            }



        }


        //
        // Add a node to the view model.
        //
        this.addNode = function(nodeDataModel) {
            if (!this.data.nodes) {
                this.data.nodes = [];
            }

            // 
            // Update the data model.
            //
            if(typeof nodeDataModel.chartNodeId == "undefined"){
                nodeDataModel.chartNodeId = this.GetNextChartViewId(); //if the node does not yet have a nodeId then grab one from the seed and set it on the node
            }
            this.data.nodes.push(nodeDataModel);

            // 
            // Update the view model.
            //
            this.nodes.push(new cpmDiagram.NodeViewModel(nodeDataModel));
        }

        //
        // Add a node to the view model.
        //
        this.addConnection = function (connectionDataModel) {
            if (!this.data.connections) {
                this.data.connections = [];
            }

            // 
            // Update the data model.
            //
            this.data.connections.push(connectionDataModel);

            // 
            // Update the view model.
            //
            this.connections.push(this.createConnectionViewModel(connectionDataModel));
        }


        //
        // Add a section-marker to the view model
        //
        this.addSectionMarker = function(sectionMarkerDataModel) {
            if (!this.data.sectionMarkers) {
                this.data.sectionMarkers = [];
            }

            if(typeof sectionMarkerDataModel.chartSectionMarkerId == "undefined"){
                sectionMarkerDataModel.chartSectionMarkerId = this.GetNextChartViewId(); //if the node does not yet have a nodeId then grab one from the seed and set it on the node
            }
            this.data.sectionMarkers.push(sectionMarkerDataModel);
            var vm = this.createSectionMarkerViewModel(sectionMarkerDataModel);
            var bcId = sectionMarkerDataModel.associatedBranchchoiceId; 
            if (!!bcId) {
                vm.setAssociatedBranchChoice(this.findNode(bcId));
            }
            this.sectionMarkers.push(vm);
        }

        //
        // Select all nodes and connections in the chart.
        //
        this.selectAll = function() {

            var nodes = this.nodes;
            for (var i = 0; i < nodes.length; ++i) {
                var node = nodes[i];
                node.select();
            }

            var connections = this.connections;
            for (var i = 0; i < connections.length; ++i) {
                var connection = connections[i];
                connection.select();
            }
        }

        //
        // Deselect all nodes and connections in the chart.
        //
        this.deselectAll = function() {

            var nodes = this.nodes;
            for (var i = 0; i < nodes.length; ++i) {
                var node = nodes[i];
                node.deselect();
            }

            var connections = this.connections;
            for (var i = 0; i < connections.length; ++i) {
                var connection = connections[i];
                connection.deselect();
            }

            var sectionMarkers = this.sectionMarkers;
            for (var i = 0; i < sectionMarkers.length; ++i) {
                var sectionMarker = sectionMarkers[i];
                sectionMarker.deselect();
            }
        };



        //
        // Update the location of the node and its connectors.
        //
        this.updateSelectedNodesLocation = function(deltaX, deltaY) {

            var selectedNodes = this.getSelectedNodes();

            for (var i = 0; i < selectedNodes.length; ++i) {
                var node = selectedNodes[i];
                node.data.x += deltaX;
                node.data.y += deltaY;
            }

        };


        this.updateSelectedSectionMarkersLocation = function(deltaY) {
            var selectedSectionMarkers = this.getSelectedSectionMarkers();
            for (var i = 0; i < selectedSectionMarkers.length; ++i) {
                var sectionMarker = selectedSectionMarkers[i];
                sectionMarker.data.top += deltaY;
            }
        }


        this.selectAssociatedDecisionchoices = function(decisionNode) {
            var decisionChoices =  this.getAssociatedDecisionchoices(decisionNode.id());
            for (var i in decisionChoices) {
                var decisionChoice = decisionChoices[i];
                decisionChoice.select();
            }
        }

        //
        // Handle mouse click on a particular node.
        //
        this.handleNodeClicked = function(node, ctrlKey) {

            if (ctrlKey) {
                node.toggleSelected();
            } else {
                this.deselectAll();
                node.select();
            }

            // Move node to the end of the list so it is rendered after all the other.
            // This is the way Z-order is done in SVG.


            var nodeIndex = this.nodes.indexOf(node);
            if (nodeIndex == -1) {
                throw new Error("Failed to find node in view model!");
            }
            this.nodes.splice(nodeIndex, 1);
            this.nodes.push(node);
        };

        //
        // Handle mouse down on a connection.
        //
        this.handleConnectionMouseDown = function(connection, ctrlKey) {

            if (ctrlKey) {
                connection.toggleSelected();
            } else {
                this.deselectAll();
                connection.select();
            }
        };

        //
        // Handle mouse down on a connection line.
        //
        this.handleConnectionLineMouseDown = function(connectionLine) {

            this.deselectAll();
            connectionLine.select(); //TODO: add this function to the line.

            // 
        };

         //
        // Handle mouse click on a particular section marker.
        //
        this.handleSectionMarkerClicked = function(sectionMarker, ctrlKey) {

            // Disabling multi-select of section markers as the drag only works on single select
            //if (ctrlKey) {
            //    sectionMarker.toggleSelected();
            //} else {
                this.deselectAll();
                sectionMarker.select();
            //}

        };

//
        // Delete all nodes and connections that are selected.
        //
        this.deleteSelected = function() {

            var newNodeViewModels = [];
            var newNodeDataModels = [];

            var deletedNodeIds = [];

            //
            // Sort nodes into:
            //		nodes to keep and 
            //		nodes to delete.
            //

            for (var nodeIndex = 0; nodeIndex < this.nodes.length; ++nodeIndex) {

                var node = this.nodes[nodeIndex];
                if (!node.selected()) {
                    // Only retain non-selected nodes.
                    newNodeViewModels.push(node);
                    newNodeDataModels.push(node.data);
                } else {
                    // Keep track of nodes that were deleted, so their connections can also
                    // be deleted.
                    deletedNodeIds.push(node.data.id);
                }
            }

            var newConnectionViewModels = [];
            var newConnectionDataModels = [];

            //
            // Remove connections that are selected.
            // Also remove connections for nodes that have been deleted.
            //
            for (var connectionIndex = 0; connectionIndex < this.connections.length; ++connectionIndex) {

                var connection = this.connections[connectionIndex];
                if (!connection.selected() &&
                    deletedNodeIds.indexOf(connection.data.source.nodeID) === -1 &&
                    deletedNodeIds.indexOf(connection.data.dest.nodeID) === -1) {
                    //
                    // The nodes this connection is attached to, where not deleted,
                    // so keep the connection.
                    //
                    newConnectionViewModels.push(connection);
                    newConnectionDataModels.push(connection.data);
                }
            }

            var newSectionMarkerViewModels = [];
            var newSectionMarkerDataModels = [];
            //
            // Sort nodes into:
            //		nodes to keep and 
            //		nodes to delete.
            //
            for (var sectionMarkerIndex = 0; sectionMarkerIndex < this.sectionMarkers.length; ++sectionMarkerIndex) {

                var sectionMarker = this.sectionMarkers[sectionMarkerIndex];
                if (!sectionMarker.selected()) {
                    // Only retain non-selected nodes.
                    newSectionMarkerViewModels.push(sectionMarker);
                    newSectionMarkerDataModels.push(sectionMarker.data);
                }
            }

            //
            // Update nodes and connections.
            //
            this.nodes = newNodeViewModels;
            this.data.nodes = newNodeDataModels;
            this.connections = newConnectionViewModels;
            this.data.connections = newConnectionDataModels;
            this.sectionMarkers = newSectionMarkerViewModels;
            this.data.sectionMarkers = newSectionMarkerDataModels;
        };



        //
        // Select nodes and connections that fall within the selection rect.
        //
        this.applySelectionRect = function(selectionRect) {

            this.deselectAll();

            for (var i = 0; i < this.nodes.length; ++i) {
                var node = this.nodes[i];
                if (node.x() >= selectionRect.x &&
                    node.y() >= selectionRect.y &&
                    node.x() + node.width() <= selectionRect.x + selectionRect.width &&
                    node.y() + node.height() <= selectionRect.y + selectionRect.height) {
                    // Select nodes that are within the selection rect.
                    if (node.visible()) {
                         node.select();
                    }
                }
            }

            for (var i = 0; i < this.connections.length; ++i) {
                var connection = this.connections[i];
                if (connection.source.parentNode().selected() &&
                    connection.dest.parentNode().selected()) {
                    // Select the connection if both its parent nodes are selected.
                    if (connection.visible()) {
                        connection.select();
                    }
                   
                }
            }

        };

        //
        // Get the array of nodes that are currently selected.
        //
        this.getSelectedNodes = function() {
            var selectedNodes = [];

            for (var i = 0; i < this.nodes.length; ++i) {
                var node = this.nodes[i];
                if (node.selected()) {
                    selectedNodes.push(node);
                }
            }

            return selectedNodes;
        };

        //
        // Get the array of sectionMarkers that are currently selected.
        //
        this.getSelectedSectionMarkers = function() {
            var selectedSectionMarkers = [];

            for (var i = 0; i < this.sectionMarkers.length; ++i) {
                var sectionMarker = this.sectionMarkers[i];
                if (sectionMarker.selected()) {
                    selectedSectionMarkers.push(sectionMarker);
                }
            }

            return selectedSectionMarkers;
        }

        //
        // Get the array of connections that are currently selected.
        //
        this.getSelectedConnections = function() {
            var selectedConnections = [];

            for (var i = 0; i < this.connections.length; ++i) {
                var connection = this.connections[i];
                if (connection.selected()) {
                    selectedConnections.push(connection);
                }
            }

            return selectedConnections;
        };


        this.findConnectionsAlongYForAlignment = function(destNode) {
            var connections = [];

            for (var prop in this.connections) {

                var connection = this.connections[prop];
               
                if (connection.source.index() === 3 &&
                    connection.dest.index() === 1 &&
                    connection.dest.parentNode().id() === destNode.id())
                {
                    connections[connections.length] = connection;
                }
            }
            return connections;
        }

        this.findConnectionsAlongXForAlignment = function(destNode) {
            var connections = [];

            for (var prop in this.connections) {

                var connection = this.connections[prop];
               
                if ((connection.source.index() === 0 || connection.source.index() === 2)
                    && connection.dest.parentNode().id() === destNode.id())
                {
                    connections[connections.length] = connection;
                }
            }
            return connections;
        }

        this.positionWrtParent =  function(currentNode) {
            var destNode = currentNode, connection, sourceConnector, newX, newY;
            if (destNode.nodeType() === cpmDiagram.NodeType.BranchChoice) {
                alert("Position manually.");
                return;
            }
            if (destNode.nodeType() === cpmDiagram.NodeType.DecisionChoice) {
                alert("Decision-choices position is fixed based on decision.");
                return;
            }

            var connectionsAlongY = this.findConnectionsAlongYForAlignment(destNode);
            if (connectionsAlongY.length >= 1) {
                if (connectionsAlongY.length > 1) {
                    alert("No automatic positioning defined when multiple parents at this time. Position manually.");
                    return;
                }
                connection = connectionsAlongY[0];
                sourceConnector = connection.source;
                newX = sourceConnector.parentNode().x() + sourceConnector.x() - destNode.width() / 2;
                destNode.data.x = newX;
                newY = sourceConnector.parentNode().y() + sourceConnector.parentNode().height() + 40;
                destNode.data.y = newY;
            } else {
                var connectionsAlongX = this.findConnectionsAlongXForAlignment(destNode);
                if (connectionsAlongX.length !== 1) {
                    alert("No automatic positioning defined when no parents or multiple parents present. Position manually.");
                    return;
                }
                connection = connectionsAlongX[0];
                sourceConnector = connection.source;
                // reset connection type and connectors
                if (connection.getConnectionType() !== cpmDiagram.ConnectionType.SShape_DragAlongX) {
                    connection.setConnectionType(cpmDiagram.ConnectionType.SShape_DragAlongX);
                    var selectedConnector = null;
                    if (sourceConnector.index() === 2) {
                        selectedConnector = destNode.inputConnectors[0];
                    }
                    else if (sourceConnector.index() === 0) {
                        selectedConnector = destNode.inputConnectors[2];
                    }
                    connection.dest = selectedConnector;
                    connection.data.dest.connectorIndex = selectedConnector.index();
                }
                //calculate coordinates for the node
                if (sourceConnector.index() === 2) {
                    newX = sourceConnector.parentNode().x() + sourceConnector.parentNode().width() + 40;
                } else if (sourceConnector.index() === 0) {
                    newX = sourceConnector.parentNode().x() - (destNode.width() + 40);
                }
                newY = sourceConnector.parentNode().y() + sourceConnector.y() - destNode.height() / 2;
                destNode.data.x = newX;
                destNode.data.y = newY;
            }

        }

        this.hasAtleastOneLbNode = function() {
            for (var i in this.nodes) {

                var node = this.nodes[i];
                if (node.nodeType() === cpmDiagram.NodeType.LightboxPseudoNode) {
                    return true;
                }
            }
            return false;
        };

    //Methods to traverse the structure to find the parent branch choice to which a node belongs to. 
    this.findParentBranchChoices = function(currentNode, firstNode) {
        var branchChoices = [];
        var parentNodes;
        //capture currentNode, which is used for 'if' stmt below
        if (typeof firstNode === "undefined") {
            originalNode = currentNode;
        }
            
        //don't do anything in this scenario - //finds a way back to original node (for looping algorithms - acne)
        if (firstNode != null && originalNode.data.id === currentNode.data.id) {

        }
        else{
            parentNodes = this.getParentNodes(currentNode);
        }
        if (typeof parentNodes != "undefined" && parentNodes.length === 0) {
            return branchChoices;
        }

        for (var i in parentNodes) {
            var parentNode = parentNodes[i];
            //finds a way back to original node (for looping algorithms - acne)
            if (firstNode != null && originalNode === currentNode) {
                //don't do anything in this scenario - kicks us out of the infinite loop
            }
            else if (parentNode.nodeType() === cpmDiagram.NodeType.BranchChoice) {
                branchChoices.push(parentNode);
            } else {
                var bcs = this.findParentBranchChoices(parentNode, originalNode); //Note recursion.
                branchChoices = branchChoices.concat(bcs);
            }
        }
        return branchChoices;
    }

    this.getAllIncomingConnections = function(currentNode) {
        var incomingConnectionsToNode = [];
        for (var i in this.connections) {
            var connection = this.connections[i];
            if (connection.data.dest.nodeID === currentNode.id()) {
                incomingConnectionsToNode.push(connection);
            }
        }
        return incomingConnectionsToNode;
    }

    this.retrieveSourceNodes = function(connections) {
        var sourceNodes = [];
        for (var i in connections) {
            var connection = connections[i];
            var node = this.findNode(connection.data.source.nodeID);
            sourceNodes.push(node);
        }
        return sourceNodes;
    }

    this.getParentNodes = function(targetNode) {
        var incomingConnections = this.getAllIncomingConnections(targetNode);
        var parentNodes = this.retrieveSourceNodes(incomingConnections);
        return parentNodes;
    }
    //End of traversal methods

    };
})();