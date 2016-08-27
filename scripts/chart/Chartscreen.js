
/**
 * Created by RABIERAmbroise on 10/08/2016.
 */

define(["jquery","../heroes","chart/chart","chart/chartElementsCreator",
    "security/checkJSON","security/secureJSON","screenSelect2","config","jqueryUI","select2"],
    function ($, heroes, Chart, chartElementsCreator, checkJSON, secureJSON, screenSelect2, config) {

    const TEAM_ATTACK_PLACEHOLDER = "Choose attacker team";
    const TEAM_DEFENCE_PLACEHOLDER = "Choose defender team";
    const MAP_PLACEHOLDER = "Choose map-filter (optional)";
    var DEFAULT_TEAM_ATTACK = [
        heroes.LUCIO,
        heroes.MERCY,
        heroes.ROADHOG,
        heroes.BASTION,
        heroes.DVA,
        heroes.SOLDIER
    ];
    var DEFAULT_TEAM_DEFEND = [
        heroes.ZARYA,
        heroes.MERCY,
        heroes.SOLDIER,
        heroes.TRACER,
        heroes.PHARAH,
        heroes.REAPER
    ];
    var DEFAULT_HEROES = {
        attack:DEFAULT_TEAM_ATTACK,
        defense:DEFAULT_TEAM_DEFEND
    };
    //var DEFAULT_MAP = ["all"]; // not needed, if nothing is given it's the same as "all"


    return function(){
        this.display = $(".chartscreen");
        this.menu = $(".chart-menu");
        this.ruleFiles = [];
        var _this = this;
        var fileInput = $("#chart-input-file");
        var chartLoading = $(".chart-loading");
        var jsonBeingSecured = 0;
        var teamAttack = $("#chart-menu-team-attack");
        var teamDefend = $("#chart-menu-team-defend");
        var map = $("#chart-menu-map");


        this.init = function(){
            //this.menu.show();
            initMenu();
        };

        function initMenu(){
            listenToFileChange();
            screenSelect2.addHeroesSelect(teamAttack, TEAM_ATTACK_PLACEHOLDER, onOptionsChange);
            screenSelect2.addHeroesSelect(teamDefend, TEAM_DEFENCE_PLACEHOLDER, onOptionsChange);
            screenSelect2.addMapSelect(map, MAP_PLACEHOLDER, onOptionsChange);
            screenSelect2.hideSoftKeyboard();
            hackCssPlaceholder();
        }

        function hackCssPlaceholder(){
            var lInput = $("body > div.chartscreen > div.chart-menu > div > span > span.selection > span > ul > li > input");
            lInput.css("width","1000px"); // as mus as you want
        }

        // todo: optimiser, factoriser (?)
        // renvoie la valeur, en ajoutant placeholder si nécessaire
        function getTeamVal(){
            var teamAttackValue = teamAttack.select2("val") == null ? [] : teamAttack.val(); //DEFAULT_TEAM_ATTACK
            var teamDefendValue = teamDefend.select2("val")  == null ? [] : teamDefend.val(); // DEFAULT_TEAM_DEFEND
            var nbPlaceholder = 0;
            var i;

            if (teamAttackValue.length > teamDefendValue.length){
                nbPlaceholder = teamAttackValue.length - teamDefendValue.length;
                for (i= 0; i < nbPlaceholder; i++)
                    teamDefendValue.push(heroes.PLACEHOLDER);
            }
            else if (teamDefendValue.length > teamAttackValue.length) {
                nbPlaceholder = teamDefendValue.length - teamAttackValue.length;
                for (i= 0; i < nbPlaceholder; i++)
                    teamAttackValue.push(heroes.PLACEHOLDER);
            }

            return {
                ATTACK:teamAttackValue,
                DEFENSE:teamDefendValue
            }
        }

        function onOptionsChange(pEvent){
            createChart(
                _this.ruleFiles,
                getTeamVal(),
                map.select2("val")
                // map.val() === map.select2("val")
            );
        }

        function listenToFileChange(){
            fileInput.change(function(pEvent){
                var fileReader = new FileReader();
                var index=0;
                var lLength = pEvent.target.files.length;

                jsonBeingSecured = 0;

                // should be named onloaded (end)..
                fileReader.onload = function(e) {
                    _this.ruleFiles.push(JSON.parse(fileReader.result));
                    index++;

                    if(index !== lLength)
                        fileReader.readAsText(pEvent.target.files[index]);
                    else
                        security();
                };
                fileReader.readAsText(pEvent.target.files[index]);
            });
        }

        function security(){
            jsonBeingSecured = _this.ruleFiles.length;
            for (var i=0; i < _this.ruleFiles.length; i++){
                if (checkJSON(_this.ruleFiles[i])){
                    secureJSON(_this.ruleFiles[i], onEndSecure);
                } else {
                    newJSONCheckFailed();
                    break;
                }
            }
        }

        function onEndSecure(){
            jsonBeingSecured--;
            if (jsonBeingSecured === 0){
                onOptionsChange();
            }
        }

        function newJSONCheckFailed(){
            console.error("JSON has been checked, he might not be secure");
            _this.ruleFiles = {};
        }

        function onChartLoaded(){
            chartLoading.hide();
        }

        // pHeroes {attack:[string], defense:[string]}
        // pRules JSON rule
        function createChart(pRules, pHeroes, pMaps){
            var chart = new Chart();

            // input user
            if (pHeroes === undefined || pHeroes === null){
                pHeroes = DEFAULT_HEROES;
            }
            if (pMaps === undefined || pMaps === null){
                pMaps = []; // will be interpreted as "all"
            }
            if (pRules === undefined || pRules.length === 0 ){
                $.getJSON(config.chart.DEFAULT_JSON_PATH, function(pData){
                    pRules = [pData];
                    checkLoadComplete();
                });
            }
            else {
                checkLoadComplete();
            }

            function checkLoadComplete(){
                var params;

                chartLoading.show();
                //_this.menu.hide();

                params = {
                    elements:chartElementsCreator(pHeroes, pRules, pMaps),
                    onChartLoaded:onChartLoaded
                };
                chart.init(params);
            }
        }
    };
});