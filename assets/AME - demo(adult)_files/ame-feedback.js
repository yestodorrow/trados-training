
$(document).ready(function () {
    //FEEDBACK
    $("#feedback-yes-button").click(ame.feedback.feedbackYesButton);
    $("#feedback-no-button").click(ame.feedback.feedbackNoButton);
    $("#feedback-send-button").click(ame.feedback.submitFeedback);
    ame.feedback.resetForm();
});

var ame = !ame ? {} : ame;
ame.feedback = {};
ame.feedback.linkedlbIDs = "";

ame.feedback.showInLightbox = function (lightboxid, lightboxSelector) {
    ame.feedback.resetForm(); //reset form before showing in lightbox
    $("#ame-feedback-initial").insertAfter(lightboxSelector + " .lbox-inner>div:last");//8801ad23-2a5b-4983-b51a-eb9a33b96901$(lightboxSelector + " .lbox-inner")
    //$(lightboxSelector + " ").lbox-inner .lbox-sectionContainer:last
    $("#feedback-lightboxId").val(lightboxid);
    $("#ame-feedback-initial").show();
}

ame.feedback.cloneInLightbox = function (lightboxid, lightboxSelector) {
    ame.feedback.resetForm(); //reset form before showing in lightbox
    $("#feedback-lightboxId").val(lightboxid);
    var feedbackClone = $("#ame-feedback-initial").clone(true, true);
    feedbackClone.attr("id", "clone_ame-feedback-initial");
    feedbackClone.insertAfter(lightboxSelector + " .lbox-inner>div:last");//8801ad23-2a5b-4983-b51a-eb9a33b96901$(lightboxSelector + " .lbox-inner")
    //$(lightboxSelector + " ").lbox-inner .lbox-sectionContainer:last
    $("#clone_ame-feedback-initial").show();
}

ame.feedback.hide = function() {
    $("#ame-feedback-initial").hide();
    $("#ame-feedback-initial").insertAfter("#cpm-body");
}

ame.feedback.feedbackNoButton = function() {
    $("#feedback-no-button").addClass("selected");
    $("#feedback-yes-button").removeClass("selected");
    $("#ame-feedback-specific").show();
}

ame.feedback.feedbackYesButton = function() { 
    $("#feedback-yes-button").addClass("selected");
    $("#feedback-no-button").removeClass("selected");
    $("#ame-feedback-specific").show();
}

ame.feedback.resetForm= function() {
    $("#feedback-yes-button").removeClass("selected");
    $("#feedback-no-button").removeClass("selected");
    $("#feedback-text-email").val("");
    $("#feedback-name-fail").hide();
    $("#feedback-email-fail").hide();

    $("#feedback-name").val("");
    $("#feedback-text").val("");
    $("#ame-feedback-specific").hide();
    $("#ame-feedback-helpful").show();
    $("#ame-feedback-sent").hide();

}

ame.feedback.submitFeedback = function() {
    var canSubmit = $("#feedback-name").val() == undefined;

    //Trim text to ensure whitespace removed
    //Validate fields if the fields are available to user
    if (!canSubmit) {
        if ($("#feedback-name").val() != undefined && $("#feedback-name").val().trim() === "") {
            $("#feedback-name-fail").show();
        } else {
            $("#feedback-name-fail").hide();
        }

        //Set can submit on second set since it will override any settings previous to this statement
        if ($("#feedback-text-email").val().trim() === "") {
            $("#feedback-email-fail").show();
            canSubmit = false;
        } else {
            //validate email address is in valid email format
            var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
            var emailValid = emailReg.test($("#feedback-text-email").val());

            if (emailValid) {
                $("#feedback-email-fail").hide();
                canSubmit = true;
            } else {
                $("#feedback-email-fail").show();
                canSubmit = false;
            }
        } 
    }
   

    if (canSubmit) {
        //show the nice message to our friendly users
        $("#ame-feedback-helpful").hide();
        $("#ame-feedback-specific").hide();
        $("#ame-feedback-sent").toggle();
           
        //subject field -- topic title or cpm title
        var feedback = {};
        /*---------------   Basic Feedback Fields -------------------------*/
        feedback.feedbackText = $("#feedback-text").val();
        //feedback.pocId = $("#feedback-pocId").val();
        feedback.contextUrl = window.location.href;
        feedback.guestName = $("#feedback-name").val();
        feedback.guestEmail = $("#feedback-text-email").val();
        feedback.wasHelpful = $("#feedback-yes-button").hasClass("selected");

        /* ---------------  fields from Mayo User Menu control -------------- */
        if (typeof _dl !== 'undefined') {
            feedback.mayoUserId = _dl.user_muid; /*use this value to lookup lanId, idmId,  firstname, lastname, and idm guid value from ame user table*/
            feedback.businessClientId = _dl.user_child_bc_id;
            feedback.businessClientName = _dl.user_child_bc_name;
            feedback.pocId = _dl.topic_id;
            feedback.title = _dl.topic_title;
            if (ame.feedback.linkedlbIDs.length > 0) {
                feedback.cpm_lightbox_id = ame.feedback.linkedlbIDs;
            } else {
                feedback.cpm_lightbox_id = $("#feedback-lightboxId").val();
            }
            if (feedback.cpm_lightbox_id.length > 0) {
                feedback.secondaryTitle = _dl.cpm_title; 
            } else {
                feedback.secondaryTitle = _dl.sec_title; 
            }
            feedback.personId = '';
        } else {
            //legacy references
            feedback.mayoUserId = $("#hdUserId").val(); /*use this value to lookup lanId, idmId,  firstname, lastname, and idm guid value from ame user table*/
            feedback.businessClientId = $("#hdBusinessClientId").val();
        }

        //TEST only => var dt = { 'Feedback': feedback.Feedback, 'PocId': feedback.PocId};"http://services.kcms.mayo.edu/api/Feedback/AddFeedback"
        var serviceurl = AMEMasterLayout.config.settings.ServiceLocation + "api/V1/Feedback/AddFeedback";
        var email = "mailto:mayoexpert@mayo.edu";
        var errorResponse = "There was an error submitting your feedback. Please reload the page and try again or send your feedback to <a href=" + email + ">MayoExpert Team</a>. Sorry for the inconvenience.";
        var successResponse = "Thank you for your feedback."
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: serviceurl,
            data: JSON.stringify(feedback),
            dataType: "json",
            success: function (data) {
                $("#ame-feedback-sent").text(successResponse);               
            },
            error: function (x, status, error) {
                $("#ame-feedback-sent").html(errorResponse);
                // alert("Your sse node call failed.  Error Occured: " + x.status + error + status);
            }
              
        });

           
    }

}