/**
 * Created by RABIERAmbroise on 21/08/2016.
 */


// used in ChartScreenSelect2.js
define(["heroes"], function (heroes) {
    return {
        ATTACK:[
            heroes.GENJI,
            heroes.MCCREE,
            heroes.PHARAH,
            heroes.REAPER,
            heroes.SOLDIER,
            heroes.TRACER
        ],
        DEFENSE:[
            heroes.BASTION,
            heroes.HANZO,
            heroes.JUNKRAT,
            heroes.MEI,
            heroes.TORBJORN,
            heroes.WIDOWMAKER
        ],
        TANK:[
            heroes.DVA,
            heroes.REINHARDT,
            heroes.ROADHOG,
            heroes.WINSTON,
            heroes.ZARYA
        ],
        SUPPORT:[
            heroes.ANA,
            heroes.LUCIO,
            heroes.MERCY,
            heroes.SYMMETRA,
            heroes.ZENYATTA
        ]
    };

});