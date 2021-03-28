

function fnQues492(objFromMainQues) {

    let quesVars = {
        varPMT: uRand(400, 600, 10),
        varRate: uRand(.04, .08, .005),
        varN: uRand(5, 8, 1),
        varY: uRand(8, 14, 1),
        get varReturnInYear() {return this.varY + this.varN - 1},
        varFV: "??"
    };

    
    quesVars = addPrefix(quesVars);
    if (objFromMainQues.isProduction) { return buildPage(fetchQuesVars(quesVars)) } else { return buildPage(quesVars) }

    function buildPage(objQuesVars) {
        quesVars = objQuesVars; createEDVarInScope(quesVars);

        let calcVars = {
            calcTheAns:  fFutureValue(quesVars)
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
            What is the future value (the value in year ${varReturnInYear}) 
            of an annuity that pays \$${varPMT} per year, for ${varN} years,
            at a rate of ${dispRatePerc}%, with the first payment being made in year ${varY}?
        `;


        obj.solution = probDisplay(quesVars)`
        <p>
        Step-by-step solution unavailable at this time.</p>
        <p>
        In short, you need to use the FV of the annuity formula
        to determine the value of the annuity in year ${varReturnInYear}.
        The years that the annuity starts and ends are mostly irrelevant, however,
        since you're dealing with FV.
        You know that there are ${varN} payments,
        so you can plug that into the FV of an annuity formula.<br/>
        n = ${varN}<br />
        C<sub>${varY}</sub> = ${varPMT}<br/>
        i = ${dispRatePerc}%
        </p>
        <p>
        FV<sub>${varReturnInYear}</sub> = \$${calcTheAns.toLocaleString('en-US')}.
        </p.
        `;

        return obj;
    } // end of fillPage

}
