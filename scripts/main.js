

// todo : trad eng fr
// todo : remplir rules.json

require.config({
    //urlArgs: "bust=" + (new Date()).getTime(),
    paths: {
        jquery:"https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min",//"./jquery-2.2.4.min",
        //cookie:"libs/jquery-cookie/jquery.cookie"
        bootstrap:"./libs/bootstrap.min", //"https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min", //
        cytoscape:"./libs/cytoscape.min", // "http://cytoscape.github.io/cytoscape.js/api/cytoscape.js-latest/cytoscape.min"
        qtip:"https://cdnjs.cloudflare.com/ajax/libs/qtip2/3.0.3/basic/jquery.qtip.min",//"./jquery.qtip.min",
        "cytoscape-qtip":"./cytoscape-qtip",
        select2:"./libs/select2/select2.full.min",
        jqueryUI:"./libs/jquery-ui-sortable-and-effects/jquery-ui.min"
    },
    shim: {
        "bootstrap": {
            deps:["jquery"]
        },
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
            deps:["jquery"],
            /*exports: "$.fn.select2"*/
        },
        jqueryUI:{
            deps:["jquery"]
        }
    }
    //urlArgs: "bust=" + ( new Date().getTime() ) // Permet de faire croire qu"on va chercher fichiers différents, pour rdl tout sans avoir à vider le cache. Enlever à la fin.
});

//
//
require(["mainscreen","retractible-menu","bootstrap"], function(mainscreen, retractibleMenu) /// on peut mettre un chemin ici ou ds path.
{
    mainscreen();
    retractibleMenu();
});
