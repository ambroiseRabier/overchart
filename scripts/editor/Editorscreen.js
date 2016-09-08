/* Copyright (C) Ambroise Rabier - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Ambroise Rabier <rabier.ambroise@outlook.fr>, August 2016
 */
/**
 * Created by RABIERAmbroise on 10/08/2016.
 */

define(["jquery","editor/EditorAdd","editor/EditorRelated","editor/EditorMapSynergy",
    "security/checkJSON", "security/secureJSON", "config","heroesSorted"],
function ($, EditorAdd, EditorRelated, EditorMapSynergy, checkJSON, secureJSON, config, heroesSorted) {
    /** @const */ var SAVE_NAME = "rules.json";

    return function(){
        this.display = $(".editorscreen");
        this.ruleFile;
        this.currentDisplayedHero = "";
        var current$img;
        var _this = this;
        var editorAdd = new EditorAdd(this);
        var editorRelated = new EditorRelated(this);
        var editorMapSynergy = new EditorMapSynergy(this);
        var fileReader = new FileReader();
        var jsonHeroes = $(".editor-json-heroes");
        var jsonHeroesSelector = $(".editor-json-selected");
        var heroeData = $(".editor-heroe-data"); // todo, put in EditorRelated ?
        var inputFile = $("#editor-input-file");

        this.init = function(){
            inputFile.change(onFileJsonChange);
            jsonHeroes.click(onHeroeClick); // not on img itself because img aren't displayed yet
            window.onresize = onResize;
            $(".editor-save").click(onSave);
            editorAdd.init();
            $(".editor-create").click(editorAdd.addNewJSON);
            $(".editor-load-default").click(onDefaultJSON);
            hackCssPlaceholder();
        };

        function hackCssPlaceholder(){
            var lInput = $("body > div.editorscreen > div.editor-add-related > div > span > span.selection > span > ul > li > input");
            lInput.css("width","1000px"); // as mus as you want
        }

        function onFileJsonChange(pEvent){
            // should be on loaded (end)
            fileReader.onload = onNewJSON;
            fileReader.readAsText(pEvent.target.files[0]);
            jsonHeroesSelector.hide();
        }

        function onDefaultJSON(pEvent){
            $.getJSON(config.chart.DEFAULT_JSON_PATH, function(pData){
                _this.ruleFile = pData;
                _this.displayNewJSON();
            });
        }

        function onNewJSON(pEvent){
            _this.ruleFile = JSON.parse(fileReader.result);

            if (checkJSON(_this.ruleFile)){
                secureJSON(_this.ruleFile, _this.displayNewJSON);
            } else
                newJSONCheckFailed();
        }

        // when new JSON is loaded, show menu and delete previous hero synergy/counter from screen
        this.displayNewJSON = function(){
            displayHeroes(_this.ruleFile);
            editorAdd.display.show();
            editorMapSynergy.display.hide();
            heroeData.html("");
        };

        function newJSONCheckFailed(){
            console.error("JSON has been checked, he might not be secure");
            _this.ruleFile = {};
        }

        function displayHeroes(pFile){
            jsonHeroes.show();
            //jsonHeroes.html("");

            for (var pRole in heroesSorted){
                for (var i=0; i<heroesSorted[pRole].length; i++){
                    if (!pFile.hasOwnProperty(heroesSorted[pRole][i]))
                        continue;
                    addHero(pRole, heroesSorted[pRole][i]);
                }
            }
            /*
            for (var pHeroe in pFile){
                if (pHeroe === "meta")
                    continue;

                addHero(pHeroe);
            }*/
        }

        function addHero(pRole, pHeroe){
            // create div or something whit img
            jsonHeroes.find('[data-role="'+pRole+'"]').append("<img data-heroe='"+pHeroe+"' src='./img/"+pHeroe+".png'>");
        }

        function onHeroeClick(pEvent){
            var $img = $(pEvent.target);
            var lHeroe = $img.data("heroe");
            if (lHeroe === undefined)
                return;
            current$img = $img
            editorRelated.displayRelatedHeroes(lHeroe, heroeData);
            editorMapSynergy.show();

            editorMapSynergy.display.show();
            editorAdd.changeSelectFirstHeroe(lHeroe);

            jsonHeroesSelector.show();
            jsonHeroesSelector.css("top", $img.offset().top);
            jsonHeroesSelector.css("left", $img.offset().left);
        }

        function onResize(pEvent){
            jsonHeroesSelector.css("top", current$img.offset().top);
            jsonHeroesSelector.css("left", current$img.offset().left);
        }

        this.refresh = function(pRefreshLevel){
            // met à jour l'affichage du json
            if (pRefreshLevel === "hero"){
                displayHeroes(this.ruleFile);
            } else if (pRefreshLevel === "relatedHero" && this.currentDisplayedHero !== ""){
                editorRelated.displayRelatedHeroes(this.currentDisplayedHero, heroeData);
            }
        };

        // http://stackoverflow.com/questions/14964035/how-to-export-javascript-array-info-to-csv-on-client-side
        var download = function(content, fileName, mimeType) {
            var a = document.createElement('a');
            mimeType = mimeType || 'application/octet-stream';

            if (navigator.msSaveBlob) { // IE10
                return navigator.msSaveBlob(new Blob([content], { type: mimeType }),     fileName);
            } else if ('download' in a) { //html5 A[download]
                a.href = 'data:' + mimeType + ',' + encodeURIComponent(content);
                a.setAttribute('download', fileName);
                document.body.appendChild(a);
                setTimeout(function() {
                    a.click();
                    document.body.removeChild(a);
                }, 66);
                return true;
            } else { //do iframe dataURL download (old ch+FF):
                var f = document.createElement('iframe');
                document.body.appendChild(f);
                f.src = 'data:' + mimeType + ',' + encodeURIComponent(content);

                setTimeout(function() {
                    document.body.removeChild(f);
                }, 333);
                return true;
            }
        };

        // todo: vérifier fonctionnement +// marche pas sur firefox..
        /*var saveData = (function () {
            var a = document.getElementById("editor-save");
            return function (data, fileName) {
                var json = JSON.stringify(data),
                    blob = new Blob([json], {type: "octet/stream"}),
                    url = window.URL.createObjectURL(blob);
                a.href = url;
                a.download = fileName;
                a.click();
                window.URL.revokeObjectURL(url);
            };
        }());*/

        function onSave(pEvent){
            if (_this.ruleFile === undefined)
                return;
            //var blob = new Blob([JSON.stringify(_this.ruleFile)], {type: "text/plain;charset=utf-8"});
            //var file = new File([blob], SAVE_NAME);
            //saveData(_this.ruleFile, SAVE_NAME);
            download(JSON.stringify(_this.ruleFile), SAVE_NAME, "text/json");
        }


    };
});
