var cpmDiagram = cpmDiagram || {};
cpmDiagram.ConnectionViewModel = cpmDiagram.ConnectionViewModel || {};




(function() {
    //
    // View model for a connection.
    //
    //USING: cpmDiagram.ConnectionType
    //USING: cpmDiagram.ConnectionLineViewModel
    //USING: cpmDiagram.ConnectionTextViewModel
    //INIT_REQUIRES: cpmDiagram.ConnectionType
    //INIT_REQUIRES: cpmDiagram.ConnectionLineViewModel
    //INIT_REQUIRES: cpmDiagram.ConnectionTextViewModel
    cpmDiagram.ConnectionViewModel = function(connectionDataModel, sourceConnector, destConnector) {
        var offset = 8;
        /*********************************
        CONSTRUCTOR FUNCTIONS
        **********************************/
        this.renderArrow = function() {
            return (this.dest.parentNode().nodeType() !== cpmDiagram.NodeType.Branch);
        }

        this.sourceCoordX = function() {
            var srcX = this.source.parentNode().x() + this.source.x();
            //if  sourceNode is a branch no offset calcs needed
            if (this.source.parentNode().nodeType() === cpmDiagram.NodeType.Branch) {
                return srcX;
            }
            switch (this.source.name()) {
                case "A":
                    srcX = srcX - offset;
                    break;
                case "C":
                    srcX = srcX + offset;
                    break;
             }
            return srcX;
        };

        this.sourceCoordY = function() {
            var srcY = this.source.parentNode().y() + this.source.y();
            //if  sourceNode is a branch no offset calcs needed
            if (this.source.parentNode().nodeType() === cpmDiagram.NodeType.Branch) {
                return srcY;
            }
            switch (this.source.name()) {
            case "D":
                srcY = srcY + offset;
                break;
            case "B":
                srcY = srcY - offset;
                break;
            }
            return srcY;
        };

        this.sourceCoord = function() {
            return {
                x: this.sourceCoordX(),
                y: this.sourceCoordY()
            };
        }


        this.destCoordX = function() {
            var dstX = this.dest.parentNode().x() + this.dest.x();
            //if  sourceNode is a branch no offset calcs needed
            if (!this.renderArrow()) {
                return dstX;
            }
            switch (this.dest.name()) {
            case "A":
                dstX = dstX - offset;
                break;
            case "C":
                dstX = dstX + offset;
                break;
            }
            return dstX;
        };

        this.destCoordY = function() {
            var dstY = this.dest.parentNode().y() + this.dest.y();
            //if  sourceNode is a branch no offset calcs needed
            if (!this.renderArrow()) {
                return dstY;
            }
            switch (this.dest.name()) {
            case "D":
                dstY = dstY + offset;
                break;
            case "B":
                dstY = dstY - offset;
                break;
            }
            return dstY;
        };

        this.destCoord = function() {
            return {
                x: this.destCoordX(),
                y: this.destCoordY()
            };
        }

        //
        // Takes the text from datamodel and looks up the connectionType value.
        // Also defaults to SShape_DragAlongY if none exists for this string 
        //
        var strToConnectionType = function(connectionTypeString) {

            return (connectionTypeString && cpmDiagram.ConnectionType[connectionTypeString]) ? cpmDiagram.ConnectionType[connectionTypeString] : cpmDiagram.ConnectionType.SShape_DragAlongY;

        };


        this._createConnectionLines = function() {

            var source = this.sourceCoord();
            var dest = this.destCoord();
            var lines = [];
            var connectionType = strToConnectionType(this.data.type);
            lines[lines.length] = new cpmDiagram.ConnectionLineViewModel(0, source, dest, connectionType, this.data.connectionBreakLength, this.renderArrow());
            lines[lines.length] = new cpmDiagram.ConnectionLineViewModel(1, source, dest, connectionType, this.data.connectionBreakLength, this.renderArrow());
            lines[lines.length] = new cpmDiagram.ConnectionLineViewModel(2, source, dest, connectionType, this.data.connectionBreakLength, this.renderArrow());

            return lines;
        }

        this._createConnectionText = function() {
            if (this.data.text) {
                return new cpmDiagram.ConnectionTextViewModel(this.sourceCoord(), this.source.name(), this.data.text);
            }
            return undefined;
        }


        /***************************************
        PROPERTIES
        ***************************************/
        //this.visible = true;
        this.data = connectionDataModel;
        this.source = sourceConnector;
        this.dest = destConnector;

        //collection of different connection types that could be used
        /**
        TODO: remove this from here and put on the scope object for the view 
        to make this ViewModel cleaner
        **/
        this.availableConnectionTypes = cpmDiagram.ConnectionType;

        // Set to true when the connection is selected.
        this._selected = false;

        /*INITED PROPERTIES*/
        //
        //Get the list of ConnectionLine objects
        //
        if (strToConnectionType(connectionDataModel.type) !== cpmDiagram.ConnectionType.None) {
            this.lines = this._createConnectionLines();
        }

        //
        // Text object that will be rendered as part of the connection
        //
        this.textObj = this._createConnectionText();



        /***********************************
        WRAPPED PROPERTIES
        *************************************/
        this.visible = function () {
            if (typeof this.data.visible === "undefined") this.data.visible = true; //backwards compatible
            return this.data.visible;
        }
        this.setVisible = function (val) { this.data.visible = val; }

        //
        // Select the connection.
        //
        this.select = function () {
            this._selected = true;
        };

        //
        // Deselect the connection.
        //
        this.deselect = function () {
            this._selected = false;
        };

        //
        // Toggle the selection state of the connection.
        //
        this.toggleSelected = function () {
            this._selected = !this._selected;
        };

        //
        // Returns true if the connection is selected.
        //
        this.selected = function () {
            return this._selected;
        };

       
       /*****************************
       MEMBERS
       *****************************/
        this.recomputeLineCoords = function() {

            var conType = strToConnectionType(this.data.type);
            if (conType === cpmDiagram.ConnectionType.None) {
                return;
            }

            var source = this.sourceCoord();
            var dest = this.destCoord();
            
            for (var i = 0; i < this.lines.length; ++i) {
                this.lines[i].source = source;
                this.lines[i].dest = dest;
                this.lines[i].connectionType = conType;
                this.lines[i].connectionBreakLength = this.data.connectionBreakLength;
                this.lines[i].lineCoordX1();
                this.lines[i].lineCoordY1();
                this.lines[i].lineCoordX2();
                this.lines[i].lineCoordY2();
            }

        };

        this.arrowMarkerId = function() {
            return "triangle-" + this.data.source.nodeID + '-' + this.data.dest.nodeID;
        }

        this.setConnectionBreakLength = function(breakCoord) {
            //var conType = cpmDiagram.ConnectionViewModel.ConnectionType[this.data.type] ? cpmDiagram.ConnectionViewModel.ConnectionType[this.data.type] : cpmDiagram.ConnectionViewModel.ConnectionType.SShape_DragAlongY;
            var conType = strToConnectionType(this.data.type);
            if (conType === cpmDiagram.ConnectionType.SShape_DragAlongY) {
                if (this.data.connectionBreakLength === undefined) {
                    this.data.connectionBreakLength = (this.destCoordY() - this.sourceCoordY()) / 2;
                }
                this.data.connectionBreakLength += breakCoord.y; // - this.sourceCoordY();
            } else if (conType === cpmDiagram.ConnectionType.SShape_DragAlongX) {
                if (this.data.connectionBreakLength === undefined) {
                    this.data.connectionBreakLength = (this.destCoordX() - this.sourceCoordX()) / 2;
                }
                this.data.connectionBreakLength += breakCoord.x; //- this.sourceCoordX();
            }
        }

        this.setConnectionType = function(conType) {
            var conTypeStr = "";
            //if conType argument is a number 
            if (typeof conType == "number" && isFinite(conType) && conType % 1 === 0) {
                //look up the property
                for (var prop in cpmDiagram.ConnectionType) {
                    if (cpmDiagram.ConnectionType[prop] == conType) {
                        conTypeStr = prop;
                    }
                }
            } else if (typeof conType == "string") {
                conTypeStr = conType;
            }
            this.data.type = conTypeStr;
        };

        this.getConnectionTypeStr = function() {
            return this.data.type;
        }

        this.getConnectionType = function() {
            return strToConnectionType(this.data.type);
        }

        this.polylinePointsStr = function() {
            var conType = strToConnectionType(this.data.type);
            if (conType === cpmDiagram.ConnectionType.None) {
                return "";
            }
            var x1 = this.lines[0].lineCoordX1();
            var y1 = this.lines[0].lineCoordY1();
            var x2 = this.lines[1].lineCoordX1();
            var y2 = this.lines[1].lineCoordY1();
            var x3 = this.lines[2].lineCoordX1();
            var y3 = this.lines[2].lineCoordY1();
            var x4 = this.lines[2].lineCoordX2();
            var y4 = this.lines[2].lineCoordY2();

            return x1 + "," + y1 + " " +
                x2 + "," + y2 + " " +
                x3 + "," + y3 + " " +
                x4 + "," + y4 + " ";

        };

    };
})();