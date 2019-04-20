/**
 * Created by RABIERAmbroise on 28/08/2016.
 */

// add retractible class, enjoy.
define(["jquery"], function ($) {
    /** @const */ var RETRACTIBLE_SELECTOR = ".retractible";

    return function (){
        var $retractible = $(RETRACTIBLE_SELECTOR);

        $retractible.each(function(){
            var lElement = $(this);
            var lMenu = $(lElement.data("menu"));
            var lIcon = lElement.find(".icon-sort-down");
            var lSwitch = false;

            lElement.click(function(){
                lMenu.toggle();
                //lSwitch ? lIcon.
                lIcon.toggleClass( "icon-sort-up" );
                lIcon.toggleClass( "retractible-fa-correction" );
            });
        });
    };
});