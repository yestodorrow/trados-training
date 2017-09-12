$(document).ready(function () {
    if (typeof KmAuditManager !== "undefined") {
        KmAuditManager.Init();
    }

    isMobile();

    if (!$("body").hasClass("mobile")) {
        favHover();
    }

    // KM Content Toggle
    $('.km-toggle').on('click', function () {
        $(this).next('div').toggle();
        $(this).toggleClass('open');
        return false;
    });

    // Filter functionality **Don't add return false will mess upcode in production
    $('.languages a').on('click', function () {
        $(this).next('ol').toggle();
        $(this).toggleClass('lang-close');
    });

    $('.languages ol li a').on('click', function () {
        var lang = $(this).text();
        $(".languages a:first").html(lang);
        $(this).parent("li").parent("ol").toggle();
        $('.lang-close').toggleClass('lang-close');
    });

    $('.mobile-filter-btn').on('click', function () {
        $('.km-filter').show();
        $('body').append('<div class="mobile-background"></div>');
        return false;
    });

    $('.lang-close').on('click', function () {
        $(this).parent().children('ol').hide();
        $('.lang-close').hide();
        return false;
    });

    $('.filter-close').on('click', function () {
        $('.km-filter').hide();
        $('body div.mobile-background').remove();
        return false;
    });

    //toggle spe most relevent on spe homepage
    $('.spe-list-toggle').on('click', function () {
        $(this).next('div').toggle();
        $(this).toggleClass('open');
        return false;
    });

    // FAVORITE TOGGLE
    $('.doc-fav a').on('click', function () {
        $(this).parent().toggleClass('fav-current');
        if ($(this).parent().hasClass("fav-current")) {
            if (typeof AddFavoriteItem == 'function') {
                AddFavoriteItem(this, 'spe');
            }
            if ($(this).hasClass("cpm-fav")) {
            }
            else {
                $('.doc-fav span').text("Favorite");
            }
        }
        else {
            if (typeof RemoveFavoriteItem == 'function') {
                RemoveFavoriteItem(this, 'spe');
            }
            if ($(this).hasClass("cpm-fav")) {
            }
            else {
                $('.doc-fav span').text("Add to Favorites");
            }
        }
        if (!$("body").hasClass("mobile")) {
            favHover();
        }
        return false;
    });

    $('.spe-favorite-remove a').on('click', function () {
        //TODO: add if statement around logic for confirmation popup.
        if (typeof RemoveFavoriteItem == 'function') {
            RemoveFavoriteItem($(this));
        }

        var parentLi = $(this).parent().parent();
        var parentOl = $(this).parent().parent().parent();

        var length = $(parentOl).find("> li").length;

        if (length === 1) {
            $(parentOl).prev().remove();
            $(parentOl).remove();
        } else {
            $(parentLi).remove();
        }

        return false;
    });

    $(".lbox-close").click(function () {
        $.fancybox.close();
        return false;
    });

    function isIE() {
        return document.body.style.msTouchAction !== undefined
            || window.navigator.msPointerEnabled != undefined;
    }
});

$(document).on('click touchstart', function (event) {
    if (!$(event.target).closest('.languages').length) {
        $(".languages").children('ol').hide();
        $('.lang-close').show().removeClass();

    }
});

$(document).on('click touchstart', function (event) {
    if (!$("body").hasClass("small")) {
        if (!$(event.target).closest('a.favorites').length && !$(event.target).closest($("a.favorites").next('div')).length) {
            $("a.favorites").next('div').hide();
            $('a.favorites').removeClass('open');
        }
    }
});




function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

// resets for filters couldn't include in desktop.js because this functionality is also in km
function filterLoad() {
    // resets for all filter options
    $('.filter').children('h4').children('a').off();
    $('body div.mobile-background').remove();
    $('.filter.languages').children('ol').hide();
    $('.filter.languages').children('.lang-close').hide();
    $('.km-filter').show();
    resetFilterOptions();

    if ($('body').hasClass("small")) {
        $('.km-filter').hide();

        $(".filter").each(function (i) {
            if ($(this).hasClass("languages") || $(this).hasClass("filter-results")) {
                // Do nothing
            }
            else {
                $(this).find('h4').wrapInner('<a></a>');
                $(this).children('ol').hide();
            }
        });

        $('.filter').children('h4').children('a').on('click', function () {
            $(this).parent().next('ol').toggle();
            $(this).toggleClass('open');
            return false;
        });
    }
    else {
        $(".filter").each(function (i) {
            if ($(this).hasClass("languages") || $(this).hasClass("filter-results")) {
                // Do nothing
            }
            else {
                var header = $(this).children('h4').children('a').html();
                $(this).children('h4').children('a').remove();
                $(this).children('h4').html(header);
                $(this).children('ol').show();
            }
        });
        collapseFilterOptions();
    }

}

function collapseFilterOptions() {
    $('.filter').each(function () {
        if ($(this).hasClass("languages") || $(this).hasClass("filter-results")) {
            // Do nothing
        }
        else {
            var max = 5
            if ($(this).find("li").length > max) {
                $(this).append('<span class="expand"><a href="#">See More</a></span>');
                $(this).children('ol').css("margin-bottom", "0");
                $(this).find("li:gt(4)").hide();
                $(this).find("li").each(function () {
                    if ($(this).hasClass("selected") && $(this).index() > 4) {
                        $(this).parent().parent().find("span a").html("See Less").parent().removeClass("expand").addClass("collapse less");
                        $(this).parent('ol').find("li:gt(4)").show().css("margin-bottom", "0");
                        return false;
                    }
                    else {

                    }
                });



                $(this).find("span a").click(function () {
                    if ($(this).parent().hasClass("expand")) {
                        $(this).parent().parent().find("li:gt(4)").show();
                        $(this).html("See Less").parent().removeClass("expand").addClass("collapse less");
                        return false;
                    }
                    else {
                        $(this).parent().parent().find("li:gt(4)").hide();
                        $(this).html("See More").parent().removeClass("collapse less").addClass("expand");
                        return false;
                    }
                });
            }
        }
    });
}

function resetFilterOptions() {
    $('.filter').each(function () {
        $(this).children('span').remove();
        $(this).children('ol').children('li').show();
    });
}

function isMobile() {
    try { document.createEvent("TouchEvent"); $('body').addClass('mobile'); mobile = true; }
    catch (e) { mobile = false; }
}



function favHover() {
    $('.doc-fav').find("span").attr("data", 'Add to Favorites list').addClass("fav-tip").addClass("hover").removeClass("fav-tip-2");
    if ($('.doc-fav.fav-current')) {
        $('.doc-fav.fav-current').find("span").attr("data", 'Remove from Favorites list').addClass("fav-tip-2").removeClass("fav-tip");
    }
}

function fancyLoad() {
    //Initiate fancybox
    if ($("body").hasClass("small")) {
        $(".fancy-link, .lbox-link").fancybox({
            padding: [12, 12, 12, 12],
            margin: [0, 0, 0, 0],
            autoSize: false,
            fitToView: false,
            height: 'auto',
            width: '90%',
            maxWidth: 844,
            scrolling: 'no',
            closeBtn: false,
            wrapCSS: 'fbox'
        });
    }
    else {
        $(".fancy-link, .lbox-link").fancybox({
            padding: [48, 60, 48, 60],
            margin: [24, 48, 24, 48],
            autoSize: false,
            fitToView: false,
            height: 'auto',
            width: '80%',
            maxWidth: 844,
            scrolling: 'no',
            closeBtn: false,
            wrapCSS: 'fbox',
            afterShow: function () {
                if (isIE()) {
                    var activeBox = $('.fancybox-skin .lbox-pdf-container');
                    activeBox.load(document.URL + ' #' + activeBox.attr('id'));
                }
            }
        });
    }
}