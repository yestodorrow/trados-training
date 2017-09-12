KcmsSearchBox = {};

///Initialize the auto complete control 
KcmsSearchBox.Init = function (inputbox, searchFunction) {
    KcmsSearchBox.callbackFunction = searchFunction; //only supports 1 per page -- multiple functions pass will result in last one winning
    $(inputbox).autocomplete(
    {
        source: function (request, response) {
            $.ajax({
                url: $(this.element).attr('data-host'),
                data: {
                    search_term: $(this.element).val().toLowerCase(),
                    search_site: $(this.element).attr('data-site'),
                    search_client: $(this.element).attr('data-client'),
                    max_matches: $(this.element).attr('data-max-match')
                },
                dataType: "jsonp",
                type: "get",
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    response($.map(data, function (item) {

                        return {
                            label: item.name,
                            value: item.name
                        }
                    }))
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    //alert(textStatus);
                }
            });
        },
        minLength: 2,

        select:  function (event, ui) {
            $(this).val(ui.item.value);
            var func = (typeof KcmsSearchBox.callbackFunction == 'function') ?
                KcmsSearchBox.callbackFunction : new Function(KcmsSearchBox.callbackFunction);

            func(this);
        }
    });

    ///Setup formate of result to bold matched text in suggester term
    $.ui.autocomplete.prototype._renderItem = function (ul, item) {
        var re = new RegExp("^" + this.term);
        var t = item.label.replace(re, "<span style='font-weight:bold;'>" +
                this.term +
                "</span>");
        return $("<li></li>")
            .data("item.autocomplete", item)
            .append("<a>" + t + "</a>")
            .appendTo(ul);
    };

}
