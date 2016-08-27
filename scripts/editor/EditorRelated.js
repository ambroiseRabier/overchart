/**
 * Created by RABIERAmbroise on 21/08/2016.
 */


define(["jquery","../heroes","screenSelect2"],
function ($, heroes, screenSelect2) {
    const WEAKTO = "<";
    const COUNTER = ">";
    const SYNERGY = "+";
    var filterToH1={
        "<": "<h1 title='weak to' style='color:red;'><</h1>",
        ">": "<h1 title='counter to' style='color:#02c5ff;'>></h1>",
        "+": "<h1 title='boosted by' style='color:green;'>+</h1>"
    };

    return function (pEditor){
        var _this = pEditor;

        function addListenerToDestroyRelated(pDestroyBtn){
            pDestroyBtn.$.one("click", function(){
                delete _this.ruleFile[pDestroyBtn.heroe][pDestroyBtn.filter][pDestroyBtn.relatedHeroe];
                _this.refresh("relatedHero");
            });
        }

        function weakToCounter(pHeroe, pRuleFile){
            var result = $("<ul class='editor-heroe-list'></ul>");
            result.append(filterToH1[COUNTER]);
            for (var lHeroe in pRuleFile){
                if (!pRuleFile.hasOwnProperty(lHeroe))
                    continue;
                if (lHeroe === "meta")
                    continue;
                if (pRuleFile[lHeroe][WEAKTO][pHeroe] === undefined)
                    continue;

                var liElement =  $("<li></li>");
                /*var destroyBtn = {
                    $:$("<button class='editor-delete-related'><i class='fa fa-times' aria-hidden='true'></i></button>"),
                    heroe:pHeroe,
                    filter:pFilter,
                    relatedHeroe:pRelatedHeroe
                };*/

                liElement.append(
                    "<img src='./img/"+lHeroe+".png' class='editor-related-heroe-img'>" +
                    "<div class='editor-related-heroe-text'>" +
                    "<p><span>REASON:</span> "+pRuleFile[lHeroe][WEAKTO][pHeroe].reason+"</p>" +
                    "</div>"
                );

                //liElement.append(destroyBtn.$);
                //addListenerToDestroyRelated(destroyBtn);

                result.append(liElement);
            }
            return result;
        }

        function createDataList (pHeroe, pFilter, pRuleFile){
            var result = $("<ul class='editor-heroe-list'></ul>");
            result.append(filterToH1[pFilter]);
            for (var pRelatedHeroe in pRuleFile[pHeroe][pFilter]){
                if (!pRuleFile[pHeroe][pFilter].hasOwnProperty(pRelatedHeroe))
                    continue;

                var liElement =  $("<li></li>");
                var destroyBtn = {
                    $:$("<button class='editor-delete-related'><i class='fa fa-times' aria-hidden='true'></i></button>"),
                    heroe:pHeroe,
                    filter:pFilter,
                    relatedHeroe:pRelatedHeroe
                };

                liElement.append(
                    "<img src='./img/"+pRelatedHeroe+".png' class='editor-related-heroe-img'>" +
                    "<div class='editor-related-heroe-text'>" +
                    "<p><span>REASON:</span> "+pRuleFile[pHeroe][pFilter][pRelatedHeroe].reason+"</p>" +
                    "</div>"
                );
                liElement.append(destroyBtn.$);
                addListenerToDestroyRelated(destroyBtn);

                result.append(liElement);
            }
            return result;
        }

        this.displayRelatedHeroes = function(pHeroe, p$display){
            _this.currentDisplayedHero = pHeroe;
            p$display.html("");
            p$display.append(createDataList(pHeroe, WEAKTO, _this.ruleFile));
            p$display.append(weakToCounter(pHeroe,_this.ruleFile));
            p$display.append(createDataList(pHeroe, SYNERGY, _this.ruleFile));

        };
    }
});














