var windowSize = '';
var windowWidth = 0;
var actualSize = 0;
var $nav;
var mobile = false;

$(document).ready(function () {

    isMobile();

    //test for link in cpm can be removed when testing is done
    $("a.test-link").each(function () {
        $(this).click(function () {
            if ($("body").hasClass("small") || $("body").hasClass("medium")) {
                $('body').append('<div class="mobile-background"></div>');
            }
            $(this.hash).toggle();
            scrollableTables();
            return false;
        });
    });


    // simulate placeholder text for home page search    
    $('#homeSearch').on('input propertychange', function () {
        if ($(this).val() != "") {
            $(this).siblings('label[for="homeSearch"]').hide();
        }
        else {
            $(this).siblings('label[for="homeSearch"]').show();
        }
    });

    //search button actions.
    $(".ame-search-button").click(function (e) {
        AmeSearchBox.DoSearch();
        e.preventDefault();
        return false;
    });

    $(".search-results").keyup(function (event) {
        if (event.keyCode === 13) {
            AmeSearchBox.DoSearch();
            event.preventDefault();
            return false;
        }
    });

    $(".expert-individual-container > a.close").click(function () {
        $(".expert-individual-container").toggle();
        $('body div.mobile-background').remove();
        return false;
    });

    //EXPERT FILTERS
    $(".expert-filters > li > a").click(function () {
        $(this).parent().siblings("li").children("a").removeClass("open").siblings("ul").hide();
        $(this).toggleClass('open').next('ul').toggle();
        return false;
    });

    // CLOSE EXPERTS FILTERS ON CLICK OFF 
    $(document).on('click touchstart', function (event) {
        if (!$(event.target).closest('.expert-filters > li > a').length) {
            $(".expert-filters > li").each(function () {
                $(this).children("a").removeClass("open").siblings("ul").hide();
            });
        }
    })

    //OTHER AREAS OF EXPERTISE 

    $(".other-areas-of-expertise a").click(function () {
        $(this).toggleClass("open").next("ul").toggle();
        if ($(".expertWrapper").is(":visible")) {
            var divHeight = $('.expertIndividual').height();
            $(".expertWrapper").height(divHeight);
        }
        return false;
    });

    // EXPERT PAGER CLICK EVENTS
    $(".expert-pager").find('a').click(function () {
        $(".expert-individual-pager-container").toggle();
        $(".expert-individual-pager-container-2").toggle();
        return false;
    });

    $(".new-text-page").click(function () {
        $(".expert-individual-pager-container-3").toggle();
        $(".expert-individual-pager-container-2").toggle();
        $(".expert-pager-send-button").attr("disabled", "disabled");
        $(".pager-text").val("");
        return false;
    });

    $(".expert-pager-send-button").click(function () {
        var pageText = $(".pager-text").val();
        $(".expert-page-sent").children('.text-page').html('Message: ' + pageText);
        $(".expert-individual-pager-container-2").toggle();
        $(".expert-individual-pager-container-3").toggle();
        $(".pager-text").val("");
        $(".expert-pager-send-button").addClass("disabled");
        return false;
    });

    //disable expert-pager-send-button on page load
    $(".expert-pager-send-button").attr("disabled", "disabled");
    $(".pager-text").on('input propertychange', function () {
        //if pager-text is not empty, remove disabled attribute
        if ($(this).val() != '') {
            $(".expert-pager-send-button").removeAttr("disabled");
            $(".expert-pager-send-button").removeClass("disabled");
        }
        else {
            //add disabled attribute
            $(".expert-pager-send-button").attr("disabled", "disabled");
            $(".expert-pager-send-button").addClass("disabled");
        }
    });

    //EXPERT SEARCH RESULT TOGGLE
    $('.expert-search-result-toggle').on('click', function () {
        $(this).next('div').toggle();
        $(this).toggleClass('open');
        return false;
    });

    // Search Result Preview
    $(".search-result-preview").click(function () {
        $("li.search-result").each(function (i) {
            if ($(this).hasClass("preview-selected")) {
                $(this).removeClass("preview-selected");
            }
            $(this).children(".navigation-preview").attr("class", "navigation-preview").hide();
        })
        $(this).parent().next("div").toggle();
        $(this).parent().parent().toggleClass("preview-selected");
        return false;
    });

    // Click event for mobile topic nav dropdown
    $(".mobile-topic-nav").click(function () {
        if ($("#topic-left-nav").length) {
            $('#topic-left-nav').toggle();
        }
        else {
            $('#cpm-left-nav').toggle();
        }
        $(this).toggleClass('open');
        return false;
    });

    // Clinical trials tab for dropdowns
    $('#ct-tabs li').click(function () {
        var position = $(this).index();
        if ($(this).hasClass("open")) {
            $(this).removeClass("open");
            $('#ct-tab').hide().children('li').eq(position).hide();
        }
        else {
            $("#ct-tabs li").each(function (i) {
                $(this).removeClass("open");
            });
            $("#ct-tab").each(function (i) {
                $(this).hide().children("li").hide();
            });
            $(this).addClass("open");
            $('#ct-tab').show().children('li').eq(position).show();
        }

    });

    // Light Box Back Link code - End

    $('#back-to-top').click(function () { window.scrollTo(0, 0); });

    // AME FAVORITES IN HEADER
    if ($("#user-menu-favorites").length) {
        if (typeof AmeFavoritesHeader == 'function') {
            AmeFavoritesHeader();
        }
    }
    //FAVORITES TOGGLE
    $(".content-fav").click(function () {

        if ($(this).hasClass("content-fav-current")) {
            //remove 
            if (typeof RemoveFavoriteItem == 'function') {
                RemoveFavoriteItem($(this).children().first(), 'ame');
            }
        } else {
            //add
            if (typeof AddFavoriteItem == 'function') {
                AddFavoriteItem($(this).children().first(), 'ame');
            }
        }

        $(this).toggleClass("content-fav-current");

        if (typeof amefavHover == 'function') {
            if (!$("body").hasClass("mobile")) {
                amefavHover();
            }
        }

        return false;

    });

    $(".ame-favorite-remove-link").click(function () {
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

    // Expandable Sections & Teaching Points
    var i = 0;
    ($('div.ame-km-expandable')).each(function (i) {
        var objId = "link-" + ++i;
        var h3Text = $(this).children('h3').html();
        if ($(this).children().hasClass("poc-id")) {
            var pocID = $(this).children(".poc-id").first().html();
            $(this).children(".poc-id").remove();
            h3Text = h3Text + '<span class="poc-id">' + pocID + '</span>';
        }
        if ($(this).hasClass('ame-km-teaching-point')) {
            var h3Text = '<span class="tp">teaching point</span>' + h3Text;
        }
        var h3SpanText = '<span class="closed">' + h3Text + '</span>';
        $(this).children('div').first().attr("id", objId).hide();
        $(this).children('h3').empty().append(h3SpanText).wrap('<a class="toggle-it expandable" href=' + '#' + objId + '></a>');
    });

    $("a.toggle-it").each(function () {
        $(this).click(function () {
            $(this).parent().find(this.hash).toggle();
            $(this).find('h3 span').first().toggleClass('closed open');
            return false;
        });
    });

    /**
    * Light Box Back link code - Start
    */
    // remove any back-links
    $('a.lbox-link:not(.lbox-container a.lbox-link)').click(function () {
        $('.back-link', $(this).attr('href')).remove();
    });

    var n$ = $('.lbox-container');
    n$.each(
    function (ind, el) {
        $('a.lbox-link', $(el)).click(function (e) {
            //var link$ = $('<a class="lbox-link back-link" href="#'+$(el).attr("id")+'">Back</a>');
            var l = document.createElement('a');
            l.appendChild(document.createTextNode('Back'));
            var link$ = $(l);
            link$.addClass('lbox-link');
            link$.addClass('lbox-back');
            link$.attr('href', '#' + $(el).attr('id'));
            //remove any existing back links
            var lb = $($(this).attr('href'));
            $('.lbox-back', lb).remove();
            lb.prepend(link$);
        })
    });

    // Light Box Back Link code - End      

    // determine screen size for search results
    checkBrowserSize();
    setInterval('checkBrowserSize()', 1000);

    //Centering cpm svg for mobile and ipad
    function scrollSvgToCenterAlongX() {
        var screenWidth = $("#cpm-body").width();
        var cpmPosition = (480 - (screenWidth / 2));
        if ($("#cpm-table-body").is(":visible")) {
            cpmPosition = 0;
        }
        $("#cpm-body").delay(0).animate({ scrollLeft: cpmPosition });
    }

    var poll = setInterval(function () { pollForSvgPresense(); }, 1000);

    var tries = 0;

    function pollForSvgPresense() {
        if ($("#cpm-body").length > 0) {
            scrollSvgToCenterAlongX();
            clearInterval(poll);
        } else {
            //after 60 seconds still not able to find svg in dom, give up. 
            if (tries > 60) {
                clearInterval(poll);
                tries = undefined;
            }
            tries++;
        }
    }


});

function menuDropdowns() {

    //user menu dropdown for responsive header
    if ($('body').hasClass("small")) {
        $('a.mobile-search').off();

        //mobile search dropdown for responsive header
        $('a.mobile-search').on('click', function () {
            $(this).parent().toggleClass('open');
            $('#ameUserFavorites').toggle();
            $('.mobile-search-header').toggle();
            $('h1.mobile-header').toggle().text('Search').removeClass('favorites').addClass('search');
            $('a.home').toggle();
            return false;
        });
    }
    else {
        $('a.toggleMenu').off();

        $('a.toggleMenu').on('click', function () {
            $(this).next('ul').toggle();
            $(this).toggleClass('open');
            $('a.toggleFavorites').removeClass('open');
            $('#user-menu-favorites').hide();
            return false;
        });

        $(document).on('click touchstart', function (event) {
            if (!$(event.target).closest('#user-menu-options').length && !$(event.target).closest('.toggleMenu').length) {
                if ($('.toggleMenu').hasClass('open')) {
                    $("#user-menu-options").hide();
                    $('a.toggleMenu').removeClass('open');
                }
            }
        });
    }
    $('a.toggleFavorites').off();

    $('a.toggleFavorites').on('click', function () {
        $(this).next('div').toggle();
        $(this).toggleClass('open');
        $('a.toggleMenu').removeClass('open');
        $('#user-menu-options').hide();
        if ($('body').hasClass("small")) {
            $('a.mobile-search').toggle();
            $('.mobile-favorites-header').toggle();
            $('h1.mobile-header').toggle().text('Favorites').removeClass('search').addClass('favorites');
            $('a.home').toggle();
            if ($("div.mobile-background").is(":visible")) {
                $('body div.mobile-background').remove();
            }
            else {
                $('body').append('<div class="mobile-background"></div>');
            }
        }
        return false;
    });

    // CLOSE Favorites CPM NAV ON CLICK OFF 


    $(document).on('click touchstart', function (event) {
        if (!$(event.target).closest('#user-menu-favorites').length && !$(event.target).closest('.toggleFavorites').length) {
            if ($('.toggleFavorites').hasClass('open')) {
                $("#user-menu-favorites").hide();
                $('a.toggleFavorites').removeClass('open');
            }
        }

        if ($('.cpm-navigation').hasClass("open") && !$('body').hasClass("small")) {
            if (!$(event.target).closest('#cpm-left-nav').length) {
                hideNavigation();
            }
        }
    });
}

//display cpm navigation on hover

function navHover() {
    var windowHeight = $(window).height() - 100;
    $(".cpm-navigation")
        .mouseenter(function () {
            if ($('body').hasClass('small')) {
                $(this).addClass("open");
                $(this).parent().children("ul, h2, h3").show();
            }
            else {
                $(this).parent("#cpm-left-nav").css("background-color", "#ffffff").css("border", "1px solid #c3c5c5").css("box-shadow", "0px 0px 6px #c2c2c2").children("ul, h2, h3").show();
                $(this).css("border-right", "none").addClass("open");
                var menuHeight = $($nav).outerHeight();
                if (menuHeight > windowHeight) {
                    if ($("#undefined-sticky-wrapper").hasClass("hey")) {
                        $("#cpm-left-nav").css('max-height', (windowHeight + 63));
                    }
                    else {
                        $("#cpm-left-nav").css('max-height', (windowHeight - 54));
                    }
                }
            }
        });
    $("#cpm-left-nav")
            .mouseleave(function () {
                hideNavigation();
            });
}

function navClick() {
    $('.cpm-navigation').on('click', function (event) {

        //reset everthing
        if ($(this).hasClass("open")) {
            hideNavigation();
        }
        else {
            if ($('body').hasClass('small')) {
                $(this).addClass("open");
                $(this).parent().children("ul, h2, h3").show();
            }
            else {
                $(this).parent("#cpm-left-nav").css("background-color", "#ffffff").css("border", "1px solid #c3c5c5").css("box-shadow", "0px 0px 6px #c2c2c2").children("ul, h2, h3").show();
                $(this).css("border-right", "none").addClass("open");
                var menuHeight = $($nav).outerHeight();
                var windowHeight = $(window).height() - 100;
                if (menuHeight > windowHeight) {
                    if ($("#undefined-sticky-wrapper").hasClass("hey")) {
                        $("#cpm-left-nav").css('max-height', (windowHeight + 63));
                    }
                    else {
                        $("#cpm-left-nav").css('max-height', (windowHeight - 10));
                    }
                }
            }
        }
    });
}


$(window).on('orientationchange', function (event) {
    windowHeight = $(window).height() - 100;
    if ($('body').hasClass('small')) { hideNavigation(); }
});

function hideNavigation() {
    $("#cpm-left-nav").css("border", "none").css("box-shadow", "none").css("background-color", "transparent").children("ul, h2, h3").hide();
    $(".cpm-navigation").removeClass("open");
    if ($("body").hasClass("small")) {
        //don't add border back on       
    }
    else {
        $(".cpm-navigation").css("border-right", "1px solid #c5c5c5");
    }
}

// Check the current size of the browser
function checkBrowserSize() {
    windowWidth = window.innerWidth;
    var contentWidth = $("body").width();
    var sizeDiff = windowWidth - contentWidth;
    actualWindowSize = windowWidth - sizeDiff;

    //alert(actualWindowSize);

    // widths need to match the media queries in CSS
    if (actualWindowSize >= 1254) { newWindowSize = 'x-large'; }
    if (actualWindowSize <= 1253 && actualWindowSize > 976) { newWindowSize = 'large'; }
    if (actualWindowSize <= 975 && actualWindowSize > 753) { newWindowSize = 'medium'; }
    if (actualWindowSize <= 752) { newWindowSize = 'small'; }

    if (windowSize != newWindowSize) {
        windowSize = newWindowSize;
        ameLoadHero();
    }
}


function ameLoadHero() {

    if (windowSize == 'x-large') {
        $('body').removeClass('large');
        $('body').removeClass('medium');
        $('body').removeClass('small');
        $('body').addClass('x-large');
    }

    if (windowSize == 'large') {
        $('body').removeClass('x-large');
        $('body').removeClass('medium');
        $('body').removeClass('small');
        $('body').addClass('large');
    }

    if (windowSize == 'medium') {
        $('body').removeClass('x-large');
        $('body').removeClass('large');
        $('body').removeClass('small');
        $('body').addClass('medium');
    }

    if (windowSize == 'small') {
        $('body').removeClass('x-large');
        $('body').removeClass('large');
        $('body').removeClass('medium');
        $('body').addClass('small');
    }

    if ($("#cpm-container").is(":visible")) { cpmNavigationLoad(); }
    if ($(".search-results-list").is(":visible")) {
        if ($("body").hasClass("search-results-comparison")) {

        } else { searchDisplayLoad(); }
    }

    if ($(".ame-clinical-trials").is(":visible")) { clinicalTrialsLoad(); }
    if ($(".expert-container").is(":visible")) { expertsLoad(); }
    if ($("#topic-body").is(":visible")) { topicLoad(); }
    if (!$("body").hasClass("mobile")) { amefavHover(); }

    headerDisplayLoad();
    filterLoad();
    navStick();
    scrollableTables();
    fancyLoad();
    //Call function to shorten text
    $(".comment").shorten();
}

function cpmNavigationLoad() {

    $('body').addClass('cpm');
    if ($("#cpm-table-body").is(":visible")) { $('body').addClass('table'); }

    // clone left nav and show as collapsed if screen size below 1254px
    if ($("#cpm-container").is(":visible")) {
        $nav = $("#cpm-left-nav").clone();
        $("#cpm-left-nav").remove();
    }

    $(".cpm-search-container").children(".cpm-navigation").remove();

    if ($("body").hasClass("x-large")) {
        $($nav).insertBefore("#cpm-container").show();
        $("#cpm-left-nav").children("ul, h2, h3").show();
    }
    else {
        // Reset Display
        $($nav).insertBefore(".cpm-search");
        $("#cpm-left-nav").children("ul, h2, h3").hide();
        //$("<a class='cpm-navigation'>Navigation</a>").insertBefore("#cpm-left-nav");
        if ($("body").hasClass("small") || $("body").hasClass("medium") || $("body").hasClass("mobile")) {
            navClick();
        }
        else {
            navHover();
        }
    }
}

function searchDisplayLoad() {

    isMobile();

    if ($("body").hasClass("small") || $("body").hasClass("medium") || $("body").hasClass("mobile")) {

        // Reset Display
        $("li.search-result").each(function (i) {
            $(this).removeClass("hover");
            $(this).children("p").children("a.search-result-preview").show();
            $(this).children("p").children("span:last-of-type").show();
        });

        $(".navigation-preview").each(function (i) {
            $(this).children(".navigation-preview-close").show();
        });

        $(".navigation-preview-close").click(function () {
            $(this).parent().parent("li").removeClass("preview-selected");
            $(this).parent("div").hide();
        });

    }
    else {
        // Reset display
        $("li.search-result").each(function (i) {
            $(this).addClass("hover");
            $(this).children("p").children("a.search-result-preview").hide();
            $(this).children("p").children("span:last-of-type").hide();
        });

        $(".navigation-preview").each(function (i) {
            $(this).children(".navigation-preview-close").hide();
        });

        function showMenu() {
            $("li.search-result").each(function (i) {
                if ($(this).hasClass("preview-selected")) {
                    $(this).removeClass("preview-selected");
                }
                $(this).children(".navigation-preview").attr("class", "navigation-preview").hide();
            })

            $(this).addClass("preview-selected").children(".navigation-preview").show();
        }

        function timeOut() {
            setTimeout(hideMenu, 2000);
        }

        var hideMenu = function () {
        }

        $("li.hover").each(function (i) {
            $(this).hoverIntent(showMenu, timeOut);
        });
    }
}

function headerDisplayLoad() {


    if ($('body').hasClass("small")) {
        $('a.mobile-menu').removeClass('open');
        $('a.mobile-search').removeClass('open');
        $('.mobile-search').show();
        $('a.toggleFavorites').removeClass('open');
        $('#user-menu-favorites').hide();
    }
    else {
        $('#user-menu-options').hide();
        $('.mobile-search').hide();
        $('.mobile-header').hide();
        $('a.home').show();
        $('a.toggleFavorites').removeClass('open');
        $('#user-menu-favorites').hide();
        if ($('header').hasClass("homepage")) {
            $('.site-search').hide();
        }
    }
    menuDropdowns();
}

function clinicalTrialsLoad() {
    if ($('body').hasClass("small")) {
        $('.km-toggle.locations').next('div').hide();
    }
    else {
        $('.km-toggle.locations').next('div').show();
    }
}

function expertsLoad() {
    if ($('body').hasClass("small")) {
        $('.expert-individual-container').hide();
    }
    else {
        $('.expert-individual-container').show();
    }
}

function topicLoad() {
    if ($('body').hasClass("small")) {
        $('#topic-left-nav').hide();
        $('#cpm-left-nav').hide();
    }
    else {
        $('#topic-left-nav').show();
        $('#cpm-left-nav').show();
    }
}


function amefavHover() {
    $('.content-fav').find("a").attr("data", 'Add to Favorites list').addClass("content-fav-tip-hover").removeClass("content-fav-tip-hover-2");
    if ($('.content-fav.content-fav-current')) {
        $('.content-fav.content-fav-current').find("a").attr("data", 'Remove from Favorites list').addClass("content-fav-tip-hover-2").removeClass("content-fav-tip-hover");
    }
    return false;
}

function scrollableTables() {
    $(".ame-km-table").each(function () {
        if ($(this).children("table").prop('scrollWidth') > $(this).width()) {
            $(this).children("table").wrap("<div class='scrollable'></div>").prepend("<div class='shaded'></div>");
        }
    });
}


// Stick for top nav
function navStick() {
    $(".topic").unstick();
    $(".cpm-search-wrapper").unstick();
    $("#cpm-nav").unstick();
    if ($('body').hasClass("small")) {
        // Do nothing
    }
    else {
        $(".topic").sticky({ topSpacing: 0, className: "hey" });
        $("#cpm-nav").sticky({ topSpacing: 0, className: "hey" });
        if ($('body').hasClass("x-large")) {
            $(".cpm-search-wrapper").sticky({ topSpacing: 60, className: "hey", wrapperClassName: "search-stick-wrapper" });
        }
        else {
            $(".cpm-search-wrapper").sticky({ topSpacing: 36, className: "hey", wrapperClassName: "search-stick-wrapper" });
        }
    }
}

//Function to shorten text for clinical trials descriptions
(function ($) {
    $.fn.shorten = function (settings) {

        var config = {
            showChars: 250,
            ellipsesText: "...",
            moreText: "See more",
            lessText: "See less"
        };

        if (settings) {
            $.extend(config, settings);
        }

        $(document).off("click", '.morelink');

        $(document).on({
            click: function () {

                var $this = $(this);
                if ($this.hasClass('less')) {
                    $this.removeClass('less');
                    $this.html(config.moreText);
                } else {
                    $this.addClass('less');
                    $this.html(config.lessText);
                }
                $this.parent().parent().prev().toggle();
                $this.parent().prev().toggle();
                if ($('.lbox').is(":visible")) { $.fancybox.update(); }
                return false;
            }
        }, '.morelink');

        return this.each(function () {
            var $this = $(this);
            if ($this.hasClass("shortened")) return;

            $this.addClass("shortened");
            var content = $this.html();
            if (content.length > config.showChars) {
                var c = content.substr(0, config.showChars);
                var h = content.substr(config.showChars, content.length - config.showChars);
                var html = c + '<span class="moreellipses">' + config.ellipsesText + ' </span><span class="morecontent"><span>' + h + '</span> <p><a href="#" class="morelink">' + config.moreText + '</a></p></span>';
                $this.html(html);
                $(".morecontent span").hide();
            }
        });
    };
})(jQuery);




