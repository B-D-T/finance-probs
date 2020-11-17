

function fnQues492(objFromMainQues) {

    let quesVars = {
        varPMT: uRand(400, 600, 10),
        varRate: uRand(.04, .08, .005),
        varN: uRand(5, 8, 1),
        varY: uRand(8, 14, 1),
        get varReturnInYear() {return this.varY + this.varN - 1},
        varFV: "??"
    };

    
    quesVars = addPrefix(quesVars, quesNum());
    if (objFromMainQues.isProduction) {return buildPage(fetchQuesVars(quesVars))} else {return buildPage(quesVars);}

    function buildPage(objQuesVars) { quesVars = objQuesVars; createEDVarInScope(quesVars);
        
        let calcVars = {
            calcTheAns:  fFutureValue(quesVars)
        };
        createEDVarInScope(calcVars);

        let displayVars = { };
        createEDVarInScope(displayVars); jQuery.extend(quesVars, calcVars, displayVars); return fillPage();
    }

    function fillPage() {

        const dispRatePerc = uRound(varRate * 100, 4);

        let obj = {};
        
        obj.ansBoxMessage = ansBoxMessages("writeOutNums");

        obj.stem = probDisplay(quesVars)`
            What is the future value (the value in year ${varReturnInYear}) 
            of an annuity that pays \$${varPMT} per year, for ${varN} years,
            at a rate of ${dispRatePerc}%, with the first payment being made in year ${varY}?
        `;


        obj.solution = probDisplay(quesVars)`
        Step-by-step solution unavailable at this time.<br />
        In short, you need to determine the FV of the annuity in year ${varReturnInYear}.<br/>
        FV<sub>${varReturnInYear}</sub> = \$${calcTheAns.toLocaleString('en-US')}.`;

        return obj;
    } // end of fillPage

}
