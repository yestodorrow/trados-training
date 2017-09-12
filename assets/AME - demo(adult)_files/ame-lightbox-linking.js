        jQuery(document).ready(function($) {

            var activeNodeId;
            var lightBoxTrail = []; // track multiple linked lightboxes

            //Hide feedback form initially for use in lightboxes
            ame.feedback.hide();

            $(document).bind("node-with-lb-clicked", function (evt, id) {
                ame.lightbox.show(id);

                if ($("body").hasClass("small") || $("body").hasClass("medium")) {
                    ame.feedback.showInLightbox(id, "#clone_lightbox-content_" + id); //pass in selector
                } else {
                    ame.feedback.showInLightbox(id, "#lightbox-content_" + id); //pass in selector
                }
                
                lightBoxTrail.push(id);
                ame.feedback.linkedlbIDs = lightBoxTrail.join("|");
                activeNodeId = id;
            });

            $('.lbox-close').click(ame.lightbox.closeEvent);
   
            $('[id^="lightbox-dismiss-area_"]').click(function (evt) {
                var nodeId = /lightbox\-dismiss\-area_(.*)/.exec($(evt.target).attr('id'))[1];
                ame.lightbox.hide(nodeId);
                activeNodeId = null;
                lightBoxTrail = [];
                ame.feedback.linkedlbIDs = "";

            });

            var selectNode = function (nodeId) {
                var nodeSelector = '#node-' + nodeId;
             	var nodeDiv = $(nodeSelector);
                if (!!angular) {
                    var scope = angular.element(nodeDiv[0]).scope();
                    if (!!scope) {
                        scope.$apply(function() {
                            scope.node.select();
                        });
                    }
                }
            }


            var currentLbId;
            $(document).bind('lightbox-shown', function(evt, nodeId) {
                //plug code to fire on lightbox-shown event
                //set currentLbId outside of if statement because KmAuditManager is not used on Provider mobile app
                currentLbId = nodeId;
                if (typeof KmAuditManager !== "undefined") {
                    KmAuditManager.CreateAuditRecord(null, null, CpmAuthoringView.config.settings.itemId, currentLbId, _dl.cpm_title,
                        CpmAuthoringView.config.settings.itemSrc.name, ContentLayout.settings.Lang, window.location.href, _dl.user_muid, AMEMasterLayout.config.settings.SiteName, _dl.topic_id,
                        KmAuditManager.Actions.OpenLightbox, KmAuditManager.Views.AmeDetailPage);
                }

            });

            $(document).bind('lightbox-hidden', function(evt, nodeId) {
                var sc = angular.element($('svg')).scope();
                !!sc && sc.$apply(function () { sc.chart.deselectAll(); });
                if (currentLbId === nodeId) {
                    currentLbId = null;
                }
            });

            $(document).bind('scroll-to-node', function(evt, nodeId) {
                var nodeSelector = '#node-' + nodeId;
                var nodeDiv = $(nodeSelector);
                if (nodeDiv.length > 0) {
                    //in order to find the node height when hidden, we need to remove the class
                    nodeDiv.removeClass("hidden");
                    var scrollTo = (nodeDiv.offset().top -$('#undefined-sticky-wrapper').height());
                    // scrollTo - 36 = adjustment for top of lightbox from top nav bar
                    $('html,body').animate({ scrollTop: (scrollTo - 36) }, 500);
                    return false;
                }
            });
            // used with back linking piece
            var lbLinks = $('a[node-lb-id]');
            lbLinks.click(function (evt) {
                var nodeLbId = $(this).attr('node-lb-id');
                var nodeSelector = '#node-' + nodeLbId;
             	var nodeDiv = $(nodeSelector);
             	if(nodeDiv.length > 0)
             	{
                    // hide the previously showing light box, which will also deselect the lb
	                ame.lightbox.hide(currentLbId);
	                activeNodeId = nodeLbId;
             	    //if the node is in a hidden branchchoice, expand the branch choice
                    if (!!angular) {
                        var scope = angular.element(nodeDiv[0]).scope();
                        if (!!scope) {
                            scope.$apply(function() {
                                ame.lightbox.show(nodeLbId);
                                ame.feedback.showInLightbox(nodeLbId, "#lightbox-content_" + nodeLbId); //pass in selector
                                lightBoxTrail.push(nodeLbId);
                                ame.feedback.linkedlbIDs = lightBoxTrail.join("|");
                                scope.node.select();
                                scope.$parent.$parent.$parent.expandBranchChoicesForHiddenNode(scope.node);

                            });
                        }
                    }
                    // show the target lightbox and select it so it is highlighted
	                //selectNode(nodeLbId);

	                 var scrollTo = (nodeDiv.offset().top - $('#undefined-sticky-wrapper').height());
	                 $('html,body').animate({ scrollTop: scrollTo }, 500);

	             }
             	else{
             		var lbContentSelector = '#lightbox-content_'+nodeLbId;
             		var lbArrowSelector = '#lightbox-arrow_' + nodeLbId;
             		var lbContentDiv = $(lbContentSelector);
             		var lbArrowDiv = $(lbArrowSelector);
             		if (lbContentDiv.length > 0) {
	                     //get current divs top, left coordinates
	                     var currentLbContentDiv = $('#lightbox-content_' + currentLbId);
	                     var currentLbContentPosition = currentLbContentDiv.position();
	                     var currentLbArrowDiv = $('#lightbox-arrow_' + currentLbId);
	                     var currentLbArrowPosition = currentLbArrowDiv.position();
	                     // update top left for lb arrow div and lb content div
	                     lbContentDiv.css('top', currentLbContentPosition.top);
	                     lbContentDiv.css('left', currentLbContentPosition.left);
	                     lbArrowDiv.css('top', currentLbArrowPosition.top);
	                     lbArrowDiv.css('left', currentLbArrowPosition.left);

	                     // Create a back link in the content div and inject in html 
	                     var backLink = $('<a class="lbox-back">Back</a>');
	                     lbContentDiv.find('.lbox-back').remove();
	                     lbContentDiv.prepend(backLink);

	                     var prevCurrentNodeId = currentLbId; // Note: This string copy by value is important.
	                     var backLinkClickHandler = function() {
	                         ame.lightbox.hide(nodeLbId);
	                         selectNode(activeNodeId);
	                         ame.lightbox.show(prevCurrentNodeId);
	                         ame.feedback.showInLightbox(prevCurrentNodeId, "#lightbox-content_" + prevCurrentNodeId); //pass in selector
	                         lightBoxTrail.pop();
	                         ame.feedback.linkedlbIDs = lightBoxTrail.join("|");
	                     };
	                     backLink.click(backLinkClickHandler);

	                     ame.lightbox.hide(currentLbId); // this will hide lightboxes, deselect all nodes and sets currentNodeId and currentLbId to null
	                     selectNode(activeNodeId);
	                     ame.lightbox.show(nodeLbId);
	                     ame.feedback.showInLightbox(nodeLbId, "#lightbox-content_" + nodeLbId); //pass in selector
	                     lightBoxTrail.push(nodeLbId);
	                     ame.feedback.linkedlbIDs = lightBoxTrail.join("|");
	                 }

	             }


            });
        });