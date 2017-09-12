angular.module('cpmDiagramReadOnly')
//
// Directive that generates the rendered chart from the data model.
//
    .directive('cpmDiagramReadOnly', function() {
        return {
            restrict: 'E',
            templateUrl: "cpmViewTemplate.html", /*READ ONLY VIEW*/
            replace: true,
            scope: {
                chart: "=chart",
            },

            //
            // Controller for the cpmAuthView directive.
            // Having a separate controller is better for unit testing, otherwise
            // it is painful to unit test a directive without instantiating the DOM 
            // (which is possible, just not ideal).
            //
            controller: 'cpmDiagramReadOnlyController'
        };
    });