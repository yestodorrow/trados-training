//Ensure exists
var cpmDiagram = cpmDiagram || {};
//cpmDiagram.ConnectionViewModel = cpmDiagram.ConnectionViewModel || {};


(function() {
    //
    // View model for a connector.
    //
    cpmDiagram.ConnectorViewModel = function(index, connectorDataModel, xMult, yMult, parentNode) {
    /*********************************
    CONSTRUCTOR FUNCTIONS
    **********************************/

    /***************************************
    PROPERTIES
    ***************************************/
        this.data = connectorDataModel;
        this._parentNode = parentNode;
        this._xMult = xMult;
        this._yMult = yMult;
        this._index = index;

    /***********************************
    WRAPPED PROPERTIES
    *************************************/
        this.index = function() {
            return this._index;
        }

        //
        // The name of the connector.
        //
        this.name = function() {
            return this.data.name;
        };

        //
        //Whether node is expanded or not
        //
        this.expanded = function() {
            return this.data.expanded;
        }

        //
        //Boolean to track wther is a bracket or not
        //
        this.bracket = function() {
            return this.data.bracket;
        }

        //
        // Node ID of last expanded node in a bracket, assume set default if not set when bracket state is updated
        //
        this.lastActiveNodeId = function() {
            return this.data.lastActiveNodeId;
        }

        //
        // X coordinate of the connector.
        //
        this.x = function() {
            return this._parentNode.data.nodeWidth * this._xMult;
        };

        //
        // Y coordinate of the connector.
        //
        this.y = function() {
            return this._parentNode.data.nodeHeight * this._yMult;
        };


        this.textOffsetX = function()
        {

            return this._xMult == 0 ? -20 : 20;
        }

        this.textOffsetY = function () {

            return this._yMult == 0 ? -20 : 20;
        }

        this.collapseOffsetX = function () {

            return (this._xMult == .5) ? 0 : 10;
        }

        this.collapseOffsetY = function () {

            return this._yMult == .5 ? 0 : 10;
        }
        this.collapseXLength = function () {

            return (this._xMult == .5) ? 0 : 24;
        }

        this.collapseYLength = function () {

            return this._yMult == .5 ? 0 : 24;
        }

        //
        // The parent node that the connector is attached to.
        //
        this.parentNode = function() {
            return this._parentNode;
        };

        /*****************************
        MEMBERS
        *****************************/
        this.canCollapse = function() {
            return this.data.canCollapse;
        }
        this.setCanCollapse = function(pTrueFalse) {
            this.data.canCollapse = pTrueFalse;
        }
        this.toggleExpanded = function () {
            this.data.expanded = !this.data.expanded;
            if (!this.data.expanded) {
                //be sure to enable the option to expand/collapse 
                this.setCanCollapse(true);
            }
        }
        this.toggleBracket = function () {
            this.data.bracket = !this.data.bracket;
        }
        this.isBracket = function() {
            return this.data.bracket;
        }
        this.arrowMarkerId = function() {
            return "expandMarker" + this._parentNode.id() + this.index();
        }
    };

})();

