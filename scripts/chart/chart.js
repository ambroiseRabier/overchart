/**
 * Created by RABIERAmbroise on 06/08/2016.
 */


define(['jquery','cytoscape',"qtip","../cytoscape-qtip","config"],
function ($, cytoscape, qtip, cyqtip, config) {
    cyqtip( cytoscape, $ ); // register extension

    var options = {
        name: 'grid',

        fit: true, // whether to fit the viewport to the graph
        padding: 30, // padding used on fit
        boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
        avoidOverlap: true, // prevents node overlap, may overflow boundingBox if not enough space
        avoidOverlapPadding: 10, // extra spacing around nodes when avoidOverlap: true
        condense: false, // uses all available space on false, uses minimal space on true
        rows: 2, // force num of rows in the grid
        cols: undefined, // force num of columns in the grid //
        position: function( node ){}, // returns { row, col } for element
        sort: undefined, // a sorting function to order the nodes; e.g. function(a, b){ return a.data('weight') - b.data('weight') }
        animate: false, // whether to transition the node positions
        animationDuration: 500, // duration of animation in ms if enabled
        animationEasing: undefined, // easing of animation if enabled
        ready: undefined, // callback on layoutready
        stop: undefined // callback on layoutstop
    };

    function Chart(){
        this.cy; // window.cy = this.cy ? (nécessaire dnas d'autre cas ?)

        this.reset = function(){
            $(".loading").show();
        };

        this.init = function(pParams){
            this.cy = cytoscape({
                container: document.getElementById('chart-cy'),

                boxSelectionEnabled: false, // ??
                autounselectify: true, // ??

                /*layout: {
                    name: 'cose'
                },*/

                style: [
                    {
                        selector: 'node',
                        style: {
                            'content': 'data(name)',
                            'text-opacity': 0.8,
                            'text-valign': 'bottom',
                            'text-halign': 'center',
                            'background-color': config.chart.NODE_COLOR_BACKGROUND,
                            'background-image': 'data(img)',
                            'color':'white',

                            'width':'90px',
                            'height':'90px',
                            'shape':config.chart.shape,
                            'border-width':'data(borderWidth)',
                            'border-style':'solid',
                            'border-color':'data(borderColor)',
                            'border-opacity':1
                        }
                    },

                    {
                        selector: 'edge',
                        style: {
                            'width': 4,
                            'target-arrow-shape': 'triangle',
                            'line-color': 'data(color)',
                            'target-arrow-color': 'data(color)',
                            'curve-style': 'bezier', // haystack a test si parrallèles
                            'line-style':'solid'
                        }
                    }
                ],

                elements:pParams.elements,

                /*qtip: {
                    content: {
                        text: 'Tips plugin element'
                    }
                },*/

                ready:function(){
                    this.layout(options);

                    pParams.onChartLoaded();
                    //(this === cy)
                    //console.log(this.edges("[source='Ange']"));
                    //this.$("#Ange").css("background-color","#FFbaea");
                    //this.$("#Ange").addClass("bc");
                }
            });

            // pas qtip sur éléments qui n'en possède pas ?
            this.cy.elements().qtip({
                content: function(){
                    //return 'Example qTip on ele ' + this.id()
                    //console.log(this.data().tip);
                    if (this.data().tip)
                        return this.data().tip;
                    else
                        return "";
                },
                position: {
                    my: 'top center',
                    at: 'bottom center'
                },
                style: {
                    classes: 'qtip-bootstrap',
                    tip: {
                        width: 16,
                        height: 8
                    }
                }
            });

            // call on core
            /*this.cy.qtip({
                content: 'Example qTip on core bg',
                position: {
                    my: 'top center',
                    at: 'bottom center'
                },
                show: {
                    cyBgOnly: true
                },
                style: {
                    classes: 'qtip-bootstrap',
                    tip: {
                        width: 16,
                        height: 8
                    }
                }
            });*/
        };

        //cy.$("#Ange").addClass('bc');
    }

    return Chart;
});
