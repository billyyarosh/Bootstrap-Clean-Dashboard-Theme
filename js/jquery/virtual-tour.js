
$(function() {

    var run = function(){
        var vTour;
        var hash = window.location.hash.substring(1);
        if(hash == "vtour"){
            $('html').find('[pageVTourUrl]').each(function(index){
                var tourUrl = $(this).attr("pageVTourUrl");
                vTour = new VTour(tourUrl == "" || tourUrl == null ? undefined : tourUrl);
                vTour.tour();
                return false;
            });
        }else if(hash == "vguide"){
            $('html').find('[pageVGuideUrl]').each(function(index){
                var tourUrl = $(this).attr("pageVGuideUrl");
                var vTour = new VTour(tourUrl == "" || tourUrl == null ? undefined : tourUrl);
                vTour.tourGuide();
                return false;
            });
        }
    };

    $(window).load(function(){
        if(window.location.hash) {
            run();
        }
    });
    $(window).bind('hashchange', function() {
        run();
    });
});

function VTour(pageTourUrl, contextNew)
{
    var tourItems = new Array();
    var pageVTourUrl = pageTourUrl;
    var mobileMode = $(window).width() <= 767;
    var vTour = this;
    var context = contextNew;

    var buildTourItems = function(fields){
        //remove any old fields
        $('#vtour-help-guide-alert').remove();
        $('#vtour-modal').remove();
        $('.tour-guide-highlight').css({"z-index": '', position: ''});
        $(".tour-guide-highlight").removeClass("tour-guide-highlight");
        $(".popover").removeClass("popover");
        $('[id^="popover-continue-"]').unbind('click');
        //Load the virtual tour help text into memory
        var $tourHtml = undefined;
        $.ajax(
            {
                url: pageVTourUrl,
                type: 'get',
                dataType: 'html',
                async: false,
                cache: false,
                success: function(data)
                {
                    $tourHtml = $(data);
                }
            }
        );
        if($tourHtml != undefined){
            //iterate over each div in the vtour page
            var itemIndex = 0;
            $tourHtml.each(
                function(){
                    var $item = $(this);
                    //If the iterating item has the attribute display, add it to the tourItems list
                    if($item.attr("display")){
                        //The passed value fields if undefined means add all items, otherwise determine the fields
                        //to add to the tourItems list.
                        var fieldRequired = fields == undefined;
                        if(!fieldRequired){
                            $.each(fields,
                                function(index, value){
                                    if(value == $item.attr("field")){
                                        fieldRequired = true;
                                        return false;
                                    }
                                }
                            );
                        }
                        if(fieldRequired){
                            tourItems[itemIndex] = {
                                fieldId: $item.attr("field"),
                                displayType: $item.attr("display"),
                                placement: $item.attr("placement"),
                                mobilePlacement: $item.attr("mobile-placement"),
                                title: $item.attr("title"),
                                content: $item.html()
                            };
                            itemIndex ++;
                        }
                    }
                }
            );
        }
    };

    var guideHelpBox = '<div id="vtour-help-guide-alert" class="alert alert-info" style="position:absolute; z-index: 1071;top: .5px;left:35%;text-align: center;"><div><strong>Help Guide</strong><br/>Hover or press over a highlighted area. Press Esc to close.</div></div>';
    var staticModal = '<div id="vtour-modal" class="modal hide"  tabindex="-1" role="dialog"><div class="modal-header"></div><div class="modal-body"></div><div class="modal-footer"><button id="modal-continue" class="btn btn-success">Continue</button></div></div>';
    $("<style type='text/css'> .popover{z-index:1061; width: 280px;} .tour-guide-highlight{background-color: white; border-color: rgba(82, 168, 236, 0.8);outline: 0;-webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 8px rgba(82, 168, 236, .6);-moz-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 8px rgba(82, 168, 236, .6);box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 8px rgba(82, 168, 236, .6); } </style>").appendTo("head");

    var currentTourIndex = 0;
    var closed = false;

    var displayTourItem = function (index){
        if(index < tourItems.length && index >= 0 ){
            currentTourIndex = index+1;
            var tourItem = tourItems[index];
            if(tourItem.displayType == "modal"){
                $('#vtour-modal .modal-body').html(tourItem.content);
                $('#vtour-modal').modal({
                    keyboard: false,
                    backdrop: 'static',
                    title: tourItem.title
                });
                $('.modal-backdrop.in').css(backdropDefaultStyle);
                $('#modal-continue').live('click', function() {
                    $('#vtour-modal').modal('hide');
                    setTimeout(function() { displayTourItem(currentTourIndex) }, 1);
                });
            }else if(tourItem.displayType == "popover"){
                var buttonText = tourItems.length - 1 == index ? "Hide" : "Continue";
                var tempContent = tourItem.content
                    + '<br/><div><p style="font-size: 10px;">Press Tab/Enter or Continue Button when done</p><button class="btn btn-success" id="popover-continue-' + index + '">'+buttonText+'</button></div>';
                $("#" + tourItem.fieldId).popover(
                    {
                        content: tempContent,
                        trigger: 'manual',
                        placement: mobileMode && tourItem.mobilePlacement != undefined ? tourItem.mobilePlacement : tourItem.placement,
                        title: tourItem.title
                    }
                );
                $("#" + tourItem.fieldId).popover('show');
                //add backdrop and highlight the field
                toggleBackdrop();
                toggleItemHighLight(tourItem.fieldId, index);
                $("#" + tourItem.fieldId).focus();
                //handle key press and click on continue
                handleKeyPress(index, tourItem.fieldId);
                $('#popover-continue-' + index).bind('click', function() {
                    if(itemChanged || !isEditableField){
                        setTimeout(function() { displayTourItem(currentTourIndex) }, 1);
                        toggleBackdrop();
                        toggleItemHighLight(tourItem.fieldId, index);
                        itemChanged = false; isEditableField = false;
                    }
                });
            }else{
                setTimeout(function() { displayTourItem(currentTourIndex) }, 1);
            }
        }else if(currentTourIndex == tourItems.length){
            if(!closed){
                closed = true;
                vTour.onClose();
            }
        }
    };

    var toggleTourGuide = function (){
        for(var i = 0; i < tourItems.length; i++){
            var tourItem = tourItems[i];
            if(tourItem.displayType == "popover"){
                $("#" + tourItem.fieldId).popover(
                    {
                        content: tourItem.content,
                        placement: mobileMode && tourItem.mobilePlacement != undefined ? tourItem.mobilePlacement : tourItem.placement,
                        title: tourItem.title,
                        trigger: 'hover'
                    }
                );
                if(i == 0){
                    toggleBackdrop({
                        opacity: '.5',
                        filter: 'alpha(opacity=50)',
                        'z-index': '1040'
                    });
                    $('#vtour-backdrop').on('click', function(e){vTour.hideTourGuide();});
                    toggleHelpGuideAlert();
                }
                toggleItemHighLight(tourItem.fieldId, i);
            }
        }
    };

    var backdropDefaultStyle = {
        opacity: '0.4',
        filter: 'alpha(opacity=40)',
        'z-index': '1040'
    };

    var toggleItemHighLight = function(focusedId, index){
        if(focusedId != undefined){
            if($("#"+focusedId).css('z-index') >= 1041){
                $("#"+focusedId).css({"z-index": 'auto', position: 'initial'});
                $("#" + focusedId).toggleClass("tour-guide-highlight");
                $("#" + focusedId).popover('destroy');
            }else{
                $("#"+focusedId).css({'z-index': 1041 + index, position: 'relative'});
                $("#" + focusedId).toggleClass("tour-guide-highlight");
                $("#" + focusedId).attr("rel", "popover");
            }
        }
    };

    var toggleBackdrop = function(backdropStyle) {
        if($('#vtour-backdrop').length <= 0){
            var $backdrop = $('<div id="vtour-backdrop" class="modal-backdrop"/>').appendTo(document.body);
            if(backdropStyle == undefined){
                $backdrop.css(backdropDefaultStyle);
            }else{
                $backdrop.css(backdropStyle);
            }
        }else{
            $('div.modal-backdrop').remove();
        }
    };

    var toggleHelpGuideAlert = function(){
        if($("#vtour-help-guide-alert").length > 0){
            $("#vtour-help-guide-alert").remove();
        }else{
            $('body').append(guideHelpBox);
            $("#vtour-help-guide-alert").live('click', function(e){
                vTour.hideTourGuide();
            });
        }
    };

    var itemChanged = false;
    var isEditableField = false;

    var escapeKeyListen = function(){
        var keyPressHandler = function(e){
            var keyCode = e.keyCode || e.which;
            if (keyCode == 27) {
                vTour.hideTourGuide();
                $('body').unbind("keydown", keyPressHandler);
            }
        };
        $('body').bind("keydown", keyPressHandler);
    };

    var handleKeyPress = function(index, focusedId) {
        var keyPressHandler = function(e){
            var keyCode = e.keyCode || e.which;
            if (keyCode == 13 || keyCode == 9) {
                e.preventDefault();
                if(itemChanged || !isEditableField){
                    $('#popover-continue-' + index).click();
                    $("#"+focusedId).unbind("keydown", keyPressHandler);
                    itemChanged = false; isEditableField = false;
                }
            }
        };
        $("#"+focusedId).bind("keydown", keyPressHandler);

        var changeHandler = function(e){
            $('#popover-continue-' + index).removeClass("disabled");
            itemChanged = true;
        };
        isEditableField = ($("#"+focusedId).is('input') || $("#"+focusedId).is('select'))
            && (!$("#"+focusedId).hasClass('value-input') || !$("#"+focusedId).hasClass('uneditable-input'));
        if(isEditableField){
            $('#popover-continue-' + index).addClass("disabled");
            if(isEventSupported("input") && $("#"+focusedId).is('input')){
                $("#"+focusedId).one("input", changeHandler);
            }else if($("#"+focusedId).is('input')){
                $('#popover-continue-' + index).removeClass("disabled");
                isEditableField = false;
            }

            if($("#"+focusedId).is('select')){
                $("#"+focusedId).one("change", changeHandler);
            }
        }
    };

    this.tour = function(fields){
        if(pageVTourUrl == undefined || pageVTourUrl == "" || pageVTourUrl == null) {
            pageVTourUrl = context.attr("pageVTourUrl");
        }
        if(pageVTourUrl != undefined && pageVTourUrl != "" && pageVTourUrl != null){
            if(fields != undefined){
                buildTourItems(fields);
            }else{
                buildTourItems();
            }
            this.onStart(false);
        }
    };

    this.onStart = function(popUpGuide){
        if(popUpGuide == true){
            escapeKeyListen();
            toggleTourGuide();
        }else{
            $('body').append(staticModal);
            displayTourItem(0);
        }
    };

    this.onClose = function(){

    };

    this.tourGuide = function(fields){
        if(pageVTourUrl == undefined || pageVTourUrl == "" || pageVTourUrl == null){
            pageVTourUrl = context.attr("pageVGuideUrl");
        }
        if(pageVTourUrl != undefined && pageVTourUrl != "" && pageVTourUrl != null){
            if(fields != undefined){
                buildTourItems(fields);
            }else{
                buildTourItems()
            }
            this.onStart(true);
        }
    };

    this.hideTourGuide = function(){
        toggleTourGuide();
        vTour.onClose();
    };

    VTour.getInstance = function(){
        return vTour;
    }
}

var isEventSupported = (function(){
    var TAGNAMES = {
        'select':'input','change':'input', 'input':'input',
        'submit':'form','reset':'form',
        'error':'img','load':'img','abort':'img'
    };
    function isEventSupported(eventName) {
        var el = document.createElement(TAGNAMES[eventName] || 'div');
        eventName = 'on' + eventName;
        var isSupported = (eventName in el);
        if (!isSupported) {
            el.setAttribute(eventName, 'return;');
            isSupported = typeof el[eventName] == 'function';
        }
        el = null;
        return isSupported;
    }
    return isEventSupported;
})();
