/**
 * Created by RABIERAmbroise on 26/08/2016.
 */

define([], function () {
    // <div class="help" data-help=""><i class="fa fa-question-circle" aria-hidden="true"></i></div>

    var dataHelpToHtml = {
        "editor-menu":"<h4>Menu Help</h4>" +
        "- You can load and edit a rule file (.json).<br> " +
        "- You can create a new empty file, or modify the default rule file.<br> " +
        "- After your change don't forget to save it !",

        "editor-map-synergy":"<h4>Map Synergy Help</h4>" +
        "- Each map whit each stage is represented, for attack and defense.<br>" +
        "- If the stage circle is in green, it mean the current selected heroe is a good choice on this stage of the map.<br>" +
        "- If it is in red, it mean the heroe is a bad choice.<br>" +
        "- You can can create your rules on attack and defence side for each heroe.",

        "chart":"<h4>Chart Help</h4>" +
        "- Insert your team and green and red arrow gonna show you counter and synergy between them." +
        "- Red and green circle show you if your heroe is good on the choosen map." +
        "- Tap/clic on an heroe to see associated tips."
    };

    return function (){
        var helpElements = $(".help");

        helpElements.qtip({
            content: function(){
                return dataHelpToHtml[this.data("help")];
            },
            position: {
                my: 'top center',
                at: 'bottom center'
            },
            style: {
                classes: 'qtip-bootstrap',
                tip: {
                    width: 16,
                    height: 8
                }
            }
        });
    };
});