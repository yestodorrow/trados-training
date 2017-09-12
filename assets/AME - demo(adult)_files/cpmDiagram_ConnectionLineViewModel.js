//Ensure exists
var cpmDiagram = cpmDiagram || {};
//cpmDiagram.ConnectionViewModel = cpmDiagram.ConnectionViewModel || {};


(function () {
    //
    //
    //USING: cpmDiagram.ConnectionViewModel.ConnectionType
    cpmDiagram.ConnectionLineViewModel = function(lineIndex, sourceCoord, destCoord, connectionType_, connectionBreakLength_, renderArrowMarker) {

        /*********************************
        CONSTRUCTOR FUNCTIONS
        **********************************/

        /***************************************
        PROPERTIES
        ***************************************/
        this.source = sourceCoord;
        this.dest = destCoord;
        this.lineIndex = lineIndex;
        this.isDraggable = (lineIndex == 1);
        this.lastLine = (lineIndex == 2);
        this.connectionType = connectionType_;
        this.connectionBreakLength = connectionBreakLength_;
        
        var arrowHeadLength = 11;
        if (!renderArrowMarker) {
            arrowHeadLength = 0;
        }
        /***********************************
        WRAPPED PROPERTIES
        *************************************/
        this.lineCoordX1 = function () {
            if (this.connectionType === cpmDiagram.ConnectionType.SShape_DragAlongY) {
                if (lineIndex === 0) {
                    return this.source.x;
                }
                if (lineIndex == 1) {
                    return this.source.x;
                }
                if (lineIndex === 2) {
                    return this.dest.x;
                }
            }
            if (this.connectionType === cpmDiagram.ConnectionType.SShape_DragAlongX) {
                if (lineIndex === 0) {
                    return this.source.x;
                }
                if (lineIndex == 1) {
                    return this.computeMidX();
                }
                if (lineIndex === 2) {
                    return this.computeMidX();
                }
            }
            return null; //TODO: null case?
        };

        this.lineCoordY1 = function () {
            if (this.connectionType === cpmDiagram.ConnectionType.SShape_DragAlongY) {
                if (lineIndex === 0) {
                    return this.source.y;
                }
                if (lineIndex === 1) {
                    return this.computeMidY();
                }
                if (lineIndex === 2) {
                    return this.computeMidY();
                }
            }
            if (this.connectionType === cpmDiagram.ConnectionType.SShape_DragAlongX) {
                if (lineIndex === 0) {
                    return this.source.y;
                }
                if (lineIndex === 1) {
                    return this.source.y;
                }
                if (lineIndex === 2) {
                    return this.dest.y;
                }
            }
            return null; //TODO: null case?
        };

        this.lineCoordX2 = function () {
            if (this.connectionType === cpmDiagram.ConnectionType.SShape_DragAlongY) {
                if (lineIndex === 0) {
                    return this.source.x;
                }
                if (lineIndex === 1) {
                    return this.dest.x;
                }
                if (lineIndex === 2) {
                    //return this.dest.x;
                    return line3CoordX({ x: this.lineCoordX1(), y: this.lineCoordY1() }, this.dest);
                }
            }
            if (this.connectionType === cpmDiagram.ConnectionType.SShape_DragAlongX) {
                if (lineIndex === 0) {
                    return this.computeMidX();
                }
                if (lineIndex === 1) {
                    return this.computeMidX();
                }
                if (lineIndex === 2) {
                    //return this.dest.x;
                    return line3CoordX({ x: this.lineCoordX1(), y: this.lineCoordY1() }, this.dest);
                }
            }
            return null; //TODO: null case?
        };

        this.lineCoordY2 = function () {
            if (this.connectionType === cpmDiagram.ConnectionType.SShape_DragAlongY) {
                if (lineIndex === 0) {
                    return this.computeMidY();
                }
                if (lineIndex == 1) {
                    return this.computeMidY();
                }
                if (lineIndex === 2) {
                    //return this.dest.y;
                    return line3CoordY({ x: this.lineCoordX1(), y: this.lineCoordY1() }, this.dest);
                }
            }
            if (this.connectionType === cpmDiagram.ConnectionType.SShape_DragAlongX) {
                if (lineIndex === 0) {
                    return this.source.y;
                }
                if (lineIndex == 1) {
                    return this.dest.y;
                }
                if (lineIndex === 2) {
                    //return this.dest.y;
                    return line3CoordY({ x: this.lineCoordX1(), y: this.lineCoordY1() }, this.dest);
                }
            }
            return null; //TODO: null case?
        };

        this.isDraggableAlongX = function () {
            return this.connectionType === cpmDiagram.ConnectionType.SShape_DragAlongX;
        };

        this.isDraggableAlongY = function () {
            return this.connectionType === cpmDiagram.ConnectionType.SShape_DragAlongY;
        };

        /*****************************
        MEMBERS
        *****************************/
        this.computeMidY = function () {
            if (this.connectionBreakLength === undefined || this.connectionBreakLength === null) {
                this.connectionBreakLength = (this.dest.y - this.source.y) / 2;
            }
            return this.source.y + this.connectionBreakLength;
        };

        this.computeMidX = function () {
            if (this.connectionBreakLength === undefined || this.connectionBreakLength === null) {
                this.connectionBreakLength = (this.dest.x - this.source.x) / 2;
            }
            return this.source.x + this.connectionBreakLength;
        };

        function line3Angle(source, dest) {
            return Math.atan2((dest.y - source.y), (dest.x - source.x));
        };

        function line3CoordX(source, dest) {
            var phi = line3Angle(source, dest);
            return dest.x - arrowHeadLength * Math.cos(phi);
        };

        function line3CoordY(source, dest) {
            var phi = line3Angle(source, dest);
            return dest.y - arrowHeadLength * Math.sin(phi);
        };
    };

})();
