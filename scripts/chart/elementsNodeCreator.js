
/**
 * Created by RABIERAmbroise on 09/08/2016.
 */

define(["../heroes","config"], function (heroes, config) {
    const WEAKTO = "<";
    const SYNERGY = "+";
    const FILTER_MAP_GOOD = "map+";
    const FILTER_MAP_BAD = "map-";
    const WEAKTO_CLASS = "tip-weak";
    const SYNERGY_CLASS = "tip-synergy";
    const SIDE_ATTACK = "ATTACK";
    const SIDE_DEFENSE = "DEFENSE";

    var uniqueID = 0;
    var inputHeroes; // {attack:[], defence:[]}
    var rules; // [json, json, ...]
    var currentLoopMeta; // actual meta of the used json in loop
    var currentLoopSide; // actual side of tested hero
    var links = {};

    function resetNodeCreator(){
        uniqueID = 0;
        links = {};
    }

    // some reverse engineering to get the sourceID
    // (maybe my structure is wrong)
    function getSourceID(pLoopIndex, pTipColor){
        var sourceSide;
        var resultID;
        // counter always on opposite side of currentLoopSide
        if (pTipColor === WEAKTO_CLASS){
            if (currentLoopSide === SIDE_ATTACK)
                sourceSide = SIDE_DEFENSE;
            else if (currentLoopSide === SIDE_DEFENSE)
                sourceSide = SIDE_ATTACK
        }
        else if (pTipColor === SYNERGY_CLASS){
            sourceSide = currentLoopSide;
        }
        // Attack side begin first in loop
        if (sourceSide === SIDE_ATTACK)
            resultID = pLoopIndex;
        else if (sourceSide === SIDE_DEFENSE)
            resultID = pLoopIndex + inputHeroes[SIDE_ATTACK].length;
        else
            console.error("error can't get sourceID");

        return resultID;
    }

    function addLink(pLoopIndex, pTipColor){
        var sourceUniqueID = getSourceID(pLoopIndex, pTipColor);

        if (links[sourceUniqueID] === undefined)
            links[sourceUniqueID] = {};
        if (links[sourceUniqueID][uniqueID] === undefined)
            links[sourceUniqueID][uniqueID] = [];

        // there can't be different color on same link actually (can't be counter and synergy !)
        links[sourceUniqueID][uniqueID] = pTipColor;
    }

    function createLiElement(pCssClass, pHero, pReason){
        if (currentLoopMeta["author"] === undefined
            || currentLoopMeta["name"] === undefined
            || currentLoopMeta["background-color"] === undefined){
            console.log("author, name or background-color missing in json.meta");
            return "";
        }

        var lStyle = "style= 'background-color:"
            + currentLoopMeta["background-color"] + ";'";
            /*+ "color:"
            + currentLoopMeta["color"] + ";"
            + "'";*/

        return (
            "<li title='"+currentLoopMeta.name+"' class='"+ pCssClass + "' "
            + lStyle
            +">"
            + "<span class='tip-hero-name'>"
            + pHero.toUpperCase()
            +" : </span>"
            + pReason
            +"</li>"
        );
    }

    //pHeroe => "mercy" (tested hero)
    //pHeroeCounters => Json ">" index
    //pOppositeSideHeroes => [6 heroes Array]
    function getCounterTip(pHeroeCounters, pOppositeSideHeroes){
        var lhero="";
        var result ="";

        for (var i=0;i < pOppositeSideHeroes.length; i++){
            lhero = pOppositeSideHeroes[i];
            if (!pHeroeCounters[lhero])
                continue;
            if (pHeroeCounters[lhero].reason  === undefined){
                console.log("Error : Reason missing in JSON for counterHero : " + lhero + " ("+WEAKTO+")");
                continue;
            }

            addLink(i, WEAKTO_CLASS);
            result += createLiElement(WEAKTO_CLASS, lhero, pHeroeCounters[lhero].reason);
        }
        return result;
    }

    //pHeroe => "mercy" (tested hero)
    //pHeroeCounters => Json "+" index
    //pOppositeSideHeroes => [6 heroes Array]
    function getSynergyTip(pHeroeSynergy, pSideHeroes){
        var lhero;
        var result ="";

        for (var i=0;i < pSideHeroes.length; i++){
            lhero = pSideHeroes[i];
            if (!pHeroeSynergy[lhero])
                continue;
            if (pHeroeSynergy[lhero].reason  === undefined){
                // we don't know which hero we are actually testing(i won't add it in params jsut for that)
                console.log("Error : Reason missing in JSON for synergy : " + lhero);
                continue;
            }

            addLink(i, SYNERGY_CLASS);
            result += createLiElement(SYNERGY_CLASS, lhero, pHeroeSynergy[lhero].reason);
        }
        return result;
    }

    function createTip(pHeroe, pSide){
        var result = "<ul>";
        var oppositeSide = pSide === SIDE_ATTACK ? SIDE_DEFENSE : SIDE_ATTACK;
        currentLoopSide = pSide;

        for (var i=0; i < rules.length; i++){
            if (rules[i].meta === undefined){
                console.error("property meta of json "+i+" missing !");
                continue;
            }
            currentLoopMeta = rules[i].meta;

            if (!rules[i][pHeroe]){
                //console.log("no info this hero : " + pHeroe + " in JSON : " + i);
                continue;
            }
            result += getCounterTip(rules[i][pHeroe][WEAKTO], inputHeroes[oppositeSide]);
            result += getSynergyTip(rules[i][pHeroe][SYNERGY], inputHeroes[pSide]);
        }

        result += "</ul>";
        return result;
    }

    function getBorderColor(pHeroe, pMaps, pSide) {
        var good = 0;
        var bad = 0;
        var result = "";

        if (pHeroe === heroes.PLACEHOLDER){
            return config.all.BACKGROUND_COLOR;
        }

        for (var j=0; j < rules.length; j++){
            for(var i=0; i < pMaps.length; i++){
                // todo: change json object to "map+":{ATTACK:[], DEFENSE:[]}
                // if side is "DEFENSE HANAMURA A" for pMaps[i]
                // and that the tested hero is on "ATTACK"
                // then it does not concern our hero
                var mapWhitSide = pSide + " " + pMaps[i];
                if (rules[j][pHeroe][FILTER_MAP_BAD].indexOf(mapWhitSide) !== -1)
                    good++;
                else if (rules[j][pHeroe][FILTER_MAP_GOOD].indexOf(mapWhitSide) !== -1)
                    bad++;
            }
        }

        if (bad === 0 && good > 0)
            result = config.all.MAP_COLOR_GOOD;
        else if (good === 0 && bad > 0)
            result = config.all.MAP_COLOR_BAD;
        else if (bad !== 0 && good > bad)
            result = config.all.MAP_COLOR_GOOD_CONFLICT;
        else if (good !== 0 && bad > good)
            result = config.all.MAP_COLOR_BAD_CONFLICT;
        else
            result = config.all.BACKGROUND_COLOR;

        return result;
    }

    function createNodes(pHeroesSide, pSide, pMaps){
        var result = [];
        var i;
        var name = "";
        for (i=0; i < pHeroesSide.length; i++){
            if (pHeroesSide[i] === heroes.PLACEHOLDER)
                name = "";
            else
                name = pHeroesSide[i][0].toLocaleUpperCase() + pHeroesSide[i].substr(1);
            result.push({
                data: {
                    id: uniqueID,
                    name: name,
                    img: './img/'+pHeroesSide[i]+'.png',
                    tip: createTip(pHeroesSide[i], pSide),
                    borderWidth:'3px',
                    borderColor:getBorderColor(pHeroesSide[i], pMaps, pSide)
                }
            });
            uniqueID++;
        }

        return result;
    }

    return function(pHeroes, pRules, pMaps){
        resetNodeCreator();
        inputHeroes = pHeroes;
        rules = pRules;

        return {
            nodes:createNodes(pHeroes[SIDE_ATTACK], SIDE_ATTACK, pMaps).concat(createNodes(pHeroes[SIDE_DEFENSE], SIDE_DEFENSE, pMaps)),
            links:links
        };
    };
});