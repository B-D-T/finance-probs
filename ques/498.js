function fnQues498(objFromMainQues) {

    let quesVars = {
        varFV: uRand(12500000,50000000,1000000),
        varRate: uRand(.05, .25, .01),
        varN: uRand(25, 40, 1),
        varPV: "??",
        get varY(){return this.varN}
    };

    quesVars = addPrefix(quesVars);
    if (objFromMainQues.isProduction) { return buildPage(fetchQuesVars(quesVars)) } else { return buildPage(quesVars) }

    function buildPage(objQuesVars) {
        quesVars = objQuesVars; createEDVarInScope(quesVars);

        let calcVars = {
            calcGrowthRate: 1 + varRate,
            calcPVYear: varY-varN,
            calcFVIF: (1+varRate)**varN,
            get calcPVIF(){return 1/(this.calcFVIF)},
            get calcTheAns() {return varFV * this.calcPVIF}
        };
        createEDVarInScope(calcVars);

        let displayVars = {
            dispRatePerc: uRound(varRate * 100, 4),
            dispGrowthRate: uRound(calcGrowthRate, 5),
            dispPVIF: uRound(calcPVIF, 5),
            dispFVIF: uRound(calcFVIF, 5),
            dispTheAns: uRound(calcTheAns, 0)
        };
        createEDVarInScope(displayVars);
        
        jQuery.extend(quesVars, calcVars, displayVars);
        storeQuesRespVars(quesVars, calcTheAns);
        return fillPage();
    }

    function fillPage() {
        let obj = {};
        
        obj.ansBoxMessage = ansBoxMessages("writeOutNums");

        obj.stem = probDisplay(quesVars)`
            In varN years, a pension liability will require payment of \$${varFV.toLocaleString('en-US')}.
            If the discount rate is dispRatePerc%, how much should be invested
            today to ensure the liability is exactly met?
        `;

        obj.solution = probDisplay(quesVars)`${explainPVSinglePmt_PV(quesVars)}

        <p>
            This answer means that we can put \$${dispTheAns.toLocaleString()} in an account today (year calcPVYear) and 
            it will grow at dispRatePerc% over the next varN years,
            eventually reaching \$${varFV.toLocaleString()} by the time we owe the pension payment.
            
            
        </p>

        `;

        return obj;

    } // end of fillPage
}

 // received from addOnPageSubmit
function fnQuesResp(objPageSubmit){
    const qtrxDivID = "#divQues" + objPageSubmit.strQuesNum;
    if (!(jQuery(`${qtrxDivID}-response`).length)){
        let objRespFeedback = objPageSubmit;
        return setEDQuesRespVars(objRespFeedback);
    }
}