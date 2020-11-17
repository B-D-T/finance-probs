function fnQues501 (objFromMainQues) {

    let quesVars = {
        varPV: uRand(400000000,450000000,1000000),
        varRate: uRand(.05, .10, .01),
        varFV: 1000000000,
        varY: 0,
        varN: "??"
    };

    quesVars = addPrefix(quesVars);
    if (objFromMainQues.isProduction) { return buildPage(fetchQuesVars(quesVars)) } else { return buildPage(quesVars) }

    function buildPage(objQuesVars) {
        quesVars = objQuesVars; createEDVarInScope(quesVars);

        let calcVars = {
            calcGrowthRate: 1 + varRate,
            calcFVdivPV: varFV/varPV,
            calcLnFVdivPV: uLn(varFV/varPV),
            calcLnGrowthRate: uLn(1 + varRate),
            get calcTheAns() {return (this.calcLnFVdivPV)/(this.calcLnGrowthRate)}
        };
        createEDVarInScope(calcVars);

        let displayVars = {
            dispRatePerc: uRound(varRate*100, 4),
            dispGrowthRate: uRound(calcGrowthRate, 5),
            dispLnGrowthRate: uRound(calcLnGrowthRate, 5),
            dispFVdivPV: uRound(calcFVdivPV, 5),
            dispLnFVdivPV: uRound(calcLnFVdivPV, 5),
        };
        createEDVarInScope(displayVars);
        
        jQuery.extend(quesVars, calcVars, displayVars);
        storeQuesRespVars(quesVars, calcTheAns);
        return fillPage();
    }

    function fillPage() {
        let obj = {};
        
        obj.ansBoxMessage = ansBoxMessages("decimalPlaces4");

        obj.stem = probDisplay(quesVars)`
            An NBA team's value is currently \$${varPV.toLocaleString('en-US')} and has been increasing
            at a rate of dispRatePerc% per year over the last 10 years.
            Assuming that trend continues,
            how many years will it be until the team is worth one billion dollars?
        `;

        obj.solution = probDisplay(quesVars)`
        ${explainFVSinglePmt_N(quesVars)}
        <p>
        This means it will take about ${uRound(calcTheAns,2)} years for the team 
        to be worth one billion dollars.
        </p>
        <p style="font-size:0.8em; margin-top:10px;">
        We solved this using the Future Value of a Single Payment formula,
        but we could have also used the Present Value of a Single Payment formula and 
        ended up with the same result. 
        Those two formulas have the same terms and calculations,
        but one has PV<sub>y-n</sub> isolated and one has FV<sub>y+n</sub> isolated. 
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