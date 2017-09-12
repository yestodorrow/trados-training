//*** controllers rely on app already being inited, thus, this include must come after the CpmAuthoringView.js
// Define the controller on the module.
// Inject the dependencies. 
// Point to the controller definition function.
cpmAuthApp.controller('cpmDisplayCtrl', ['$scope', 'settings', 'sitecoreService', '$rootScope', '$sce', cpmDisplayCtrl]);


///
/// Cpm App Controller, this is the main controller for driving the cpm application.  
///
function cpmDisplayCtrl($scope, settings, sitecoreService, $rootScope, $sce) {
    /****************************************
    CONSTANTS
    ****************************************/

    /*********************************
     CONSTRUCTOR FUNCTIONS
    **********************************/
    function Init() {
        ///
        /// Call Sitecore Service and get the chart view model
        ///
        sitecoreService.LoadCpm(settings.itemId).then(function (data) {
            // Successful
            $scope.chartViewModel = new cpmDiagram.ChartViewModel(data.RenderingVM);

            $scope.$watchCollection('chartViewModel.nodes', function (newNodes, oldNodes) {
                $scope.chartViewModel.updateSvgHeight();
                $scope.chartViewModel.updateSvgWidth();
            });
        },
          function (data) {
              // failure 
              if (settings.debug) console.log("fail");
          })
          .then(function () {
              // Like a Finally Clause; will not fire if error inside success/fail handlers though...
              if (settings.debug) console.log("finally Loaded Cpm");
          });
    }




    /***************************************
      PROPERTIES
    ***************************************/
    $scope.cpmId = settings.itemId ? settings.itemId : "{D00DA38B-B838-4E5A-9652-F77BFC2F82F0}";
    $scope.Title;
    /***********************************
      WRAPPED PROPERTIES
    *************************************/



    /*****************************
      MEMBERS
    *****************************/
    $rootScope.AsHTML = function (content) {
        return $sce.trustAsHtml(content);
    }
 
   
    /*****************************
    EVENT HANDLERS
    *****************************/
    ////
    //// Event handler for key-down on the flowchart.
    ////
    //$scope.keyDown = function (evt) {

    //    if (evt.keyCode === ctrlKeyCode) {

    //        ctrlDown = true;
    //        evt.stopPropagation();
    //        evt.preventDefault();
    //    }
    //};

    ////
    //// Event handler for key-up on the flowchart.
    ////
    //$scope.keyUp = function (evt) {

    //    if (evt.keyCode === deleteKeyCode) {
    //        //
    //        // Delete key.
    //        //
    //        $scope.chartViewModel.deleteSelected();
    //    }

    //    if (evt.keyCode == aKeyCode && ctrlDown) {
    //        // 
    //        // Ctrl + A
    //        //
    //        $scope.chartViewModel.selectAll();
    //    }

    //    if (evt.keyCode == escKeyCode) {
    //        // Escape.
    //        $scope.chartViewModel.deselectAll();
    //    }

    //    if (evt.keyCode === ctrlKeyCode) {
    //        ctrlDown = false;

    //        evt.stopPropagation();
    //        evt.preventDefault();
    //    }
    //};
    
    //event used on cpmSearchController
    $scope.$onRootScope('cpmDisplayController.selectNodeAndExpand', function (event, args) {
        $scope.expandBranchChoicesForHiddenNode(args.targetNode);
        //find the node in target
        var node = $scope.chartViewModel.findNode(args.targetNode.id());
        //allows the highlighting css
        node.select();
    });

    //event used on cpmSearchController
    $scope.$onRootScope('cpmDisplayController.deselectNode', function (event, args) {
        //find the node in target
        var node = $scope.chartViewModel.findNode(args.targetNode);
        //allows the unhighlighting of open node
        node.deselect();
    });

    //event used for highlighing nodes
    $scope.$onRootScope('cpmDisplayController.highLightSearchNodes', function (event, args) {
        var searchResults = args.searchArray;
        //counter for search results
        var resultsCounter = 0;
      
        ////iterate through []
        for (var i = 0; i < searchResults.length; i++) {
            //find the current node from the search results
            var node = $scope.chartViewModel.findNode(searchResults[i].key);
            //increment counter of results
            resultsCounter += 1;    
            //apply search specific css for branch choice nodes
            $scope.toggleHighlightBranchChoicesForHiddenNode(node, 3);
            
            //apply search specific css
            if (node.nodeType() == cpmDiagram.NodeType.Step) {
                //step
                node.classTypeForShape = 1;
                node.nodeRectSearched = 1;
            }
            else if(node.nodeType() == cpmDiagram.NodeType.Decision) {
                //decision
                node.classTypeForShape = 2;
                node.nodeRectSearched = 2;
            }
            //set counter based off of result
            node.searchResultCounter = resultsCounter;
        }

    });

    //event used for unhighlighing nodes
    $scope.$onRootScope('cpmDisplayController.unHighLightSearchNodes', function (event, args) {
        var searchResults = args.searchArray;
        //iterate through []
        for (var i = 0; i < searchResults.length; i++) {
            var node = $scope.chartViewModel.findNode(searchResults[i].key);
            $scope.toggleHighlightBranchChoicesForHiddenNode(node, 0);

            //unapply search specific css
            if (node.nodeType() == cpmDiagram.NodeType.Step) {
                //step
                node.classTypeForShape = 0;
                node.nodeRectSearched = 0;
            }
            else if(node.nodeType() == cpmDiagram.NodeType.Decision) {
                //decision
                node.classTypeForShape = 0;
                node.nodeRectSearched = 0;
            }
            //set counter variable to empty
            node.searchResultCounter = '';
        }
    });

    //expanded
    $scope.$onRootScope('cpmDiagram.expandCollapse', function (event, expandCollapseArgs) {
        // the destination element and all of its children need to be hidden
        var node = expandCollapseArgs.activeNode;
        var conn = expandCollapseArgs.activeConnector;
        var connections = $scope.chartViewModel.connections;

        //Check wether is also a bracket; if element is a bracket and need to exand, we need allow only 1 of the child nodes to be expanded, 
        // in this scenario, go throguh connectors and the first one
        var visibleVal = conn.expanded();
        ////check wether any of the other connectors have connections with this node's guid as destination.  If so, check that source connector to determine if its a bracket
        var parentInfo = $scope.chartViewModel.GetParentInfo(node, conn);

        ////if parent connector is a bracket, collapse siblings
        if (parentInfo.isBracket) {
            //Find siblings and ensure that all connectors are collapsed except for the one that logically is the parent
            for (var i = 0; i < $scope.chartViewModel.connections.length; i++) {
                if (parentInfo.parentNode == null) break; //should be set if found
                if (connections[i].data.source.nodeID == parentInfo.parentNode.id() && connections[i].data.source.connectorIndex == parentInfo.parentIndex &&
                    connections[i].data.dest.nodeID != node.id()) {

                    //This is a sibling!  anti-exando asap! :)
                    var sibling = $scope.chartViewModel.findNode(connections[i].data.dest.nodeID);

                    //What is a node links back up to a element that is above this item?  If the algorithm is throughough, then the whoel diagram would dissapear, nice!!!
                    //iteration each connection that has this node and connector as a source, walk down each path and set hidden val
                    var siblingConnectionsToUpdate = [];
                    siblingConnectionsToUpdate = siblingConnectionsToUpdate.concat($scope.chartViewModel.ToggleExpandIfChildrenPresent(sibling, 0));
                    siblingConnectionsToUpdate = siblingConnectionsToUpdate.concat($scope.chartViewModel.ToggleExpandIfChildrenPresent(sibling, 1));
                    siblingConnectionsToUpdate = siblingConnectionsToUpdate.concat($scope.chartViewModel.ToggleExpandIfChildrenPresent(sibling, 2));
                    siblingConnectionsToUpdate = siblingConnectionsToUpdate.concat($scope.chartViewModel.ToggleExpandIfChildrenPresent(sibling, 3));

                    //Hide them all!
                    for (var j = 0; j < siblingConnectionsToUpdate.length; j++) {
                        $scope.chartViewModel.findNode($scope.chartViewModel.connections[siblingConnectionsToUpdate[j]].data.dest.nodeID).setVisible(false);
                        $scope.chartViewModel.connections[siblingConnectionsToUpdate[j]].setVisible(false);  //set visible on view model
                    };
                }
            }
        }

        //What is a node links back up to a element that is above this item?  If the algorithm is throughough, then the whoel diagram would dissapear, nice!!!
        //iteration each connection that has this node and connector as a source, walk down each path and set hidden val
        var connectionsToUpdate = [];
        $scope.chartViewModel.recursiveFindExpandedChildConnectionIndexes(true, node.id(), conn.index(), node.nodeType(), connectionsToUpdate); //array of indexes of connections that need to be hidden and thier 

        
        for (var i = 0; i < connectionsToUpdate.length; i++) {
            $scope.chartViewModel.findNode($scope.chartViewModel.connections[connectionsToUpdate[i]].data.dest.nodeID).setVisible(visibleVal);
            $scope.chartViewModel.connections[connectionsToUpdate[i]].setVisible(visibleVal);  //set visible on view model
        };

    });

    // select a path
    $scope.$onRootScope('cpmDiagram.bracketToggled', function (event, bracketToggleArgs) {
        // the destination element and all of its children need to be hidden
        var node = bracketToggleArgs.activeNode;
        var conn = bracketToggleArgs.activeConnector;
        var connections = $scope.chartViewModel.connections;

        //Check wether is also a bracket; if element is a bracket and need to exand, we need allow only 1 of the child nodes to be expanded, 
        // in this scenario, go throguh connectors and the first one
        var isBracket = conn.bracket();
        if (!isBracket) return;

        //*** Run only for setting initial scope -- if bracket connector does not have a last active node yet (first time made a bracket), set the default expanded child to the first one if none is set
        if (typeof conn.data.lastActiveNodeId == "undefined") {
            //inspect children that have expanded nodes, 
            var foundFirstChild = false;
            for (var i = 0; i < connections.length; i++) {
                if (connections[i].data.source.nodeID == node.id() && connections[i].data.source.connectorIndex == conn.index()) {
                    var childNode = $scope.chartViewModel.findNode(connections[i].data.dest.nodeID);

                    //Set first node as expanded by default, collapse remaining children
                    if (!foundFirstChild) {
                        for (var j = 0; j < childNode.inputConnectors.length; j++) {
                            //if collapsed, expand regardless of has children or not
                            if (!childNode.inputConnectors[j].expanded()) {
                                childNode.inputConnectors[j].toggleExpanded();
                                $scope.$emit('cpmDiagram.expandCollapse', { activeNode: childNode, activeConnector: childNode.inputConnectors[j] });//publish event
                            }
                        }
                        foundFirstChild = true;

                    } else {
                        for (var j = 0; j < childNode.inputConnectors.length; j++) {
                            //If expanded, collapse if it has children
                            if (childNode.inputConnectors[j].expanded()) {
                                //Test to ensure there is at least one child otherwise ignore
                                var found = false;
                                for (var k = 0; k < connections.length; k++) {
                                    //just checking source will remove the change we look at the incoming connector
                                    if (connections[k].data.source.nodeID == childNode.id() && connections[k].data.source.connectorIndex == childNode.inputConnectors[j].index()) {
                                        found = true;
                                        break;
                                    }
                                }

                                if (found) {
                                    childNode.inputConnectors[j].toggleExpanded();
                                    $scope.$emit('cpmDiagram.expandCollapse', { activeNode: childNode, activeConnector: childNode.inputConnectors[j] });//publish event
                                }
                            }
                        }
                    }
                }
            }

        }

        if (conn.expanded()) {
            for (var i = 0; i < connections.length; i++) {
                if (connections[i].data.source.nodeID == node.id() && connections[i].data.source.connectorIndex == conn.index()) {
                    //If the child was the last active node in bracket, expand, else skip expanding
                    if (conn.data.lastActiveNodeId == connections[i].data.dest.nodeID) {
                        var childNode = $scope.chartViewModel.findNode(connections[i].data.dest.nodeID);
                        for (var j = 0; j < childNode.inputConnectors.length; j++) {
                            childNode.inputConnectors[j].toggleExpand();
                            $scope.$emit('cpmDiagram.expandCollapse', { activeNode: childNode, activeConnector: childNode.inputConnectors[j] });//publish event
                        }
                    }

                }
            }
        }




    });

    $scope.expandBranchChoicesForHiddenNode = function(targetNode) {
        if (targetNode.visible()) {
            return;
        }
        var branchChoices = [];
        branchChoices = $scope.chartViewModel.findParentBranchChoices(targetNode);
        for (var i in branchChoices) {
            var branchChoice = branchChoices[i];
            $scope.expandBranchChoice(branchChoice);
            if (!branchChoice.visible()) {
                $scope.expandBranchChoicesForHiddenNode(branchChoice);
            }
        }
    }

    $scope.expandBranchChoice = function(branchChoiceNode) {
        for (var i = 0; i < branchChoiceNode.inputConnectors.length; i++) {
            if (!branchChoiceNode.inputConnectors[i].expanded()) {
                branchChoiceNode.inputConnectors[i].toggleExpanded();
                $scope.$emit('cpmDiagram.expandCollapse', { activeNode: branchChoiceNode, activeConnector: branchChoiceNode.inputConnectors[i] });
            }
        }
    }

    $scope.toggleHighlightBranchChoicesForHiddenNode = function (targetNode, turnOnOff) {
        //targetNode - node to find parents of
        if (targetNode.visible()) {
            return;
        }
        //turnOff - apply css
        var branchChoices = [];
        //find the parentBranches of targetNode
        branchChoices = $scope.chartViewModel.findParentBranchChoices(targetNode);
        for (var i in branchChoices) {
            var branchChoice = branchChoices[i];
            //console.log('branchChoice ' + branchChoice.name());
            //get connectors from the branchChoice
            var inputConnectors = branchChoice.data.inputConnectors;
            for (var r = 0; r < inputConnectors.length; r++) {
                //if the connector property canCollapse is true
                if (inputConnectors[r].canCollapse === true) {
                    branchChoice.nodeRectSearched = turnOnOff;
                }
            }
        }
    }
    ///
    /// Call Constructor
    ///
    Init();
};