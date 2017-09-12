//Ensure exists
var cpmDiagram = cpmDiagram || {};


(function () {
    //
    // ENUM: Node Types
    //
    cpmDiagram.NodeType = {}

    cpmDiagram.NodeType.Step = 0;

    cpmDiagram.NodeType.Decision = 1;

    cpmDiagram.NodeType.DecisionChoice = 5;

    cpmDiagram.NodeType.BranchChoice = 2;

    cpmDiagram.NodeType.Branch = 4;

    cpmDiagram.NodeType.LinkToExtCpm = 3;

    cpmDiagram.NodeType.LightboxPseudoNode = 6;
})();