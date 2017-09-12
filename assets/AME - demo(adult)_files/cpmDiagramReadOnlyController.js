//
// Read Only view, used for preview currently, need to rethink this as we get more into the public view of CPMS
//
angular.module('cpmDiagramReadOnly', []).controller('cpmDiagramReadOnlyController', ['$scope', '$element', 'sitecoreService', '$location', 'settings', 'lightbox', '$interval', cpmDiagramReadOnlyController]);


///
/// Read only view of the cpm diagram, I control the rendering a svg calculations for the diagram
///
function cpmDiagramReadOnlyController($scope, $element, sitecoreService, $location, settings, lightbox, $interval) {
    /****************************************
 CONSTANTS
 ****************************************/
    var bodyFieldId = "{07C225C6-DA3E-4339-BD8A-A70AC95FE35E}";
    var titleFieldId = "{DCCEECE5-E6D3-4235-9290-DF075EBE24F3}";
    //
    // The class for connections and connectors.
    //
    this.connectionClass = 'connection';
    this.connectorClass = 'connector';
    this.nodeClass = 'node';

    $scope.nodeTopGap = 18;
    $scope.nodeSideGap = 24;
    $scope.svgLocation = 0;
    /*********************************
       CONSTRUCTOR FUNCTIONS
    **********************************/

    var parseLocation = function (location) {
        var pairs = location.substring(1).split("&");
        var obj = {};
        var pair;
        var i;

        for (i in pairs) {
            if (pairs[i] === "") continue;

            pair = pairs[i].split("=");
            obj[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
        }

        return obj;
    };

    var keysToLowerCase = function (obj) {
        if (!typeof (obj) === "object" || typeof (obj) === "string" || typeof (obj) === "number" || typeof (obj) === "boolean") {
            return obj;
        }
        var keys = Object.keys(obj);
        var n = keys.length;
        var lowKey;
        while (n--) {
            var key = keys[n];
            if (key === (lowKey = key.toLowerCase()))
                continue;
            obj[lowKey] = keysToLowerCase(obj[key]);
            delete obj[key];
        }
        return (obj);
    };

    function Init() {

        //'Lightbox opening' code - start 
        try {
            //lbId='50068fda-a072-4564-950a-c49a739104ac' // when lightbox and node are same 
            //linkObj={node:{id:'883c7629-5727-4f05-8820-9f9cc2a9b0aa', lb:{id:'50068fda-a072-4564-950a-c49a739104ac'}}} //when lightbox and node are different - future
            //linkObj={node:{id:'883c7629-5727-4f05-8820-9f9cc2a9b0aa', lb:{id:'50068fda-a072-4564-950a-c49a739104ac', lb:{id:'611790eb-a072-4564-950a-c49a739104ac'}}}} //when lightbox and node are different and back button is needed to take to a previous lightbox - future case

            var qryParams = parseLocation(window.location.search); //$location.search(); <-- bug in angular: https://github.com/angular/angular.js/issues/7239
            //per Marc B, want lbid to be case insensitive
            var qryParamsLowerCase = keysToLowerCase(qryParams);
            var nodeId, lightboxId;
            if (!!qryParamsLowerCase.lbid) {
                nodeId = qryParamsLowerCase.lbid;
                lightboxId = qryParamsLowerCase.lbid;
            } else if (!!qryParams.linkObj) { // Kalyan: Currently the else block is not used. Initial design was to have a json object to be sent for the linked lightbox thing
                var linkOb = JSON.parse(qryParams.linkObj);
                nodeId = linkOb.node.id;
                lightboxId = linkOb.node.lb.id;
            }

            var node;
            if (!!nodeId) {
                //Find node and set expand
                var multipleNodes = nodeId.split("|");
                node = $scope.chart.findNode(multipleNodes[0]);
                $scope.$parent.expandBranchChoicesForHiddenNode(node);
            }
            if (!!lightboxId) {
                //if (node.hasSections()) {
                //svg needs to be loaded before triggering the node click and scroll events.
                var promise = $interval(function () {
                    console.debug("svg not available -" + Date.now());
                    $scope.svgAvailable = !!jQuery('svg').length;
                    if ($scope.svgAvailable) {
                        console.debug("svg available - " + Date.now());
                        $interval.cancel(promise);
                        var multipleLbIds = lightboxId.split("|");
                        jQuery.event.trigger("node-with-lb-clicked", multipleLbIds[0]);
                        jQuery.event.trigger("scroll-to-node", node.id());
                        for (iter = 1; iter < multipleLbIds.length; iter++) {
                            $("a[node-lb-id='" + multipleLbIds[iter] + "']").triggerHandler("click");
                        }
                    }
                }, 500);

                if (!!node) {
                    node.toggleSelected();
                }
            }
        } catch (e) {
            //log the error in console and move forward. Any of the above code failing is not a big deal.
            console.error(JSON.stringify(e));
        }
        //'Lightbox opening' code - end 
    }


    /***************************************
       PROPERTIES
    ***************************************/
    var controller = this;

    //
    // Reference to the document and jQuery, can be overridden for testting.
    //
    this.document = document;

    //
    // Wrap jQuery so it can easily be  mocked for testing.
    //
    this.jQuery = function (element) {
        return $(element);
    }

    //
    // Init data-model variables.
    //
    $scope.draggingConnection = false;
    $scope.connectorSize = 10;
    $scope.dragSelecting = false;

    //
    // Reference to the connection, connector or node that the mouse is currently over.
    //
    $scope.mouseOverConnector = null;
    $scope.mouseOverConnection = null;
    $scope.mouseOverNode = null;

    /*****************************
        MEMBERS
    *****************************/
    //You can define methods on scope to 

    //
    // Translate the coordinates so they are relative to the svg element.
    //
    this.translateCoordinates = function (x, y) {
        var svg_elem = $("svg").get(0); //NOTE: since SVG is no the root node in the template, must find element directly $element.get(0);
        var matrix = svg_elem.getScreenCTM();
        var point = svg_elem.createSVGPoint();
        point.x = x;
        point.y = y;
        return point.matrixTransform(matrix.inverse());
    };

    //
    // Search up the HTML element tree for an element the requested class.
    //
    this.searchUp = function (element, parentClass) {

        //
        // Reached the root.
        //
        if (element == null || element.length == 0) {
            return null;
        }

        // 
        // Check if the element has the class that identifies it as a connector.
        //
        if (hasClassSVG(element, parentClass)) {
            //
            // Found the connector element.
            //
            return element;
        }

        //
        // Recursively search parent elements.
        //
        return this.searchUp(element.parent(), parentClass);
    };

    //
    // Hit test and retreive node and connector that was hit at the specified coordinates.
    //
    this.hitTest = function (clientX, clientY) {

        //
        // Retreive the element the mouse is currently over.
        //
        return this.document.elementFromPoint(clientX, clientY);
    };

    //
    // Hit test and retreive node and connector that was hit at the specified coordinates.
    //
    this.checkForHit = function (mouseOverElement, whichClass) {

        //
        // Find the parent element, if any, that is a connector.
        //
        var hoverElement = this.searchUp(this.jQuery(mouseOverElement), whichClass);
        if (!hoverElement) {
            return null;
        }

        return hoverElement.scope();
    };

    /*****************************
    EVENT HANDLERS
    *****************************/


    //
    // Called on mouse down in the chart.
    //
    $scope.mouseDown = function (evt) {

        $scope.chart.deselectAll();


    };

    //
    // Called for each mouse move on the svg element.
    //
    $scope.mouseMove = function (evt) {

        //
        // Clear out all cached mouse over elements.
        //
        $scope.mouseOverConnection = null;
        $scope.mouseOverConnector = null;
        $scope.mouseOverNode = null;

        var mouseOverElement = controller.hitTest(evt.clientX, evt.clientY);
        if (mouseOverElement == null) {
            // Mouse isn't over anything, just clear all.
            return;
        }


        // Figure out if the mouse is over a connector.
        var scope = controller.checkForHit(mouseOverElement, controller.connectorClass);
        $scope.mouseOverConnector = (scope && scope.connector) ? scope.connector : null;
        if ($scope.mouseOverConnector) {
            // Don't attempt to mouse over anything else.
            return;
        }

        // Figure out if the mouse is over a node.
        var scope = controller.checkForHit(mouseOverElement, controller.nodeClass);
        $scope.mouseOverNode = (scope && scope.node) ? scope.node : null;
    };

    $scope.itemResponseCache = {};

    //
    // Handle mousedown on a node.
    //
    $scope.nodeMouseDown = function (evt, node) {

        var chart = $scope.chart;
        var lastMouseCoords;


        //TODO: check user specified functionality
        if (node.hasSections()) {
            jQuery.event.trigger("node-with-lb-clicked", node.data.id);
            //lightbox.show(node.data.id);
        }


        if (node.nodeType() === cpmDiagram.NodeType.LinkToExtCpm) {
            //transfer to external functionality, check url to open in new window
            // TODO:make an ajax call to a webservice to get the url
            var key = node.data.extRef.cpmId + node.data.extRef.topicId;
            var url = settings.externalCpmLinks[key];
            if (!!url) {
                window.location.href = url;
            } else {
                alert("Invalid link - " + url + ".");
            }
        } else {
            //If any of connectors are collapsed, toggle expand on the connector.  This should also notify any brackets to collapse 
            //TODO: check wether parent is bracket; or rather a branch node type after code is integrated.
            for (var i = 0; i < node.inputConnectors.length; i++) {
                if (!node.inputConnectors[i].expanded()) {
                    node.inputConnectors[i].toggleExpanded();
                    $scope.$emit('cpmDiagram.expandCollapse', { activeNode: node, activeConnector: node.inputConnectors[i] });
                    return;
                }
            }

            node.toggleSelected(); //if there where items that needed to expand than this step does not get hit -- by design
        }

    };

    //
    // Handle mousedown on a connection.
    //
    $scope.connectionMouseDown = function (evt, connection) {
        var chart = $scope.chart;
        chart.handleConnectionMouseDown(connection, evt.ctrlKey);

        // Don't let the chart handle the mouse down.
        evt.stopPropagation();
        evt.preventDefault();
    };


    $scope.onRightClick = function (contextItemVM) {
        if ($scope.mouseOverConnector) {
            //if found, update parent with last active connector index
            $scope.mouseOverConnector.parentNode().setActiveConnectorIndex($scope.mouseOverConnector.index());
            $scope.chart.contextNode = contextItemVM;
        }


        if ($scope.mouseOverConnection) {
            //do nothing currently...
            $scope.chart.contextNode = contextItemVM;
        }

        if ($scope.mouseOverNode) {
            $scope.chart.contextNode = contextItemVM;
        }
        //context.setActiveNode(contextNodeVM);
        //console.log("clicked connector on node: " + contextNodeVM.id());
    }


    $scope.nodeMouseOver = function (node) {
        node.setHover(node.hasSections() || node.hasCollapsedConnectors() || node.nodeType() === 3);
        $scope.mouseOverNode = node;
    }

    $scope.nodeMouseOut = function (node) {
        node.setHover(false);
        $scope.mouseOverNode = null;
    }

    //
    // Handle mousedown on an input connector.
    //
    $scope.connectorMouseDown = function (evt, node, connector, connectorIndex, isInputConnector) {


    };

    var winJq = jQuery(window);
    $scope.svgLocation = function () {
        var coordinates = controller.translateCoordinates(0, 0);
        return {
            top: (coordinates.y * -1 + winJq.scrollTop()),
            left: (coordinates.x * -1 + winJq.scrollLeft())
        }
    }

    ///
    /// Call Constructor
    ///
    Init();


};
