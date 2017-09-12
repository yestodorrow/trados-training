angular.module('cpmAppCommon').service('cpmNodeInitializer', ['rfc4122', cpmNodeInitializer]);

function cpmNodeInitializer(guidService) {


    /**************************
    * CONSTANTS
    * Node widht and height defaults
    *
    **************************/
    var stepNodeDefaultWidth = 180;
    var stepNodeDefaultHeight = 60;
    var decisionNodeDefaultWidth = 160;
    var decisionNodeDefaultHeight = 160;
    var decisionChoiceNodeDefaultWidth = 30;
    var decisionChoiceNodeDefaultHeight = 20;
    var branchConnectorDefaultWidth = 0;
    var branchConnectorDefaultHeight = 0;
    var branchChoiceDefaultWidth = 160;
    var branchChoiceDefaultHeight = 60;
    var decisionConnectionGap12 = 2;// changing the 12 px to 2 px as the diamond radius of 18 is already causing some gap. watch for regression issues.
    var linkToExtCpmDefaultWidth = 230;
    var linkToExtCpmDefaultHeight = 60;
    var defaultViewWidth = 960;
    var nodeToNodeDefaultGap = 40;
    /********************
    * PRIVATE MEMBERS
    ************************/
    var createInitialNode = function(newNodeArgs) {
        var newNode = new cpmDiagram.Node();
        newNode.nodeType = newNodeArgs.nodeType;

        var activeConnector = newNodeArgs.parentNode.lastActiveConnector();
        newNode.y = newNodeArgs.parentNode.y() + activeConnector.y() + nodeToNodeDefaultGap;
        newNode.x = newNodeArgs.parentNode.x(); // + activeConnector.x() + 0;
        newNode.name = newNodeArgs.title;
        newNode.id = guidService.v4();

        return newNode;


    };

    //
    //Most of the new nodes created need to be aligned based on where the parent node is located
    //
    var getNewNodeDefaultX = function(newNodeArgs, newNodeWidth) {
        var lastActiveConnector = newNodeArgs.parentNode.lastActiveConnector();
        switch (lastActiveConnector.name()) {
        case 'D':
        case 'B':
            return newNodeArgs.parentNode.x() + lastActiveConnector.x() - newNodeWidth / 2;
        case 'A':
            return newNodeArgs.parentNode.x() - newNodeWidth - nodeToNodeDefaultGap;
        case 'C':
            return newNodeArgs.parentNode.x() + newNodeArgs.parentNode.width() + nodeToNodeDefaultGap;
        }
        return newNodeArgs.parentNode.x(); // should never hit this.
    };

    //
    //Most of the new nodes created need to be aligned based on where the parent node is located
    //
    var getNewNodeDefaultY = function(newNodeArgs, newNodeHeight) {
        var lastActiveConnector = newNodeArgs.parentNode.lastActiveConnector();
        switch (lastActiveConnector.name()) {
        case 'D':
            return newNodeArgs.parentNode.y() + lastActiveConnector.y() + nodeToNodeDefaultGap;
        case 'B':
            return newNodeArgs.parentNode.y() - newNodeHeight - nodeToNodeDefaultGap;
        case 'A':
        case 'C':
            return newNodeArgs.parentNode.y() + lastActiveConnector.y() - newNodeHeight / 2;
        }
        return newNodeArgs.parentNode.x(); // should never hit this.
    };

    ///
    /// returns initial connector based on the connector index of 
    /// the decision on which the decision-choice needs to be created.
    ///
    var getDecisionChoiceInitialConnector = function(pcIndex) {

        switch (pcIndex) {
        case 0: // A - Left side
            return {
                name: "A",
                expanded: true
            }
        case 1: // B - Top 
            return {
                name: "B",
                expanded: true
            }
        case 2: // C- Right side
            return {
                name: "C",
                expanded: true
            }
        case 3: // D - Bottom
            return {
                name: "D",
                expanded: true
            }
        }

    }


/*********************************
    * FACTORY OBJECT 
    ***********************************/
    return {
        createNewCpmInitialStepNode: function(val, type) {
            var newNode = new cpmDiagram.Node();
            if (type == cpmDiagram.NodeType.Step) {
                newNode.nodeHeight = stepNodeDefaultHeight;
                newNode.nodeWidth = stepNodeDefaultWidth;
            } else if (type == cpmDiagram.NodeType.Decision) {
                newNode.nodeHeight = decisionNodeDefaultHeight;
                newNode.nodeWidth = decisionNodeDefaultWidth;
            }

            newNode.nodeType = type;
            newNode.y = 50;
            newNode.x = (defaultViewWidth - newNode.nodeWidth)/2;
            newNode.name = val;
            newNode.id = guidService.v4();
            return newNode;
        },
        createStepNode: function(newNodeArgs) {
            //get a default
            var node = createInitialNode(newNodeArgs);

            //customize it
            node.nodeWidth = stepNodeDefaultWidth;
            node.nodeHeight = stepNodeDefaultHeight;
            node.x = getNewNodeDefaultX(newNodeArgs, node.nodeWidth);
            node.y = getNewNodeDefaultY(newNodeArgs, node.nodeHeight);
            return node;
        },
        createLinkExtCpmNode: function(newNodeArgs) {
            //get a default
            var node = createInitialNode(newNodeArgs);

            //customize it
            node.nodeWidth = linkToExtCpmDefaultWidth;
            node.nodeHeight = linkToExtCpmDefaultHeight; 
            node.x = getNewNodeDefaultX(newNodeArgs, node.nodeWidth);
            node.y = getNewNodeDefaultY(newNodeArgs, node.nodeHeight);
            return node;
        },
        createDecisionNode: function(newNodeArgs) {
            //get a default
            var node = createInitialNode(newNodeArgs);

            // customize it
            node.nodeWidth = decisionNodeDefaultWidth;
            node.nodeHeight = decisionNodeDefaultHeight;
            node.x = getNewNodeDefaultX(newNodeArgs, node.nodeWidth);
            node.y = getNewNodeDefaultY(newNodeArgs, node.nodeHeight);
            return node;
        },

        createDecisionChoiceNode: function(newNodeArgs) {
            //get a default
            var node = createInitialNode(newNodeArgs);

            // customize it
            node.nodeWidth = decisionChoiceNodeDefaultWidth;
            node.nodeHeight = decisionChoiceNodeDefaultHeight;
            node.inputConnectors = [];
            node.inputConnectors[0] = getDecisionChoiceInitialConnector(newNodeArgs.parentNode.lastActiveConnector().index());

            var dcCoord = this.decisionChoiceCoordWrtDecision(newNodeArgs.parentNode, node);
            node.x = dcCoord.x;
            node.y = dcCoord.y;
            return node;
        },

        createBranchConnectorNode: function(newNodeArgs) {

            //get a default
            var node = createInitialNode(newNodeArgs);

            // customize it
            node.nodeWidth = branchConnectorDefaultWidth; // should be 0
            node.nodeHeight = branchConnectorDefaultHeight; //should be 0 

            node.inputConnectors = [{ name: "A", expanded: true }];
            node.x = getNewNodeDefaultX(newNodeArgs, node.nodeWidth);
            node.y = getNewNodeDefaultY(newNodeArgs, node.nodeHeight);
            return node;
        },

        createBranchChoiceNode: function(newNodeArgs) {

            //get a default
            var node = createInitialNode(newNodeArgs);

            // customize it
            node.nodeWidth = branchChoiceDefaultWidth;
            node.nodeHeight = branchChoiceDefaultHeight;
            //branch-choice needs to be positioned manually. No preferred default
            //node.x = getNewNodeDefaultX(newNodeArgs, node.nodeWidth);
            //node.y = getNewNodeDefaultY(newNodeArgs, node.nodeHeight);
            return node;
        },
        createLightboxNode:function() { // a lightbox node is an invisible one that is used only to tie sections together
            var newNode = new cpmDiagram.Node();
            newNode.nodeType = cpmDiagram.NodeType.LightboxPseudoNode;
            newNode.id = guidService.v4();
            newNode.name = "Light box with id - "+newNode.id;
            newNode.x = 0;
            newNode.y = 0;
            newNode.nodeWidth = 0;
            newNode.nodeHeight = 0;
            newNode.inputConnectors = [];
            newNode.outputConnectors = [];
            newNode.relatedContentItems = [];
            return newNode;
        },
        decisionChoiceCoordWrtDecision: function(decision, decisionChoiceData) {
            var x = 0, y = 0;
            var index = 0;
            switch (decisionChoiceData.inputConnectors[0].name) {
            case 'A':
                index = 0;
                break;
            case 'B':
                index = 1;
                break;
            case 'C':
                index = 2;
                break;
            case 'D':
                index = 3;
                break;
            }
            var connector = decision.inputConnectors[index];
            var dConPosX = decision.x() + connector.x();
            var dConPosY = decision.y() + connector.y();
            var dcWidth = decisionChoiceData.nodeWidth;
            var dcHeight = decisionChoiceData.nodeHeight;
            switch (connector.index()) {
            case 0: // A - Left side
                x = dConPosX - dcWidth - decisionConnectionGap12;
                y = dConPosY - dcHeight / 2;
                break;
            case 1: // B - Top 
                x = dConPosX - dcWidth / 2;
                y = dConPosX - dcHeight - decisionConnectionGap12;
                break;
            case 2: // C- Right side
                x = dConPosX + decisionConnectionGap12;
                y = dConPosY - dcHeight / 2;
                break;
            case 3: // D - Bottom
                x = dConPosX - dcWidth / 2;
                y = dConPosY + decisionConnectionGap12;
                break;
            }
            return { x: x, y: y };
        }
    };

}