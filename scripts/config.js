/**
 * Created by RABIERAmbroise on 11/05/2016.
 */

define(['jquery'], function ($) {
    var config = {};


    config.all = {
        MAP_COLOR_GOOD:"rgb(0, 238, 0)",// light green
        MAP_COLOR_GOOD_CONFLICT:"green", // dark green
        MAP_COLOR_BAD:"red",
        MAP_COLOR_BAD_CONFLICT:"darkred",
        BACKGROUND_COLOR:"rgb(51, 51, 51)", // some black
    };

    config.chart = {
        DEFAULT_JSON_PATH:"./rules.json",
        NODE_COLOR_BACKGROUND:"rgb(238,238,238)", // some grey
        EDGE_COLOR_WEAKTO:"red",
        EDGE_COLOR_SYNERGY:"rgb(0, 238, 0)",
        // http://cytoscapeweb.cytoscape.org/documentation/shapes
        shape:"circle"
    };

    return config;
});