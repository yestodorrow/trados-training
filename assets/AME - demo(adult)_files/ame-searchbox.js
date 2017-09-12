AmeSearchBox = {};

//TODO: verify integrate with autosuggest


AmeSearchBox.Init = function() {
    //Detect if Home search is on the page, if so, bind listener to key up to detect enter
    //Detect if homeSearch button is on the page, if so, bind the listener to click button
    $("#homeSearchButton").on("click", AmeSearchBox.SearchButtonClick);
    $("#homeSearch").on("keyup", AmeSearchBox.KeyUp); //needed to iphone go button
    //Detect if ameSearch control is on the page, if so, bind listener to key up to detect enter
    //Detect if ameSearchbutton is on the page, if so, bind the listener to click button
    $("#ameSearchButton").on("click", AmeSearchBox.SearchButtonClick);
    $("#headerSearchButton").on("click", AmeSearchBox.SearchButtonClick);
    $("#ameSearch").on("keyup", AmeSearchBox.KeyUp); //needed to iphone go button
    $("#headerSearch").on("keyup", AmeSearchBox.KeyUp); //needed to iphone go button
}

AmeSearchBox.SearchButtonClick = function(event, args)
{
    //Pull content in search box and build search url
    AmeSearchBox.DoSearch();
    event.stopPropagation();
    return false;
}

AmeSearchBox.KeyUp = function (event, args) {
    //Detect if enter key pushed, if so then build url and set window location
    if (event.keyCode === 13) {
        AmeSearchBox.DoSearch();
    }
}

var searchOnce = 0;
AmeSearchBox.DoSearch = function () {
    //Detect if enter key pushed, if so then build url and set window location
    var searchText = "";

    if ($("#homeSearch").length) {
        searchText = $("#homeSearch").val();
    }
    else if ($("#ameSearch").length) {
        searchText = $("#ameSearch").val();
    } else if ($("#headerSearch").length) {
        searchText = $("#headerSearch").val();
    }

    if (searchText === "") {
       //do nothing
    } else {
        if (searchOnce < 1) {
            searchOnce = 1; //set to prevent keyup double submitted -- need keyup to catch the go button on iphones
            var searchUrl = "/search/results?amQuestion=" + searchText;
            if (window.location.href.indexOf("gsa-results-comparison") > -1) {
                searchUrl = "/search/results/gsa-results-comparison?amQuestion=" + searchText;
            }
            if (AMEMasterLayout) {
                searchUrl = AMEMasterLayout.config.settings.IsAmeDelivery ? searchUrl : "/amemaster" + searchUrl;
            }

            window.location.href = searchUrl;
        }
       
    }

   
}