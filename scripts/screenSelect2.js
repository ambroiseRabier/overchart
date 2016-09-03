
/**
 * Created by RABIERAmbroise on 20/08/2016.
 */

define(["jquery","mapsSorted","heroesSorted","onlyMap","config"],
function ($, mapsSorted, heroesSorted, onlyMap, config) {
    // add possibility to sort by drag and drop
    function select2_sortable($select2, pCallback){
        var ul = $select2.next('.select2-container').first('ul.select2-selection__rendered');
        ul.sortable({
            placeholder : 'ui-state-highlight',
            forcePlaceholderSize: true,
            items       : 'li:not(.select2-search__field)',
            tolerance   : 'pointer',
            stop: function() {
                $($(ul).find('.select2-selection__choice').get().reverse()).each(function() {
                    var id = $(this).data('data').id;
                    var option = $select2.find('option[value="' + id + '"]')[0];
                    $select2.prepend(option);
                });
                pCallback();
            }
        });
    }

    function format(pState){
        if (!pState.id) return pState.text; // optgroup
        return "<img class='chart-menu-flag' src='img/" + pState.text + ".png'/>" + pState.text;
    }

    function getChildrenHeroe(pSideArray){
        var result = [];
        for (var i=0;i< pSideArray.length;i++){
            result.push({
                id:pSideArray[i],
                text:pSideArray[i]
            });
        }
        return result;
    }

    function getDataHeroe(pSorted){
        // return [{
        //   "text": "ATTACK",
        //   "children": [
        //    {
        //        id: 'ATTACK Hanamura A',
        //        text: 'Hanamura A'
        //    },
        //]},{...}]

        var result = [];
        for (var side in pSorted){
            result.push({
                "text": side,
                "children":getChildrenHeroe(pSorted[side])
            });
        }
        return result;
    }

    function getChildrenMaps(pMapPoints, pMap){
        var result = [];
        for (var i = 0; i < pMapPoints.length; i++) {
            result.push({
                id: pMap + " " + pMapPoints[i],
                text: onlyMap[pMap] + " " + pMapPoints[i]
            });
        }

        return result;
    }

    // todo: ATTACK and DEFENSE as string, not good, should be some kind of const
    function getDataMap(pSorted){
        // return [{
        //   "text": "HANAMURA",
        //   "children": [
        //    {
        //        id: 'HANAMURA A',
        //        text: 'Hanamura A'
        //    },
        //]},{...}]

        var result = [];
        for (var lMap in pSorted) {
            result.push({
                "text": lMap,
                "children":getChildrenMaps(pSorted[lMap], lMap)
            });
        }

        return result;
    }

    return {
        addHeroesSelect: function(p$ID, pPlaceholder, pCallBack, pDisabled){
            if (pDisabled === undefined)
                pDisabled = false;
            // don't display until select2 is loaded (not realy needed)
            $.when(
                p$ID.select2({
                    width:"100%",
                    height:"100%",
                    //tags:getValues(heroes),
                    data:getDataHeroe(heroesSorted),
                    placeholder:pPlaceholder,
                    minimumResultsForSearch: -1, // to hide search bar
                    disabled: pDisabled,
                    templateResult: format,
                    templateSelection: format,
                    escapeMarkup: function(m) { return m; }
                }).on(
                    "change",
                    pCallBack
                )/*.on( // prevent sorting, seem like i don't need this (it doesn't sort actually)
                    "select2:select",
                function (evt) {
                    var element = evt.params.data.element;
                    var $element = $(element);

                    $element.detach();
                    $(this).append($element);
                    $(this).trigger("change");
                })*/
            ).done(function () {
                select2_sortable(p$ID ,pCallBack);
                p$ID.show();
            });
        },

        addMapSelect: function(p$ID, pPlaceholder, pCallBack){
            // don't display until select2 is loaded (not realy needed)
            $.when(
                p$ID.select2({
                    width:"100%",
                    //tags:getValues(maps),
                    data:getDataMap(mapsSorted.sorted),
                    placeholder:pPlaceholder,
                    minimumResultsForSearch: -1,
                }).on("change", pCallBack)
            ).done(function () {
                select2_sortable(p$ID ,pCallBack);
                p$ID.show();
            });
        },

        hideSoftKeyboard: function(p$){
            if (config.isMobile) {
                $(".select2-search__field").attr("readonly", true);
            }

        }
    }
});