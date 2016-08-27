
/**
 * Created by RABIERAmbroise on 10/08/2016.
 */


define(["config"], function (config) {
    const WEAKTO_CLASS = "tip-weak";
    const SYNERGY_CLASS = "tip-synergy";

    function createEdge(pSource, pTarget, pColor){
        if(pColor == WEAKTO_CLASS)
            pColor = config.chart.EDGE_COLOR_WEAKTO;
        if(pColor == SYNERGY_CLASS)
            pColor = config.chart.EDGE_COLOR_SYNERGY;

        return {
            data:{
                id:pSource + "-" + pTarget,
                source:pSource,
                target:pTarget,
                color:pColor
            }
        };
    }

    return function (pLinks){
        var result = [];
        for (var lIdSource in pLinks){
            for (var lIdTarget in pLinks[lIdSource]){
                result.push(createEdge(lIdSource, lIdTarget, pLinks[lIdSource][lIdTarget]));
            }
        }
        return result;
    }
});
/*
 [
 { data: { id:'0-1', source: '0', target: '1' , color:"green"} },
 { data: { id:'2-9', source: '2', target: '9' , color:"red"} },
 ]
*/