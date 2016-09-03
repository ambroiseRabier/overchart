
/**
 * Created by RABIERAmbroise on 13/08/2016.
 */


define(["jquery","../heroes","screenSelect2"], function ($, heroes, screenSelect2) {
    const COUNTER = ">";
    const WEAKTO = "<";
    const SYNERGY = "+";
    const MAP_PLACEHOLDER = "Choose map-filter (optional)";
    const HEROE_FIRST_PLACEHOLDER = "winston";

    return function(pEditor){
        this.display = $(".editor-add-related");
        var _this=this;
        var lSwitchEasyDisplayed = true;
        var input = {
            command:$("#editor-input-command"),
            heroFirst:$("#editor-input-first-heroe"),
            filter:$("#editor-input-filter"),
            heroSecond:$("#editor-input-second-heroe"),
            reason:$("#editor-input-reason"),
            submit:$(".editor-input-submit")
        };

        this.init = function(){
            input.submit.click(onSubmitRelated);
            screenSelect2.addHeroesSelect(input.heroFirst, HEROE_FIRST_PLACEHOLDER, function(){}, true);
            input.filter.select2({
                // will hide searchBar
                minimumResultsForSearch: -1
            });
            screenSelect2.addHeroesSelect(input.heroSecond, HEROE_FIRST_PLACEHOLDER, function(){});
            listenToInputSwitch();
        };

        this.changeSelectFirstHeroe = function(pHeroe){
            input.heroFirst.val(pHeroe).trigger("change");
        };

        function listenToInputSwitch(){
            var inputPro = $(".editor-input-container-pro");
            var inputEasy = $(".editor-input-container-easy");
            $(".editor-input-choice").click(function(pEvent){
                if (lSwitchEasyDisplayed){
                    inputPro.show();
                    inputEasy.hide();
                } else {
                    inputEasy.show();
                    inputPro.hide();
                }
                lSwitchEasyDisplayed = !lSwitchEasyDisplayed;
            });
        }

        function onSubmitRelated(pEvent){
            var reason = input.reason.val();
            var command = "";

            if (lSwitchEasyDisplayed){
                command = [
                    input.heroFirst.select2("val"),
                    input.filter.select2("val"),
                    input.heroSecond.select2("val")
                ];
            }
            else
                command = input.command.val().toLowerCase().split(" ");

            checkCommand(command, reason);
        }

        function checkCommand(pCommand, pReason){
            // in case "< dva" become "winston < dva"
            if (pCommand.length === 2 && isFilter(pCommand[0]))
                pCommand.unshift(pEditor.currentDisplayedHero);

            // in case ">"
            if (pCommand.indexOf(COUNTER) !== -1){
                pCommand[1] = WEAKTO;
                var lTemp = pCommand[0];
                pCommand[0] = pCommand[2];
                pCommand[2] = lTemp;
            }

            if(validCommand(pCommand)){
                addRelatedHero({
                    command:pCommand,
                    reason:pReason
                });
            } else {
                displayWrongCommand();
            }
        }

        function displayWrongCommand(){
            _this.display.effect( "shake" );
            // ouvrir modal de help ?
            console.log("temp: Your command is wrong");
        }

        function resetInput(pParams){
            input.command.val("");
            input.reason.val("");

            input.command.attr("placeholder", pParams.command.join(" "));
            input.reason.attr("placeholder", pParams.reason);
        }

        this.addNewJSON = function() {
            pEditor.ruleFile = {};

            pEditor.ruleFile.meta = {
                "author":"Author",
                "name":"My lovely rules",
                "background-color":"white"
            };

            for (var lHero in heroes){
                if (heroes.hasOwnProperty(lHero)){
                    if (heroes[lHero] === heroes.PLACEHOLDER)
                        continue;
                    pEditor.ruleFile[heroes[lHero]] = {
                        "<":{},
                        "+":{},
                        "map+":[],
                        "map-":[]
                    }
                }
            }

            pEditor.displayNewJSON();
        };

        function addHero(pHeroe){
            // ajoute un hero sur json

            pEditor.ruleFile[pHeroe] = {
                "<":{},
                "+":{}
            };
            pEditor.refresh("hero");
        }

        // add an related hero, add hero too if doesn't exist in json
        function addRelatedHero(pParams){
            var result = {};
            var heroWasAdded = false;

            resetInput(pParams);

            if (pEditor.ruleFile[pParams.command[0]] === undefined){
                addHero(pParams.command[0]);
                heroWasAdded = true;
            }

            if (pEditor.ruleFile[pParams.command[0]][pParams.command[1]][pParams.command[2]] === undefined){
                pEditor.ruleFile[pParams.command[0]][pParams.command[1]][pParams.command[2]] = {
                    reason:pParams.reason,
                };
            } else {
                // already an related hero here
                displayRelatedHeroeExist(pParams.command[2]);
                if (heroWasAdded)
                    pEditor.refresh("hero");
                return;
            }

            pEditor.refresh("relatedHero");
        }

        function displayRelatedHeroeExist(pHero){
            console.log("temp: Related Hero '"+pHero+"' already exist !");
        }

        function validCommand(pCommand){
            return isHero(pCommand[0])
                && isHero(pCommand[2])
                && isFilter(pCommand[1]);
        }

        function isHero(pHero){
            for (var lHero in heroes){
                if (heroes[lHero] === pHero)
                    return true;
            }
            return false;
        }

        function isFilter(pString){
            return WEAKTO === pString || SYNERGY === pString || COUNTER === pString;
        }

        function randomColor(){
            return '#' + Math.floor(Math.random() * 16777215).toString(16);
        }

    };
});