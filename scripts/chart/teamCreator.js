/**
 * Created by RABIERAmbroise on 30/10/2016.
 */


define(["config","heroes","heroesSorted"],
function (config, heroes, heroesSorted) {

    const WEAKTO = "<";
    const DPS="dps";
    const TANK="tank";
    const HEAL="heal";
    const METAGAME = [DPS,DPS,TANK,TANK,HEAL,HEAL];


    /**
     * Return the perfect team against à compo.
     * @param [""] enemyTeam, {} ruleFile (only one rulefile !)
     * @returns {Array}
     * @constructor
     */
    function teamCreator (enemyTeam, pRuleFile) {
        var perfectTeam = [];
        var counterScore = {};
        var weakToScore = {}; // todo prendre en compte le weakto, car on peut avoir
        // un gars qui counter plusieurs en face mais qui se fait counter aussi
        // alros qu'un autre avec le même score counter peu ne pas se farie counter, non ?
        // faire gaffe aux maps
        // faire gaffe aux synergy
        // faire gaffe à des règles supplémentaires, pas tobjorn et symmetra par exemple
        var counterScoreKeysSorted;
        var meta = [];

        for (var hero in heroes) {
            if (heroes[hero] === heroes.PLACEHOLDER)
                continue;

            counterScore[heroes[hero]] = getCounterScore(
                heroes[hero],
                enemyTeam,
                pRuleFile
            );
        }

        counterScoreKeysSorted = Object.keys(counterScore).sort(
            function(a,b){return counterScore[b]-counterScore[a]}
        );

        // first
        perfectTeam.push(counterScoreKeysSorted[0]);
        meta.push(getMetaForHero(perfectTeam[0]));
        // five
        getFiveLast(perfectTeam, counterScoreKeysSorted, meta);
        // synergy
        perfectTeam = sortWhitSynergy(perfectTeam, pRuleFile);

        // position dans le tableau
        console.log(perfectTeam.map(function(pHero) {
            return counterScoreKeysSorted.indexOf(pHero);
        }));
        // score dans le tableau
        console.log(perfectTeam.map(function(pHero) {
            return counterScore[pHero];
        }));

        return perfectTeam;
    }

    function getCounterScore (pHero, pEnemyTeam, pRuleFile) {
        var score = 0;

        for (var i=0;i< pEnemyTeam.length;i++) {
            if (pRuleFile[pEnemyTeam[i]] === undefined)
                continue;

            if (pRuleFile[pEnemyTeam[i]][WEAKTO][pHero] !== undefined)
                score++;
        }

        return score;
    }

    function getFiveLast (perfectTeam, pCounterScoreKeysSorted, pMeta) {
        var lMetaGame = clone(METAGAME);

        lMetaGame.splice(lMetaGame.indexOf(pMeta[0]), 1);

        for (var i=1;i < pCounterScoreKeysSorted.length;i++) {
            var lMeta = getMetaForHero(pCounterScoreKeysSorted[i]);

            if (lMetaGame.indexOf(lMeta) !== -1) {
                lMetaGame.splice(lMetaGame.indexOf(lMeta), 1);
                pMeta.push(getMetaForHero(pCounterScoreKeysSorted[i]));
                perfectTeam.push(pCounterScoreKeysSorted[i]);
            }
        }

    }

    function sortWhitSynergy (pPerfectTeam, pRuleFile) {
        return pPerfectTeam;
    }

    function getMetaForHero (pHero) {
        for (var role in heroesSorted) {
            if (heroesSorted[role].indexOf(pHero) !== -1) {
                if (role == "ATTACK")
                    return DPS;
                else if (role == "DEFENSE")
                    return DPS;
                else if (role == "TANK")
                    return TANK;
                else if (role == "SUPPORT")
                    return HEAL;
            }
        }
        console.error("something went wrong in getMetaForHero !");
    }

    function clone(pObject){
        return JSON.parse(JSON.stringify(pObject));
    }



    return teamCreator;
});