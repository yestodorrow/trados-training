var km = !km ? {} : km;
km.slideshow = {};
km.slideshow.activeSlideshow;
km.slideshow.interval;
km.slideshow.cleanupCloneSlideshow = function () {
    if (km.slideshow.interval) {
        clearInterval(km.slideshow.interval);
    }
}
km.slideshow.initCloneSlideshow = function (jQueryOwlObjects) {
    var owlObj = jQueryOwlObjects;
    owlObj.removeClass('owl-hidden owl-loaded');
    //owlObj.find('.owl-stage-outer').children().unwrap();
    if (owlObj) {

        // Listen to owl events:
        owlObj.on('initialized.owl.carousel resized.owl.carousel refreshed.owl.carousel', function (event) {
            var carousel = this;
            var top_pos = $(carousel).find('.owl-item.active img').on('load', function () {
                var top_pos = $(this).height();
                $(carousel).find('.owl-controls').css('top', top_pos + 'px');
            });

            var top_pos = $(carousel).find('.owl-item.active img').height();
            if (top_pos > 0) {
                $(carousel).find('.owl-controls').css('top', top_pos + 'px');
            }
        });

        owlObj.on('changed.owl.carousel', function (event) {
            var items = event.item.count;
            var page = event.page.index;
            var item = event.item.index;
            var namespace = event.namespace;
            $(this).find('.owl-controls div div span').text(item + 1);
            var currentSlide = item + 1;
            // Disable first and last buttons
            if (currentSlide == 1) {
                $(this).find('.owl-prev').addClass("disable-button");
                $(this).find('.owl-next').removeClass("disable-button");
            } else if (currentSlide == items) {
                $(this).find('.owl-prev').removeClass("disable-button");
                $(this).find('.owl-next').addClass("disable-button");
            } else {
                $(this).find('.owl-prev').removeClass("disable-button");
                $(this).find('.owl-next').removeClass("disable-button");
            }
        });

        // init the carousel
        owlObj.owlCarousel({
            items: 1,
            lazyLoad: true,
            loop: false,
            nav: true,
            dots: false,
            autoHeight: false
        });

        owlObj.each(function () {
            var rowCount = $(this).find('.owl-item').length;
            $('<div class="counter">' + '<span>1</span> of ' + rowCount + '</span>').prependTo($(this).find('.owl-nav'))
            $(this).find('.owl-prev').addClass('disable-button');
        });
        km.slideshow.activeSlideshow = owlObj;

        //owl.show();
        /*
         Hack to handle hiding/showing the carousel. If the carousel is hidden
         when first rendered, its width will be incorrect. Here we check its
         width every 500ms and if it's not correct, the width of the carousel
         is reset.
    
         See: https://github.com/smashingboxes/OwlCarousel2/issues/207#issuecomment-47560042
    
         This should fix should be unnecessary once the 2.0.0-beta.3 release comes
         out.
        */
        km.slideshow.interval = setInterval(
            function () {
                var carousel = $(km.slideshow.activeSlideshow).data('owlCarousel');
                if (carousel) {
                    if (carousel._width != $(km.slideshow.activeSlideshow).width()) {
                        carousel._width = $(km.slideshow.activeSlideshow).width();
                        carousel.invalidate('width');
                        carousel.refresh();
                    }
                }
            },
            500
        );
    }



}

$(document).ready(function () {
    var owl = $('.owl-carousel');

    // init the carousel
    $('.owl-carousel').owlCarousel({
        items: 1,
        lazyLoad: true,
        loop: false,
        nav: true,
        dots: false,
        autoHeight: true
    });

    // Listen to owl events:
    owl.on('initialized.owl.carousel resized.owl.carousel refreshed.owl.carousel translated.owl.carousel loaded.owl.lazy', function (event) {
        var carousel = this;
        var top_pos = $(carousel).find('.owl-item.active img').on('load', function () {
            var top_pos = $(this).height();
            $(carousel).find('.owl-controls').css('top', top_pos + 'px');
        });

        var top_pos = $(carousel).find('.owl-item.active img').height();
        if (top_pos > 0) {
            $(carousel).find('.owl-controls').css('top', top_pos + 'px');
        }
    });

    owl.on('loaded.owl.lazy', function (event) {
        var carousel = this;
        var owl_height = $(carousel).find('.owl-item.active').height();
        $('.owl-height').css('height', owl_height + 'px');
    });

    owl.on('changed.owl.carousel', function (event) {
        var items = event.item.count;
        var page = event.page.index;
        var item = event.item.index;
        var namespace = event.namespace;
        $(this).find('.owl-controls div div span').text(item + 1);
        var currentSlide = item + 1;
        // Disable first and last buttons
        if (currentSlide == 1) {
            $(this).find('.owl-prev').addClass("disable-button");
            $(this).find('.owl-next').removeClass("disable-button");
        } else if (currentSlide == items) {
            $(this).find('.owl-prev').removeClass("disable-button");
            $(this).find('.owl-next').addClass("disable-button");
        } else {
            $(this).find('.owl-prev').removeClass("disable-button");
            $(this).find('.owl-next').removeClass("disable-button");
        }
    });

    $('.owl-carousel').each(function () {
        var rowCount = $(this).find('.owl-item').length;
        $('<div class="counter">' + '<span>1</span> of ' + rowCount + '</span>').prependTo($(this).find('.owl-nav'))
        $(this).find('.owl-prev').addClass('disable-button');
    });

    /*
     Hack to handle hiding/showing the carousel. If the carousel is hidden
     when first rendered, its width will be incorrect. Here we check its
     width every 500ms and if it's not correct, the width of the carousel
     is reset.

     See: https://github.com/smashingboxes/OwlCarousel2/issues/207#issuecomment-47560042

     This should fix should be unnecessary once the 2.0.0-beta.3 release comes
     out.
    */
    setInterval(
        function () {
            $('.owl-carousel').each(function () {
                var carousel = $(this).data('owlCarousel');
                if (carousel._width != $(this).width()) {
                    carousel._width = $(this).width();
                    carousel.invalidate('width');
                    carousel.refresh();
                }
            })
        },
        500
    );
});
