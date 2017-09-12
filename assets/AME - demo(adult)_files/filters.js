angular.module('cpmAppCommon').filter('nodeFilter', function () {
    return function (items, nType) {
        var filtered = [];


        if (nType === undefined || nType === '') {
            return items;
        }

        //This is case where we want everything BUT to specified node type


        if (nType < 0) {
            angular.forEach(items, function (item) {
                if (Math.abs(nType) != item.nodeType()) {
                    filtered.push(item);
                }
            });
        } else {
            angular.forEach(items, function (item) {
                if (nType === item.nodeType() || item.nType === '') {
                    filtered.push(item);
                }
            });
        }


        return filtered;
    };
})
.filter('nodeExcludeFilter', function () {
    return function (items, excludeTypes) {
        var filtered = [];


        if (excludeTypes === undefined || excludeTypes === '') {
            return items;
        }

        //This is case where we want everything BUT to specified node type
        angular.forEach(items, function (item) {
            if (!excludeTypes[item.nodeType()]) {
                filtered.push(item);
            }
        });

        return filtered;
    };
})
.filter('connectionExcludeFilter', function () {
    return function (items, excludeTypes) {
        var filtered = [];


        if (excludeTypes === undefined || excludeTypes === '') {
            return items;
        }

        angular.forEach(items, function (item) {
            if (!excludeTypes[item.getConnectionTypeStr()]) {
                filtered.push(item);
            }
        });

        return filtered;
    };
});