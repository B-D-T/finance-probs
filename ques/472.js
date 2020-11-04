// @ts-nocheck
function fnQues472(objFromMainQues) {

    let quesVars = {
        varPMT: uRand(2, 13, 1), // div
        varRate: uRand(.02, .09, .005), //i
        varY: 1,
        varPV: "??"
    };

    quesVars = addPrefix(quesVars);
    if (objFromMainQues.isProduction) { return buildPage(fetchQuesVars(quesVars)) } else { return buildPage(quesVars) }

    function buildPage(objQuesVars) {
        quesVars = objQuesVars; createEDVarInScope(quesVars);

        let calcVars = {
            calcTheAns: varPMT/varRate
        };
        createEDVarInScope(calcVars);

        let displayVars = {
            dispRatePerc: uRound(varRate * 100, 4), // per
            dispPMT: varPMT.toFixed(2).toLocaleString('en')
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
            <p>
                A company offers an annual dividend of \$dispPMT per share.
                What would you pay today for one share,
                assuming a discount rate of dispRatePerc% and that 
                you will receive the first dividend payment until a year from now?
            </p>
        `;

        obj.solution = probDisplay(quesVars)`${explainPVPerpetuityConst_PV(quesVars)}`;

        return obj;

    } // end of fillPage
}

// received from addOnPageSubmit
function fnQuesResp(objPageSubmit) {
    const qtrxDivID = "#divQues" + objPageSubmit.strQuesNum;
    if (!(jQuery(`${qtrxDivID}-response`).length)) {
        let objRespFeedback = objPageSubmit;
        return setEDQuesRespVars(objRespFeedback);
    }
}