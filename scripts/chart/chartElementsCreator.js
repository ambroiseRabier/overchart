
/**
 * Created by RABIERAmbroise on 09/08/2016.
 */


define(["chart/elementsNodeCreator", "chart/elementsEdgeCreator"], function (nodeCreator, edgeCreator) {
    /** @const */ var SIDE_ATTACK = "attack";
    /** @const */ var SIDE_DEFENSE = "defense";



    // pHeroes {attack:[], defence:[]};
    // pRules [json, json]
    // pContext ["close", "map-name", ...]
    return function(pHeroes, pRules, pMaps){
        var result;

        var nodeCreatorResult = nodeCreator(pHeroes, pRules, pMaps);
        var edgesResult = edgeCreator(nodeCreatorResult.links);

        result = {
            nodes: nodeCreatorResult.nodes,
            edges: edgesResult
        };

        return result;
    };

});

/* final result example
{
 nodes: [
 { data: { id: '0', name:"Ange", img:'./img/Ange.jpg'} },
 { data: { id: '1', name:"Soldier", img:'./img/soldat-76.jpg', tip:placeholderTipNodes } },
 { data: { id: '2', name:"Junkrat", img:'./temp/reinhardt.jpg'} }, // tip:placeholderTipNodes3
 { data: { id: '3', name:"Junkrat", img:'./temp/6bc.jpg' } },
 { data: { id: '4', name:"Reinhardt", img:'./temp/6bc.jpg' } },
 { data: { id: '5', name:"Ange", img:'./temp/6bc.jpg' } },
 { data: { id: '6', name:"Ange", img:'./temp/6bc.jpg' } },
 { data: { id: '7', name:"Ange", img:'./temp/6bc.jpg' } },
 { data: { id: '8', name:"Ange", img:'./temp/6bc.jpg' } },
 { data: { id: '9', name:"Reinhardt", img:'./temp/6bc.jpg', tip:placeholderTipNodes2 } },
 { data: { id: '10', name:"Ange", img:'./temp/6bc.jpg' } },
 { data: { id: '11', name:"Ange", img:'./temp/6bc.jpg' } }
 ],
 edges: [
 { data: { id:'0-1', source: '0', target: '1' , color:"green"} },
 { data: { id:'2-9', source: '2', target: '9' , color:"red"} },
 ]
 };
 */