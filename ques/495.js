

function fnQues495(objFromMainQues) {

    let quesVars = {
        varPMT: uRand(400, 600, 10),
        varRate: uRand(.04, .08, .005),
        varN: uRand(15, 20, 1),
        varY: uRand(5, 10, 1),
        varReturnInYear: uRand(50, 60, 1),
        varFV: "??"
    };

    quesVars = addPrefix(quesVars);
    if (objFromMainQues.isProduction) { return buildPage(fetchQuesVars(quesVars)) } else { return buildPage(quesVars) }

    function buildPage(objQuesVars) { quesVars = objQuesVars; createEDVarInScope(quesVars);
        
        let calcVars = {
            calcFVofAnn: fFutureValue(quesVars),
            calcNforSinglePmt: varReturnInYear - (varY + varN - 1),
            get calcTheAns() { return fFutureValue({varRate, "varY":varY+varN-1, "varPV":this.calcFVofAnn, "varN":this.calcNforSinglePmt}) }
        };
        createEDVarInScope(calcVars);

        let displayVars = { };
        createEDVarInScope(displayVars);
        
        jQuery.extend(quesVars, calcVars, displayVars);
        storeQuesRespVars(quesVars, calcTheAns);
        return fillPage();
    }

    function fillPage() {

        const dispRatePerc = uRound(varRate * 100, 4);

        let obj = {};
        
        obj.ansBoxMessage = ansBoxMessages("writeOutNums");

        obj.stem = probDisplay(quesVars)`
            What is the value in year ${varReturnInYear} of an annuity that
            pays \$${varPMT} per year, for ${varN} years,
            at a rate of ${dispRatePerc}%, with the first payment being made in year ${varY}?
        `;


        obj.solution = probDisplay(quesVars)`${explainFVAnnuityConst_FV(quesVars)}`;

        return obj;
    } // end of fillPage

}
