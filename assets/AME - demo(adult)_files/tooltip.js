$(function () {
    var $targets = $('abbr[title][title!=""],[data-tooltip][data-tooltip!=""]');
    var $target = false;
    var tooltip = false;
    var title = false;
    var tip = '';

    $targets.bind('click', function (e) {
        var isAbbrTag = function () {
            return ($target.attr('data-tooltip') === undefined);
        }

        var remove_tooltip = function () {
            $tooltip.animate(
				{ opacity: 0 },
				50,
				function () {
				    $(this).remove();
				}
			);

            if ($target !== false) {
                if (isAbbrTag()) {
                    $target.attr('title', tip);
                }
                $(document).unbind('click touchstart', remove_tooltip);
                $target = false;
            }
            return false;
        };

        var init_tooltip = function () {
            if ($(window).width() < $tooltip.outerWidth() * 1.5) {
                $tooltip.css('max-width', $(window).width() / 2);
            } else {
                $tooltip.css('max-width', 340);
            }

            var pos_left = $target.offset().left +
				($target.outerWidth() / 2) - ($tooltip.outerWidth() / 2);

            var pos_top = $target.offset().top - $tooltip.outerHeight() - 20;

            if (pos_left < 0) {
                pos_left = $target.offset().left + $target.outerWidth() / 2 - 20;
                $tooltip.addClass('left');
            } else {
                $tooltip.removeClass('left');
            }

            if (pos_left + $tooltip.outerWidth() > $(window).width()) {
                pos_left = $target.offset().left - $tooltip.outerWidth() +
					$target.outerWidth() / 2 + 20;

                $tooltip.addClass('right');
            } else {
                $tooltip.removeClass('right');
            }

            if (pos_top < 0) {
                var pos_top = $target.offset().top + $target.outerHeight();
                $tooltip.addClass('top');
            } else {
                $tooltip.removeClass('top');
            }

            $tooltip.css({ left: pos_left, top: pos_top + 10 });
            $tooltip.animate({ opacity: 1 }, 50);

        };

        // if there's an open tooltip, close it
        if ($target !== false) {
            if ($target[0] == $(this)[0]) {
                // if it's the same tooltip as this one, don't show it again
                remove_tooltip();
                return;
            } else {
                remove_tooltip();
            }
        }

        $target = $(this);

        // don't do anything if in an <a> tag
        if ($target.parents('a').length > 0) {
            return;
        }

        e.stopPropagation();

        $tooltip = $('<div id="abbr_tooltip"></div>');

        if (isAbbrTag()) {
            tip = $target.attr('title');
            $target.attr('title', '');
        } else {
            tip = $target.attr('data-tooltip');
        }
        $tooltip.css('opacity', 0).html(tip).appendTo('body');


        init_tooltip();

        // use wait to rate-limit resize events to every 200ms
        var wait = 0;
        $(window).resize(
			function () {
			    if (wait > 0) {
			        clearTimeout(wait);
			    }
			    wait = setTimeout(init_tooltip, 200);
			}
		);

        $tooltip.bind('click', remove_tooltip);
        $(document).bind('click touchstart', remove_tooltip);
        return false;
    });

});
