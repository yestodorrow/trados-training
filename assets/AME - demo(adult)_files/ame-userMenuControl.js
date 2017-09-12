var ame = !ame ? {} : ame;
ame.userMenuControl = {};

ame.userMenuControl.updatelinkQueryStringByOS = function(isVpn){
    var isVpnBool = JSON.parse(isVpn.toLowerCase());
    if (!isVpnBool) {
        //Is Windows OS 
        if ($.client.os == 'Windows') {
           //IE or CHROME
            if ($.client.browser != "Mozilla" && $.client.browser != "Chrome") {
                //add noSPNEGO
                if ($("#expertPortfolio a")[0]) $("#expertPortfolio a")[0].href = $("#expertPortfolio a")[0].href + "?noSPNEGO";
                if ($("#hasExpertise a")[0]) $("#hasExpertise a")[0].href = $("#hasExpertise a")[0].href + "?noSPNEGO";
            }
        } else {
            //Not windows (i.e. Mac os or other)
            //add noSPNEGO
            if ($("#expertPortfolio a")[0]) $("#expertPortfolio a")[0].href = $("#expertPortfolio a")[0].href + "?noSPNEGO";
            if ($("#hasExpertise a")[0]) $("#hasExpertise a")[0].href = $("#hasExpertise a")[0].href + "?noSPNEGO";
        }
    } else {
        //add noSPNEGO
        if ($("#expertPortfolio a")[0]) $("#expertPortfolio a")[0].href = $("#expertPortfolio a")[0].href + "?noSPNEGO";
        if ($("#hasExpertise a")[0]) $("#hasExpertise a")[0].href = $("#hasExpertise a")[0].href + "?noSPNEGO";
    }
}