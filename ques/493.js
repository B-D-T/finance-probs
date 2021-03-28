

function fnQues493(objFromMainQues) {

    let quesVars = {
        varPMT: uRand(400, 600, 10),
        varRate: uRand(.06, .09, .001),
        varN: uRand(10, 13, 1),
        varY: uRand(5, 8, 1),
        varG: uRand(.03, .058, .001)
        //varFV: "??"
    };

    
    quesVars = addPrefix(quesVars);
    if (objFromMainQues.isProduction) { return buildPage(fetchQuesVars(quesVars)) } else { return buildPage(quesVars) }

    function buildPage(objQuesVars) { quesVars = objQuesVars; createEDVarInScope(quesVars);
        
        let calcVars = {
            get calcTheAns() {return fFutureValue(quesVars) }
        };
        createEDVarInScope(calcVars);

        let displayVars = {
            dispFinalYear: (varY + varN - 1).toString(),
            dispRatePerc: uRound(varRate * 100, 4),
            dispGrowthRatePerc: uRound(varG * 100, 5)
        };
        createEDVarInScope(displayVars); 
        
        jQuery.extend(quesVars, calcVars, displayVars);
        storeQuesRespVars(quesVars, calcTheAns);
        return fillPage();    }

    function fillPage() {
        let obj = {};
        
        obj.ansBoxMessage = ansBoxMessages("writeOutNums");

        obj.stem = probDisplay(quesVars)`
            An annuity makes its first payment of \$${varPMT.toLocaleString('en-US')} in year ${varY.toString()}
            and increases that amount by ${dispGrowthRatePerc}% per year over ${varN} years.
            Assuming a rate of ${dispRatePerc}%,
            what is the future value (the value in year ${dispFinalYear}) of the annuity?
        `;


        obj.solution = probDisplay(quesVars)`${explainFVGrowingAnn_FV(quesVars)}

        `;

        return obj;
    } // end of fillPage

}
