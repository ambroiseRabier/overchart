/**
 * Created by RABIERAmbroise on 10/08/2016.
 */

define(["jquery","chart/Chartscreen","editor/Editorscreen"], function ($, Chartscreen, Editorscreen) {
    return function () {
        this.display = $(".mainscreen");
        var _this = this;
        var chartScreen = new Chartscreen();
        var editorScreen = new Editorscreen();
        var chartReady = false;
        var editorReady = false;


        function init (pEvent){
            editorScreen.display.hide();
            chartScreen.display.hide();
            _this.display.show();
        };


        $(".btn-Editor").click(function(){
            if (!editorReady)
                editorScreen.init();
            editorReady=  true;
            editorScreen.display.show();
            reset();
        });
        $(".btn-Chart").click(function(){
            if (!chartReady)
                chartScreen.init();
            chartReady = true;
            reset();
            chartScreen.display.show();
        });
        $(".chart-back").click(init);
        $(".editor-back").click(init);

        function reset(){
            _this.display.hide();
        }
    };
});