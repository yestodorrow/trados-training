angular.module('cpmApplication').service('lightbox', function() {
    return {
        show: function(id) {
            ame.lightbox.show(id);
        },
        hide: function(id) {
            ame.lightbox.hide(id);
        }
    };
});