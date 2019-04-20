/**
 * Created by RABIERAmbroise on 16/08/2016.
 */

// predefined tags/maps that the user can choose to use
// todo : need rework
define(["onlyMap"], function (map) {
    var oneTime = false;
    var obj = {
        ATTACK: [
            map.HANAMURA + " A",
            map.HANAMURA + " B",
            map.ANUBIS + " A",
            map.ANUBIS + " B",
            map.VOLSKAYA + " A",
            map.VOLSKAYA + " B",

            map.DORADO + " 1",
            map.DORADO + " 2",
            map.DORADO + " 3",
            map.ROUTE_66 + " 1",
            map.ROUTE_66 + " 2",
            map.ROUTE_66 + " 3",
            map.GIBRALTAR + " 1",
            map.GIBRALTAR + " 2",
            map.GIBRALTAR + " 3",

            map.HOLLYWOOD + " A",
            map.HOLLYWOOD + " 1",
            map.HOLLYWOOD + " 2",
            map.KING_ROW + " A",
            map.KING_ROW + " 1",
            map.KING_ROW + " 2",
            map.NUMBANI + " A",
            map.NUMBANI + " 1",
            map.NUMBANI + " 2",
            map.EINCHELWALDE + " A",
            map.EINCHELWALDE + " 1",
            map.EINCHELWALDE + " 2",

            map.ILIOS + " Lighthouse",
            map.ILIOS + " Ruins",
            map.ILIOS + " Well",
            map.LIJANG_TOWER + " Control Center",
            map.LIJANG_TOWER + " Garden",
            map.LIJANG_TOWER + " Night Market",
            map.NEPAL + " Sanctum",
            map.NEPAL + " Shrine",
            map.NEPAL + " Village"
        ]
    };

    function getList() {
        if (!oneTime) {
            obj.DEFENSE = obj.ATTACK;
            oneTime = true;
        }
        return obj;
    }

    var objSorted = {
        "HANAMURA": ["A", "B"],
        "ANUBIS": ["A", "B"],
        "VOLSKAYA": ["A", "B"],

        "DORADO": ["1", "2", "3"],
        "ROUTE_66": ["1", "2", "3"],
        "GIBRALTAR": ["1", "2", "3"],

        "HOLLYWOOD": ["A", "1", "2"],
        "KING_ROW": ["A", "1", "2"],
        "NUMBANI": ["A", "1", "2"],
        "EINCHELWALDE":["A", "1", "2"],

        "ILIOS": ["Lighthouse", "Ruins", "Well"],
        "LIJANG_TOWER": ["Control Center", "Garden", "Night Market"],
        "NEPAL": ["Sanctum", "Shrine", "Village"]
    };

    function isControlMap(pMap){
        var controlMap = [
            "ILIOS",
            "LIJANG_TOWER",
            "NEPAL"
        ];
        if (controlMap.indexOf(pMap) !== -1)
            return true;
        return false
    }

    // copy ATTACK to DEFENSE because map doesn't differ from side
    return {
        list: getList(),
        sorted: objSorted,
        isControlMap:isControlMap
    };
});