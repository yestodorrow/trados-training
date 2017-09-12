//Ensure exists
var cpmDiagram = cpmDiagram || {};
(function() {
    //
    // View model for a node.
    //
    //USING: cpmDiagram.ConnectorViewModel
    cpmDiagram.NodeViewModel = function(nodeDataModel) {

        /*********************************
        CONSTRUCTOR FUNCTIONS
        **********************************/
        //
        // Create view model for a list of data models.
        //
        var createConnectorsViewModel = function (nodeType, connectorDataModels, x, parentNode) {
            var viewModels = [], connectorViewModel;
            if (nodeType <= 3) {
                if (connectorDataModels && connectorDataModels.length == 4) {
                    //Should have 4 for rectangles
                    //Left
                    connectorViewModel =
                        new cpmDiagram.ConnectorViewModel(0, connectorDataModels[0], 0, .50/*parentNode.data.nodeHeight / 2 */, parentNode);
                    viewModels.push(connectorViewModel);

                    //Top
                    viewModels.push(new cpmDiagram.ConnectorViewModel(1,
                        connectorDataModels[1],
                        .50/*(parentNode.data.nodeWidth / 2)*/,
                        0,
                        parentNode));

                    //Right
                    viewModels.push(new cpmDiagram.ConnectorViewModel(2,
                        connectorDataModels[2],
                        1/*x + parentNode.data.nodeWidth*/,
                        .50/* (parentNode.data.nodeHeight / 2)*/,
                        parentNode));

                    //Bottom
                    viewModels.push(new cpmDiagram.ConnectorViewModel(3,
                        connectorDataModels[3],
                        .50/*(parentNode.data.nodeWidth / 2)*/,
                        1/*parentNode.data.nodeHeight*/,
                        parentNode));
                }
            }


            // branch node connectors
            if (nodeType === 4 ) {
                // A branch-connector node has only one connector
                if (connectorDataModels && connectorDataModels.length == 1) {

                    connectorViewModel =
                        new cpmDiagram.ConnectorViewModel(0, connectorDataModels[0], 0, 0, parentNode);
                    viewModels.push(connectorViewModel);
                }
            }

            //decision-choice node connectors
            if (nodeType === 5 ) {
                // A decision-choice node has only one connector 
                // which could vary based on parent node's lastActiveConnector index. 
                if (connectorDataModels && connectorDataModels.length == 1) {
                    var xMult = 0, yMult = 0, index = 0;
                    switch(connectorDataModels[0].name) {
                        case 'A': //Left
                            xMult = 0;
                            yMult = .5;
                            index = 0; 
                            break;
                        case 'B': // Top
                            xMult = .5;
                            yMult = 0;
                            index = 1; 
                            break;
                        case 'C': // Top
                            xMult = 1;
                            yMult = 0.5;
                            index = 2; 
                            break;
                        case 'D': // Top
                            xMult = .5;
                            yMult = 1;
                            index = 3; 
                            break;
                    }
                    connectorViewModel =
                        new cpmDiagram.ConnectorViewModel(index, connectorDataModels[0], xMult, yMult, parentNode);
                    viewModels.push(connectorViewModel);
                }
            }

            return viewModels;
        };

        /***************************************
        PROPERTIES
        ***************************************/
        
        this.data = nodeDataModel;
        // Set to true when the node is selected.
        this._selected = false;
        this._lastActiveConnectorIndex = 0;
        this.hideSections = true;
        //cpm search properties to set for search classes
        this.classTypeForShape = 0;
        this.searchResultCounter;
        this.nodeRectSearched = 0;
        this.nodeDiamondSearched = 0;

        /*INITED PROPERTIES*/
        this.inputConnectors = createConnectorsViewModel(this.data.nodeType, this.data.inputConnectors, 0, this);

        this.refreshConnectors = function() {
            this.inputConnectors = createConnectorsViewModel(this.data.nodeType, this.data.inputConnectors, 0, this);
        }

        /***********************************
        WRAPPED PROPERTIES
        *************************************/

        this.isSize = function(strSize) {
            if (typeof this.data.size == "undefined") return strSize == 'standard';

            return strSize == this.data.size;

        }

        this.visible = function() {
            if (typeof this.data.visible === "undefined") this.data.visible = true; //backwards compatible
            return this.data.visible;
        }
        this.setVisible = function (val) { this.data.visible = val; }

        this.NodeID = function(){
            return "Node " + this.data.chartNodeId;
        }

        //
        // Object Type
        //
        this.nodeType = function() {

            return this.data.nodeType;
        }

        this.id = function() {

            return this.data.id;
        }

        //
        // Name of the node.
        //
        this.name = function() {
            return this.data.name || "";
        };

        //
        // X coordinate of the node.
        //
        this.x = function() {
            return parseFloat(this.data.x);
        };

        //
        // Y coordinate of the node.
        //
        this.y = function() {
            return parseFloat(this.data.y);
        };

        //
        // Width of the node.
        //
        this.width = function() {
            return this.data.nodeWidth; //cpmDiagram.nodeWidth;
        };

        this.widthRotated = function() {
            return this.width() * .75 * .4;
        };

        //
        // Height of the node.
        //
        this.height = function() {
            return parseInt(this.data.nodeHeight);
            /*var numConnectors =
	            Math.max(
	                this.inputConnectors.length,
	                this.outputConnectors.length);
            return cpmDiagram.computeConnectorY(numConnectors);*/
        };

        this.heightRotated = function() {
            return this.height() * .75 * .77;
        };

        this.nodeBottom = function() {
            return parseInt(this.data.nodeHeight) + parseInt(this.data.y);
        };

        this.nodeYMid = function () {
            return parseInt(this.data.nodeWidth * .5) + parseInt(this.data.x) - 16; //Why 16 px offset?  not sure... 2/3rds of side gap, but why?  might be future regression issue here...
        };

        //
        // Select the node.
        //
        this.select = function() {
            this._selected = true;
        };

        //
        // last activated connects (mouse rolled over) node.
        //
        this.lastActiveConnector = function() {
            if (this.nodeType() === 5) { // for decision-choice the array has only one connector
                return this.inputConnectors[0];
            }
            return this.inputConnectors[this._lastActiveConnectorIndex];
        };

        //
        // set last activated connector (mouse rolled over) node.
        //
        this.setActiveConnectorIndex = function(index) {
            this._lastActiveConnectorIndex = index;
        };

        //
        // Deselect the node.
        //
        this.deselect = function() {
            this._selected = false;
        };

        //
        // Toggle the selection state of the node.
        //
        this.toggleSelected = function() {
            this._selected = !this._selected;
            this.hideSections = this._selected && this.data.relatedContentItems.length > 0 ? false : true;
            if (this.hideSections) {
                //Hack of structure to support
                //ame.lightbox.hide(node.data.id);
            }
            this.setHover(!this.hideSections);
        };

        //
        // True if there is at least one section associated with the item
        //
        this.hasSections = function() {
            return this.data.relatedContentItems.length > 0;
        }

        //
        // Returns true if the node is selected.
        //
        this.selected = function() {
            return this._selected;
        };

        this.isHovering = function() {
            return this.data.hover;
        };

        this.href = function() {
            return (('extRef' in this.data) && 'href' in this.data.extRef) ? this.data.extRef.href : "";
        }

        /*****************************
        /*****************************
        MEMBERS
        *****************************/
        this.FormatCssClasses = function(cssClasses) {
            var cssStr = "";
            if (cssClasses) {
                 for (var innerIndex = 0; innerIndex < cssClasses.length; innerIndex++) {
                            cssStr += " " + cssClasses[innerIndex];
                 }
            }
           
            return cssStr;
        }
        this.GetCssClasses = function (relatedContentItemsId) {
            //find the item and buidl the class string
            for (var index = 0; index < this.data.relatedContentItems.length, index++;) {
                if (data.relatedContentItems[index].id === relatedContentItemsId) {
                    var cssStr = "";
                    if (this.data.CssClasses) {
                        for (var innerIndex = 0; innerIndex < this.data.CssClasses.length; innerIndex++) {
                            cssStr += " " + this.data.CssClasses[innerIndex];
                        }
                    }
                    return cssStr;
                }
            }

            return "";
        }

        this.hasCollapsedConnectors = function() {
            for (var i = 0; i < this.inputConnectors.length; i++) {
                if (!this.inputConnectors[i].expanded()) {
                    return true;
                }
            }
            return false;
        }


        ///
        /// Retrieve the first section title if there are sections assocated with this item
        ///
        this.GetFirstSectionTitle = function () {
            if (this.hasSections()) {
                return this.data.relatedContentItems[0].title;
            } else {
                return "";
            }
        }

        this.GetSectionContent = function() {
            if (this.hasSections()) {
                var retVal = "";
                for (var t = 0; t < this.data.relatedContentItems.length; t++) {
                    retVal += "<div>";
                    retVal += this.data.relatedContentItems[t].body;
                    retVal += "</div>";
                }
                return retVal;
            } else {
                return "";
            }

        }

        //
        // Set Hover state
        //
        this.setHover = function (boolState) {
            if (this.hasSections() && !this.hideSections)
                this.data.hover = true;
            else
                this.data.hover = boolState;
        };

        //
        // Internal function to add a connector.
        this._addConnector = function(connectorDataModel, x, connectorsDataModel, connectorsViewModel) {
            var connectorViewModel =
                new cpmDiagram.ConnectorViewModel(connectorsViewModel.length, connectorDataModel, x,
                    cpmDiagram.computeConnectorY(connectorsViewModel.length), this);

            connectorsDataModel.push(connectorDataModel);

            // Add to node's view model.
            connectorsViewModel.push(connectorViewModel);
        };

        //
        // Add an input connector to the node.
        //
        this.addInputConnector = function(connectorDataModel) {

            if (!this.data.inputConnectors) {
                this.data.inputConnectors = [];
            }
            this._addConnector(connectorDataModel, 0, this.data.inputConnectors, this.inputConnectors);
        };

        //
        // Add an ouput connector to the node.
        //
        this.addOutputConnector = function(connectorDataModel) {

            if (!this.data.outputConnectors) {
                this.data.outputConnectors = [];
            }
            this._addConnector(connectorDataModel, cpmDiagram.nodeWidth, this.data.outputConnectors, this.outputConnectors);
        };
        

        //
        // Instead of using the inputConnector[index] 
        // this method node.getConnector('A') can be used till 
        // the underlying datastructure 
        // is changed to dictionary instead of 
        // an array for the inputConnectors
        //
        this.getConnector = function(connectorName)
        {
            for (var prop in this.inputConnectors) {
                var conn = this.inputConnectors[prop]; 
                if (conn.name() === connectorName) {
                    return conn;
                }
            }
            return null;
        }


    };
})();