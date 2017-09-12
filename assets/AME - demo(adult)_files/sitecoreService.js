angular.module('sitecoreServiceMod', ['ng.httpLoader'])
    .service('sitecoreService', ['settings', '$http', '$q', SitecoreDataAccess]);


//Sitecore DataAccess Class
function SitecoreDataAccess(settings, $http, $q) {
    var kmSectionTemplateId = "{D1A1F112-66A2-47EF-ACFB-DE8A5D4B5758}";
    var kmTableSectionTemplateId = "{02098915-EFD2-4841-8851-30D04B752AF2}";
    var kmTableBucketId = "{35393E96-C648-46B2-A82B-2040EED16C14}";
    var cpmDiagramFieldId = "{D761134B-2A8A-415A-A450-18BA2E3FAE5C}";
    var taskTitleFieldId = "{DCCEECE5-E6D3-4235-9290-DF075EBE24F3}";
    var cpmTemplateId = "{BE2CD27D-D827-4F0D-B922-972DB01C5CE7}";
    var prestineModel;
    var config = settings;
    //var d; //Note: using d at the service level is causing issues with ajax calls that are made back to back (in a for loop). Leaving the scope to individual function level


    var MockSearchResults = {
        "results": [
            {"id": "1e5a2d21-7af4-43c5-b249-4d23678a3a22", "title": "Conduct Physical Exam"},
            {"id": "1e5a2d21-7af4-43c5-b249-4d23678a3a22", "title": "Conduct Physical Exam"},
            {"id": "1e5a2d21-7af4-43c5-b249-4d23678a3a22", "title": "Conduct Physical Exam"},
            {"id": "1e5a2d21-7af4-43c5-b249-4d23678a3a22", "title": "Conduct Physical Exam"},
            {"id": "1e5a2d21-7af4-43c5-b249-4d23678a3a22", "title": "Conduct Physical Exam"},
            {"id": "1e5a2d21-7af4-43c5-b249-4d23678a3a22", "title": "Conduct Physical Exam"},
            {"id": "1e5a2d21-7af4-43c5-b249-4d23678a3a22", "title": "Conduct Physical Exam"},
        ]
    }
 
    var MockSearch2 = { "CurrentPage": 1, "Location": null, "PageNumbers": 1, "SearchCount": "1", "SearchTime": null, "facets": [[], [], [], []], "items": null, "launchType": null, "ContextData": null, "ContextDataView": null };


    var emptyChartDataModel = { "id": "",
        "name": "",
        "nodes": [],
        "connections": []
    };

    //Public API
    return {
        LastLoaded: function() {
            return prestineModel;
        },
        LoadCpm: function (cpmId) {
          
            var d = $q.defer();

            //First determine if server provided us the model, if so move forward
            if (config.itemSrc && config.itemSrc != "") {
                if (!prestineModel) prestineModel = JSON.stringify(config.itemSrc);
                d.resolve({ RenderingVM: config.itemSrc });
                return d.promise;
            }

            if (!cpmId) {
                console.log("Warning: Cpm Id was empty");
                d.resolve();//resolve right away if no id if passed in
            } 

            if (cpmId == "mock") {
                //var model = { Title: "Aortic Regurgitation CPM", RenderingVM: fullMock, config: config };
                //if (!prestineModel) prestineModel = JSON.stringify(model.RenderingVM);

                ////prestineModel = JSON.stringify(prestineModel.RenderingVM);
                //d.resolve(model);
            } else {
                if (prestineModel) {
                    //service has already got the model, why are we getting again?
                    d.resolve(prestineModel); //this will error
                } else {
                    var serviceUrl = config.ItemApiLocation + "-/item/v1/?sc_itemid=" + cpmId;
                    $http.get(serviceUrl).success(function (data) {
                         //Grab model and loag into prestine model
                        if (data.error)
                        {
                            alert(data.error.message);
                            return;
                        }
                        emptyChartDataModel.id = cpmId;
                        emptyChartDataModel.name = data.result.items[0].Fields[taskTitleFieldId].Value;

                        if (data.result) {
                           
                             var retVal = {
                                 'config': {},
                                 'RenderingVM': data.result.items[0].Fields[cpmDiagramFieldId].Value == "" ? emptyChartDataModel : JSON.parse(data.result.items[0].Fields[cpmDiagramFieldId].Value),
                                 'Title': data.result.items[0].Fields[taskTitleFieldId].Value
                             };
                             retVal.RenderingVM.name = retVal.Title;
                             prestineModel = JSON.stringify(retVal.RenderingVM);
                             d.resolve(retVal);
                         } else {
                             d.resolve(data);
                         }
                     });
                }
            }

            return d.promise;
        },
        ReLoadCpm: function () {
            return activeNode;
        },

        SaveCpm: function(model) {
            var createHref = config.ItemApiLocation + "-/item/v1/?sc_itemid=" + model.id;

            //Note: Seems I need to do the double encoding for the 'IIS potential dangerous request issue'
            $http.put(createHref, encodeURIComponent(cpmDiagramFieldId)+"=" + encodeURIComponent(encodeURIComponent(JSON.stringify(model)))+"&richTextField="+encodeURIComponent(cpmDiagramFieldId), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function (data) {
                if (data.error)
                {
                    alert(data.error.message);
                    return;
                }
                alert("CPM Saved.");
            }).error(function (data, status, headers, config) { alert("Error saving cpm . Status code:" + status); });
        },

        AddNode: function(cpmId, parentId, type, title, onSuccess,onError) {

            var saveService = config.ServiceLocation + config.CreateNodeService;//TODO: replace with config setting from json config structure 
            $http.post(saveService, { cpmId: cpmId, parentId: parentId, childType: type, title: title }).success(onSuccess).error(onError);
        },

        ReadCpm: function(cpmId) {
            var d = $q.defer();
            var createHref = config.ItemApiLocation + "-/item/v1/?sc_itemid=" + cpmId;

            $http.get(createHref)
                .success(
                function (data) {
                    if (data.error) {
                        alert(data.error.message);
                        return;
                    }
                    d.resolve(data);
                });
            return d.promise;

        },

        /****************************************************
        Should be ReadItem as its not specific to a section
        *******************************************************/
        ReadSection: function(sectionId, fields, isPreview){
            var d = $q.defer();
            var createHref = config.ItemApiLocation + "-/item/v1/?sc_itemid=" + sectionId;

            if (fields) {
                createHref = createHref + "&fields=" + fields;
            }
            if (isPreview) {
                createHref += "&pdha=1";
            }
            $http.get(createHref).success(
                function (data) {
                    if (data.error)
                    {
                        alert(data.error.message);
                        return;
                    }
                    d.resolve(data);
                }).error(
                function (data, status, headers, config) {
                    alert("Unable to read section. Status code:" + status);
                });
            return d.promise;
        },




        ReadParentTree: function (cpmGuid) {
            var d = $q.defer();
            var createHref = config.ItemApiLocation + "api/CareProcessModel/V1/GetParentTopics?cpmId=" + cpmGuid;

            $http.get(createHref).success(function (data) {
                if (data.error) { alert(data.error.message); return; }
                d.resolve(data);
            }).error(function (data, status, headers, config) { alert("Unable to create section. Status code:" + status); });

            return d.promise;
        },


        LookupUserName: function(lanId){
            var d = $q.defer();
            var createHref = config.ItemApiLocation + "api/CareProcessModel/V1/LookupName?lanId=" + lanId;

            $http.get(createHref).success(function (data) {
                if (data.error) { alert(data.error.message); return; }
                d.resolve(data.replace(/"/g, ""));
            }).error(function (data, status, headers, config) { alert("Unable to create section. Status code:" + status); });

            return d.promise;

        },

        /****************************************************
        Check out a item, if its in pending publish state then it will also start workflow back at draft
        *******************************************************/
        CheckOut: function(sitecoreId){
            var d = $q.defer();
            var createHref = config.ItemApiLocation + "api/CareProcessModel/V1/CheckOutContent?sitecoreId=" + sitecoreId;

            $http.get(createHref).success(function (data) {
                if (data.error) { alert(data.error.message); return; }
                d.resolve(data.replace(/"/g, ""));
            }).error(function (data, status, headers, config) { alert("Unable to create section. Status code:" + status); });

            return d.promise;
        },

        /****************************************************
        Check in a item, during the unlock a minor version is created
        *******************************************************/
        CheckIn: function(sitecoreId){
            var d = $q.defer();
            var createHref = config.ItemApiLocation + "api/CareProcessModel/V1/CheckInContent?sitecoreId=" + sitecoreId;

            $http.get(createHref).success(function (data) {
                if (data.error) { alert(data.error.message); return; }
                d.resolve(data.replace(/"/g, ""));
            }).error(function (data, status, headers, config) { alert("Unable to create section. Status code:" + status); });

            return d.promise;
        },

        /*******************************************************
            create a new Concept and a new table in Sitecore; set workflow to draft
        *********************************************************/
        SaveConceptTable: function (parentId, conceptTemplateId, conceptName, conceptTitle, sectionbucketId, conceptDoNotShowInNav, name, title, body, footnote, citation, doNotShow) {
            var d = $q.defer();
            var createHref = config.ItemApiLocation + "api/CareProcessModel/V1/CreateConceptAndSection";
            //?parentId=" + parentId + "&conceptTemplateId=" + conceptTemplateId + "&conceptName=" + escape(conceptName)
            //+ "&sectionbucketId=" + kmTableSectionTemplateId + "&name=" + name + "&body=" + encodeURIComponent(encodeURIComponent(body))
            //+ "&footnote=" + encodeURIComponent(footnote) + "&citation=" + escape(citation);

            var postData = { conceptTemplateId: conceptTemplateId, parentId: parentId, conceptName: conceptName, conceptTitle: conceptTitle, conceptDoNotShowInNav:conceptDoNotShowInNav, sectionbucketId: sectionbucketId, name: name,title:title, body: encodeURIComponent(body), doNotShow: doNotShow, footnote: encodeURIComponent(footnote), citation: citation };
            $http.post(createHref, JSON.stringify(postData), { headers: { 'Content-Type': 'application/json' } }).success(function (data) {
                if (data.error) { alert(data.error.message); return; }
                d.resolve(data.replace(/"/g, ""));
            }).error(function (data, status, headers, config) { alert("Unable to create section. Status code:" + status); });
            //$http.get(createHref).success(function (data) {
            //    if (data.error) { alert(data.error.message); return; }
            //    d.resolve(data.replace(/"/g, ""));
            //}).error(function (data, status, headers, config) { alert("Unable to create section. Status code:" + status); });

            return d.promise;;
        },

        /*******************************************************
            create a new Concept and a new section to Sitecore; set workflow to draft
        *********************************************************/
        SaveConceptSection: function (parentId, conceptTemplateId, conceptName, conceptTitle, sectionbucketId, conceptDoNotShowInNav, name, title, body, doNotShow) {
            var d = $q.defer();
            var createHref = config.ItemApiLocation + "api/CareProcessModel/V1/CreateConceptAndSection";
                //?parentId=" + parentId + "&conceptTemplateId=" + conceptTemplateId 
                //+ "&conceptName=" + escape(conceptName) + "&sectionbucketId=" + sectionbucketId + "&name=" + name + "&body=" + encodeURIComponent(encodeURIComponent(body));


            var postData = { conceptTemplateId: conceptTemplateId, parentId: parentId, conceptName: conceptName, conceptTitle: conceptTitle, conceptDoNotShowInNav: conceptDoNotShowInNav, sectionbucketId: sectionbucketId, name: name, title: title, body: encodeURIComponent(body), doNotShow: doNotShow };
            $http.post(createHref, JSON.stringify(postData), { headers: { 'Content-Type': 'application/json' } }).success(function (data) {
                if (data.error) { alert(data.error.message); return; }
                d.resolve(data.replace(/"/g, ""));
            }).error(function (data, status, headers, config) { alert("Unable to create section. Status code:" + status); });


            //$http.get(createHref).success(function (data) {
            //    if (data.error) { alert(data.error.message); return; }
            //    d.resolve(data.replace(/"/g, ""));
            //}).error(function (data, status, headers, config) { alert("Unable to create section. Status code:" + status); });

            return d.promise;
        },

        /*******************************************************
            create a new section in sitecore and set workflow to draft
        *********************************************************/
        CreateSection: function (parentId,bucketId, name,title, body, doNotShow) {
            var d = $q.defer();
            var createHref = config.ItemApiLocation + "api/CareProcessModel/V1/CreateSection";

            var postData = { parentIdConceptId: parentId, sectionbucketId: bucketId, name: name, title: title, body: body, doNotShow:doNotShow };
            $http.post(createHref, JSON.stringify(postData), { headers: { 'Content-Type': 'application/json' } }).success(function (data) {
                if (data.error) { alert(data.error.message); return; }
                d.resolve(data.replace(/"/g, ""));
            }).error(function (data, status, headers, config) { alert("Unable to create section. Status code:" + status); });

            return d.promise;
        },

        /*******************************************************
            create a new table in sitecore and set workflow to draft
        *********************************************************/
        CreateTable: function (parentId, name, title, body, footnote, citation, doNotShow) {
            var d = $q.defer();
            var createHref = config.ItemApiLocation + "api/CareProcessModel/V1/CreateSection";
            var postData = { parentIdConceptId: parentId, sectionbucketId: kmTableBucketId, name:name, title: title, body: body, footnotes: footnote, citations: citation, doNotShow: doNotShow };

            $http.post(createHref, JSON.stringify(postData), { headers: { 'Content-Type': 'application/json' } }).success(function (data) {
                if (data.error) { alert(data.error.message); return; }
                d.resolve(data.replace(/"/g, ""));
            }).error(function (data, status, headers, config) { alert("Unable to create section. Status code:" + status); });

            return d.promise;           
        },

        UpdateSection: function (id,title, body, doNotShow) {
            var d = $q.defer();
            var updateHref = config.ItemApiLocation + "-/item/v1/?sc_itemid=" + id;

            //Note: Seems I need to do the double encoding for the 'IIS potential dangerous request issue'
            $http.put(updateHref, "title=" + escape(title) + "&body=" + encodeURIComponent(encodeURIComponent(body)) + "&richTextField=body" + "&{4A923073-2C13-445B-8D3A-D1EC976A34F1}=" + (doNotShow ? "1" : "0"), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function (data) {
                if (data.error)
                {
                    alert(data.error.message);
                    return;
                }
                d.resolve(data);
            }).error(function (data, status, headers, config) { alert("Unable to update concept. Status code:" + status); });
            return d.promise;
        },
        UpdateTableSection: function (id, title, body, footnotes,citations, doNotShow) {
            var d = $q.defer();
            var updateHref = config.ItemApiLocation + "-/item/v1/?sc_itemid=" + id;

            //Note: Seems I need to do the double encoding for the 'IIS potential dangerous request issue'
            $http.put(updateHref, "title=" + escape(title) + "&body=" + encodeURIComponent(encodeURIComponent(body)) + "&richTextField=body.footnotes" + "&footnotes=" + encodeURIComponent(encodeURIComponent(footnotes)) + "&citations=" + escape(citations) + "&{4A923073-2C13-445B-8D3A-D1EC976A34F1}=" + (doNotShow ? "1" : "0"), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function (data) {
                if (data.error) {
                    alert(data.error.message);
                    return;
                }
                d.resolve(data);
            }).error(function (data, status, headers, config) { alert("Unable to update concept. Status code:" + status); });
            return d.promise;
        },

        QueryItems: function(query,pageIndex)
        {
            //TODO: determine if paging even supported on large queries...
            var d = $q.defer();
            ///
            var site = config.SearchApiLocation + "-/item/v1/?query="+query;
            $http.get(site).success(
                function (data) {
                    if (data.error) {
                        alert(data.error.message);
                        return;
                    }
                    d.resolve(data);
                }).error(
                function (data, status, headers, config) {
                    alert("Unable to query sitecore Status code:" + status);
                });

            return d.promise;
        },

        GetContextUser: function () {
            var d = $q.defer();
            var contextHref = config.ItemApiLocation + "api/CareProcessModel/V1/UserInContext";
            $http.get(contextHref).success(function (data) {
                if (data.error) { alert(data.error.message); return; }
                d.resolve(data.replace(/"/g, ""));
            }).error(function (data, status, headers, config) { alert("Unable to create section. Status code:" + status); });

            return d.promise;
        },

        Search: function (term, pageIndex, allowedTemplates) {
            //TODO: urlescape term
            //TODO: make service domain dynamic
            //TODO: pass in bucket to search rather then hard coding

            var d = $q.defer();
            ///
           //json p request out to sitecore bucket search, pass the term and bucket you want to search
            var site = config.SearchApiLocation + "sitecore/Shell/Applications/Buckets/Services/Search.ashx";
            //var qryStr = "q[0][type]=text&q[0][value]=" + term + "&q[0][operation]=should&pageNumber=" + pageIndex + "&type=Query&pageSize=20&version=1&id=" + bucketId + "&indexName=&db=&callback=JSON_CALLBACK";// "q[0][type]=text&q[0][value]=digest&q[0][operation]=should&pageNumber=0&type=facet&pageSize=20&version=1&id={DFC0BFF1-B6B6-49C7-8648-F86DEA5DB27E}";
            var qryStr = "fromBucketListField="+term+"&location=&filterText=&language=&pageNumber=" + pageIndex +"&pageSize=20&sort=&template="+allowedTemplates+"&indexName=&db=&callback=JSON_CALLBACK";
            $http.jsonp(site + "?" + qryStr).success(function (data) {
                d.resolve(data);

            }).error(function(data, status, headers, config) {
                alert("Error occurred. Status code:"+status);
            });;

            return d.promise;
        },
        SearchCpm: function (term, pageIndex) {
            //TODO: urlescape term
            //TODO: make service domain dynamic
            //TODO: pass in bucket to search rather then hard coding

            var d = $q.defer();
            ///
            //json p request out to sitecore bucket search, pass the term and bucket you want to search
           
           
            var site = config.SearchApiLocation + "sitecore/Shell/Applications/Buckets/Services/Search.ashx";
            var qryStr = "fromBucketListField="+term+"&location=&filterText=&language=&pageNumber=" + pageIndex +"&pageSize=20&sort=&template="+cpmTemplateId+"&indexName=&db=&callback=JSON_CALLBACK";
            $http.jsonp(site + "?" + qryStr).success(function (data) {
                d.resolve(data);

            }).error(function (data, status, headers, config) {
                alert("Error occurred. Status code:" + status);
            });;

            return d.promise;
        },
        IsDirty: function(model) {
            return !(JSON.stringify(model) === JSON.stringify(prestineModel.RenderingVM));
        },
        SearchRelatedCpmTopics:function(cpmId) {
            var relatedTopicRetrievalSvcUrl = "/KcmsServices/CpmTopicInfoRetrievalService.asmx/GetTopicInfo";
            var d = $q.defer();
            $http.post(relatedTopicRetrievalSvcUrl, { cpmGuid: cpmId }).success(function (data) {
                var obj = JSON.parse(data.d);
                if (!!obj.message) {
                    alert(data.d.message);
                }
                var topicItemArray = obj;
                if (angular.isArray(obj)) {
                    d.resolve(topicItemArray);
                }
            }).error(function (data, status, headers, config) {
                alert("Error occurred. Status code:" + status);
            });
            return d.promise;
        },
        //used for searching on a specific care process model to highlight nodes directing the user to which l-box to view
        SearchGsaCpm: function (term, cpmGuid) {
            var createHref = config.ItemApiLocation + "api/V1/Ame/Algorithm/GetCpmNodesByTerm?term=" + term + "&cpmGuid=" + cpmGuid;
            var d = $q.defer();
            $http.get(createHref).success(
                function (data) {
                    if (data.error) {
                        alert(data.error.message);
                        return;
                    }
                    d.resolve(data);
                }).error(
                function (data, status, headers, config) {
                    alert("Unable to query:" + status);
                });

            return d.promise;
        }
    }

};