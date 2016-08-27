/**
 * Created by RABIERAmbroise on 14/08/2016.
 */


define(["heroes"], function (heroes) {
    function checkRelatedHero(pRelatedHero){
        var property = [
            "reason",
        ];

        for (var lProperty in pRelatedHero){
            if (!pRelatedHero.hasOwnProperty(lProperty))
                continue;
            if (property.indexOf(lProperty) === -1)
                return false;
            if (!isString(pRelatedHero[lProperty]))
                return false;
        }
        return true;
    }

    function checkHero(pHero){
        var property = [
            "<",
            "+",
            "map+",
            "map-"
        ];

        for (var lProperty in pHero){
            if (!pHero.hasOwnProperty(lProperty))
                continue;
            if (lProperty === "map+" || lProperty === "map-")
                continue;
            if (property.indexOf(lProperty) === -1)
                return false;
            else {
                for (var lHero in pHero[lProperty]){
                    if (!checkHeroExist(lHero)){
                        console.log("Related hero name '"+lHero+"' is invalid.");
                        return false;
                    }
                    else {
                        if (!checkRelatedHero(pHero[lProperty][lHero]))
                            return false;
                    }
                }
            }
        }
        return true;
    }

    function checkMeta(pMeta){
        var property = [
            "author",
            "name",
            "background-color"
        ];

        for (var lProperty in pMeta){
            if (!pMeta.hasOwnProperty(lProperty))
                continue;
            if (property.indexOf(lProperty) === -1)
                return false;
            if (!isString(pMeta[lProperty]))
                return false;
        }

        return true;
    }

    function checkHeroExist(pHero){
        for (var lHero in heroes){
            if (!heroes.hasOwnProperty(lHero))
                continue;
            if (heroes[lHero] === pHero)
                return true;
        }
        return false;
    }

    function isString(pValue){
        return typeof pValue === "string";
    }

    return function(pJson){
        // BECAUSE I DONT THINK ITS REALY USEFULL to heck the JSON like this
        return true;

        var hasMeta = false;

        for (var lHero in pJson){
            if (lHero === "meta"){
                hasMeta = true;
                if (!checkMeta(pJson[lHero]))
                    return false;
            }
            else if (checkHeroExist(lHero)){
                if (!checkHero(pJson[lHero]))
                    return false;
            }
            else {
                console.log("hero name '"+lHero+"' is invalid.");
                return false;
            }
        }

        if (!hasMeta)
            return false;

        return true;
    }
});

