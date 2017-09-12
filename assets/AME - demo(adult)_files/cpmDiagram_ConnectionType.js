//Ensure exists
var cpmDiagram = cpmDiagram || {};
//cpmDiagram.ConnectionViewModel = cpmDiagram.ConnectionViewModel || {};


(function () {
    //
    // ENUM: Connection Line Types
    //
    cpmDiagram.ConnectionType = {}

    // |
    // | Straight line
    // |
    // cpmDiagram.ConnectionViewModel.ConnectionType.Straight = 1;

    //  |
    //  ----. S shape, that could be dragged along Y axis 
    //      |
    cpmDiagram.ConnectionType.SShape_DragAlongY = 2;

    // ---. 
    //    |    S shape, that could be dragged along X axis 
    //    .--- 
    cpmDiagram.ConnectionType.SShape_DragAlongX = 3;

    //  |
    //  |     L shape
    //  .--- 
    cpmDiagram.ConnectionType.LShape = 4;

    //  ---.
    //     |  L shape inverted
    //     |
    cpmDiagram.ConnectionType.LShape_Inverted = 5;

    //
    // No lines/connection will be rendered
    // Used by decision to decision-choice connection
    //
    cpmDiagram.ConnectionType.None = 6;


})();