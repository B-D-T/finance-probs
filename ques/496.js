fnQues496 = function (objFromMainQues) {
    const windowScope = this; // global var (global to this function anyway)

    let quesVars = {
        varPV: uRand(20000, 50000, 1000),
        varRate: uRand(.05, .25, .01),
        varN: uRand(5, 10, 1),
        varY: 0,
        varFV: "??"
    };

    quesVars = addPrefix(quesVars, quesNum(true));
    if (objFromMainQues.isProduction) {return buildPage(fetchQuesVars(quesVars))} else {return buildPage(quesVars);}

    function buildPage(objQuesVars) { quesVars = objQuesVars; createEDVarInScope(quesVars, windowScope);
        
        let calcVars = {
            calcGrowthRate: 1 + varRate,
            get calcFVIF() {return this.calcGrowthRate ** varN},
            get calcTheAns() {return varPV * this.calcFVIF}
        };
        createEDVarInScope(calcVars, windowScope);

        let displayVars = {
            dispRatePerc: uRound(varRate * 100, 0),
            dispGrowthRate: uRound(calcGrowthRate, 5),
            dispFVIF: uRound(calcFVIF, 5)
        };
        createEDVarInScope(displayVars, windowScope); jQuery.extend(quesVars, calcVars, displayVars); return fillPage();
    }

    function fillPage() {
        let obj = {};
        
        obj.ansBoxMessage = ansBoxMessages("writeOutNums");

        obj.stem = probDisplay(quesVars)`
            You have \$varPV right now. What is the value of \$varPV, varN years
            from now, assuming dispRatePerc%?
        `;

        obj.solution = probDisplay(quesVars)`${explainFVSinglePmt_FV(quesVars)}

        `;

        return obj;
    } // end of fillPage

}
