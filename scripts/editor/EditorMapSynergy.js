/**
 * Created by RABIERAmbroise on 21/08/2016.
 */

define(["jquery","mapsSorted","config"], function ($, mapSorted, config) {
    const FILTER_MAP_GOOD = "map+";
    const FILTER_MAP_BAD = "map-";
    const SIDE_ATTACK = "ATTACK";
    const SIDE_DEFENSE = "DEFENSE";

    var orderCssClick = [
        "",
        config.all.MAP_COLOR_GOOD,
        config.all.MAP_COLOR_BAD
    ];

    return function(pEditor){
        this.display = $(".editor-map-synergy");
        var _this = this;
        var $Switch = $(".switch-container"); // this.display.find(".switch-container") worked a time ago, and now it doesn't (wtf ?????)
        var $Point;
        var isInit = false;
        var mapSide = SIDE_ATTACK;

        function init(){
            $Switch.find(".slider").click(onClickSwitch);
            for (var mapName in mapSorted.sorted){
                _this.display.append(createMapElement(mapName, mapSorted.sorted[mapName]));
            }
            $Point = $(".editor-map-synergy-element-point");
            $Point.click(onClickPoint);

            if (!config.isMobile){
                $Point.mouseenter(onMouseEnterPointMap);
                $Point.parent().mouseleave(onMouseLeavePointMapContainer);
            }
        }

        function createMapElement(mapName, mapArrayPoints){
            var result = $("<div class='editor-map-synergy-element'></div>");
            result.append("<img src='"+config.pathMap+mapName+".jpg'>");

            var container = $("<div class='editor-map-synergy-element-point-container'></div>");
            for (var i=0;i<mapArrayPoints.length;i++){
                var cssClassPoint = mapSorted.isControlMap(mapName) ? "editor-point-square" : "editor-point-circle";


                container.append(
                    "<div class='editor-map-synergy-element-point "+cssClassPoint+"' " +
                    "data-state='0'"+
                    "data-point='"+mapArrayPoints[i]+"'" +
                    "data-map='"+mapName+"'>" +
                    ""+mapArrayPoints[i]+"</div>"
                );
            }
            result.append(container);

            //for points.. in map

            return result;
        }

        function addMapToJSON(pMap, goodOrBad){
            var inverse = goodOrBad === FILTER_MAP_GOOD ? FILTER_MAP_BAD : FILTER_MAP_GOOD;
            pEditor.ruleFile[pEditor.currentDisplayedHero][goodOrBad].push(pMap);
            var lIndex = pEditor.ruleFile[pEditor.currentDisplayedHero][inverse].indexOf(pMap);
            if (lIndex !== -1)
                pEditor.ruleFile[pEditor.currentDisplayedHero][inverse].splice(lIndex, 1);
        }

        function removeMapToJSON(pMap){
            var lIndex = pEditor.ruleFile[pEditor.currentDisplayedHero][FILTER_MAP_GOOD].indexOf(pMap);
            if (lIndex !== -1)
                pEditor.ruleFile[pEditor.currentDisplayedHero][FILTER_MAP_GOOD].splice(lIndex, 1);
            lIndex = pEditor.ruleFile[pEditor.currentDisplayedHero][FILTER_MAP_BAD].indexOf(pMap);
            if (lIndex !== -1)
                pEditor.ruleFile[pEditor.currentDisplayedHero][FILTER_MAP_BAD].splice(lIndex, 1);
        }

        function onClickPoint(pEvent){
            var $element = $(pEvent.target);

            if (mapSorted.isControlMap($element.data("map")))
                onClickPointActionControlMap($element);
            else
                onClickPointAction($element);

            if (config.isMobile)
                displayMapPoint({
                    $img:$element.parent().parent().find("img"), // barbaric way to get the img inside editor-map-synergy-element
                    side:mapSide,
                    map:$element.data("map"),
                    point:$element.data("point")
                });
        }

        function onClickPointAction($element){
            var completeMapRef = getMapRef($element);

            if ($element.data("state") === 0){
                addMapToJSON(completeMapRef , FILTER_MAP_GOOD);
                setColor($element, 1);
            }
            else if ($element.data("state") === 1){
                addMapToJSON(completeMapRef, FILTER_MAP_BAD);
                setColor($element, 2);
            }
            else if ($element.data("state") === 2){
                removeMapToJSON(completeMapRef);
                setColor($element, 0);
            }
        }

        function onClickPointActionControlMap($element){
            var attackMapRef = SIDE_ATTACK +" "+ $element.data("map") +" "+ $element.data("point");
            var defenceMapRef = SIDE_DEFENSE +" "+ $element.data("map") +" "+ $element.data("point");

            if ($element.data("state") === 0){
                addMapToJSON(attackMapRef , FILTER_MAP_GOOD);
                addMapToJSON(defenceMapRef , FILTER_MAP_GOOD);
                setColor($element, 1);
            }
            else if ($element.data("state") === 1){
                addMapToJSON(attackMapRef, FILTER_MAP_BAD);
                addMapToJSON(defenceMapRef, FILTER_MAP_BAD);
                setColor($element, 2);
            }
            else if ($element.data("state") === 2){
                removeMapToJSON(attackMapRef);
                removeMapToJSON(defenceMapRef);
                setColor($element, 0);
            }
        }

        function onClickSwitch(pEvent) {
            // AVOID PROPAGATION OF THE EVENT (this function won't be called two time for each click)
            //pEvent.preventDefault();
            // i changed the element that is listened, work too.

            if ($Switch.find("input").prop('checked'))
                mapSide = SIDE_ATTACK;
            else
                mapSide = SIDE_DEFENSE;
            refresh()
        }

        function setColor(p$element, pIndex) {
            p$element.css("background-color", orderCssClick[pIndex]);
            p$element.data("state", pIndex);
        }

        function getMapRef(p$img) {
            return mapSide +" "+ p$img.data("map") +" "+ p$img.data("point");
        }

        function refresh() {
            var goodMaps = pEditor.ruleFile[pEditor.currentDisplayedHero][FILTER_MAP_GOOD];
            var badMaps = pEditor.ruleFile[pEditor.currentDisplayedHero][FILTER_MAP_BAD];

            $Point.each(function () {
                var $element = $(this);
                var completeMapRef = getMapRef($element);
                if (goodMaps.indexOf(completeMapRef) !== -1)
                    setColor($element, 1);
                else if (badMaps.indexOf(completeMapRef) !== -1)
                    setColor($element, 2);
                else
                    setColor($element, 0);
            });
        }

        function onMouseEnterPointMap(pEvent){
            var $element = $(pEvent.target);

            displayMapPoint({
                $img:$element.parent().parent().find("img"), // barbaric way to get the img inside editor-map-synergy-element
                side:mapSide,
                map:$element.data("map"),
                point:$element.data("point")
            });
        }

        function onMouseLeavePointMapContainer(pEvent){
            var $element = $(pEvent.currentTarget); // todo:vérifier que currentarget fonctionne bien (a priori oui)

            displayMapPoint({
                $img:$element.parent().find("img"), // barbaric way to get the img inside editor-map-synergy-element
                map:$element.children()[0].getAttribute('data-map')
            });
        }

        // pParams: {$img, side, map, point}
        function displayMapPoint(pParams){
            if (pParams.point === undefined)
                pParams.$img.attr("src",config.pathMap+pParams.map+".jpg");
            else{
                // i don't want double of img for control map
                if (!mapSorted.isControlMap(pParams.map))
                    pParams.$img.attr("src",config.pathMap + pParams.side +"/"+ pParams.map +"/"+ pParams.point + ".jpg");
                else
                    pParams.$img.attr("src",config.pathMap + SIDE_ATTACK +"/"+ pParams.map +"/"+ pParams.point + ".jpg");
            }
        }

        this.show = function(pHeroe){
            if (!isInit){
                isInit=true;
                init();
            }
            refresh();
        }
    }
});