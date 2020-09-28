function fnQues486 (objFromMainQues) {


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
            calcTheAns: fFVAnnuityStandard({varPMT, varRate, varN})
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
        What is the future value (the value in year varN) of a standard annuity that
        pays \$${varPMT.toLocaleString()} for varN years at a rate of ${uRound(varRate*100,2)}%?
        `

        obj.solution = probDisplay(quesVars)`
        ${explainFVAnnuityStand_FV(quesVars)}
        `
        return obj;

    } // end of fillPage
}

// received from addOnPageSubmit
function fnQuesResp(objPageSubmit){
    const qtrxDivID = "#divQues" + objPageSubmit.strQuesNum + "-response";
    if (!(jQuery(qtrxDivID).length)){
        let objRespFeedback = objPageSubmit;
        return setEDQuesRespVars(objRespFeedback);
    }
}