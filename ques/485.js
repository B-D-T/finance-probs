function fnQues485 (objFromMainQues) {


    let quesVars = {
        "varPMT": uRand(400, 600, 10),
        "varRate": uRand(.04, .08, .005),
        "varN": uRand(3, 7, 1),
    };

    quesVars = addPrefix(quesVars);
    if (objFromMainQues.isProduction) { return buildPage(fetchQuesVars(quesVars)) } else { return buildPage(quesVars) }

    function buildPage(objQuesVars) {
        quesVars = objQuesVars; createEDVarInScope(quesVars);

        let calcVars = {
            calcTheAns: fPVAnnuityStandard({varPMT, varRate, varN})
        };
        createEDVarInScope(calcVars);

        let displayVars = {};
        createEDVarInScope(displayVars);
        
        jQuery.extend(quesVars, calcVars, displayVars);
        storeQuesRespVars(quesVars, calcTheAns);
        return fillPage();
    }

    function fillPage() {
        let obj = {};

        obj.ansBoxMessage = ansBoxMessages("writeOutNums");

        obj.stem = probDisplay(quesVars)`
        What is the present value (the value in year 0) of a standard annuity that
        pays \$${varPMT.toLocaleString('en-US')} for varN years at a rate of ${uRound(varRate*100,4)}%?
        `

        obj.solution = probDisplay(quesVars)`
        ${explainPVAnnuityConst_PV(quesVars)}
        `
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