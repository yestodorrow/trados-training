var ame = !ame?{}:ame;
ame.lightbox = {};
ame.lightbox.activeLightboxClone = null;
ame.lightbox.previousTop = 0;
ame.lightbox.previousLeft = 0;
ame.lightbox.closeEvent = function (evt) {
        var p = $(evt.target).parent();
        var id = p.attr('id');
        var patt = /lightbox\-content_(.*)/;
        var nodeId = patt.exec(id)[1];
        ame.lightbox.hide(nodeId);
        ame.feedback.hide(id);
        activeNodeId = null;
        lightBoxTrail = [];
        ame.feedback.linkedlbIDs = "";

        jQuery("#lightbox-arrow_" + id).delay(1).animate({
            scrollTop: parseInt(jQuery("#lightbox-arrow_" + id).css('top')),
            scrollLeft: parseInt(jQuery("#lightbox-arrow_" + id).css('left'))
        });
}

ame.lightbox.show = function (id) {
    jQuery("#lightbox-dismiss-area_" + id).removeClass('hidden');
    jQuery("#lightbox-dismiss-area_" + id).height(jQuery(document).height());
    if (!$("body").hasClass("small") && !$("body").hasClass("medium")) {
        jQuery("#lightbox-arrow_" + id).removeClass('hidden');
    }

    jQuery("#lightbox-content_" + id).removeClass('hidden');
    jQuery.event.trigger("lightbox-shown", id);

    if ($("body").hasClass("small") || $("body").hasClass("medium")) {
        ame.lightbox.previousTop = jQuery("#lightbox-content_" + id).css('top');
        ame.lightbox.previousLeft = jQuery("#lightbox-content_" + id).css('left');

        window.scrollTo(0, 0);

        ame.lightbox.activeLightboxClone = jQuery("#lightbox-content_" + id).clone(true,true);
        ame.lightbox.activeLightboxClone.attr("id", "clone_lightbox-content_" + id);
        jQuery("#clone_lightbox-content_" + id).css('top', '0px').css('left', '0px');

        jQuery("body").append(ame.lightbox.activeLightboxClone);
        km.slideshow.initCloneSlideshow(ame.lightbox.activeLightboxClone.find('.owl-carousel'));
        jQuery("#lightbox-content_" + id).addClass('hidden');
        $(".topic").unstick();
        $(".cpm-search-wrapper").unstick();

    }

}

ame.lightbox.hide = function(id) {
    jQuery("#lightbox-dismiss-area_" + id).addClass('hidden');
    jQuery("#lightbox-arrow_" + id).addClass('hidden');
    ame.feedback.hide();
    jQuery.event.trigger("lightbox-hidden", id);
    if ($("body").hasClass("small") || $("body").hasClass("medium")) {
        ame.lightbox.activeLightboxClone.remove();

        jQuery("#cmp-body").delay(1).animate({
            scrollTop: parseInt(jQuery("#lightbox-arrow_" + id).css('top')),
            scrollLeft: parseInt(jQuery("#lightbox-arrow_" + id).css('left'))
        });
        navStick();
    }
    jQuery("#lightbox-content_" + id).addClass('hidden');
    km.slideshow.cleanupCloneSlideshow();
}

