/**
 * Created by RABIERAmbroise on 14/08/2016.
 */

define([], function () {

    var valueIsNotString = false;
    var nbEachRecursive = 0;

    function isString(pValue){
        return typeof pValue === "string";
    }

    function escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
            //.replace(/'/g, "&#039;");
    }

    function eachRecursive(obj, pCallBack) {
        nbEachRecursive++;

        for (var k in obj) {
            if (typeof obj[k] == "object" && obj[k] !== null)
                eachRecursive(obj[k], pCallBack);
            else {
                if (isString(obj[k]))
                    obj[k] = escapeHtml(obj[k]);
                else
                    valueIsNotString = true;
            }
        }
        nbEachRecursive--;
        if (nbEachRecursive === 0)
            pCallBack();

    }

    return eachRecursive;
});