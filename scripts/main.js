

// todo : trad eng fr
// todo : remplir rules.json
// todo : ask for LD quality site if to long to download
/*var displayLDSite = false;
setTimeout(function(){

},5000);*/

require.config({
    paths: {
        jquery:"https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min",//"./jquery-2.2.4.min",
        //cookie:"libs/jquery-cookie/jquery.cookie"
        //bootstrap:"./libs/bootstrap.min", //"https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min", //
        cytoscape:"https://cdnjs.cloudflare.com/ajax/libs/cytoscape/2.7.8/cytoscape.min",//"./libs/cytoscape.min", // "http://cytoscape.github.io/cytoscape.js/api/cytoscape.js-latest/cytoscape.min"
        qtip:"./libs/jquery.qtip.min", //"https://cdnjs.cloudflare.com/ajax/libs/qtip2/3.0.3/basic/jquery.qtip.min",//
        "cytoscape-qtip":"./cytoscape-qtip",
        select2:"./libs/select2/select2.full.min",
        jqueryUI:"./libs/jquery-ui-sortable-and-effects/jquery-ui.min"
    },
    shim: {
        /*"bootstrap": {
            deps:["jquery"]
        },*/
        "cytoscape": {
            deps:["jquery"]
        },
        "qtip": {
            deps:["jquery"]
        },
        "cytoscape-qtip": {
            deps:["jquery","qtip","cytoscape"]
        },
        select2: {
            deps:["jquery"]
            /*exports: "$.fn.select2"*/
        },
        jqueryUI:{
            deps:["jquery"]
        }
    },
    waitSeconds: 30 // before timeout
    //urlArgs:"1.0.0" // will work only on js..
});

//
//
require(["jquery","mainscreen","retractibleMenu","help"/*,"bootstrap"*/], function($, mainscreen, retractibleMenu, help) /// on peut mettre un chemin ici ou ds path.
{
    $(".main-loading").hide();
    mainscreen();
    retractibleMenu();
    help();
    $(".main-body").show();
});























